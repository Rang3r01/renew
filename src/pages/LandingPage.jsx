// Landing page - keeping original implementation
// This is temporarily defined inline; original JSX content will be refactored into modular components

const LandingPage = ({ onNavigate, onShowAuth }) => {
  const { isMobile } = useResponsive ? useResponsive() : { isMobile: window.innerWidth < 768 };

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#F5F8FA' }}>
      <section style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(160deg,#071820 0%,#0d2b35 40%,#0f3d4a 70%,#0d2b35 100%)', overflow: 'hidden' }}>
        <nav style={{ padding: isMobile ? '14px 20px' : '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }}/>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2BB5C8' }}>RENEW</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Health Supplies</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => onShowAuth('signin')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '9px 20px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
            <button onClick={() => onShowAuth('signup')} style={{ background: '#2BB5C8', border: 'none', borderRadius: 8, padding: '9px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Get Started</button>
          </div>
        </nav>

        <div style={{ padding: isMobile ? '32px 20px 60px' : '40px 48px 80px', maxWidth: 700 }}>
          <h1 style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#fff', margin: '0 0 24px', lineHeight: 1.05 }}>
            <span>Where </span><br/>
            <span style={{ color: '#2BB5C8' }}>Nature</span>
            <span> & </span>
            <span style={{ color: '#2BB5C8' }}>Health</span>
            <br/>
            <span>Connect</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: '0 0 36px' }}>
            Premium health equipment, supplements and wellness products — expertly curated for Sports, Health and Wellbeing.
          </p>
          <div style={{ display: 'flex', gap: 14, marginBottom: 36 }}>
            <button onClick={() => onShowAuth('signup')} style={{ background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>Shop Now →</button>
            <button onClick={() => onShowAuth('signin')} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
          </div>
        </div>
      </section>

      <section style={{ background: '#F5F8FA', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: '#1a2b30', margin: '0 0 48px' }}>Everything your body needs</h2>
        </div>
      </section>

      <footer style={{ background: '#071820', padding: '28px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }}/>
            <span style={{ color: '#2BB5C8' }}>RENEW</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}> Health Supplies Secunda</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Shopping & Retail</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Secunda, Mpumalanga</span>
            <span style={{ color: 'rgba(255,255,255,0.15)' }}>·</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>By Appointment Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { LandingPage };
