import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';

export function CartPage({ cart, onUpdateCart, onRemove, onBack, onCheckout }) {
  const { isMobile } = useResponsive();
  const [step, setStep] = useState('cart');
  const [form, setForm] = useState({ firstName:'',lastName:'',email:'',phone:'',address:'',city:'',postal:'',payment:'eft' });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  const shipping = subtotal>1000?0:150;
  const total = subtotal+shipping;

  const validate = () => {
    const e={};
    if(!form.firstName) e.firstName='Required';
    if(!form.lastName) e.lastName='Required';
    if(!form.email.includes('@')) e.email='Valid email required';
    if(!form.phone) e.phone='Required';
    if(!form.address) e.address='Required';
    if(!form.city) e.city='Required';
    if(!form.postal) e.postal='Required';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handlePlaceOrder = () => {
    if(!validate()) return;
    setPlacing(true);
    setTimeout(()=>{ setPlacing(false); setStep('confirm'); onCheckout(); },900);
  };

  const orderNum = 'RNW-'+Math.floor(10000+Math.random()*90000);

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#F5F8FA', minHeight:'100vh' }}>
      <nav style={{ background:'#0d2b35', height:isMobile?56:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${isMobile?16:32}px` }}>
        <button style={{ background:'none',border:'none',color:'rgba(255,255,255,0.55)',fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>← Back</button>
        <span style={{ color:'#fff',fontWeight:700,fontSize:15 }}>Your Cart</span>
        <div style={{ width:60 }}/>
      </nav>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:isMobile?'16px':'28px 32px 60px' }}>
        {step==='cart' && (
          cart.length===0?(
            <div style={{ textAlign:'center',padding:'80px 20px' }}>
              <div style={{ fontSize:48,color:'#DDE4E8',marginBottom:16 }}>◎</div>
              <div style={{ fontSize:16,color:'#9AABB0',marginBottom:24 }}>Your cart is empty</div>
              <button style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>Browse Products</button>
            </div>
          ):(
            <div>
              {cart.map(item=>(
                <div key={item.id} style={{ background:'#fff',borderRadius:12,padding:isMobile?'14px':'18px 22px',display:'flex',gap:12,marginBottom:10,border:'1px solid #E8EEF0',alignItems:'center' }}>
                  <div style={{ fontSize:22,color:'#B8D4DC',flexShrink:0 }}>◎</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:10,fontWeight:700,color:'#9AABB0',textTransform:'uppercase' }}>{item.brand}</div>
                    <div style={{ fontSize:13,fontWeight:700,color:'#1a2b30',marginTop:2 }}>{item.name}</div>
                    <div style={{ fontSize:13,color:'#4A6068' }}>R {item.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                  </div>
                  <div style={{ display:'flex',alignItems:'center',gap:8,flexShrink:0 }}>
                    <div style={{ display:'flex',alignItems:'center',border:'1.5px solid #DDE4E8',borderRadius:8,overflow:'hidden' }}>
                      <button style={{ background:'#F5F8FA',border:'none',width:28,height:32,fontSize:15,cursor:'pointer',color:'#4A6068',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>onUpdateCart(item.id,item.qty-1)}>−</button>
                      <span style={{ padding:'0 8px',fontSize:13,fontWeight:700,color:'#1a2b30' }}>{item.qty}</span>
                      <button style={{ background:'#F5F8FA',border:'none',width:28,height:32,fontSize:15,cursor:item.qty>=item.stock?'not-allowed':'pointer',color:item.qty>=item.stock?'#C8D4D8':'#4A6068',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>item.qty<item.stock&&onUpdateCart(item.id,item.qty+1)} disabled={item.qty>=item.stock}>+</button>
                    </div>
                    <div style={{ fontSize:14,fontWeight:800,color:'#1A8A9A',minWidth:80,textAlign:'right' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                    <button style={{ background:'none',border:'none',color:'#C8D4D8',fontSize:14,cursor:'pointer',padding:0 }} onClick={()=>onRemove(item.id)}>✕</button>
                  </div>
                </div>
              ))}
              <div style={{ background:'#fff',borderRadius:12,padding:'20px',border:'1px solid #E8EEF0',marginTop:20 }}>
                <div style={{ fontSize:15,fontWeight:700,color:'#1a2b30',marginBottom:16 }}>Order Summary</div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:14,color:'#4A6068',marginBottom:12 }}>
                  <span>Total</span><span style={{ fontWeight:800 }}>R {total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                </div>
                <button style={{ width:'100%',background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setStep('checkout')}>Proceed to Checkout</button>
              </div>
            </div>
          )
        )}
        {step==='confirm' && (
          <div style={{ textAlign:'center',padding:'80px 20px' }}>
            <div style={{ fontSize:48,color:'#059669',marginBottom:16 }}>✓</div>
            <h2 style={{ fontSize:isMobile?22:28,fontWeight:800,color:'#1a2b30',margin:'0 0 12px' }}>Order Placed!</h2>
            <p style={{ fontSize:14,color:'#4A6068',marginBottom:24 }}>Thank you! We'll be in touch shortly.</p>
            <div style={{ fontSize:22,fontWeight:800,color:'#1A8A9A',marginBottom:32 }}>R {total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
            <button style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>Continue Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
}
