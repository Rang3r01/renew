import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

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

function buildSignatureString(params: Record<string, string>, passphrase: string): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => k !== "signature" && params[k] !== "" && params[k] !== undefined)
    .map((k) => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, "+")}`)
    .join("&");
  return passphrase
    ? `${sorted}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : sorted;
}

async function md5hex(message: string): Promise<string> {
  const buf = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("MD5", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") ?? "";
    const sandboxMode = Deno.env.get("PAYFAST_SANDBOX_MODE") !== "false";

    // IP validation — skip in sandbox mode to allow testing
    if (!sandboxMode) {
      const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        req.headers.get("x-real-ip") ?? "";
      if (!PAYFAST_IPS.has(clientIp)) {
        console.warn(`Payfast ITN rejected: unlisted IP ${clientIp}`);
        return new Response("Forbidden", { status: 403, headers: corsHeaders });
      }
    }

    const rawBody = await req.text();
    const params: Record<string, string> = {};
    for (const [k, v] of new URLSearchParams(rawBody)) {
      params[k] = v;
    }

    // Verify signature
    const receivedSig = params["signature"] ?? "";
    const computedSig = await md5hex(buildSignatureString(params, passphrase));

    if (computedSig !== receivedSig) {
      console.error(`ITN signature mismatch. computed=${computedSig} received=${receivedSig}`);
      return new Response("Invalid signature", { status: 400, headers: corsHeaders });
    }

    const orderId = params["m_payment_id"];
    const paymentStatus = params["payment_status"]; // COMPLETE | FAILED | CANCELLED
    const pfPaymentId = params["pf_payment_id"] ?? "";

    if (!orderId) {
      return new Response("Missing order ID", { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    if (paymentStatus === "COMPLETE") {
      const { error } = await supabase
        .from("orders")
        .update({ status: "confirmed", payment_status: "paid", payfast_payment_id: pfPaymentId })
        .eq("id", orderId);
      if (error) {
        console.error("Failed to update order:", error);
        return new Response("DB error", { status: 500, headers: corsHeaders });
      }
      console.log(`Order ${orderId} marked paid (pf_payment_id=${pfPaymentId})`);
    } else {
      const newPaymentStatus = paymentStatus === "FAILED" ? "failed" : "cancelled";
      await supabase
        .from("orders")
        .update({ payment_status: newPaymentStatus })
        .eq("id", orderId);
      console.log(`Order ${orderId} payment ${newPaymentStatus}`);
    }

    return new Response("OK", { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("ITN handler error:", err);
    return new Response("Internal error", { status: 500, headers: corsHeaders });
  }
});
