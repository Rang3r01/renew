import { useState } from 'react';

const SIGN_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/payfast-sign`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export function PayfastButton({ order, onError, style }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch(SIGN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
          // Pass the app origin so the edge function can build correct return_url / cancel_url
          Origin: window.location.origin,
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total,
          firstName: order.firstName,
          lastName: order.lastName ?? '',
          email: order.email,
          itemName: `Renew Health Supplies Order ${order.id}`,
          appOrigin: window.location.origin,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Signature request failed (${res.status})`);
      }

      const { params, payfastUrl } = await res.json();

      // Build a hidden form and POST it to Payfast
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = payfastUrl;
      form.target = '_top';
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setLoading(false);
      onError?.(err.message || 'Payment initiation failed. Please try again.');
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      type="button"
      style={{
        width: '100%',
        background: loading ? '#9AABB0' : '#0E9F6E',
        color: '#fff',
        border: 'none',
        borderRadius: 9,
        padding: '14px',
        fontSize: 15,
        fontWeight: 700,
        cursor: loading ? 'default' : 'pointer',
        fontFamily: "'DM Sans',sans-serif",
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...style,
      }}
    >
      {loading ? <><SpinnerIcon /> Redirecting to Payfast…</> : <><LockIcon /> Pay Securely with Payfast</>}
    </button>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}
