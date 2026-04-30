export function PaymentCancelPage({ onNavigate }) {
  const orderId = new URLSearchParams(window.location.search).get('order') || '';

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#EEF2F5', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: '#0d2b35', height: 60, display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: '#2BB5C8' }}>RENEW</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #E4EAF0' }}>

          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#FFF7ED', border: '3px solid #FED7AA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a2b30', margin: '0 0 10px' }}>Payment Cancelled</h1>
          <p style={{ fontSize: 15, color: '#4A6068', margin: '0 0 6px' }}>
            Your payment was not completed. No charge has been made to your account.
          </p>
          {orderId && (
            <p style={{ fontSize: 13, color: '#9AABB0', margin: '0 0 32px' }}>
              Order reference: <strong style={{ color: '#1a2b30' }}>{orderId}</strong>
            </p>
          )}

          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '14px 18px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: '#EA580C', fontWeight: 600, marginBottom: 4 }}>Your cart is saved</div>
            <p style={{ margin: 0, fontSize: 13, color: '#4A6068', lineHeight: 1.6 }}>
              You can return to checkout and try again whenever you're ready. If you keep experiencing issues, please contact us.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => onNavigate('cart')}
              style={{ width: '100%', background: '#2BB5C8', color: '#fff', border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
            >
              Return to Cart
            </button>
            <button
              onClick={() => onNavigate('store')}
              style={{ width: '100%', background: 'none', border: '1.5px solid #DDE4E8', borderRadius: 9, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", color: '#4A6068' }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
