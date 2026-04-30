import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function buildSignatureString(params: Record<string, string>, passphrase: string): string {
  const sorted = Object.keys(params)
    .sort()
    .filter((k) => params[k] !== "" && params[k] !== undefined)
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
    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID");
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY");
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") ?? "";
    const sandboxMode = Deno.env.get("PAYFAST_SANDBOX_MODE") !== "false";

    if (!merchantId || !merchantKey) {
      return new Response(
        JSON.stringify({ error: "Payfast credentials not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const { orderId, amount, firstName, lastName, email, itemName } = body;

    if (!orderId || !amount || !firstName || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: orderId, amount, firstName, email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    // Extract the project ref to build the app URL — fall back to the Supabase URL origin
    const appOrigin = supabaseUrl; // ITN notify URL stays on Supabase functions
    const notifyUrl = `${supabaseUrl}/functions/v1/payfast-notify`;

    // return_url and cancel_url point back to the front-end
    // We embed the order ID as a query param so the result pages can display it
    const returnBase = req.headers.get("origin") ?? supabaseUrl;
    const returnUrl = `${returnBase}/payment-success?order=${orderId}`;
    const cancelUrl = `${returnBase}/payment-cancel?order=${orderId}`;

    const params: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      name_first: firstName,
      name_last: lastName ?? "",
      email_address: email,
      m_payment_id: orderId,
      amount: Number(amount).toFixed(2),
      item_name: itemName ?? `Order ${orderId}`,
    };

    const sigString = buildSignatureString(params, passphrase);
    const signature = await md5hex(sigString);

    const payfastUrl = sandboxMode
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    return new Response(
      JSON.stringify({ params: { ...params, signature }, payfastUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
