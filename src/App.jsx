import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { LandingPage } from './pages/LandingPage';
import { StorePage } from './pages/StorePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { AdminPage } from './pages/AdminPage';
import { ClerkSignInModal, ClerkSignUpModal } from './components/ClerkAuthUI';
import { TweaksPanel, TweakSection, TweakToggle, TweakColor } from './components/TweaksPanel';
import { useTweaks } from './hooks/useTweaks';
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';

export function App() {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();

  const user = clerkUser ? {
    id: clerkUser.id,
    name: clerkUser.fullName || clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    isAdmin: clerkUser.publicMetadata?.isAdmin === true,
    avatar: clerkUser.imageUrl,
  } : null;

  const { products, loading: productsLoading, saveProduct, deleteProduct } = useProducts();
  const { orders, loading: ordersLoading, createOrder } = useOrders();

  const [page, setPage] = useState('landing');
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const TWEAK_DEFAULTS = { accentColor: '#2BB5C8', darkNav: true, roundedCards: true };
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const navigate = (pg) => setPage(pg);

  useEffect(() => {
    if (isLoaded && user && page === 'landing') {
      setPage('store');
      setShowAuth(false);
    }
  }, [isLoaded, user]);

  const handleShowAuth = (mode) => { setAuthMode(mode); setShowAuth(true); };

  const handleLogout = () => {
    signOut();
    setCart([]);
    setPage('landing');
  };

  const handleAddToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      const currentQty = existing ? existing.qty : 0;
      const available = product.stock - currentQty;
      if (available <= 0) return prev;
      const addQty = Math.min(qty, available);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + addQty } : i);
      return [...prev, { ...product, qty: addQty }];
    });
  };

  const handleUpdateCart = (id, qty) => {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.id !== id)); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const handleRemoveFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));

  const handleCheckout = async () => {
    const orderTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const newOrder = {
      id: 'RNW-' + Math.floor(10000 + Math.random() * 90000),
      customer: user?.name || 'Customer',
      email: user?.email || '',
      phone: '',
      itemCount: cart.reduce((s, i) => s + i.qty, 0),
      total: orderTotal,
      date: new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending',
      items: cart.map(i => ({ name: i.name, brand: i.brand, qty: i.qty, price: i.price })),
    };
    await createOrder(newOrder);
    setCart([]);
  };

  const handleSaveProduct = async (product, imageFile) => {
    await saveProduct(product, imageFile);
  };

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id);
  };

  const handleViewProduct = (product) => { setSelectedProduct(product); setPage('product'); };

  const accentStyle = { '--accent': tweaks.accentColor || '#2BB5C8' };

  if (!isLoaded || (user && (productsLoading || ordersLoading))) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d2b35', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)', margin: '0 auto 16px' }} />
          <div style={{ fontSize: 22, fontWeight: 800, color: '#2BB5C8', letterSpacing: '-0.01em' }}>RENEW</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Loading…</div>
        </div>
      </div>
    );
  }

  const authedPage = user ? page : 'landing';

  return (
    <div style={accentStyle}>
      {authedPage === 'landing' && (
        <LandingPage
          onNavigate={navigate}
          onShowSignIn={() => handleShowAuth('signin')}
          onShowSignUp={() => handleShowAuth('signup')}
          user={user}
        />
      )}

      {authedPage === 'store' && user && (
        <StorePage
          products={products}
          cart={cart}
          onAddToCart={handleAddToCart}
          onViewProduct={handleViewProduct}
          user={user}
          onLogout={handleLogout}
          onNavigate={navigate}
        />
      )}

      {authedPage === 'product' && user && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          cart={cart}
          onAddToCart={(product, qty) => handleAddToCart(product, qty || 1)}
          onBack={() => setPage('store')}
          onNavigate={navigate}
        />
      )}

      {authedPage === 'cart' && user && (
        <CartPage
          cart={cart}
          onUpdateCart={handleUpdateCart}
          onRemove={handleRemoveFromCart}
          onBack={() => setPage('store')}
          onCheckout={handleCheckout}
        />
      )}

      {authedPage === 'admin' && user?.isAdmin && (
        <AdminPage
          products={products}
          orders={orders}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onNavigate={navigate}
        />
      )}

      <ClerkSignInModal
        isOpen={showAuth && authMode === 'signin'}
        onClose={() => setShowAuth(false)}
        onSuccess={() => { setShowAuth(false); navigate('store'); }}
      />
      <ClerkSignUpModal
        isOpen={showAuth && authMode === 'signup'}
        onClose={() => setShowAuth(false)}
        onSuccess={() => { setShowAuth(false); navigate('store'); }}
      />

      <TweaksPanel>
        <TweakSection label="Brand">
          <TweakColor label="Accent colour" id="accentColor" value={tweaks.accentColor} onChange={(v) => setTweak('accentColor', v)} />
        </TweakSection>
        <TweakSection label="UI">
          <TweakToggle label="Dark navigation" id="darkNav" value={tweaks.darkNav} onChange={(v) => setTweak('darkNav', v)} />
          <TweakToggle label="Rounded cards" id="roundedCards" value={tweaks.roundedCards} onChange={(v) => setTweak('roundedCards', v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
