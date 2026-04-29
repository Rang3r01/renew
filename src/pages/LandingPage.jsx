import { useResponsive } from '../hooks/useResponsive';

export function LandingPage({ onNavigate, onShowSignIn, onShowSignUp }) {
  const { isMobile } = useResponsive();

  const categories = [
    { name: 'Oxygen Products', sub: 'Concentrators · CPAP · Nebulizers', color: 'linear-gradient(135deg,#0d4a5a,#1A8A9A)', accent: '#2BB5C8' },
    { name: 'Supplements', sub: 'Protein · Vitamins · Minerals', color: 'linear-gradient(135deg,#0a3545,#0f5068)', accent: '#3CC8DA' },
    { name: 'Recovery', sub: 'Tools · Compression · Nutrition', color: 'linear-gradient(135deg,#0d3040,#1A6070)', accent: '#2BB5C8' },
    { name: 'Wellness', sub: 'Collagen · Skin · Sleep', color: 'linear-gradient(135deg,#0a2535,#0d3a4a)', accent: '#4DCFDF' },
  ];

  const testimonials = [
    { name: 'Sarah M.', loc: 'Secunda', text: 'The oxygen concentrator changed my quality of life completely. Outstanding service and product knowledge.' },
    { name: 'Pieter B.', loc: 'eMalahleni', text: 'Best supplement range in Mpumalanga. The team really knows their products and gives great advice.' },
    { name: 'Nomsa D.', loc: 'Secunda', text: 'Fast delivery and genuine products. My go-to health store for the whole family.' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans',sans-serif", background: '#F5F8FA' }}>
      <style>{`
        @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-40px,30px) scale(1.08)} 66%{transform:translate(20px,-30px) scale(0.95)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,35px)} }
        .hero-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(43,181,200,0.4) !important; }
        .cat-card:hover .cat-arrow { transform:translateX(4px); }
        .cat-card:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4) !important; }
      `}</style>

      <section style={{ position: 'relative', minHeight: '100vh', background: 'linear-gradient(160deg,#071820 0%,#0d2b35 40%,#0f3d4a 70%,#0d2b35 100%)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ padding: isMobile ? '14px 20px' : '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)', flexShrink: 0 }}/>
            <span style={{ fontSize: 22, fontWeight: 800, color: '#2BB5C8', letterSpacing: '-0.01em' }}>RENEW</span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Health Supplies</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onShowSignIn} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '9px 20px', color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Sign In</button>
            <button onClick={onShowSignUp} style={{ background: '#2BB5C8', border: 'none', borderRadius: 8, padding: '9px 20px', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Get Started</button>
          </div>
        </nav>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '32px 20px 60px' : '40px 48px 80px', maxWidth: 700 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.35)', marginBottom: 28, textTransform: 'uppercase' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2BB5C8', animation: 'pulse 2s infinite', flexShrink: 0 }}/>
            YOUR SOURCE FOR OXYGEN PRODUCTS · SECUNDA, MPUMALANGA
          </div>

          <h1 style={{ margin: '0 0 24px', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
            <span style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#fff', display: 'inline' }}>Where</span>
            <br/>
            <span style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#2BB5C8', display: 'inline' }}>Nature</span>
            <span style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#fff', display: 'inline', margin: '0 8px' }}>&amp;</span>
            <span style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#2BB5C8', display: 'inline' }}>Health</span>
            <br/>
            <span style={{ fontSize: 'clamp(52px,7vw,100px)', fontWeight: 800, color: '#fff', display: 'inline' }}>Connect</span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: '0 0 36px', maxWidth: 520 }}>
            Premium health equipment, supplements and wellness products — expertly curated for Sports, Health and Wellbeing.
          </p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
            <button className="hero-cta-btn" onClick={onShowSignUp} style={{ background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)', color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.25s' }}>
              Shop Now
              <span style={{ fontSize: 18, transition: 'transform 0.2s' }}>→</span>
            </button>
            <button className="hero-cta-btn" onClick={onShowSignIn} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', borderRadius: 10, padding: '14px 28px', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'all 0.25s' }}>
              Sign In
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2BB5C8', flexShrink: 0 }}/>By appointment only
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2BB5C8', flexShrink: 0 }}/>35+ premium brands
            </div>
            <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.1)' }}/>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#2BB5C8', flexShrink: 0 }}/>Expert guidance
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: '#0a1f28', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#2BB5C8', marginBottom: 14 }}>BROWSE BY CATEGORY</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: '#fff', margin: '0 0 48px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Everything your body needs</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 16 }}>
            {categories.map((c, i) => (
              <div key={i} className="cat-card" style={{
                borderRadius: 14, padding: '28px 24px', cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'transform 0.3s,box-shadow 0.3s', border: '1px solid rgba(255,255,255,0.05)',
                background: c.color, animationDelay: `${i*0.1}s`
              }} onClick={() => onShowSignUp()}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '0 0 3px 3px', background: c.accent }}/>
                <div style={{ position: 'relative', zIndex: 2 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 8, lineHeight: 1.2 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5, marginBottom: 20, minHeight: 36 }}>{c.sub}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: c.accent, transition: 'transform 0.2s' }} className="cat-arrow">Browse →</div>
                </div>
                <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at bottom right,${c.accent}22,transparent 60%)` }}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#F5F8FA', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#2BB5C8', marginBottom: 14 }}>WHY RENEW</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: '#1a2b30', margin: '0 0 48px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>More than just a store</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))', gap: 24 }}>
            {[
              { icon: '◉', title: 'Medical-Grade Equipment', desc: 'Certified oxygen concentrators, CPAP machines and respiratory devices sourced from trusted manufacturers.' },
              { icon: '◈', title: 'Expert Consultation', desc: 'Our team provides personalised guidance — by appointment, ensuring you get exactly what you need.' },
              { icon: '◎', title: 'Curated Health Brands', desc: 'We handpick every brand on our shelves for quality, efficacy and safety. No filler products.' },
              { icon: '⬡', title: 'Sports & Wellness Focus', desc: 'From elite athletes to everyday wellness, we stock products for every stage of your health journey.' },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '32px 28px', border: '1px solid #E8EEF0', transition: 'transform 0.25s,box-shadow 0.25s' }}>
                <div style={{ fontSize: 28, color: '#2BB5C8', marginBottom: 16 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: '#1a2b30', margin: '0 0 10px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6B7F84', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'linear-gradient(160deg,#071820,#0d2b35)', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>WHAT CUSTOMERS SAY</div>
          <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 800, color: '#fff', margin: '0 0 48px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>Trusted by the Secunda community</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '28px', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: 48, color: '#2BB5C8', lineHeight: 0.8, marginBottom: 16, fontFamily: 'Georgia,serif', opacity: 0.6 }}>"</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, margin: '0 0 24px' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ position: 'relative', background: 'linear-gradient(135deg,#2BB5C8 0%,#1A8A9A 60%,#0F6A7A 100%)', padding: 'clamp(60px,8vw,100px) clamp(20px,4vw,40px)', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-30%', right: '-10%' }}/>
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(0,0,0,0.08)', bottom: '-20%', left: '-5%' }}/>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>BY APPOINTMENT ONLY</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800, color: '#fff', margin: '0 0 16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>Ready to invest in your health?</h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', margin: '0 0 40px', lineHeight: 1.6 }}>Create a free account to browse our full catalogue, place orders and book a consultation.</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <button className="hero-cta-btn" onClick={onShowSignUp} style={{ background: '#fff', color: '#1A8A9A', border: 'none', borderRadius: 10, padding: '15px 36px', fontSize: 16, fontWeight: 800, cursor: 'pointer', transition: 'all 0.25s' }}>
              Create Free Account →
            </button>
            <button onClick={onShowSignIn} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, cursor: 'pointer', textDecoration: 'underline' }}>
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>

      <footer style={{ background: '#071820', padding: '28px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, fontWeight: 600 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }}/>
            <div>
              <span style={{ color: '#2BB5C8', fontWeight: 800 }}>RENEW</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}> Health Supplies Secunda</span>
            </div>
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
}
