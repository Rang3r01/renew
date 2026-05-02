import { useState } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { colors, gradients, typography } from '../theme';

export function StorePage({ products, cart, onAddToCart, onViewProduct, user, onLogout, onNavigate }) {
  const { isMobile, isTablet } = useResponsive();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [addedId, setAddedId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'name')       return a.name.localeCompare(b.name);
      return 0;
    });

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div style={{ fontFamily: typography.fontFamily, background: '#F5F8FA', minHeight: '100vh' }}>
      <nav style={{ background: colors.navBg, position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: `0 ${isMobile ? '16px' : '32px'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: isMobile ? 56 : 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: gradients.primary, flexShrink: 0 }}/>
            <div>
              <span style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: colors.primary }}> RENEW</span>
              {!isMobile && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginLeft: 4 }}>Health Supplies</span>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12 }}>
            {user?.isAdmin && !isMobile && (
              <button style={{ background: `rgba(43,181,200,0.15)`, color: colors.primary, border: `1px solid rgba(43,181,200,0.3)`, borderRadius: 6, padding: '6px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: typography.fontFamily }} onClick={() => onNavigate('admin')}>⚙ Admin</button>
            )}
            {!isMobile && <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Hi, {user?.name?.split(' ')[0]}</span>}
            <button style={{ background: colors.primary, color: colors.white, border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: typography.fontFamily }} onClick={() => onNavigate('cart')}>
              {isMobile ? '🛒' : 'Cart'}
              {cartCount > 0 && <span style={{ background: colors.white, color: colors.primaryDark, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{cartCount}</span>}
            </button>
            {isMobile ? (
              <button style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', fontSize: 20, cursor: 'pointer' }} onClick={() => setMenuOpen(o => !o)}>☰</button>
            ) : (
              <button style={{ background: 'none', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontFamily: typography.fontFamily }} onClick={onLogout}>Sign Out</button>
            )}
          </div>
        </div>

        {isMobile && menuOpen && (
          <div style={{ background: '#0a2230', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px' }}>
            {user?.isAdmin && <button style={{ display: 'block', width: '100%', padding: '10px 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)', fontFamily: typography.fontFamily }} onClick={() => { onNavigate('admin'); setMenuOpen(false); }}>⚙ Admin Panel</button>}
            <button style={{ display: 'block', width: '100%', padding: '10px 0', background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer', textAlign: 'left', fontFamily: typography.fontFamily }} onClick={() => { onLogout(); setMenuOpen(false); }}>Sign Out</button>
          </div>
        )}
      </nav>

      <div style={{ background: colors.bgCard, borderBottom: `1px solid ${colors.borderSubtle}`, padding: isMobile ? '12px 16px' : '16px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none', marginBottom: isMobile ? 8 : 10 }}>
            {categories.map(c => (
              <button key={c}
                style={{ background: category === c ? colors.primary : colors.bgCard, border: category === c ? 'none' : `1.5px solid ${colors.borderInput}`, borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: category === c ? colors.white : colors.textSecondary, flexShrink: 0, fontFamily: typography.fontFamily }}
                onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200 }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: colors.textTertiary, fontSize: 15 }}>⌕</span>
              <input style={{ width: '100%', paddingLeft: 32, border: `1.5px solid ${colors.borderInput}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', background: colors.bgInput, boxSizing: 'border-box', color: colors.textPrimary, fontFamily: typography.fontFamily }} placeholder="Search products…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select style={{ border: `1.5px solid ${colors.borderInput}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, outline: 'none', background: colors.bgInput, cursor: 'pointer', color: colors.textPrimary, boxSizing: 'border-box', width: isMobile ? '100%' : 'auto', fontFamily: typography.fontFamily }} value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: isMobile ? '16px' : '32px 32px 60px' }}>
        <div style={{ fontSize: 13, color: colors.textTertiary, marginBottom: 16 }}>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: colors.textTertiary }}>No products found</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: isMobile ? 12 : 20 }}>
            {filtered.map(product => {
              const inCart = getCartQty(product.id);
              const atLimit = inCart >= product.stock;
              return (
                <div key={product.id} style={{ background: colors.bgCard, borderRadius: 12, overflow: 'hidden', border: `1px solid ${colors.borderSubtle}` }}>
                  <div style={{ position: 'relative', background: '#F0F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', height: isMobile ? 160 : 200 }} onClick={() => onViewProduct(product)}>
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><span style={{ fontSize: 32, color: '#B8D4DC' }}>◎</span><span style={{ fontSize: 11, color: '#B8D4DC', marginTop: 4, textAlign: 'center', padding: '0 12px' }}>{product.name}</span></div>
                    }
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(43,181,200,0.12)', color: colors.primaryDark, borderRadius: 4, padding: '3px 7px', fontSize: 9, fontWeight: 700, letterSpacing: '0.05em' }}>{product.category}</div>
                    {product.stock === 0 && <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: colors.error }}>Out of Stock</div>}
                    {product.stock > 0 && product.stock <= 5 && <div style={{ position: 'absolute', bottom: 8, right: 8, background: '#FEF9EC', color: '#D97706', borderRadius: 4, padding: '3px 7px', fontSize: 9, fontWeight: 700 }}>Only {product.stock} left</div>}
                  </div>
                  <div style={{ padding: isMobile ? '12px' : '16px 18px 18px' }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: colors.textTertiary, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>{product.brand}</div>
                    <div style={{ fontSize: isMobile ? 14 : 15, fontWeight: 700, color: colors.textPrimary, marginBottom: 4, lineHeight: 1.3, cursor: 'pointer' }} onClick={() => onViewProduct(product)}>{product.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
                      <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 800, color: colors.primaryDark }}>R {product.price.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                        {inCart > 0 && !atLimit && <span style={{ fontSize: 10, fontWeight: 700, color: colors.primaryDark }}>{inCart} in cart</span>}
                        <button
                          style={{ background: product.stock === 0 || atLimit ? colors.borderInput : colors.primary, color: product.stock === 0 || atLimit ? colors.textTertiary : colors.white, border: 'none', borderRadius: 6, padding: '7px 12px', fontSize: 12, fontWeight: 700, cursor: product.stock === 0 || atLimit ? 'not-allowed' : 'pointer', fontFamily: typography.fontFamily }}
                          onClick={() => handleAdd(product)}
                          disabled={product.stock === 0 || atLimit}
                        >
                          {product.stock === 0 ? 'Out of Stock' : atLimit ? 'Max' : addedId === product.id ? '✓' : '+'}
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
}
