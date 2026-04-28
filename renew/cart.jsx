
// Cart & Checkout — mobile optimized
const CartPage = ({ cart, onUpdateCart, onRemove, onBack, onCheckout }) => {
  const { isMobile } = useResponsive();
  const [step, setStep] = React.useState('cart');
  const [form, setForm] = React.useState({ firstName:'',lastName:'',email:'',phone:'',address:'',city:'',postal:'',payment:'eft' });
  const [errors, setErrors] = React.useState({});
  const [placing, setPlacing] = React.useState(false);

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

  const orderNum = React.useMemo(()=>'RNW-'+Math.floor(10000+Math.random()*90000),[]);

  const inputStyle = { width:'100%',border:'1.5px solid #DDE4E8',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box',color:'#1a2b30',fontFamily:"'DM Sans',sans-serif" };
  const labelStyle = { display:'block',fontSize:12,fontWeight:600,color:'#4A6068',marginBottom:5 };

  if(step==='confirm') return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F5F8FA', padding:20 }}>
      <div style={{ background:'#fff',borderRadius:16,padding:isMobile?'36px 24px':'56px 48px',textAlign:'center',maxWidth:440,width:'100%',border:'1px solid #E8EEF0',boxShadow:'0 8px 40px rgba(0,0,0,0.08)' }}>
        <div style={{ width:64,height:64,borderRadius:'50%',background:'#ECFDF5',color:'#059669',fontSize:28,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 24px' }}>✓</div>
        <h2 style={{ fontSize:isMobile?22:28,fontWeight:800,color:'#1a2b30',margin:'0 0 12px' }}>Order Placed!</h2>
        <p style={{ fontSize:14,color:'#4A6068',lineHeight:1.6,margin:'0 0 24px' }}>Thank you! We'll be in touch shortly to confirm and arrange delivery.</p>
        <div style={{ fontSize:13,color:'#9AABB0',marginBottom:8 }}>Order #{orderNum}</div>
        <div style={{ fontSize:22,fontWeight:800,color:'#1A8A9A',marginBottom:32 }}>R {total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
        <button style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>Continue Shopping</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#F5F8FA', minHeight:'100vh' }}>
      {/* Nav */}
      <nav style={{ background:'#0d2b35', height:isMobile?56:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${isMobile?16:32}px` }}>
        <button style={{ background:'none',border:'none',color:'rgba(255,255,255,0.55)',fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>← Back</button>
        <span style={{ color:'#fff',fontWeight:700,fontSize:15 }}>{step==='cart'?'Your Cart':'Checkout'}</span>
        <div style={{ width:60 }}/>
      </nav>

      {/* Step indicator */}
      <div style={{ background:'#fff',borderBottom:'1px solid #E8EEF0',padding:'0 20px',display:'flex',alignItems:'center',justifyContent:'center',gap:16,height:48 }}>
        {['cart','checkout'].map((s,i)=>(
          <div key={s} style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:24,height:24,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,background:step===s?'#2BB5C8':step==='checkout'&&s==='cart'?'#1A8A9A':'#E8EEF0',color:step===s||step==='checkout'&&s==='cart'?'#fff':'#9AABB0' }}>
              {step==='checkout'&&s==='cart'?'✓':i+1}
            </div>
            <span style={{ fontSize:13,fontWeight:600,color:step===s?'#1a2b30':'#9AABB0' }}>{s==='cart'?'Cart':'Checkout'}</span>
            {i<1&&<div style={{ width:30,height:2,background:'#E8EEF0' }}/>}
          </div>
        ))}
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:isMobile?'16px':'28px 32px 60px' }}>
        {step==='cart' && (
          cart.length===0?(
            <div style={{ textAlign:'center',padding:'80px 20px' }}>
              <div style={{ fontSize:48,color:'#DDE4E8',marginBottom:16 }}>◎</div>
              <div style={{ fontSize:16,color:'#9AABB0',marginBottom:24 }}>Your cart is empty</div>
              <button style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'12px 28px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={onBack}>Browse Products</button>
            </div>
          ):(
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start' }}>
              <div>
                {cart.map(item=>(
                  <div key={item.id} style={{ background:'#fff',borderRadius:12,padding:isMobile?'14px':'18px 22px',display:'flex',gap:12,marginBottom:10,border:'1px solid #E8EEF0',alignItems:'center' }}>
                    <div style={{ width:56,height:56,background:'#F0F7FA',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,color:'#B8D4DC',flexShrink:0,overflow:'hidden' }}>
                      {item.image?<img src={item.image} alt={item.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:'◎'}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:10,fontWeight:700,color:'#9AABB0',textTransform:'uppercase' }}>{item.brand}</div>
                      <div style={{ fontSize:13,fontWeight:700,color:'#1a2b30',marginTop:2,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize:13,color:'#4A6068' }}>R {item.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                    </div>
                    <div style={{ display:'flex',flexDirection:isMobile?'column':'row',alignItems:'center',gap:8,flexShrink:0 }}>
                      <div style={{ display:'flex',alignItems:'center',border:'1.5px solid #DDE4E8',borderRadius:8,overflow:'hidden' }}>
                        <button style={{ background:'#F5F8FA',border:'none',width:28,height:32,fontSize:15,cursor:'pointer',color:'#4A6068',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>onUpdateCart(item.id,item.qty-1)}>−</button>
                        <span style={{ padding:'0 8px',fontSize:13,fontWeight:700,color:'#1a2b30' }}>{item.qty}</span>
                        <button
                          style={{ background:'#F5F8FA',border:'none',width:28,height:32,fontSize:15,cursor:item.qty>=item.stock?'not-allowed':'pointer',color:item.qty>=item.stock?'#C8D4D8':'#4A6068',fontFamily:"'DM Sans',sans-serif" }}
                          onClick={()=>item.qty<item.stock&&onUpdateCart(item.id,item.qty+1)}
                          disabled={item.qty>=item.stock}
                        >+</button>
                      </div>
                      <div style={{ fontSize:14,fontWeight:800,color:'#1A8A9A',minWidth:isMobile?'auto':80,textAlign:'right' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <button style={{ background:'none',border:'none',color:'#C8D4D8',fontSize:14,cursor:'pointer',padding:0 }} onClick={()=>onRemove(item.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ background:'#fff',borderRadius:12,padding:'20px',border:'1px solid #E8EEF0',position:isMobile?'static':'sticky',top:88 }}>
                <div style={{ fontSize:15,fontWeight:700,color:'#1a2b30',marginBottom:16 }}>Order Summary</div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:14,color:'#4A6068',marginBottom:8 }}><span>Subtotal</span><span>R {subtotal.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span></div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:14,color:'#4A6068',marginBottom:shipping>0?4:12 }}><span>Shipping</span><span style={shipping===0?{color:'#059669'}:{}}>{shipping===0?'Free':`R ${shipping.toFixed(2)}`}</span></div>
                {shipping>0&&<div style={{ fontSize:11,color:'#059669',marginBottom:12 }}>Free shipping on orders over R1,000</div>}
                <div style={{ height:1,background:'#E8EEF0',marginBottom:12 }}/>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:800,color:'#1a2b30',marginBottom:18 }}><span>Total</span><span>R {total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span></div>
                <button style={{ width:'100%',background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:12,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setStep('checkout')}>Proceed to Checkout</button>
              </div>
            </div>
          )
        )}

        {step==='checkout' && (
          <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 320px',gap:20,alignItems:'start' }}>
            <div>
              {/* Delivery */}
              <div style={{ background:'#fff',borderRadius:12,padding:isMobile?'18px':'24px',border:'1px solid #E8EEF0',marginBottom:16 }}>
                <div style={{ fontSize:15,fontWeight:700,color:'#1a2b30',marginBottom:18 }}>Delivery Details</div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:14 }}>
                  {[['firstName','First Name'],['lastName','Last Name']].map(([k,l])=>(
                    <div key={k}>
                      <label style={labelStyle}>{l}</label>
                      <input style={{ ...inputStyle,borderColor:errors[k]?'#DC2626':'#DDE4E8' }} value={form[k]} onChange={e=>set(k,e.target.value)} />
                      {errors[k]&&<div style={{ fontSize:11,color:'#DC2626',marginTop:3 }}>{errors[k]}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14,marginBottom:14 }}>
                  {[['email','Email'],['phone','Phone']].map(([k,l])=>(
                    <div key={k}>
                      <label style={labelStyle}>{l}</label>
                      <input style={{ ...inputStyle,borderColor:errors[k]?'#DC2626':'#DDE4E8' }} value={form[k]} onChange={e=>set(k,e.target.value)} />
                      {errors[k]&&<div style={{ fontSize:11,color:'#DC2626',marginTop:3 }}>{errors[k]}</div>}
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={labelStyle}>Street Address</label>
                  <input style={{ ...inputStyle,borderColor:errors.address?'#DC2626':'#DDE4E8' }} value={form.address} onChange={e=>set('address',e.target.value)} />
                  {errors.address&&<div style={{ fontSize:11,color:'#DC2626',marginTop:3 }}>{errors.address}</div>}
                </div>
                <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:14 }}>
                  {[['city','City'],['postal','Postal Code']].map(([k,l])=>(
                    <div key={k}>
                      <label style={labelStyle}>{l}</label>
                      <input style={{ ...inputStyle,borderColor:errors[k]?'#DC2626':'#DDE4E8' }} value={form[k]} onChange={e=>set(k,e.target.value)} />
                      {errors[k]&&<div style={{ fontSize:11,color:'#DC2626',marginTop:3 }}>{errors[k]}</div>}
                    </div>
                  ))}
                </div>
              </div>
              {/* Payment */}
              <div style={{ background:'#fff',borderRadius:12,padding:isMobile?'18px':'24px',border:'1px solid #E8EEF0' }}>
                <div style={{ fontSize:15,fontWeight:700,color:'#1a2b30',marginBottom:16 }}>Payment Method</div>
                {[{id:'eft',label:'EFT / Bank Transfer',sub:"We'll send banking details after confirmation"},{id:'cash',label:'Cash on Collection',sub:'By appointment at our Secunda store'}].map(p=>(
                  <div key={p.id} onClick={()=>set('payment',p.id)} style={{ display:'flex',gap:12,padding:'12px 14px',borderRadius:10,cursor:'pointer',border:`1.5px solid ${form.payment===p.id?'#2BB5C8':'#E8EEF0'}`,background:form.payment===p.id?'rgba(43,181,200,0.04)':'#fff',marginBottom:10,alignItems:'flex-start' }}>
                    <div style={{ width:18,height:18,borderRadius:'50%',border:'2px solid #DDE4E8',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2 }}>
                      {form.payment===p.id&&<div style={{ width:9,height:9,borderRadius:'50%',background:'#2BB5C8' }}/>}
                    </div>
                    <div>
                      <div style={{ fontSize:14,fontWeight:600,color:'#1a2b30' }}>{p.label}</div>
                      <div style={{ fontSize:12,color:'#9AABB0',marginTop:2 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div style={{ background:'#fff',borderRadius:12,padding:'20px',border:'1px solid #E8EEF0',position:isMobile?'static':'sticky',top:88 }}>
              <div style={{ fontSize:15,fontWeight:700,color:'#1a2b30',marginBottom:14 }}>Order Summary</div>
              {cart.map(i=>(
                <div key={i.id} style={{ display:'flex',justifyContent:'space-between',fontSize:12,color:'#4A6068',marginBottom:7 }}>
                  <span style={{ maxWidth:180,lineHeight:1.3 }}>{i.name} ×{i.qty}</span>
                  <span>R {(i.price*i.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                </div>
              ))}
              <div style={{ height:1,background:'#E8EEF0',margin:'12px 0' }}/>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:14,color:'#4A6068',marginBottom:8 }}><span>Shipping</span><span>{shipping===0?'Free':`R ${shipping.toFixed(2)}`}</span></div>
              <div style={{ display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:800,color:'#1a2b30',marginBottom:18 }}><span>Total</span><span>R {total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span></div>
              <button style={{ width:'100%',background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:13,fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",marginBottom:8 }} onClick={handlePlaceOrder} disabled={placing}>{placing?'Placing…':'Place Order'}</button>
              <button style={{ width:'100%',background:'none',border:'none',color:'#9AABB0',fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setStep('cart')}>← Edit Cart</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Object.assign(window, { CartPage });
