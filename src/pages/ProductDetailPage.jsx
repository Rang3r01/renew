import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { colors, gradients, typography } from '../theme';

export function ProductDetailPage({ product, onAddToCart, onBack, cart, onNavigate }) {
  const { isMobile } = useResponsive();
  const [added, setAdded] = useState(false);
  if (!product) return null;

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const inCart = cart.find(i => i.id === product.id)?.qty || 0;
  const remaining = product.stock - inCart;
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    if (remaining <= 0) return;
    onAddToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ fontFamily: typography.fontFamily, background: '#F5F8FA', minHeight: '100vh' }}>
      <nav style={{ background: colors.navBg, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: `0 ${isMobile ? '16px' : '32px'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? 56 : 64 }}>
          <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', fontFamily: typography.fontFamily, display: 'flex', alignItems: 'center', gap: 6 }} onClick={onBack}>
            ← {isMobile ? 'Back' : 'Back to Store'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: gradients.primary }}/>
            <span style={{ fontSize: 16, fontWeight: 800, color: colors.primary }}>RENEW</span>
          </div>
          <button style={{ background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: typography.fontFamily }} onClick={() => onNavigate('cart')}>
            🛒 {cartCount > 0 && <span style={{ background: colors.white, color: colors.primaryDark, borderRadius: '50%', width: 16, height: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800 }}>{cartCount}</span>}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '32px 32px 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 20 : 60, alignItems: 'start' }}>
          <div style={{ background: '#F0F7FA', borderRadius: isMobile ? 12 : 16, height: isMobile ? 240 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid #E0ECF0`, overflow: 'hidden' }}>
            {product.image
              ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ textAlign: 'center' }}><div style={{ fontSize: isMobile ? 48 : 64, color: '#B8D4DC' }}>◎</div><div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 8, padding: '0 20px' }}>{product.name}</div></div>
            }
          </div>

          <div>
            <div style={{ display: 'inline-block', background: 'rgba(43,181,200,0.1)', color: colors.primaryDark, borderRadius: 4, padding: '4px 10px', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>{product.category}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: colors.textTertiary, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>{product.brand}</div>
            <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 800, color: colors.textPrimary, margin: '0 0 14px', lineHeight: 1.2 }}>{product.name}</h1>
            <div style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: colors.primaryDark, marginBottom: 20 }}>R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
            <div style={{ height: 1, background: colors.borderSubtle, marginBottom: 20 }}/>
            <p style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.7, marginBottom: 20 }}>{product.description}</p>

            {product.features?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: colors.textPrimary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Features</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {product.features.map((f, i) => (
                    <li key={i} style={{ fontSize: 13, color: colors.textSecondary, padding: '4px 0', display: 'flex', gap: 8 }}>
                      <span style={{ color: colors.primary, fontSize: 8, marginTop: 5, flexShrink: 0 }}>◆</span>{f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.stock > 0 && remaining > 0 ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: `1.5px solid ${colors.borderInput}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button style={{ background: '#F5F8FA', border: 'none', width: 40, height: 44, fontSize: 18, cursor: 'pointer', color: colors.textSecondary, fontFamily: typography.fontFamily }} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span style={{ padding: '0 20px', fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>{qty}</span>
                  <button style={{ background: '#F5F8FA', border: 'none', width: 40, height: 44, fontSize: 18, cursor: 'pointer', color: colors.textSecondary, fontFamily: typography.fontFamily }} onClick={() => setQty(q => Math.min(remaining, q + 1))}>+</button>
                </div>
                <button onClick={handleAdd}
                  style={{ flex: 1, background: added ? colors.primaryDark : colors.primary, color: colors.white, border: 'none', borderRadius: 8, padding: '12px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontFamily, transition: 'background 0.2s', minWidth: isMobile ? '100%' : 'auto' }}>
                  {added ? '✓ Added to Cart' : `Add ${qty > 1 ? qty + '× ' : ''}to Cart`}
                </button>
              </div>
            ) : (product.stock === 0 || remaining <= 0) && (
              <div style={{ background: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: 8, padding: '12px 16px', fontSize: 13, color: colors.error, fontWeight: 600, marginBottom: 16 }}>
                {product.stock === 0 ? 'This product is currently out of stock.' : `You already have all ${inCart} available units in your cart.`}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
