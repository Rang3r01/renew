
// Dynamic Landing Page — mobile optimized
const LandingPage = ({ onNavigate, onShowAuth }) => {
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
    <div style={ls.root}>
      <style>{`
        @keyframes floatA { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.05)} 66%{transform:translate(-20px,20px) scale(0.97)} }
        @keyframes floatB { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(-40px,30px) scale(1.08)} 66%{transform:translate(20px,-30px) scale(0.95)} }
        @keyframes floatC { 0%,100%{transform:translate(0,0)} 50%{transform:translate(25px,35px)} }
        @keyframes pulse { 0%,100%{opacity:0.6} 50%{opacity:1} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .hero-cta-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(43,181,200,0.4) !important; }
        .cat-card:hover .cat-arrow { transform:translateX(4px); }
        .cat-card:hover { transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.4) !important; }
        .feat-card:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(43,181,200,0.1) !important; }
        .testi-card:hover { border-color:rgba(43,181,200,0.4) !important; }
      `}</style>

      {/* ── HERO ─────────────────────────────── */}
      <section style={ls.hero}>
        {/* Animated orbs */}
        <div style={{...ls.orb, width:600,height:600,top:'-10%',right:'-5%',
          background:'radial-gradient(circle,rgba(43,181,200,0.12) 0%,transparent 65%)',
          animation:'floatA 12s ease-in-out infinite'}}/>
        <div style={{...ls.orb, width:400,height:400,bottom:'5%',left:'-8%',
          background:'radial-gradient(circle,rgba(43,181,200,0.08) 0%,transparent 65%)',
          animation:'floatB 15s ease-in-out infinite'}}/>
        <div style={{...ls.orb, width:200,height:200,top:'40%',left:'40%',
          background:'radial-gradient(circle,rgba(43,181,200,0.06) 0%,transparent 70%)',
          animation:'floatC 9s ease-in-out infinite'}}/>

        {/* Grid lines */}
        <div style={ls.gridLines}/>

        {/* Nav */}
        <nav style={{...ls.nav, padding: isMobile ? '14px 20px' : '24px 48px'}}>
          <div style={ls.navBrand}>
            <div style={ls.navMark}/>
            <span style={ls.navName}>RENEW</span>
            <span style={ls.navSub}>Health Supplies</span>
          </div>
          <div style={ls.navActions}>
            <button style={ls.navSignIn} onClick={() => onShowAuth('signin')}>Sign In</button>
            <button style={ls.navSignUp} onClick={() => onShowAuth('signup')}>Get Started</button>
          </div>
        </nav>

        {/* Hero content */}
        <div style={{...ls.heroContent, padding: isMobile ? '32px 20px 60px' : '40px 48px 80px', maxWidth: isMobile ? '100%' : 700}}>
          <div style={ls.heroEyebrow}>
            <span style={ls.eyebrowDot}/>
            YOUR SOURCE FOR OXYGEN PRODUCTS · SECUNDA, MPUMALANGA
          </div>

          <h1 style={ls.heroHeadline}>
            <span style={ls.heroHeadlineMain}>Where</span>
            <br/>
            <span style={ls.heroHeadlineAccent}>Nature</span>
            <span style={{...ls.heroHeadlineMain, fontSize:'clamp(52px,7vw,100px)'}}> & </span>
            <span style={ls.heroHeadlineAccent}>Health</span>
            <br/>
            <span style={ls.heroHeadlineMain}>Connect</span>
          </h1>

          <p style={ls.heroSub}>
            Premium health equipment, supplements and wellness products
            — expertly curated for Sports, Health and Wellbeing.
          </p>

          <div style={ls.heroCTAs}>
            <button className="hero-cta-btn" style={ls.ctaPrimary} onClick={() => onShowAuth('signup')}>
              Shop Now
              <span style={ls.ctaArrow}>→</span>
            </button>
            <button className="hero-cta-btn" style={ls.ctaSecondary} onClick={() => onShowAuth('signin')}>
              Sign In
            </button>
          </div>

          <div style={ls.heroMeta}>
            <div style={ls.metaItem}><span style={ls.metaDot}/>By appointment only</div>
            <div style={ls.metaDivider}/>
            <div style={ls.metaItem}><span style={ls.metaDot}/>35+ premium brands</div>
            <div style={ls.metaDivider}/>
            <div style={ls.metaItem}><span style={ls.metaDot}/>Expert guidance</div>
          </div>
        </div>

        {/* Floating product cards */}
        {!isMobile && <div style={ls.heroCards}>
          {[
            { name:'Oxygen Concentrator 5L', price:'R4,999', tag:'MEDICAL GRADE', top:'8%', right:'4%', delay:'0s' },
            { name:'CPAP Auto Machine', price:'R8,500', tag:'SLEEP THERAPY', top:'42%', right:'12%', delay:'0.15s' },
            { name:'Whey Protein Isolate', price:'R599', tag:'SPORTS NUTRITION', top:'72%', right:'3%', delay:'0.3s' },
          ].map((c,i) => (
            <div key={i} style={{...ls.floatCard, top:c.top, right:c.right, animationDelay:c.delay, animation:`floatC ${8+i*2}s ease-in-out infinite`}}>
              <div style={ls.floatCardTag}>{c.tag}</div>
              <div style={ls.floatCardName}>{c.name}</div>
              <div style={ls.floatCardPrice}>{c.price}</div>
            </div>
          ))}
        </div>}

        {/* Scroll cue */}
        <div style={ls.scrollCue}>
          <div style={ls.scrollLine}/>
          <span style={ls.scrollText}>Scroll to explore</span>
        </div>
      </section>



      {/* ── CATEGORIES ─────────────────────────── */}
      <section style={ls.cats}>
        <div style={ls.catsInner}>
          <div style={ls.sectionEyebrow}>BROWSE BY CATEGORY</div>
          <h2 style={ls.sectionTitle}>Everything your body needs</h2>
          <div style={{...ls.catsGrid, gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: isMobile ? 12 : 16}}>
            {categories.map((c,i) => (
              <div key={i} className="cat-card" style={{...ls.catCard, background:c.color, animationDelay:`${i*0.1}s`}}
                onClick={() => onShowAuth('signup')}>
                <div style={{...ls.catAccentLine, background:c.accent}}/>
                <div style={ls.catContent}>
                  <div style={ls.catName}>{c.name}</div>
                  <div style={ls.catSub}>{c.sub}</div>
                  <div style={{...ls.catArrow, color:c.accent}} className="cat-arrow">Browse →</div>
                </div>
                <div style={{...ls.catGlow, background:`radial-gradient(circle at bottom right,${c.accent}22,transparent 60%)`}}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY RENEW ─────────────────────────── */}
      <section style={ls.why}>
        <div style={ls.whyInner}>
          <div style={ls.sectionEyebrow} style={{...ls.sectionEyebrow, color:'#2BB5C8'}}>WHY RENEW</div>
          <h2 style={{...ls.sectionTitle, color:'#1a2b30'}}>More than just a store</h2>
          <div style={{...ls.whyGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit,minmax(240px,1fr))'}}>
            {[
              { icon:'◉', title:'Medical-Grade Equipment', desc:'Certified oxygen concentrators, CPAP machines and respiratory devices sourced from trusted manufacturers.' },
              { icon:'◈', title:'Expert Consultation', desc:'Our team provides personalised guidance — by appointment, ensuring you get exactly what you need.' },
              { icon:'◎', title:'Curated Health Brands', desc:'We handpick every brand on our shelves for quality, efficacy and safety. No filler products.' },
              { icon:'⬡', title:'Sports & Wellness Focus', desc:'From elite athletes to everyday wellness, we stock products for every stage of your health journey.' },
            ].map((f,i) => (
              <div key={i} className="feat-card" style={ls.featCard}>
                <div style={ls.featIcon}>{f.icon}</div>
                <h3 style={ls.featTitle}>{f.title}</h3>
                <p style={ls.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────── */}
      <section style={ls.testiSec}>
        <div style={ls.testiInner}>
          <div style={{...ls.sectionEyebrow, color:'rgba(255,255,255,0.4)'}}>WHAT CUSTOMERS SAY</div>
          <h2 style={{...ls.sectionTitle, color:'#fff', marginBottom:48}}>Trusted by the Secunda community</h2>
          <div style={{...ls.testiGrid, gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)'}}>
            {testimonials.map((t,i) => (
              <div key={i} className="testi-card" style={ls.testiCard}>
                <div style={ls.testiQuote}>"</div>
                <p style={ls.testiText}>{t.text}</p>
                <div style={ls.testiAuthor}>
                  <div style={ls.testiAvatar}>{t.name[0]}</div>
                  <div>
                    <div style={ls.testiName}>{t.name}</div>
                    <div style={ls.testiLoc}>{t.loc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────── */}
      <section style={ls.ctaBanner}>
        <div style={ls.ctaBannerOrb}/>
        <div style={ls.ctaBannerOrb2}/>
        <div style={ls.ctaContent}>
          <div style={ls.ctaLabel}>BY APPOINTMENT ONLY</div>
          <h2 style={ls.ctaTitle}>Ready to invest in your health?</h2>
          <p style={ls.ctaDesc}>Create a free account to browse our full catalogue, place orders and book a consultation.</p>
          <div style={ls.ctaBtns}>
            <button className="hero-cta-btn" style={ls.ctaBtnMain} onClick={() => onShowAuth('signup')}>
              Create Free Account →
            </button>
            <button style={ls.ctaBtnSub} onClick={() => onShowAuth('signin')}>
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────── */}
      <footer style={ls.footer}>
        <div style={ls.footerInner}>
          <div style={ls.footerBrand}>
            <div style={{...ls.navMark, width:28,height:28}}/>
            <div>
              <span style={{color:'#2BB5C8', fontWeight:800}}>RENEW</span>
              <span style={{color:'rgba(255,255,255,0.4)'}}> Health Supplies Secunda</span>
            </div>
          </div>
          <div style={ls.footerRight}>
            <span style={ls.footerLink}>Shopping & Retail</span>
            <span style={ls.footerDot}>·</span>
            <span style={ls.footerLink}>Secunda, Mpumalanga</span>
            <span style={ls.footerDot}>·</span>
            <span style={ls.footerLink}>By Appointment Only</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ls = {
  root: { fontFamily:"'DM Sans',sans-serif", background:'#F5F8FA' },

  // Hero
  hero: { position:'relative', minHeight:'100vh', background:'linear-gradient(160deg,#071820 0%,#0d2b35 40%,#0f3d4a 70%,#0d2b35 100%)', overflow:'hidden', display:'flex', flexDirection:'column' },
  orb: { position:'absolute', borderRadius:'50%', pointerEvents:'none' },
  gridLines: {
    position:'absolute', inset:0, pointerEvents:'none',
    backgroundImage:'linear-gradient(rgba(43,181,200,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(43,181,200,0.04) 1px,transparent 1px)',
    backgroundSize:'60px 60px',
  },
  nav: { position:'relative', zIndex:10, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'24px 48px' },
  navBrand: { display:'flex', alignItems:'center', gap:10 },
  navMark: { width:36,height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', flexShrink:0 },
  navName: { fontSize:22, fontWeight:800, color:'#2BB5C8', letterSpacing:'-0.01em' },
  navSub: { fontSize:13, color:'rgba(255,255,255,0.35)' },
  navActions: { display:'flex', gap:12 },
  navSignIn: { background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'9px 20px', color:'rgba(255,255,255,0.7)', fontSize:14, fontWeight:600, cursor:'pointer' },
  navSignUp: { background:'#2BB5C8', border:'none', borderRadius:8, padding:'9px 20px', color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer' },

  heroContent: { position:'relative', zIndex:5, flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'40px 48px 80px', maxWidth:700 },
  heroEyebrow: { display:'flex', alignItems:'center', gap:8, fontSize:11, fontWeight:700, letterSpacing:'0.12em', color:'rgba(255,255,255,0.35)', marginBottom:28, textTransform:'uppercase' },
  eyebrowDot: { width:6,height:6, borderRadius:'50%', background:'#2BB5C8', animation:'pulse 2s infinite', flexShrink:0 },

  heroHeadline: { margin:'0 0 24px', lineHeight:1.05, letterSpacing:'-0.02em' },
  heroHeadlineMain: { fontSize:'clamp(52px,7vw,100px)', fontWeight:800, color:'#fff', display:'inline' },
  heroHeadlineAccent: { fontSize:'clamp(52px,7vw,100px)', fontWeight:800, color:'#2BB5C8', display:'inline' },

  heroSub: { fontSize:18, color:'rgba(255,255,255,0.55)', lineHeight:1.65, margin:'0 0 36px', maxWidth:520 },

  heroCTAs: { display:'flex', gap:14, marginBottom:36, flexWrap:'wrap' },
  ctaPrimary: { background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', color:'#fff', border:'none', borderRadius:10, padding:'14px 28px', fontSize:16, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:10, transition:'all 0.25s' },
  ctaArrow: { fontSize:18, transition:'transform 0.2s' },
  ctaSecondary: { background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.18)', color:'#fff', borderRadius:10, padding:'14px 28px', fontSize:16, fontWeight:600, cursor:'pointer', transition:'all 0.25s' },

  heroMeta: { display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' },
  metaItem: { display:'flex', alignItems:'center', gap:8, fontSize:13, color:'rgba(255,255,255,0.35)' },
  metaDot: { width:4,height:4, borderRadius:'50%', background:'#2BB5C8', flexShrink:0 },
  metaDivider: { width:1, height:12, background:'rgba(255,255,255,0.1)' },

  heroCards: { position:'absolute', right:0, top:0, bottom:0, width:'35%', zIndex:4, pointerEvents:'none' },
  floatCard: {
    position:'absolute', background:'rgba(13,43,53,0.85)', backdropFilter:'blur(16px)',
    border:'1px solid rgba(43,181,200,0.2)', borderRadius:12, padding:'14px 18px',
    boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
  },
  floatCardTag: { fontSize:9, fontWeight:800, letterSpacing:'0.1em', color:'#2BB5C8', marginBottom:6 },
  floatCardName: { fontSize:13, fontWeight:700, color:'#fff', marginBottom:6, lineHeight:1.3 },
  floatCardPrice: { fontSize:16, fontWeight:800, color:'#2BB5C8' },

  scrollCue: { position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, zIndex:5 },
  scrollLine: { width:1, height:48, background:'linear-gradient(to bottom,rgba(43,181,200,0.6),transparent)', animation:'floatC 2s ease-in-out infinite' },
  scrollText: { fontSize:10, color:'rgba(255,255,255,0.25)', letterSpacing:'0.12em', textTransform:'uppercase' },


  statLabel: { fontSize:14, color:'rgba(255,255,255,0.4)', marginTop:8, fontWeight:500 },

  // Categories
  cats: { background:'#0a1f28', padding:'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' },
  catsInner: { maxWidth:1100, margin:'0 auto' },
  sectionEyebrow: { fontSize:11, fontWeight:700, letterSpacing:'0.14em', color:'#2BB5C8', marginBottom:14 },
  sectionTitle: { fontSize:'clamp(28px,3.5vw,44px)', fontWeight:800, color:'#fff', margin:'0 0 48px', letterSpacing:'-0.02em', lineHeight:1.15 },
  catsGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16 },
  catCard: { borderRadius:14, padding:'28px 24px', cursor:'pointer', position:'relative', overflow:'hidden', transition:'transform 0.3s,box-shadow 0.3s', border:'1px solid rgba(255,255,255,0.05)' },
  catAccentLine: { position:'absolute', top:0, left:0, right:0, height:3, borderRadius:'0 0 3px 3px' },
  catContent: { position:'relative', zIndex:2 },
  catName: { fontSize:16, fontWeight:800, color:'#fff', marginBottom:8, lineHeight:1.2 },
  catSub: { fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.5, marginBottom:20, minHeight:36 },
  catArrow: { fontSize:13, fontWeight:700, transition:'transform 0.2s' },
  catGlow: { position:'absolute', inset:0 },

  // Why
  why: { background:'#F5F8FA', padding:'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' },
  whyInner: { maxWidth:1100, margin:'0 auto' },
  whyGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24 },
  featCard: { background:'#fff', borderRadius:14, padding:'32px 28px', border:'1px solid #E8EEF0', transition:'transform 0.25s,box-shadow 0.25s' },
  featIcon: { fontSize:28, color:'#2BB5C8', marginBottom:16 },
  featTitle: { fontSize:16, fontWeight:800, color:'#1a2b30', margin:'0 0 10px' },
  featDesc: { fontSize:14, color:'#6B7F84', lineHeight:1.65, margin:0 },

  // Testimonials
  testiSec: { background:'linear-gradient(160deg,#071820,#0d2b35)', padding:'clamp(60px,8vw,100px) clamp(20px,4vw,40px)' },
  testiInner: { maxWidth:1100, margin:'0 auto' },
  testiGrid: { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 },
  testiCard: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:'28px', transition:'border-color 0.2s' },
  testiQuote: { fontSize:48, color:'#2BB5C8', lineHeight:0.8, marginBottom:16, fontFamily:'Georgia,serif', opacity:0.6 },
  testiText: { fontSize:14, color:'rgba(255,255,255,0.65)', lineHeight:1.7, margin:'0 0 24px' },
  testiAuthor: { display:'flex', alignItems:'center', gap:12 },
  testiAvatar: { width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#2BB5C8,#1A8A9A)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:'#fff', flexShrink:0 },
  testiName: { fontSize:14, fontWeight:700, color:'#fff' },
  testiLoc: { fontSize:12, color:'rgba(255,255,255,0.35)' },

  // CTA banner
  ctaBanner: { position:'relative', background:'linear-gradient(135deg,#2BB5C8 0%,#1A8A9A 60%,#0F6A7A 100%)', padding:'clamp(60px,8vw,100px) clamp(20px,4vw,40px)', overflow:'hidden', textAlign:'center' },
  ctaBannerOrb: { position:'absolute', width:500, height:500, borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-30%', right:'-10%' },
  ctaBannerOrb2: { position:'absolute', width:300, height:300, borderRadius:'50%', background:'rgba(0,0,0,0.08)', bottom:'-20%', left:'-5%' },
  ctaContent: { position:'relative', zIndex:2, maxWidth:600, margin:'0 auto' },
  ctaLabel: { fontSize:11, fontWeight:700, letterSpacing:'0.12em', color:'rgba(255,255,255,0.6)', marginBottom:16 },
  ctaTitle: { fontSize:'clamp(28px,4vw,52px)', fontWeight:800, color:'#fff', margin:'0 0 16px', letterSpacing:'-0.02em', lineHeight:1.1 },
  ctaDesc: { fontSize:17, color:'rgba(255,255,255,0.75)', margin:'0 0 40px', lineHeight:1.6 },
  ctaBtns: { display:'flex', flexDirection:'column', alignItems:'center', gap:12 },
  ctaBtnMain: { background:'#fff', color:'#1A8A9A', border:'none', borderRadius:10, padding:'15px 36px', fontSize:16, fontWeight:800, cursor:'pointer', transition:'all 0.25s' },
  ctaBtnSub: { background:'none', border:'none', color:'rgba(255,255,255,0.6)', fontSize:14, cursor:'pointer', textDecoration:'underline' },

  // Footer
  footer: { background:'#071820', padding:'28px 48px' },
  footerInner: { maxWidth:1100, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 },
  footerBrand: { display:'flex', alignItems:'center', gap:10, fontSize:14, fontWeight:600 },
  footerRight: { display:'flex', gap:10, alignItems:'center' },
  footerLink: { fontSize:12, color:'rgba(255,255,255,0.3)' },
  footerDot: { color:'rgba(255,255,255,0.15)' },
};

Object.assign(window, { LandingPage });
