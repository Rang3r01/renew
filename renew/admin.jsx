
// Admin Dashboard — mobile optimized
const AdminPage = ({ products, orders, onSaveProduct, onDeleteProduct, onNavigate }) => {
  const { isMobile } = useResponsive();
  const [tab, setTab] = React.useState('dashboard');
  const [editProduct, setEditProduct] = React.useState(null);
  const [showForm, setShowForm] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const emptyProduct = { name:'',brand:'',category:'Supplements',price:'',stock:'',description:'',features:'',active:true,image:null };
  const openAdd = () => { setEditProduct({...emptyProduct}); setShowForm(true); };
  const openEdit = (p) => { setEditProduct({...p,features:(p.features||[]).join('\n')}); setShowForm(true); };
  const handleSave = () => {
    if(!editProduct.name||!editProduct.price) return;
    onSaveProduct({ ...editProduct, price:parseFloat(editProduct.price), stock:parseInt(editProduct.stock)||0, features:editProduct.features?editProduct.features.split('\n').filter(Boolean):[], id:editProduct.id||Date.now() });
    setShowForm(false);
  };
  const handleDelete = (id) => { onDeleteProduct(id); setDeleteConfirm(null); };
  const handleImageUpload = (e) => {
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=(ev)=>setEditProduct(p=>({...p,image:ev.target.result}));
    reader.readAsDataURL(file);
  };

  const totalRevenue = orders.reduce((s,o)=>s+o.total,0);
  const categories = ['Oxygen Products','Supplements','Recovery','Wellness'];
  const filteredProducts = products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||(p.brand||'').toLowerCase().includes(search.toLowerCase()));
  const customers = orders.reduce((acc,o)=>{
    const ex=acc.find(c=>c.email===o.email);
    if(ex){ex.orders.push(o);ex.spent+=o.total;}
    else acc.push({name:o.customer,email:o.email,phone:o.phone||'—',since:o.date,orders:[o],spent:o.total});
    return acc;
  },[]);

  const tabs = [{id:'dashboard',label:'Dashboard',icon:'▦'},{id:'products',label:'Products',icon:'◫'},{id:'orders',label:'Orders',icon:'◉'},{id:'customers',label:'Customers',icon:'◈'}];

  const inputSt = { width:'100%',border:'1.5px solid #DDE4E8',borderRadius:8,padding:'10px 12px',fontSize:14,outline:'none',boxSizing:'border-box',color:'#1a2b30',fontFamily:"'DM Sans',sans-serif" };
  const labelSt = { display:'block',fontSize:11,fontWeight:700,color:'#4A6068',marginBottom:5,textTransform:'uppercase',letterSpacing:'0.05em' };

  // Mobile card-style table row
  const MobileCard = ({ children, onClick }) => (
    <div onClick={onClick} style={{ background:'#fff',borderRadius:10,padding:'14px 16px',marginBottom:10,border:'1px solid #E8EEF0',cursor:onClick?'pointer':'default' }}>
      {children}
    </div>
  );

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#F5F8FA', minHeight:'100vh', display:'flex', flexDirection:isMobile?'column':'row' }}>

      {/* ── DESKTOP SIDEBAR ── */}
      {!isMobile && (
        <aside style={{ width:240,background:'#0d2b35',flexShrink:0,display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh' }}>
          <div style={{ padding:'24px 20px 20px',display:'flex',alignItems:'center',gap:12,borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)',flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:18,fontWeight:800,color:'#2BB5C8' }}>RENEW</div>
              <div style={{ fontSize:10,color:'rgba(255,255,255,0.3)',letterSpacing:'0.05em',textTransform:'uppercase' }}>Admin Panel</div>
            </div>
          </div>
          <nav style={{ padding:'16px 12px',flex:1 }}>
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ display:'flex',alignItems:'center',gap:10,width:'100%',padding:'10px 12px',background:tab===t.id?'rgba(43,181,200,0.15)':'none',border:'none',color:tab===t.id?'#2BB5C8':'rgba(255,255,255,0.5)',fontSize:14,fontWeight:600,cursor:'pointer',borderRadius:8,marginBottom:4,textAlign:'left',fontFamily:"'DM Sans',sans-serif" }}>
                <span style={{ fontSize:16 }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <button onClick={()=>onNavigate('store')} style={{ margin:'0 12px 20px',padding:'10px 12px',background:'none',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,color:'rgba(255,255,255,0.35)',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>← Back to Store</button>
        </aside>
      )}

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <div style={{ background:'#0d2b35',padding:'0 16px',display:'flex',alignItems:'center',justifyContent:'space-between',height:52,flexShrink:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }}/>
            <span style={{ fontSize:16,fontWeight:800,color:'#2BB5C8' }}>RENEW</span>
            <span style={{ fontSize:11,color:'rgba(255,255,255,0.3)' }}>Admin</span>
          </div>
          <button onClick={()=>onNavigate('store')} style={{ background:'none',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,color:'rgba(255,255,255,0.5)',fontSize:11,padding:'6px 10px',cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>← Store</button>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1,overflow:'auto',padding:isMobile?'16px 16px 80px':'32px 36px' }}>
        <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:isMobile?16:28 }}>
          <h1 style={{ fontSize:isMobile?20:26,fontWeight:800,color:'#1a2b30',margin:0 }}>{tabs.find(t=>t.id===tab)?.label}</h1>
          {tab==='products'&&<button onClick={openAdd} style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:isMobile?'8px 14px':'10px 20px',fontSize:isMobile?13:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>+ Add</button>}
        </div>

        {/* ── DASHBOARD ── */}
        {tab==='dashboard'&&(
          <div>
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:isMobile?10:20,marginBottom:isMobile?16:28 }}>
              {[
                {label:'Revenue',value:`R ${(totalRevenue/1000).toFixed(1)}k`,color:'#2BB5C8',icon:'◈'},
                {label:'Orders',value:orders.length,color:'#1A8A9A',icon:'◉'},
                {label:'Products',value:products.length,color:'#0F6A7A',icon:'◫'},
                {label:'Low Stock',value:products.filter(p=>p.stock<=5).length,color:'#D97706',icon:'⚠'},
              ].map((s,i)=>(
                <div key={i} style={{ background:'#fff',borderRadius:12,padding:isMobile?'14px':'24px',border:'1px solid #E8EEF0' }}>
                  <div style={{ fontSize:isMobile?18:24,color:s.color,marginBottom:8 }}>{s.icon}</div>
                  <div style={{ fontSize:isMobile?18:26,fontWeight:800,color:'#1a2b30' }}>{s.value}</div>
                  <div style={{ fontSize:isMobile?11:13,color:'#9AABB0',marginTop:2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize:14,fontWeight:700,color:'#1a2b30',marginBottom:12 }}>Recent Orders</div>
            {orders.slice(0,5).map(o=>(
              isMobile?(
                <MobileCard key={o.id} onClick={()=>setSelectedOrder(o)}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:11,fontWeight:700,color:'#2BB5C8',marginBottom:2 }}>{o.id}</div>
                      <div style={{ fontSize:14,fontWeight:600,color:'#1a2b30' }}>{o.customer}</div>
                      <div style={{ fontSize:12,color:'#9AABB0',marginTop:2 }}>{o.date} · {o.itemCount} items</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:15,fontWeight:800,color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <span style={{ display:'inline-block',marginTop:4,borderRadius:4,padding:'2px 8px',fontSize:10,fontWeight:700,...(o.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:o.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{o.status}</span>
                    </div>
                  </div>
                </MobileCard>
              ):(
                <div key={o.id} onClick={()=>setSelectedOrder(o)} style={{ display:'grid',gridTemplateColumns:'repeat(5,1fr)',padding:'13px 20px',borderBottom:'1px solid #F0F4F7',alignItems:'center',gap:12,fontSize:14,color:'#4A6068',background:'#fff',cursor:'pointer' }}>
                  <span style={{ fontWeight:700,color:'#2BB5C8',fontSize:12 }}>{o.id}</span>
                  <span style={{ fontWeight:600,color:'#1a2b30' }}>{o.customer}</span>
                  <span>{o.itemCount} items</span>
                  <span style={{ fontWeight:700 }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ display:'inline-block',borderRadius:4,padding:'3px 8px',fontSize:11,fontWeight:700,...(o.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:o.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{o.status}</span>
                </div>
              )
            ))}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab==='products'&&(
          <div>
            <input style={{ ...inputSt,width:isMobile?'100%':240,marginBottom:16 }} placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
            {filteredProducts.map(p=>(
              isMobile?(
                <MobileCard key={p.id}>
                  <div style={{ display:'flex',gap:12,alignItems:'flex-start' }}>
                    <div style={{ width:52,height:52,borderRadius:8,background:'#F0F7FA',border:'1px solid #E8EEF0',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                      {p.image?<img src={p.image} alt={p.name} style={{ width:'100%',height:'100%',objectFit:'cover',borderRadius:8 }}/>:<span style={{ fontSize:20,color:'#B8D4DC' }}>◎</span>}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:14,fontWeight:700,color:'#1a2b30',marginBottom:2 }}>{p.name}</div>
                      <div style={{ fontSize:11,color:'#9AABB0',marginBottom:6 }}>{p.brand} · {p.category}</div>
                      <div style={{ display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
                        <span style={{ fontSize:15,fontWeight:800,color:'#1A8A9A' }}>R {p.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                        <span style={{ fontSize:12,fontWeight:600,color:p.stock===0?'#DC2626':p.stock<=5?'#D97706':'#059669' }}>Stock: {p.stock}</span>
                        <span style={{ fontSize:10,fontWeight:700,borderRadius:4,padding:'2px 7px',background:p.active!==false?'#ECFDF5':'#F5F8FA',color:p.active!==false?'#059669':'#9AABB0' }}>{p.active!==false?'Active':'Hidden'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display:'flex',gap:8,marginTop:12 }}>
                    <button onClick={()=>openEdit(p)} style={{ flex:1,background:'rgba(43,181,200,0.1)',color:'#1A8A9A',border:'none',borderRadius:7,padding:'8px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
                    <button onClick={()=>setDeleteConfirm(p.id)} style={{ flex:1,background:'#FEF2F2',color:'#DC2626',border:'none',borderRadius:7,padding:'8px',fontSize:13,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                  </div>
                </MobileCard>
              ):(
                <div key={p.id} style={{ display:'grid',gridTemplateColumns:'56px 1fr 140px 100px 70px 80px 120px',padding:'12px 20px',borderBottom:'1px solid #F0F4F7',background:'#fff',alignItems:'center',gap:12,fontSize:14,color:'#4A6068' }}>
                  <div style={{ width:48,height:48,borderRadius:6,background:'#F0F7FA',border:'1px solid #E8EEF0',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center' }}>
                    {p.image?<img src={p.image} alt={p.name} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<span style={{ fontSize:20,color:'#B8D4DC' }}>◎</span>}
                  </div>
                  <div><div style={{ fontWeight:700,fontSize:14,color:'#1a2b30' }}>{p.name}</div><div style={{ fontSize:11,color:'#9AABB0' }}>{p.brand}</div></div>
                  <span style={{ display:'inline-block',background:'rgba(43,181,200,0.08)',color:'#1A8A9A',borderRadius:4,padding:'3px 8px',fontSize:11,fontWeight:600 }}>{p.category}</span>
                  <span style={{ fontWeight:700 }}>R {p.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ color:p.stock===0?'#DC2626':p.stock<=5?'#D97706':'#059669',fontWeight:600 }}>{p.stock}</span>
                  <span style={{ display:'inline-block',borderRadius:4,padding:'3px 8px',fontSize:11,fontWeight:700,background:p.active!==false?'#ECFDF5':'#F5F8FA',color:p.active!==false?'#059669':'#9AABB0' }}>{p.active!==false?'Active':'Hidden'}</span>
                  <div style={{ display:'flex',gap:6 }}>
                    <button onClick={()=>openEdit(p)} style={{ background:'rgba(43,181,200,0.1)',color:'#1A8A9A',border:'none',borderRadius:6,padding:'5px 10px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
                    <button onClick={()=>setDeleteConfirm(p.id)} style={{ background:'#FEF2F2',color:'#DC2626',border:'none',borderRadius:6,padding:'5px 10px',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                  </div>
                </div>
              )
            ))}
            {!isMobile&&<div style={{ background:'#fff',borderRadius:'0 0 12px 12px' }}/>}
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab==='orders'&&(
          <div>
            {orders.map(o=>(
              isMobile?(
                <MobileCard key={o.id} onClick={()=>setSelectedOrder(o)}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:11,fontWeight:700,color:'#2BB5C8',marginBottom:2 }}>{o.id}</div>
                      <div style={{ fontSize:14,fontWeight:700,color:'#1a2b30' }}>{o.customer}</div>
                      <div style={{ fontSize:12,color:'#9AABB0',marginTop:2 }}>{o.email}</div>
                      <div style={{ fontSize:12,color:'#9AABB0',marginTop:2 }}>{o.date} · {o.itemCount} items</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:16,fontWeight:800,color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <span style={{ display:'inline-block',marginTop:6,borderRadius:4,padding:'3px 9px',fontSize:11,fontWeight:700,...(o.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:o.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{o.status}</span>
                      <div style={{ fontSize:11,color:'#2BB5C8',marginTop:6 }}>Tap for details →</div>
                    </div>
                  </div>
                </MobileCard>
              ):(
                <div key={o.id} onClick={()=>setSelectedOrder(o)} style={{ display:'grid',gridTemplateColumns:'1fr 1.5fr 60px 110px 110px 90px',padding:'13px 20px',borderBottom:'1px solid #F0F4F7',background:'#fff',alignItems:'center',gap:12,fontSize:14,color:'#4A6068',cursor:'pointer' }}>
                  <span style={{ fontWeight:700,color:'#2BB5C8',fontSize:12 }}>{o.id}</span>
                  <div><div style={{ fontWeight:600,color:'#1a2b30' }}>{o.customer}</div><div style={{ fontSize:12,color:'#9AABB0' }}>{o.email}</div></div>
                  <span>{o.itemCount}</span>
                  <span style={{ fontWeight:800,color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ fontSize:12,color:'#9AABB0' }}>{o.date}</span>
                  <span style={{ display:'inline-block',borderRadius:4,padding:'3px 8px',fontSize:11,fontWeight:700,...(o.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:o.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{o.status}</span>
                </div>
              )
            ))}
            <div style={{ textAlign:'center',fontSize:12,color:'#9AABB0',marginTop:12 }}>Tap any order to view line items</div>
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab==='customers'&&(
          <div>
            {customers.map((c,i)=>(
              isMobile?(
                <MobileCard key={i} onClick={()=>setSelectedCustomer(c)}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                      <div style={{ width:40,height:40,borderRadius:'50%',background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'#fff',flexShrink:0 }}>{c.name[0]}</div>
                      <div>
                        <div style={{ fontSize:14,fontWeight:700,color:'#1a2b30' }}>{c.name}</div>
                        <div style={{ fontSize:12,color:'#9AABB0' }}>{c.email}</div>
                        <div style={{ fontSize:12,color:'#9AABB0' }}>{c.orders.length} order{c.orders.length!==1?'s':''}</div>
                      </div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:15,fontWeight:800,color:'#1A8A9A' }}>R {c.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <div style={{ fontSize:11,color:'#2BB5C8',marginTop:4 }}>View history →</div>
                    </div>
                  </div>
                </MobileCard>
              ):(
                <div key={i} onClick={()=>setSelectedCustomer(c)} style={{ display:'grid',gridTemplateColumns:'1fr 120px 80px 150px 120px',padding:'13px 20px',borderBottom:'1px solid #F0F4F7',background:'#fff',alignItems:'center',gap:12,fontSize:14,color:'#4A6068',cursor:'pointer' }}>
                  <div><div style={{ fontWeight:700,color:'#1a2b30' }}>{c.name}</div><div style={{ fontSize:12,color:'#9AABB0' }}>{c.email}</div></div>
                  <span style={{ fontSize:13 }}>{c.phone}</span>
                  <span style={{ fontWeight:600 }}>{c.orders.length}</span>
                  <span style={{ fontWeight:800,color:'#1A8A9A' }}>R {c.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ fontSize:12,color:'#9AABB0' }}>{c.since}</span>
                </div>
              )
            ))}
            <div style={{ textAlign:'center',fontSize:12,color:'#9AABB0',marginTop:12 }}>Tap any customer to view order history</div>
          </div>
        )}
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      {isMobile && (
        <div style={{ position:'fixed',bottom:0,left:0,right:0,background:'#0d2b35',borderTop:'1px solid rgba(255,255,255,0.1)',display:'flex',zIndex:200,height:60 }}>
          {tabs.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,background:'none',border:'none',color:tab===t.id?'#2BB5C8':'rgba(255,255,255,0.4)',cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,fontFamily:"'DM Sans',sans-serif",transition:'color 0.15s' }}>
              <span style={{ fontSize:18 }}>{t.icon}</span>
              <span style={{ fontSize:10,fontWeight:tab===t.id?700:500 }}>{t.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ══ ORDER DETAIL MODAL ══ */}
      {selectedOrder&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(10,30,38,0.55)',display:'flex',alignItems:isMobile?'flex-end':'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)' }} onClick={()=>setSelectedOrder(null)}>
          <div style={{ background:'#fff',borderRadius:isMobile?'16px 16px 0 0':'16px',width:'100%',maxWidth:isMobile?'100%':660,maxHeight:isMobile?'90vh':'85vh',overflow:'auto',boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #E8EEF0',position:'sticky',top:0,background:'#fff',zIndex:2 }}>
              <div>
                <div style={{ fontSize:17,fontWeight:800,color:'#1a2b30' }}>Order {selectedOrder.id}</div>
                <div style={{ fontSize:12,color:'#9AABB0',marginTop:2 }}>{selectedOrder.date} · {selectedOrder.customer}</div>
              </div>
              <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                <span style={{ display:'inline-block',borderRadius:4,padding:'4px 10px',fontSize:11,fontWeight:700,...(selectedOrder.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:selectedOrder.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{selectedOrder.status}</span>
                <button style={{ background:'none',border:'none',fontSize:18,color:'#9AABB0',cursor:'pointer' }} onClick={()=>setSelectedOrder(null)}>✕</button>
              </div>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:0,background:'#F8FAFB',borderBottom:'1px solid #E8EEF0' }}>
              {[['Customer',selectedOrder.customer],['Email',selectedOrder.email],['Phone',selectedOrder.phone||'—'],['Date',selectedOrder.date]].map(([l,v])=>(
                <div key={l} style={{ padding:'14px 18px',borderRight:'1px solid #E8EEF0' }}>
                  <div style={{ fontSize:10,fontWeight:700,color:'#9AABB0',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:'#1a2b30',wordBreak:'break-all' }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'20px 22px' }}>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 50px 100px 100px',gap:10,padding:'8px 12px',background:'#F5F8FA',borderRadius:8,marginBottom:8,fontSize:11,fontWeight:700,color:'#9AABB0',textTransform:'uppercase',letterSpacing:'0.05em' }}>
                <span>Product</span><span style={{ textAlign:'right' }}>Qty</span><span style={{ textAlign:'right' }}>Price</span><span style={{ textAlign:'right' }}>Total</span>
              </div>
              {(selectedOrder.items||[]).map((item,i)=>(
                <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr 50px 100px 100px',gap:10,padding:'11px 12px',borderBottom:'1px solid #F0F4F7',alignItems:'center' }}>
                  <div>
                    <div style={{ fontWeight:700,color:'#1a2b30',fontSize:14 }}>{item.name}</div>
                    <div style={{ fontSize:11,color:'#9AABB0' }}>{item.brand}</div>
                  </div>
                  <div style={{ textAlign:'right',fontWeight:600,color:'#4A6068' }}>{item.qty}</div>
                  <div style={{ textAlign:'right',color:'#4A6068',fontSize:13 }}>R {item.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                  <div style={{ textAlign:'right',fontWeight:800,color:'#1A8A9A' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                </div>
              ))}
              <div style={{ background:'#F8FAFB',borderRadius:10,padding:'14px 16px',marginTop:16 }}>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:14,color:'#4A6068',marginBottom:6 }}><span>Shipping</span><span style={{ color:'#059669' }}>{selectedOrder.total>1000?'Free':'R 150.00'}</span></div>
                <div style={{ display:'flex',justifyContent:'space-between',fontSize:17,fontWeight:800,color:'#1a2b30',borderTop:'1px solid #E8EEF0',paddingTop:10,marginTop:6 }}><span>Total Paid</span><span>R {selectedOrder.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ CUSTOMER MODAL ══ */}
      {selectedCustomer&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(10,30,38,0.55)',display:'flex',alignItems:isMobile?'flex-end':'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)' }} onClick={()=>setSelectedCustomer(null)}>
          <div style={{ background:'#fff',borderRadius:isMobile?'16px 16px 0 0':'16px',width:'100%',maxWidth:isMobile?'100%':680,maxHeight:isMobile?'90vh':'85vh',overflow:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #E8EEF0',position:'sticky',top:0,background:'#fff',zIndex:2 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12 }}>
                <div style={{ width:44,height:44,borderRadius:'50%',background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:'#fff',flexShrink:0 }}>{selectedCustomer.name[0]}</div>
                <div>
                  <div style={{ fontSize:17,fontWeight:800,color:'#1a2b30' }}>{selectedCustomer.name}</div>
                  <div style={{ fontSize:12,color:'#9AABB0' }}>{selectedCustomer.email}</div>
                </div>
              </div>
              <button style={{ background:'none',border:'none',fontSize:18,color:'#9AABB0',cursor:'pointer' }} onClick={()=>setSelectedCustomer(null)}>✕</button>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'#F8FAFB',borderBottom:'1px solid #E8EEF0' }}>
              {[[selectedCustomer.orders.length,'Orders'],[`R ${selectedCustomer.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}`,'Total Spent'],[selectedCustomer.since,'Since']].map(([v,l],i)=>(
                <div key={i} style={{ padding:'16px',textAlign:'center',borderRight:i<2?'1px solid #E8EEF0':'' }}>
                  <div style={{ fontSize:isMobile?16:20,fontWeight:800,color:i===1?'#1A8A9A':'#1a2b30' }}>{v}</div>
                  <div style={{ fontSize:12,color:'#9AABB0',marginTop:3 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding:'20px 22px' }}>
              <div style={{ fontSize:12,fontWeight:700,color:'#1a2b30',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:14 }}>Order History</div>
              {selectedCustomer.orders.map((o,oi)=>(
                <div key={oi} style={{ background:'#F8FAFB',borderRadius:10,overflow:'hidden',marginBottom:12,border:'1px solid #E8EEF0' }}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',background:'#fff',borderBottom:'1px solid #E8EEF0' }}>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ fontSize:11,fontWeight:700,color:'#2BB5C8' }}>{o.id}</span>
                      <span style={{ fontSize:12,color:'#9AABB0' }}>{o.date}</span>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                      <span style={{ fontSize:11,fontWeight:700,borderRadius:4,padding:'2px 8px',...(o.status==='delivered'?{background:'#ECFDF5',color:'#059669'}:o.status==='confirmed'?{background:'#EFF6FF',color:'#2563EB'}:{background:'#FEF9EC',color:'#D97706'}) }}>{o.status}</span>
                      <span style={{ fontSize:15,fontWeight:800,color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                    </div>
                  </div>
                  {(o.items||[]).map((item,ii)=>(
                    <div key={ii} style={{ display:'flex',alignItems:'center',gap:10,padding:'9px 16px',borderBottom:'1px solid #F0F4F7',fontSize:13 }}>
                      <div style={{ flex:1 }}><span style={{ fontWeight:600,color:'#1a2b30' }}>{item.name}</span><span style={{ color:'#9AABB0' }}> · {item.brand}</span></div>
                      <span style={{ fontSize:12,color:'#4A6068' }}>×{item.qty}</span>
                      <span style={{ fontWeight:700,color:'#1A8A9A',minWidth:80,textAlign:'right' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══ PRODUCT FORM MODAL ══ */}
      {showForm&&editProduct&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(10,30,38,0.55)',display:'flex',alignItems:isMobile?'flex-end':'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)' }} onClick={e=>e.target===e.currentTarget&&setShowForm(false)}>
          <div style={{ background:'#fff',borderRadius:isMobile?'16px 16px 0 0':'16px',width:'100%',maxWidth:isMobile?'100%':660,maxHeight:isMobile?'92vh':'88vh',overflow:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'18px 22px',borderBottom:'1px solid #E8EEF0',position:'sticky',top:0,background:'#fff',zIndex:2 }}>
              <div style={{ fontSize:17,fontWeight:800,color:'#1a2b30' }}>{editProduct.id?'Edit Product':'Add Product'}</div>
              <button style={{ background:'none',border:'none',fontSize:18,color:'#9AABB0',cursor:'pointer' }} onClick={()=>setShowForm(false)}>✕</button>
            </div>
            <div style={{ padding:'20px 22px' }}>
              {/* Image upload */}
              <div style={{ display:'flex',gap:16,marginBottom:22,paddingBottom:22,borderBottom:'1px solid #E8EEF0' }}>
                <div style={{ width:90,height:90,borderRadius:10,background:'#F0F7FA',border:'1.5px dashed #B8D4DC',overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
                  {editProduct.image?<img src={editProduct.image} alt="preview" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>:<span style={{ fontSize:26,color:'#B8D4DC' }}>◎</span>}
                </div>
                <div style={{ display:'flex',flexDirection:'column',justifyContent:'center',gap:8 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:'#1a2b30' }}>Product Image</div>
                  <div style={{ fontSize:12,color:'#9AABB0' }}>JPG, PNG or WebP</div>
                  <label style={{ display:'inline-block',background:'#2BB5C8',color:'#fff',borderRadius:7,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:'pointer' }}>
                    {editProduct.image?'Replace':'Upload Image'}
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} />
                  </label>
                  {editProduct.image&&<button style={{ background:'none',border:'none',color:'#DC2626',fontSize:12,cursor:'pointer',padding:0,textAlign:'left',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setEditProduct(p=>({...p,image:null}))}>Remove</button>}
                </div>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14,marginBottom:14 }}>
                {[['name','Product Name *'],['brand','Brand'],['price','Price (R) *'],['stock','Stock Qty']].map(([k,l])=>(
                  <div key={k}>
                    <label style={labelSt}>{l}</label>
                    <input style={inputSt} type={k==='price'||k==='stock'?'number':'text'} value={editProduct[k]} onChange={e=>setEditProduct(p=>({...p,[k]:e.target.value}))} />
                  </div>
                ))}
                <div>
                  <label style={labelSt}>Category</label>
                  <select style={inputSt} value={editProduct.category} onChange={e=>setEditProduct(p=>({...p,category:e.target.value}))}>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelSt}>Status</label>
                  <select style={inputSt} value={editProduct.active?'true':'false'} onChange={e=>setEditProduct(p=>({...p,active:e.target.value==='true'}))}>
                    <option value="true">Active</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={labelSt}>Description</label>
                <textarea style={{ ...inputSt,height:80,resize:'vertical' }} value={editProduct.description} onChange={e=>setEditProduct(p=>({...p,description:e.target.value}))} />
              </div>
              <div>
                <label style={labelSt}>Key Features (one per line)</label>
                <textarea style={{ ...inputSt,height:70,resize:'vertical' }} value={editProduct.features} onChange={e=>setEditProduct(p=>({...p,features:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex',justifyContent:'flex-end',gap:10,padding:'14px 22px',borderTop:'1px solid #E8EEF0',position:'sticky',bottom:0,background:'#fff' }}>
              <button style={{ background:'#F5F8FA',color:'#4A6068',border:'1.5px solid #DDE4E8',borderRadius:8,padding:'10px 18px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setShowForm(false)}>Cancel</button>
              <button style={{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'10px 22px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={handleSave}>{editProduct.id?'Save Changes':'Add Product'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRM ══ */}
      {deleteConfirm&&(
        <div style={{ position:'fixed',inset:0,background:'rgba(10,30,38,0.55)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,backdropFilter:'blur(4px)',padding:20 }} onClick={()=>setDeleteConfirm(null)}>
          <div style={{ background:'#fff',borderRadius:14,width:'100%',maxWidth:380,padding:'28px',boxShadow:'0 16px 48px rgba(0,0,0,0.2)' }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontSize:17,fontWeight:800,color:'#1a2b30',marginBottom:12 }}>Delete Product?</div>
            <p style={{ fontSize:14,color:'#4A6068',marginBottom:24,lineHeight:1.5 }}>This will permanently remove the product. This cannot be undone.</p>
            <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
              <button style={{ background:'#F5F8FA',color:'#4A6068',border:'1.5px solid #DDE4E8',borderRadius:8,padding:'10px 18px',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>setDeleteConfirm(null)}>Cancel</button>
              <button style={{ background:'#DC2626',color:'#fff',border:'none',borderRadius:8,padding:'10px 20px',fontSize:14,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" }} onClick={()=>handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { AdminPage });
