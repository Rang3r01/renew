import { colors, gradients, typography } from '../theme';

export function PaymentSuccessPage({ onNavigate }) {
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

          <div style={{ width: 80, height: 80, borderRadius: '50%', background: colors.successBg, border: `3px solid ${colors.successLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={colors.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: colors.textPrimary, margin: '0 0 10px' }}>Payment Successful!</h1>
          <p style={{ fontSize: 15, color: colors.textSecondary, margin: '0 0 6px' }}>
            Thank you for your order. Your payment has been received and confirmed.
          </p>
          {orderId && (
            <p style={{ fontSize: 13, color: colors.textTertiary, margin: '0 0 32px' }}>
              Order reference: <strong style={{ color: colors.textPrimary }}>{orderId}</strong>
            </p>
          )}

          <div style={{ background: colors.successBg2, border: `1px solid ${colors.successBorder}`, borderRadius: 10, padding: '14px 18px', marginBottom: 32, textAlign: 'left' }}>
            <div style={{ fontSize: 13, color: colors.success, fontWeight: 600, marginBottom: 4 }}>What happens next?</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: colors.textSecondary, lineHeight: 1.8 }}>
              <li>You'll receive an email confirmation shortly</li>
              <li>Our team will process and dispatch your order</li>
              <li>Estimated delivery: 3–5 business days</li>
            </ul>
          </div>

          <button
            onClick={() => onNavigate('store')}
            style={{ width: '100%', background: colors.primary, color: colors.white, border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontFamily }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
