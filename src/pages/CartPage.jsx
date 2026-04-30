import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { PayfastButton } from '../components/PayfastButton';

const fmt = (n) => `R ${n.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;

export function CartPage({ cart, onUpdateCart, onRemove, onBack, onCheckout }) {
  const { isMobile } = useResponsive();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', address:'', city:'', postal:'' });
  const [errors, setErrors] = useState({});
  const [pendingOrder, setPendingOrder] = useState(null);
  const [payError, setPayError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal;

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName)  e.lastName  = 'Required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (!form.phone)    e.phone    = 'Required';
    if (!form.address)  e.address  = 'Required';
    if (!form.city)     e.city     = 'Required';
    if (!form.postal)   e.postal   = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!validate()) return;
    setPayError('');
    // Create the order record in a pending state before redirecting to Payfast
    const orderId = 'RNW-' + Math.floor(10000 + Math.random() * 90000);
    const newOrder = {
      id: orderId,
      customer: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      total,
      date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      items: cart.map(i => ({ name: i.name, brand: i.brand, qty: i.qty, price: i.price })),
    };
    await onCheckout(newOrder);
    setPendingOrder({
      id: orderId,
      total,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
    });
    setStep('payment');
  };

  const inputSt = (err) => ({
    width: '100%', border: `1.5px solid ${err ? '#DC2626' : '#DDE4E8'}`, borderRadius: 8,
    padding: '10px 12px', fontSize: 14, outline: 'none', boxSizing: 'border-box',
    color: '#1a2b30', fontFamily: "'DM Sans',sans-serif", background: '#fff',
  });
  const labelSt = { display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#EEF2F5', minHeight: '100vh' }}>

      {/* Top nav */}
      <nav style={{ background: '#0d2b35', height: isMobile ? 52 : 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${isMobile ? 16 : 40}px` }}>
        <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.55)', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", display: 'flex', alignItems: 'center', gap: 6 }} onClick={onBack}>
          ← Back
        </button>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>Your Cart</span>
        <div style={{ width: 60 }} />
      </nav>

      {/* Step indicator */}
      {step !== 'payment' && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, padding: '20px 16px' }}>
          <StepDot num={1} label="Cart" active={step === 'cart'} done={step === 'checkout'} />
          <div style={{ width: 40, height: 1.5, background: step === 'checkout' ? '#2BB5C8' : '#C8D4D8' }} />
          <StepDot num={2} label="Checkout" active={step === 'checkout'} done={false} />
        </div>
      )}

      {/* ── CART STEP ── */}
      {step === 'cart' && (
        cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ fontSize: 52, color: '#C8D4D8', marginBottom: 16 }}>◎</div>
            <div style={{ fontSize: 16, color: '#9AABB0', marginBottom: 24 }}>Your cart is empty</div>
            <button style={{ background: '#2BB5C8', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }} onClick={onBack}>Browse Products</button>
          </div>
        ) : (
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: isMobile ? '0 12px 80px' : '0 32px 60px', display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

            {/* Cart items */}
            <div>
              {cart.map(item => (
                <div key={item.id} style={{ background: '#fff', borderRadius: 12, padding: isMobile ? '14px' : '16px 20px', display: 'flex', gap: 16, marginBottom: 10, border: '1px solid #E4EAF0', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: isMobile ? 52 : 64, height: isMobile ? 52 : 64, borderRadius: 10, background: '#EEF5F8', border: '1px solid #DCE8EE', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.image
                      ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 9 }} />
                      : <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#9AABB0" strokeWidth="1.5"/><circle cx="12" cy="12" r="3" fill="#9AABB0"/></svg>
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#9AABB0', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{item.brand}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a2b30', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: '#4A6068' }}>{fmt(item.price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #DDE4E8', borderRadius: 8, overflow: 'hidden' }}>
                      <button style={{ background: 'none', border: 'none', width: 32, height: 34, fontSize: 16, cursor: 'pointer', color: '#4A6068', fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }} onClick={() => onUpdateCart(item.id, item.qty - 1)}>−</button>
                      <span style={{ padding: '0 10px', fontSize: 14, fontWeight: 700, color: '#1a2b30', minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                      <button style={{ background: 'none', border: 'none', width: 32, height: 34, fontSize: 16, cursor: item.qty >= item.stock ? 'not-allowed' : 'pointer', color: item.qty >= item.stock ? '#C8D4D8' : '#4A6068', fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }} onClick={() => item.qty < item.stock && onUpdateCart(item.id, item.qty + 1)} disabled={item.qty >= item.stock}>+</button>
                    </div>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#2BB5C8', minWidth: isMobile ? 80 : 100, textAlign: 'right' }}>{fmt(item.price * item.qty)}</span>
                    <button style={{ background: 'none', border: 'none', color: '#B0BEC5', fontSize: 15, cursor: 'pointer', padding: '0 2px', lineHeight: 1 }} onClick={() => onRemove(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid #E4EAF0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginTop: isMobile ? 12 : 0 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#1a2b30', marginBottom: 20 }}>Order Summary</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 12 }}>
                <span>Subtotal</span>
                <span style={{ color: '#1a2b30', fontWeight: 500 }}>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #E8EEF0' }}>
                <span>Shipping</span>
                <span style={{ color: '#2BB5C8', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#1a2b30', marginBottom: 20 }}>
                <span>Total</span>
                <span style={{ fontSize: 18 }}>{fmt(total)}</span>
              </div>
              <button
                style={{ width: '100%', background: '#2BB5C8', color: '#fff', border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }}
                onClick={() => setStep('checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )
      )}

      {/* ── CHECKOUT STEP ── */}
      {step === 'checkout' && (
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: isMobile ? '0 12px 80px' : '0 32px 60px', display: isMobile ? 'block' : 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* Delivery form */}
          <div style={{ background: '#fff', borderRadius: 12, padding: isMobile ? '20px 16px' : '28px', border: '1px solid #E4EAF0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1a2b30', marginBottom: 20 }}>Delivery Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 14, marginBottom: 14 }}>
              {[['firstName','First Name'],['lastName','Last Name'],['email','Email'],['phone','Phone']].map(([k,l]) => (
                <div key={k}>
                  <label style={labelSt}>{l}</label>
                  <input style={inputSt(errors[k])} value={form[k]} onChange={e => set(k, e.target.value)} />
                  {errors[k] && <div style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors[k]}</div>}
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelSt}>Street Address</label>
              <input style={inputSt(errors.address)} value={form.address} onChange={e => set('address', e.target.value)} />
              {errors.address && <div style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors.address}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['city','City'],['postal','Postal Code']].map(([k,l]) => (
                <div key={k}>
                  <label style={labelSt}>{l}</label>
                  <input style={inputSt(errors[k])} value={form[k]} onChange={e => set(k, e.target.value)} />
                  {errors[k] && <div style={{ fontSize: 11, color: '#DC2626', marginTop: 3 }}>{errors[k]}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Order summary sidebar */}
          <div style={{ background: '#fff', borderRadius: 12, padding: '24px', border: '1px solid #E4EAF0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginTop: isMobile ? 16 : 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#1a2b30', marginBottom: 16 }}>Order Summary</div>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, fontSize: 13 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#1a2b30', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ color: '#9AABB0' }}>×{item.qty}</div>
                </div>
                <span style={{ fontWeight: 700, color: '#1a2b30', marginLeft: 12 }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #E8EEF0', paddingTop: 14, marginTop: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 8 }}>
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 16 }}>
                <span>Shipping</span><span style={{ color: '#2BB5C8', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, color: '#1a2b30', marginBottom: 20 }}>
                <span>Total</span><span>{fmt(total)}</span>
              </div>

              {payError && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 14 }}>
                  {payError}
                </div>
              )}

              <button
                onClick={handleProceedToPayment}
                style={{ width: '100%', background: '#2BB5C8', color: '#fff', border: 'none', borderRadius: 9, padding: '14px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}
              >
                Review &amp; Pay
              </button>
              <button style={{ width: '100%', background: 'none', border: 'none', color: '#9AABB0', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif" }} onClick={() => setStep('cart')}>← Back to Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* ── PAYMENT STEP ── */}
      {step === 'payment' && pendingOrder && (
        <div style={{ maxWidth: 520, margin: '40px auto', padding: isMobile ? '0 16px 80px' : '0 0 60px' }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: isMobile ? '24px 20px' : '36px', border: '1px solid #E4EAF0', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }}>

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1a2b30', marginBottom: 6 }}>Complete Your Payment</div>
              <div style={{ fontSize: 13, color: '#9AABB0' }}>Order <strong style={{ color: '#1a2b30' }}>{pendingOrder.id}</strong></div>
            </div>

            {/* Summary */}
            <div style={{ background: '#F8FBFC', border: '1px solid #E4EAF0', borderRadius: 10, padding: '16px 20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 8 }}>
                <span>Items</span>
                <span>{cart.reduce((s, i) => s + i.qty, 0)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#4A6068', marginBottom: 8 }}>
                <span>Shipping</span>
                <span style={{ color: '#2BB5C8', fontWeight: 600 }}>Free</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800, color: '#1a2b30', paddingTop: 10, borderTop: '1px solid #E4EAF0' }}>
                <span>Total</span>
                <span style={{ color: '#2BB5C8' }}>{fmt(pendingOrder.total)}</span>
              </div>
            </div>

            {payError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16 }}>
                {payError}
              </div>
            )}

            <PayfastButton
              order={pendingOrder}
              onError={(msg) => setPayError(msg)}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9AABB0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span style={{ fontSize: 12, color: '#9AABB0' }}>Secured by Payfast — you'll be redirected to complete payment</span>
            </div>

            <button style={{ width: '100%', background: 'none', border: 'none', color: '#9AABB0', fontSize: 13, cursor: 'pointer', marginTop: 16, fontFamily: "'DM Sans',sans-serif" }} onClick={() => setStep('checkout')}>
              ← Back to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDot({ num, label, active, done }) {
  const bg = active ? '#2BB5C8' : done ? '#2BB5C8' : '#fff';
  const border = active || done ? '#2BB5C8' : '#C8D4D8';
  const textColor = active || done ? '#fff' : '#9AABB0';
  const labelColor = active ? '#1a2b30' : '#9AABB0';
  const fontWeight = active ? 700 : 400;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 30, height: 30, borderRadius: '50%', background: bg, border: `2px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: textColor, transition: 'all 0.2s' }}>
        {done ? '✓' : num}
      </div>
      <span style={{ fontSize: 14, fontWeight, color: labelColor }}>{label}</span>
    </div>
  );
}
