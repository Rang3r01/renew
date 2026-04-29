import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';

const STATUS_STYLES = {
  delivered:  { background: '#ECFDF5', color: '#059669' },
  confirmed:  { background: '#EFF6FF', color: '#2563EB' },
  pending:    { background: '#FFFBEB', color: '#D97706' },
  cancelled:  { background: '#FEF2F2', color: '#DC2626' },
};

const EMPTY_PRODUCT = { name:'', brand:'', category:'Supplements', price:'', stock:'', description:'', features:'', active:true, image:null };

const CATEGORIES = ['Oxygen Products','Supplements','Recovery','Wellness'];

export function AdminPage({ products, orders, onSaveProduct, onDeleteProduct, onNavigate }) {
  const { isMobile } = useResponsive();
  const [tab, setTab] = useState('dashboard');
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const revenueLabel = totalRevenue >= 1000
    ? `R ${(totalRevenue / 1000).toFixed(1)}k`
    : `R ${totalRevenue.toLocaleString('en-ZA')}`;

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase())
  );

  const customers = orders.reduce((acc, o) => {
    const ex = acc.find(c => c.email === o.email);
    if (ex) { ex.orders.push(o); ex.spent += o.total; }
    else acc.push({ name: o.customer, email: o.email, phone: o.phone || '—', since: o.date, orders: [o], spent: o.total });
    return acc;
  }, []);

  const openAdd = () => { setEditProduct({ ...EMPTY_PRODUCT }); setShowForm(true); };
  const openEdit = (p) => { setEditProduct({ ...p, features: (p.features || []).join('\n') }); setShowForm(true); };
  const handleSave = () => {
    if (!editProduct.name || !editProduct.price) return;
    onSaveProduct({
      ...editProduct,
      price: parseFloat(editProduct.price),
      stock: parseInt(editProduct.stock) || 0,
      features: editProduct.features ? editProduct.features.split('\n').filter(Boolean) : [],
      id: editProduct.id || Date.now(),
    });
    setShowForm(false);
  };
  const handleDelete = (id) => { onDeleteProduct(id); setDeleteConfirm(null); };
  const handleImageUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditProduct(p => ({ ...p, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard',  Icon: IconGrid },
    { id: 'products',  label: 'Products',   Icon: IconBox },
    { id: 'orders',    label: 'Orders',     Icon: IconCircle },
    { id: 'customers', label: 'Customers',  Icon: IconDiamond },
  ];

  const inputSt = { width:'100%', border:'1.5px solid #DDE4E8', borderRadius:8, padding:'10px 12px', fontSize:14, outline:'none', boxSizing:'border-box', color:'#1a2b30', fontFamily:"'DM Sans',sans-serif", background:'#fff' };
  const labelSt = { display:'block', fontSize:11, fontWeight:700, color:'#4A6068', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' };

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:"'DM Sans',sans-serif", background:'#F0F4F7' }}>

      {/* ── SIDEBAR ── */}
      {!isMobile && (
        <aside style={{ width:220, background:'#0d2b35', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:10 }}>
          {/* Logo */}
          <div style={{ padding:'24px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <div style={{ width:18, height:18, borderRadius:'50%', border:'3px solid rgba(255,255,255,0.9)' }}/>
              </div>
              <div>
                <div style={{ fontSize:20, fontWeight:800, color:'#2BB5C8', letterSpacing:'-0.01em' }}>RENEW</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em', textTransform:'uppercase' }}>Admin Panel</div>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ padding:'12px 10px', flex:1 }}>
            {navItems.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                display:'flex', alignItems:'center', gap:12, width:'100%',
                padding:'10px 12px', marginBottom:2,
                background: tab === id ? 'rgba(43,181,200,0.15)' : 'none',
                border: tab === id ? '1px solid rgba(43,181,200,0.25)' : '1px solid transparent',
                borderRadius:8,
                color: tab === id ? '#2BB5C8' : 'rgba(255,255,255,0.45)',
                fontSize:14, fontWeight:600, cursor:'pointer', textAlign:'left',
                fontFamily:"'DM Sans',sans-serif", transition:'all 0.15s',
              }}>
                <Icon size={16} color={tab === id ? '#2BB5C8' : 'rgba(255,255,255,0.35)'} />
                {label}
              </button>
            ))}
          </nav>

          <div style={{ padding:'0 10px 20px' }}>
            <button onClick={() => onNavigate('store')} style={{
              width:'100%', padding:'10px 12px', background:'none',
              border:'1px solid rgba(255,255,255,0.1)', borderRadius:8,
              color:'rgba(255,255,255,0.35)', fontSize:12, cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif",
            }}>← Back to Store</button>
          </div>
        </aside>
      )}

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:100, background:'#0d2b35', height:52, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }}/>
            <span style={{ fontSize:16, fontWeight:800, color:'#2BB5C8' }}>RENEW</span>
            <span style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>Admin</span>
          </div>
          <button onClick={() => onNavigate('store')} style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:6, color:'rgba(255,255,255,0.5)', fontSize:11, padding:'6px 10px', cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>← Store</button>
        </div>
      )}

      {/* ── MAIN ── */}
      <main style={{ flex:1, marginLeft: isMobile ? 0 : 220, padding: isMobile ? '68px 16px 80px' : '40px 40px 60px', minWidth:0 }}>

        {/* Page header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h1 style={{ fontSize:isMobile?22:28, fontWeight:700, color:'#1a2b30', margin:0 }}>
            {navItems.find(n => n.id === tab)?.label}
          </h1>
          {tab === 'products' && (
            <button onClick={openAdd} style={{ background:'#2BB5C8', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>
              + Add Product
            </button>
          )}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <>
            {/* Stat cards */}
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap:16, marginBottom:32 }}>
              {[
                { label:'Revenue',   value: revenueLabel,                           Icon: IconDiamond, iconColor:'#2BB5C8' },
                { label:'Orders',    value: orders.length,                           Icon: IconCircle,  iconColor:'#1A8A9A' },
                { label:'Products',  value: products.length,                         Icon: IconBox,     iconColor:'#1A8A9A' },
                { label:'Low Stock', value: products.filter(p=>p.stock<=5).length,   Icon: IconWarning, iconColor:'#D97706' },
              ].map(({ label, value, Icon, iconColor }, i) => (
                <div key={i} style={{ background:'#fff', borderRadius:12, padding:'24px', border:'1px solid #E8EEF0', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <div style={{ marginBottom:12 }}>
                    <Icon size={20} color={iconColor} />
                  </div>
                  <div style={{ fontSize:28, fontWeight:700, color:'#1a2b30', lineHeight:1 }}>{value}</div>
                  <div style={{ fontSize:13, color:'#9AABB0', marginTop:8 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders table */}
            <div style={{ marginBottom:16 }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:'#1a2b30', margin:0 }}>Recent Orders</h2>
            </div>
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8EEF0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              {orders.slice(0, 5).map((o, i) => (
                <div key={o.id} onClick={() => setSelectedOrder(o)} style={{
                  display: isMobile ? 'block' : 'grid',
                  gridTemplateColumns: '180px 1fr 80px 140px 180px',
                  alignItems:'center', gap:16,
                  padding: isMobile ? '14px 16px' : '14px 24px',
                  borderBottom: i < 4 ? '1px solid #F0F4F7' : 'none',
                  cursor:'pointer',
                }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#2BB5C8' }}>{o.id}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:'#1a2b30' }}>{o.customer}</span>
                  <span style={{ fontSize:13, color:'#9AABB0' }}>{o.itemCount} items</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#1a2b30' }}>R {o.total.toLocaleString('en-ZA', { minimumFractionDigits:2 })}</span>
                  <div>
                    <span style={{
                      display:'inline-block', fontSize:12, fontWeight:600,
                      padding:'4px 14px', borderRadius:6,
                      ...STATUS_STYLES[o.status] || STATUS_STYLES.pending,
                    }}>{o.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PRODUCTS ── */}
        {tab === 'products' && (
          <>
            <input
              style={{ ...inputSt, width: isMobile ? '100%' : 260, marginBottom:20 }}
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8EEF0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              {filteredProducts.map((p, i) => (
                isMobile ? (
                  <div key={p.id} style={{ padding:'14px 16px', borderBottom: i < filteredProducts.length-1 ? '1px solid #F0F4F7' : 'none' }}>
                    <div style={{ display:'flex', gap:12, alignItems:'flex-start', marginBottom:10 }}>
                      <div style={{ width:48, height:48, borderRadius:8, background:'#F0F7FA', border:'1px solid #E8EEF0', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {p.image ? <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:20, color:'#B8D4DC' }}>◎</span>}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1a2b30' }}>{p.name}</div>
                        <div style={{ fontSize:11, color:'#9AABB0' }}>{p.brand} · {p.category}</div>
                        <div style={{ fontSize:14, fontWeight:800, color:'#1A8A9A', marginTop:4 }}>R {p.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={() => openEdit(p)} style={{ flex:1, background:'rgba(43,181,200,0.1)', color:'#1A8A9A', border:'none', borderRadius:7, padding:'8px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
                      <button onClick={() => setDeleteConfirm(p.id)} style={{ flex:1, background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:7, padding:'8px', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                    </div>
                  </div>
                ) : (
                  <div key={p.id} style={{ display:'grid', gridTemplateColumns:'52px 1fr 160px 100px 70px 80px 120px', alignItems:'center', gap:16, padding:'12px 24px', borderBottom: i < filteredProducts.length-1 ? '1px solid #F0F4F7' : 'none' }}>
                    <div style={{ width:44, height:44, borderRadius:8, background:'#F0F7FA', border:'1px solid #E8EEF0', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {p.image ? <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:20, color:'#B8D4DC' }}>◎</span>}
                    </div>
                    <div>
                      <div style={{ fontWeight:700, fontSize:14, color:'#1a2b30' }}>{p.name}</div>
                      <div style={{ fontSize:11, color:'#9AABB0' }}>{p.brand}</div>
                    </div>
                    <span style={{ display:'inline-block', background:'rgba(43,181,200,0.08)', color:'#1A8A9A', borderRadius:4, padding:'3px 8px', fontSize:11, fontWeight:600 }}>{p.category}</span>
                    <span style={{ fontWeight:700, fontSize:14, color:'#1a2b30' }}>R {p.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                    <span style={{ fontWeight:600, fontSize:13, color: p.stock===0 ? '#DC2626' : p.stock<=5 ? '#D97706' : '#059669' }}>{p.stock}</span>
                    <span style={{ display:'inline-block', borderRadius:4, padding:'3px 8px', fontSize:11, fontWeight:700, background: p.active!==false ? '#ECFDF5' : '#F5F8FA', color: p.active!==false ? '#059669' : '#9AABB0' }}>{p.active!==false?'Active':'Hidden'}</span>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(p)} style={{ background:'rgba(43,181,200,0.1)', color:'#1A8A9A', border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Edit</button>
                      <button onClick={() => setDeleteConfirm(p.id)} style={{ background:'#FEF2F2', color:'#DC2626', border:'none', borderRadius:6, padding:'5px 10px', fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>Delete</button>
                    </div>
                  </div>
                )
              ))}
              {filteredProducts.length === 0 && (
                <div style={{ padding:'40px', textAlign:'center', color:'#9AABB0' }}>No products found</div>
              )}
            </div>
          </>
        )}

        {/* ── ORDERS ── */}
        {tab === 'orders' && (
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8EEF0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            {orders.map((o, i) => (
              isMobile ? (
                <div key={o.id} onClick={() => setSelectedOrder(o)} style={{ padding:'14px 16px', borderBottom: i < orders.length-1 ? '1px solid #F0F4F7' : 'none', cursor:'pointer' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <div>
                      <div style={{ fontSize:11, fontWeight:700, color:'#2BB5C8', marginBottom:2 }}>{o.id}</div>
                      <div style={{ fontSize:14, fontWeight:700, color:'#1a2b30' }}>{o.customer}</div>
                      <div style={{ fontSize:12, color:'#9AABB0', marginTop:2 }}>{o.date} · {o.itemCount} items</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:15, fontWeight:800, color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <span style={{ display:'inline-block', marginTop:4, borderRadius:6, padding:'3px 10px', fontSize:11, fontWeight:600, ...STATUS_STYLES[o.status]||STATUS_STYLES.pending }}>{o.status}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div key={o.id} onClick={() => setSelectedOrder(o)} style={{ display:'grid', gridTemplateColumns:'180px 1fr 60px 140px 110px 120px', alignItems:'center', gap:16, padding:'14px 24px', borderBottom: i < orders.length-1 ? '1px solid #F0F4F7' : 'none', cursor:'pointer' }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#2BB5C8' }}>{o.id}</span>
                  <div>
                    <div style={{ fontWeight:600, color:'#1a2b30', fontSize:14 }}>{o.customer}</div>
                    <div style={{ fontSize:12, color:'#9AABB0' }}>{o.email}</div>
                  </div>
                  <span style={{ fontSize:13, color:'#9AABB0' }}>{o.itemCount}</span>
                  <span style={{ fontSize:14, fontWeight:700, color:'#1a2b30' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ fontSize:12, color:'#9AABB0' }}>{o.date}</span>
                  <span style={{ display:'inline-block', borderRadius:6, padding:'4px 14px', fontSize:12, fontWeight:600, ...STATUS_STYLES[o.status]||STATUS_STYLES.pending }}>{o.status}</span>
                </div>
              )
            ))}
          </div>
        )}

        {/* ── CUSTOMERS ── */}
        {tab === 'customers' && (
          <div style={{ background:'#fff', borderRadius:12, border:'1px solid #E8EEF0', overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
            {customers.map((c, i) => (
              isMobile ? (
                <div key={i} onClick={() => setSelectedCustomer(c)} style={{ padding:'14px 16px', borderBottom: i < customers.length-1 ? '1px solid #F0F4F7' : 'none', cursor:'pointer' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, color:'#fff', flexShrink:0 }}>{c.name[0]}</div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1a2b30' }}>{c.name}</div>
                        <div style={{ fontSize:12, color:'#9AABB0' }}>{c.orders.length} order{c.orders.length!==1?'s':''}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:15, fontWeight:800, color:'#1A8A9A' }}>R {c.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                  </div>
                </div>
              ) : (
                <div key={i} onClick={() => setSelectedCustomer(c)} style={{ display:'grid', gridTemplateColumns:'1fr 120px 80px 160px 120px', alignItems:'center', gap:16, padding:'14px 24px', borderBottom: i < customers.length-1 ? '1px solid #F0F4F7' : 'none', cursor:'pointer' }}>
                  <div>
                    <div style={{ fontWeight:700, color:'#1a2b30', fontSize:14 }}>{c.name}</div>
                    <div style={{ fontSize:12, color:'#9AABB0' }}>{c.email}</div>
                  </div>
                  <span style={{ fontSize:13, color:'#4A6068' }}>{c.phone}</span>
                  <span style={{ fontWeight:600, color:'#1a2b30' }}>{c.orders.length}</span>
                  <span style={{ fontWeight:700, color:'#1A8A9A', fontSize:14 }}>R {c.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  <span style={{ fontSize:12, color:'#9AABB0' }}>{c.since}</span>
                </div>
              )
            ))}
          </div>
        )}
      </main>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      {isMobile && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'#0d2b35', borderTop:'1px solid rgba(255,255,255,0.1)', display:'flex', zIndex:200, height:60 }}>
          {navItems.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} style={{ flex:1, background:'none', border:'none', color: tab===id ? '#2BB5C8' : 'rgba(255,255,255,0.4)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, fontFamily:"'DM Sans',sans-serif", transition:'color 0.15s' }}>
              <Icon size={18} color={tab===id ? '#2BB5C8' : 'rgba(255,255,255,0.4)'} />
              <span style={{ fontSize:10, fontWeight: tab===id ? 700 : 500 }}>{label}</span>
            </button>
          ))}
        </div>
      )}

      {/* ── ORDER DETAIL MODAL ── */}
      {selectedOrder && (
        <Modal onClose={() => setSelectedOrder(null)} isMobile={isMobile} maxWidth={660}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:'1px solid #E8EEF0', position:'sticky', top:0, background:'#fff', zIndex:2 }}>
            <div>
              <div style={{ fontSize:17, fontWeight:800, color:'#1a2b30' }}>Order {selectedOrder.id}</div>
              <div style={{ fontSize:12, color:'#9AABB0', marginTop:2 }}>{selectedOrder.date} · {selectedOrder.customer}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ display:'inline-block', borderRadius:6, padding:'4px 12px', fontSize:12, fontWeight:600, ...STATUS_STYLES[selectedOrder.status]||STATUS_STYLES.pending }}>{selectedOrder.status}</span>
              <button style={{ background:'none', border:'none', fontSize:18, color:'#9AABB0', cursor:'pointer' }} onClick={() => setSelectedOrder(null)}>✕</button>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', background:'#F8FAFB', borderBottom:'1px solid #E8EEF0' }}>
            {[['Customer', selectedOrder.customer], ['Email', selectedOrder.email], ['Phone', selectedOrder.phone||'—'], ['Date', selectedOrder.date]].map(([l, v]) => (
              <div key={l} style={{ padding:'14px 18px', borderRight:'1px solid #E8EEF0' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#9AABB0', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:4 }}>{l}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#1a2b30', wordBreak:'break-all' }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'20px 22px' }}>
            {(selectedOrder.items||[]).map((item, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 50px 100px 100px', gap:10, padding:'11px 12px', borderBottom:'1px solid #F0F4F7', alignItems:'center' }}>
                <div>
                  <div style={{ fontWeight:700, color:'#1a2b30', fontSize:14 }}>{item.name}</div>
                  <div style={{ fontSize:11, color:'#9AABB0' }}>{item.brand}</div>
                </div>
                <div style={{ textAlign:'right', fontWeight:600, color:'#4A6068' }}>{item.qty}</div>
                <div style={{ textAlign:'right', color:'#4A6068', fontSize:13 }}>R {item.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                <div style={{ textAlign:'right', fontWeight:800, color:'#1A8A9A' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
              </div>
            ))}
            <div style={{ background:'#F8FAFB', borderRadius:10, padding:'14px 16px', marginTop:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:17, fontWeight:800, color:'#1a2b30' }}>
                <span>Total</span>
                <span>R {selectedOrder.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── CUSTOMER MODAL ── */}
      {selectedCustomer && (
        <Modal onClose={() => setSelectedCustomer(null)} isMobile={isMobile} maxWidth={680}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:'1px solid #E8EEF0', position:'sticky', top:0, background:'#fff', zIndex:2 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff' }}>{selectedCustomer.name[0]}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:'#1a2b30' }}>{selectedCustomer.name}</div>
                <div style={{ fontSize:12, color:'#9AABB0' }}>{selectedCustomer.email}</div>
              </div>
            </div>
            <button style={{ background:'none', border:'none', fontSize:18, color:'#9AABB0', cursor:'pointer' }} onClick={() => setSelectedCustomer(null)}>✕</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', background:'#F8FAFB', borderBottom:'1px solid #E8EEF0' }}>
            {[[selectedCustomer.orders.length,'Orders'],[`R ${selectedCustomer.spent.toLocaleString('en-ZA',{minimumFractionDigits:2})}`,'Total Spent'],[selectedCustomer.since,'Since']].map(([v,l],i)=>(
              <div key={i} style={{ padding:'16px', textAlign:'center', borderRight: i<2 ? '1px solid #E8EEF0' : '' }}>
                <div style={{ fontSize:20, fontWeight:800, color: i===1 ? '#1A8A9A' : '#1a2b30' }}>{v}</div>
                <div style={{ fontSize:12, color:'#9AABB0', marginTop:3 }}>{l}</div>
              </div>
            ))}
          </div>
          <div style={{ padding:'20px 22px' }}>
            {selectedCustomer.orders.map((o, oi) => (
              <div key={oi} style={{ background:'#F8FAFB', borderRadius:10, overflow:'hidden', marginBottom:12, border:'1px solid #E8EEF0' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'#fff', borderBottom:'1px solid #E8EEF0' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, color:'#2BB5C8' }}>{o.id}</span>
                    <span style={{ fontSize:12, color:'#9AABB0' }}>{o.date}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ fontSize:11, fontWeight:700, borderRadius:6, padding:'2px 8px', ...STATUS_STYLES[o.status]||STATUS_STYLES.pending }}>{o.status}</span>
                    <span style={{ fontSize:15, fontWeight:800, color:'#1A8A9A' }}>R {o.total.toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  </div>
                </div>
                {(o.items||[]).map((item, ii) => (
                  <div key={ii} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 16px', borderBottom:'1px solid #F0F4F7', fontSize:13 }}>
                    <div style={{ flex:1 }}><span style={{ fontWeight:600, color:'#1a2b30' }}>{item.name}</span><span style={{ color:'#9AABB0' }}> · {item.brand}</span></div>
                    <span style={{ fontSize:12, color:'#4A6068' }}>×{item.qty}</span>
                    <span style={{ fontWeight:700, color:'#1A8A9A', minWidth:80, textAlign:'right' }}>R {(item.price*item.qty).toLocaleString('en-ZA',{minimumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── PRODUCT FORM MODAL ── */}
      {showForm && editProduct && (
        <Modal onClose={() => setShowForm(false)} isMobile={isMobile} maxWidth={660}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 22px', borderBottom:'1px solid #E8EEF0', position:'sticky', top:0, background:'#fff', zIndex:2 }}>
            <div style={{ fontSize:17, fontWeight:800, color:'#1a2b30' }}>{editProduct.id ? 'Edit Product' : 'Add Product'}</div>
            <button style={{ background:'none', border:'none', fontSize:18, color:'#9AABB0', cursor:'pointer' }} onClick={() => setShowForm(false)}>✕</button>
          </div>
          <div style={{ padding:'20px 22px' }}>
            {/* Image */}
            <div style={{ display:'flex', gap:16, marginBottom:22, paddingBottom:22, borderBottom:'1px solid #E8EEF0' }}>
              <div style={{ width:90, height:90, borderRadius:10, background:'#F0F7FA', border:'1.5px dashed #B8D4DC', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {editProduct.image ? <img src={editProduct.image} alt="preview" style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : <span style={{ fontSize:26, color:'#B8D4DC' }}>◎</span>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:8 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#1a2b30' }}>Product Image</div>
                <label style={{ display:'inline-block', background:'#2BB5C8', color:'#fff', borderRadius:7, padding:'7px 14px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  {editProduct.image ? 'Replace' : 'Upload Image'}
                  <input type="file" accept="image/*" style={{ display:'none' }} onChange={handleImageUpload} />
                </label>
                {editProduct.image && <button style={{ background:'none', border:'none', color:'#DC2626', fontSize:12, cursor:'pointer', padding:0, textAlign:'left', fontFamily:"'DM Sans',sans-serif" }} onClick={() => setEditProduct(p => ({...p, image:null}))}>Remove</button>}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap:14, marginBottom:14 }}>
              {[['name','Product Name *'],['brand','Brand'],['price','Price (R) *'],['stock','Stock Qty']].map(([k,l]) => (
                <div key={k}>
                  <label style={labelSt}>{l}</label>
                  <input style={inputSt} type={k==='price'||k==='stock'?'number':'text'} value={editProduct[k]||''} onChange={e => setEditProduct(p=>({...p,[k]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label style={labelSt}>Category</label>
                <select style={inputSt} value={editProduct.category} onChange={e => setEditProduct(p=>({...p,category:e.target.value}))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelSt}>Status</label>
                <select style={inputSt} value={editProduct.active?'true':'false'} onChange={e => setEditProduct(p=>({...p,active:e.target.value==='true'}))}>
                  <option value="true">Active</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom:14 }}>
              <label style={labelSt}>Description</label>
              <textarea style={{ ...inputSt, height:80, resize:'vertical' }} value={editProduct.description||''} onChange={e => setEditProduct(p=>({...p,description:e.target.value}))} />
            </div>
            <div>
              <label style={labelSt}>Key Features (one per line)</label>
              <textarea style={{ ...inputSt, height:70, resize:'vertical' }} value={editProduct.features||''} onChange={e => setEditProduct(p=>({...p,features:e.target.value}))} />
            </div>
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'14px 22px', borderTop:'1px solid #E8EEF0', position:'sticky', bottom:0, background:'#fff' }}>
            <button style={{ background:'#F5F8FA', color:'#4A6068', border:'1.5px solid #DDE4E8', borderRadius:8, padding:'10px 18px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }} onClick={() => setShowForm(false)}>Cancel</button>
            <button style={{ background:'#2BB5C8', color:'#fff', border:'none', borderRadius:8, padding:'10px 22px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }} onClick={handleSave}>{editProduct.id ? 'Save Changes' : 'Add Product'}</button>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(10,30,38,0.55)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)', padding:20 }} onClick={() => setDeleteConfirm(null)}>
          <div style={{ background:'#fff', borderRadius:14, width:'100%', maxWidth:380, padding:'28px', boxShadow:'0 16px 48px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize:17, fontWeight:800, color:'#1a2b30', marginBottom:12 }}>Delete Product?</div>
            <p style={{ fontSize:14, color:'#4A6068', marginBottom:24, lineHeight:1.5 }}>This will permanently remove the product and cannot be undone.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button style={{ background:'#F5F8FA', color:'#4A6068', border:'1.5px solid #DDE4E8', borderRadius:8, padding:'10px 18px', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={{ background:'#DC2626', color:'#fff', border:'none', borderRadius:8, padding:'10px 20px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }} onClick={() => handleDelete(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose, isMobile, maxWidth = 660 }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(10,30,38,0.55)', display:'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(4px)' }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius: isMobile ? '16px 16px 0 0' : 16, width:'100%', maxWidth: isMobile ? '100%' : maxWidth, maxHeight: isMobile ? '90vh' : '88vh', overflow:'auto', boxShadow:'0 24px 64px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

/* ── SVG icon components ── */
function IconGrid({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="9" y="1" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="1" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5"/>
      <rect x="9" y="9" width="6" height="6" rx="1" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}
function IconBox({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="14" rx="1.5" stroke={color} strokeWidth="1.5"/>
      <line x1="8" y1="1" x2="8" y2="15" stroke={color} strokeWidth="1.5"/>
    </svg>
  );
}
function IconCircle({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeWidth="1.5"/>
      <circle cx="8" cy="8" r="2.5" fill={color}/>
    </svg>
  );
}
function IconDiamond({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 8L8 14.5L1.5 8L8 1.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  );
}
function IconWarning({ size = 16, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 13.5H1.5L8 1.5Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="8" y1="6" x2="8" y2="9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="8" cy="11.5" r="0.75" fill={color}/>
    </svg>
  );
}
