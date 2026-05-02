import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Known Payfast server IPs (live + sandbox)
const PAYFAST_IPS = new Set([
  "197.97.145.144", "197.97.145.145", "197.97.145.146", "197.97.145.147",
  "41.74.179.194",  "41.74.179.195",  "41.74.179.196",  "41.74.179.197",
  "196.33.227.224", "196.33.227.225", "196.33.227.226", "196.33.227.227",
]);

function md5hex(message: string): string {
  return createHash("md5").update(message, "utf8").digest("hex");
}

// Parse raw form body preserving field order.
// orderedPairs: [[key, decodedValue], ...] in POST order
// decoded: { key: decodedValue } for random access
function parseBody(rawBody: string): {
  orderedPairs: [string, string][];
  decoded: Record<string, string>;
} {
  const orderedPairs: [string, string][] = [];
  const decoded: Record<string, string> = {};
  for (const segment of rawBody.split("&")) {
    const eqIdx = segment.indexOf("=");
    if (eqIdx === -1) continue;
    const key = decodeURIComponent(segment.slice(0, eqIdx).replace(/\+/g, " "));
    const val = decodeURIComponent(segment.slice(eqIdx + 1).replace(/\+/g, " "));
    orderedPairs.push([key, val]);
    decoded[key] = val;
  }
  return { orderedPairs, decoded };
}

// Re-encode decoded values the same way Payfast signs them:
// encodeURIComponent but with spaces as + instead of %20.
// Keys arrive in POST order; "signature" is excluded; passphrase appended last.
function buildVerifyString(
  orderedPairs: [string, string][],
  decoded: Record<string, string>,
  passphrase: string
): string {
  const parts = orderedPairs
    .filter(([key]) => key !== "signature" && decoded[key] !== undefined)
    .map(([key]) => `${key}=${encodeURIComponent(decoded[key]).replace(/%20/g, "+")}`);

  if (passphrase) {
    parts.push(`passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`);
  }
  return parts.join("&");
}

interface OrderItem {
  name: string;
  brand: string;
  qty: number;
  price?: number;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Always return 200 to Payfast — errors are logged, not surfaced as HTTP failures.
  try {
    console.log("ITN: Received notification");

    const passphrase = (Deno.env.get("PAYFAST_PASSPHRASE") ?? "").trim();
    const sandboxMode = Deno.env.get("PAYFAST_SANDBOX_MODE") !== "false";

    if (!sandboxMode) {
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ?? "";
      console.log(`ITN: Request from IP ${clientIp}`);
      if (!PAYFAST_IPS.has(clientIp)) {
        console.warn(`ITN: Rejected — unlisted IP ${clientIp}`);
        return new Response("OK", { status: 200, headers: corsHeaders });
      }
    } else {
      console.log("ITN: Sandbox mode — skipping IP validation");
    }

    const rawBody = await req.text();
    console.log("ITN: Raw body:", rawBody);

    const { orderedPairs, decoded } = parseBody(rawBody);
    console.log("ITN: Keys in order:", orderedPairs.map(([k]) => k).join(", "));

    // ── Signature verification ──────────────────────────────────────────────
    const receivedSig = decoded["signature"] ?? "";
    const finalString = buildVerifyString(orderedPairs, decoded, passphrase);
    const computedSig = md5hex(finalString);

    console.log("ITN: Verify string:", finalString);
    console.log("ITN: Computed sig :", computedSig);
    console.log("ITN: Received sig :", receivedSig);

    if (computedSig !== receivedSig) {
      console.error("ITN: SIGNATURE MISMATCH — logging and returning 200");
      return new Response("OK", { status: 200, headers: corsHeaders });
    }
    console.log("ITN: Signature VERIFIED");

    const orderId      = decoded["m_payment_id"];
    const paymentStatus = decoded["payment_status"];
    const pfPaymentId  = decoded["pf_payment_id"] ?? "";

    console.log(`ITN: Order=${orderId} payment_status=${paymentStatus}`);

    if (!orderId) {
      console.error("ITN: Missing m_payment_id");
      return new Response("OK", { status: 200, headers: corsHeaders });
    }

    // Service-role client bypasses RLS for webhook updates
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    if (paymentStatus === "COMPLETE") {
      // ── Fetch order ───────────────────────────────────────────────────────
      const { data: order, error: fetchError } = await supabase
        .from("orders")
        .select("id, items, status")
        .eq("id", orderId)
        .maybeSingle();

      if (fetchError || !order) {
        console.error("ITN: Failed to fetch order:", fetchError?.message ?? "not found");
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      if (order.status === "paid") {
        console.log(`ITN: Order ${orderId} already paid — ignoring duplicate ITN`);
        return new Response("OK", { status: 200, headers: corsHeaders });
      }

      // ── Mark order paid ───────────────────────────────────────────────────
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: "paid", payment_status: "paid", payfast_payment_id: pfPaymentId })
        .eq("id", orderId);

      if (updateError) {
        console.error("ITN: Failed to update order status:", updateError.message);
        return new Response("OK", { status: 200, headers: corsHeaders });
      }
      console.log(`ITN: Order ${orderId} marked PAID (pf_payment_id=${pfPaymentId})`);

      // ── Deduct stock per line item ────────────────────────────────────────
      // Items are stored as { name, brand, qty, price } — no product id.
      // decrement_stock_by_name() looks up by name+brand and subtracts qty.
      const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
      console.log(`ITN: Deducting stock for ${items.length} line item(s)`);

      for (const item of items) {
        const qty = Number(item.qty) || 1;
        console.log(`ITN: Deducting ${qty}x "${item.name}" (${item.brand})`);

        const { data: productId, error: stockError } = await supabase.rpc(
          "decrement_stock_by_name",
          { p_name: item.name, p_brand: item.brand, p_quantity: qty }
        );

        if (stockError) {
          console.error(`ITN: Stock deduction error for "${item.name}":`, stockError.message);
        } else if (productId === null) {
          console.warn(`ITN: Product not found — "${item.name}" / "${item.brand}"`);
        } else {
          console.log(`ITN: Stock deducted — product id=${productId} qty=${qty}`);
        }
      }

      console.log(`ITN: All updates complete for order ${orderId}`);
    } else {
      const newStatus = paymentStatus === "FAILED" ? "failed" : "cancelled";
      const { error } = await supabase
        .from("orders")
        .update({ payment_status: newStatus })
        .eq("id", orderId);
      if (error) console.error(`ITN: Failed to set payment_status=${newStatus}:`, error.message);
      console.log(`ITN: Order ${orderId} payment marked ${newStatus}`);
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("ITN: Unhandled error:", err);
    return new Response("OK", { status: 200, headers: corsHeaders });
  }
});
