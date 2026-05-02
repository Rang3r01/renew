import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function md5hex(message: string): string {
  return createHash("md5").update(message, "utf8").digest("hex");
}

const FIELD_ORDER = [
  "merchant_id",
  "merchant_key",
  "return_url",
  "cancel_url",
  "notify_url",
  "name_first",
  "name_last",
  "email_address",
  "m_payment_id",
  "amount",
  "item_name",
];

function buildSignatureString(data: Record<string, string>, passphrase: string): string {
  const pfParamString = FIELD_ORDER
    .filter(key => data[key] && data[key] !== "")
    .map(key => `${key}=${encodeURIComponent(data[key].toString().trim()).replace(/%20/g, "+")}`)
    .join("&");

  return passphrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, "+")}`
    : pfParamString;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const merchantId = (Deno.env.get("PAYFAST_MERCHANT_ID") ?? "").trim();
    const merchantKey = (Deno.env.get("PAYFAST_MERCHANT_KEY") ?? "").trim();
    const passphrase = (Deno.env.get("PAYFAST_PASSPHRASE") ?? "").trim();
    const sandboxMode = Deno.env.get("PAYFAST_SANDBOX_MODE") !== "false";

    if (!merchantId || !merchantKey) {
      return new Response(
        JSON.stringify({ error: "Payfast credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { orderId, amount, firstName, lastName, email, itemName, appOrigin } = body;

    if (!orderId || !amount || !firstName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, amount, firstName, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const notifyUrl = `${supabaseUrl}/functions/v1/payfast-notify`;

    const origin = (appOrigin || req.headers.get("origin") || supabaseUrl).replace(/\/$/, "");
    const returnUrl = `${origin}/payment-success`;
    const cancelUrl = `${origin}/payment-cancel`;

    const safeItemName = (itemName ?? `Order ${orderId}`)
      .substring(0, 100)
      .replace(/[^a-zA-Z0-9 \-_]/g, "")
      .trim();

    // Single shared payload — used for both signature and form fields.
    // All values are trimmed here so the form receives the exact same strings
    // that were hashed.
    const data: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: firstName.trim(),
      email_address: email.trim(),
      m_payment_id: String(orderId).trim(),
      amount: Number(amount).toFixed(2),
      item_name: safeItemName,
    };

    const trimmedLastName = (lastName ?? "").trim();
    if (trimmedLastName !== "") {
      data.name_last = trimmedLastName;
    }

    const finalString = buildSignatureString(data, passphrase);
    console.log("PF STRING:", finalString);

    const signature = md5hex(finalString);
    console.log("PF SIGNATURE:", signature);

    const payfastUrl = sandboxMode
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    return new Response(
      JSON.stringify({ params: { ...data, signature }, payfastUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("payfast-sign error:", err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
