import { colors, gradients, typography } from '../theme';

export function PaymentCancelPage({ onNavigate }) {
  const orderId = new URLSearchParams(window.location.search).get('order') || '';

  return (
    <div style={{ fontFamily: typography.fontFamily, background: colors.bgPage, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{ background: colors.navBg, height: 60, display: 'flex', alignItems: 'center', padding: '0 40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: gradients.primary }} />
          <span style={{ fontSize: 18, fontWeight: 800, color: colors.primary }}>RENEW</span>
        </div>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ background: colors.bgCard, borderRadius: 16, padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${colors.border}` }}>

          <div style={{ width: 80, height: 80, borderRadius: '50%', background: colors.warningBg, border: `3px solid ${colors.warningBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={colors.warning} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, margin: '0 0 10px' }}>Payment Cancelled</h1>
          <p style={{ fontSize: 15, color: colors.textSecondary, margin: '0 0 6px' }}>
            Your payment was not completed. No charge has been made to your account.
          </p>
          {orderId && (
            <p style={{ fontSize: 13, color: colors.textTertiary, margin: '0 0 32px' }}>
              Order reference: <strong style={{ color: colors.textPrimary }}>{orderId}</strong>
            </p>
          )}

          <div style={{ background: colors.warningBg, border: `1px solid ${colors.warningBorder}`, borderRadius: 10, padding: '14px 18px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: colors.warning, fontWeight: 600, marginBottom: 4 }}>Your cart is saved</div>
            <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, lineHeight: 1.6 }}>
              You can return to checkout and try again whenever you're ready. If you keep experiencing issues, please contact us.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => onNavigate('cart')}
              style={{ width: '100%', background: colors.primary, color: colors.white, border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontFamily }}
            >
              Return to Cart
            </button>
            <button
              onClick={() => onNavigate('store')}
              style={{ width: '100%', background: 'none', border: `1.5px solid ${colors.borderInput}`, borderRadius: 9, padding: '13px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: typography.fontFamily, color: colors.textSecondary }}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
