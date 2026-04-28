
// Store Page — mobile optimized
const StorePage = ({ products, cart, onAddToCart, onViewProduct, user, onLogout, onNavigate }) => {
  const { isMobile, isTablet } = useResponsive();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState('All');
  const [sort, setSort] = React.useState('default');
  const [addedId, setAddedId] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const categories = ['All', 'Oxygen Products', 'Supplements', 'Recovery', 'Wellness'];
  const getCartQty = (id) => (cart.find(i => i.id === id)?.qty || 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleAdd = (product) => {
    if (getCartQty(product.id) >= product.stock) return;
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const filtered = products
    .filter(p => p.active !== false)
    .filter(p => category === 'All' || p.category === category)
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div style={{ fontFamily:"'DM Sans',sans-serif", background:'#F5F8FA', minHeight:'100vh' }}>
      {/* Nav */}
      <nav style={{ background:'#0d2b35', position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 16px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:`0 ${isMobile?'16px':'32px'}`, display:'flex', alignItems:'center', justifyContent:'space-between', height:isMobile?56:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:28,height:28,borderRadius:'50%',background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)',flexShrink:0 }}/>
            <div>
              <span style={{ fontSize:isMobile?16:20, fontWeight:800, color:'#2BB5C8' }}>RENEW</span>
              {!isMobile && <span style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginLeft:4 }}>Health Supplies</span>}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:isMobile?8:12 }}>
            {user?.isAdmin && !isMobile && (
              <button style={sS.adminBtn} onClick={() => onNavigate('admin')}>⚙ Admin</button>
            )}
            {!isMobile && <span style={{ fontSize:13, color:'rgba(255,255,255,0.5)' }}>Hi, {user?.name?.split(' ')[0]}</span>}
            <button style={sS.cartBtn} onClick={() => onNavigate('cart')}>
              {isMobile ? '🛒' : 'Cart'}
              {cartCount > 0 && <span style={sS.cartBadge}>{cartCount}</span>}
            </button>
            {isMobile ? (
              <button style={sS.menuBtn} onClick={() => setMenuOpen(o => !o)}>☰</button>
            ) : (
              <button style={sS.logoutBtn} onClick={onLogout}>Sign Out</button>
            )}
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div style={{ background:'#0a2230', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'12px 16px' }}>
            {user?.isAdmin && <button style={sS.menuItem} onClick={() => { onNavigate('admin'); setMenuOpen(false); }}>⚙ Admin Panel</button>}
            <button style={sS.menuItem} onClick={() => { onLogout(); setMenuOpen(false); }}>Sign Out</button>
          </div>
        )}
      </nav>

      {/* Filters */}
      <div style={{ background:'#fff', borderBottom:'1px solid #E8EEF0', padding:isMobile?'12px 16px':'16px 32px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          {/* Category scroll */}
          <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:8, scrollbarWidth:'none', marginBottom:isMobile?8:10 }}>
            {categories.map(c => (
              <button key={c}
                style={{ ...sS.catBtn, ...(category===c?sS.catBtnActive:{}), flexShrink:0 }}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          {/* Search + sort */}
          <div style={{ display:'flex', gap:8, flexWrap: isMobile?'wrap':'nowrap' }}>
            <div style={{ position:'relative', flex:1, minWidth:isMobile?'100%':200 }}>
              <span style={{ position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#9AABB0',fontSize:15 }}>⌕</span>
              <input style={{ ...sS.searchInput, width:'100%', paddingLeft:32 }} placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            <select style={{ ...sS.sortSelect, width:isMobile?'100%':'auto' }} value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:isMobile?'16px':'32px 32px 60px' }}>
        <div style={{ fontSize:13, color:'#9AABB0', marginBottom:16 }}>{filtered.length} product{filtered.length!==1?'s':''}</div>
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 20px', color:'#9AABB0' }}>No products found</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:isMobile?12:20 }}>
            {filtered.map(product => {
              const inCart = getCartQty(product.id);
              const atLimit = inCart >= product.stock;
              return (
                <div key={product.id} style={sS.card}>
                  <div style={{ ...sS.cardImg, height:isMobile?160:200 }} onClick={() => onViewProduct(product)}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                      : <div style={sS.imgPh}><span style={{ fontSize:32,color:'#B8D4DC' }}>◎</span><span style={{ fontSize:11,color:'#B8D4DC',marginTop:4,textAlign:'center',padding:'0 12px' }}>{product.name}</span></div>
                    }
                    <div style={sS.cardCat}>{product.category}</div>
                    {product.stock===0 && <div style={sS.outOfStock}>Out of Stock</div>}
                    {product.stock>0 && product.stock<=5 && <div style={sS.lowStock}>Only {product.stock} left</div>}
                  </div>
                  <div style={{ padding:isMobile?'12px':'16px 18px 18px' }}>
                    <div style={{ fontSize:10,fontWeight:700,color:'#9AABB0',letterSpacing:'0.07em',textTransform:'uppercase',marginBottom:3 }}>{product.brand}</div>
                    <div style={{ fontSize:isMobile?14:15,fontWeight:700,color:'#1a2b30',marginBottom:4,lineHeight:1.3,cursor:'pointer' }} onClick={() => onViewProduct(product)}>{product.name}</div>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:10 }}>
                      <div style={{ fontSize:isMobile?16:18,fontWeight:800,color:'#1A8A9A' }}>R {product.price.toLocaleString('en-ZA',{minimumFractionDigits:2})}</div>
                      <div style={{ display:'flex',flexDirection:'column',alignItems:'flex-end',gap:2 }}>
                        {inCart>0 && !atLimit && <span style={{ fontSize:10,fontWeight:700,color:'#1A8A9A' }}>{inCart} in cart</span>}
                        <button
                          style={{ ...sS.addBtn, ...(addedId===product.id?sS.addBtnAdded:{}), ...((product.stock===0||atLimit)?sS.addBtnDisabled:{}) }}
                          onClick={() => handleAdd(product)}
                          disabled={product.stock===0||atLimit}
                        >
                          {product.stock===0?'Out of Stock':atLimit?'Max':addedId===product.id?'✓':'+'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const sS = {
  adminBtn:{ background:'rgba(43,181,200,0.15)',color:'#2BB5C8',border:'1px solid rgba(43,181,200,0.3)',borderRadius:6,padding:'6px 12px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  cartBtn:{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:8,padding:'7px 14px',fontSize:13,fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:6,fontFamily:"'DM Sans',sans-serif" },
  cartBadge:{ background:'#fff',color:'#1A8A9A',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800 },
  logoutBtn:{ background:'none',color:'rgba(255,255,255,0.45)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:6,padding:'6px 12px',fontSize:12,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  menuBtn:{ background:'none',border:'none',color:'rgba(255,255,255,0.7)',fontSize:20,cursor:'pointer' },
  menuItem:{ display:'block',width:'100%',padding:'10px 0',background:'none',border:'none',color:'rgba(255,255,255,0.6)',fontSize:14,fontWeight:600,cursor:'pointer',textAlign:'left',fontFamily:"'DM Sans',sans-serif",borderBottom:'1px solid rgba(255,255,255,0.05)' },
  catBtn:{ background:'#fff',border:'1.5px solid #DDE4E8',borderRadius:20,padding:'6px 14px',fontSize:12,fontWeight:600,cursor:'pointer',color:'#4A6068',fontFamily:"'DM Sans',sans-serif",whiteSpace:'nowrap' },
  catBtnActive:{ background:'#2BB5C8',borderColor:'#2BB5C8',color:'#fff' },
  searchInput:{ border:'1.5px solid #DDE4E8',borderRadius:8,padding:'8px 12px',fontSize:13,outline:'none',background:'#fff',boxSizing:'border-box',fontFamily:"'DM Sans',sans-serif",color:'#1a2b30' },
  sortSelect:{ border:'1.5px solid #DDE4E8',borderRadius:8,padding:'8px 12px',fontSize:13,outline:'none',background:'#fff',cursor:'pointer',fontFamily:"'DM Sans',sans-serif",color:'#1a2b30',boxSizing:'border-box' },
  card:{ background:'#fff',borderRadius:12,overflow:'hidden',border:'1px solid #E8EEF0' },
  cardImg:{ position:'relative',background:'#F0F7FA',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'pointer' },
  imgPh:{ display:'flex',flexDirection:'column',alignItems:'center' },
  cardCat:{ position:'absolute',top:8,left:8,background:'rgba(43,181,200,0.12)',color:'#1A8A9A',borderRadius:4,padding:'3px 7px',fontSize:9,fontWeight:700,letterSpacing:'0.05em' },
  lowStock:{ position:'absolute',bottom:8,right:8,background:'#FEF9EC',color:'#D97706',borderRadius:4,padding:'3px 7px',fontSize:9,fontWeight:700 },
  outOfStock:{ position:'absolute',inset:0,background:'rgba(255,255,255,0.7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:'#DC2626' },
  addBtn:{ background:'#2BB5C8',color:'#fff',border:'none',borderRadius:6,padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:"'DM Sans',sans-serif" },
  addBtnAdded:{ background:'#1A8A9A' },
  addBtnDisabled:{ background:'#DDE4E8',color:'#9AABB0',cursor:'not-allowed' },
};

Object.assign(window, { StorePage });
