
// Auth Modal Component
const AuthModal = ({ mode: initialMode, onClose, onAuth }) => {
  const [mode, setMode] = React.useState(initialMode || 'signin');
  const [form, setForm] = React.useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (mode === 'signup') {
      if (!form.name.trim()) return setError('Please enter your name.');
      if (!form.email.includes('@')) return setError('Please enter a valid email.');
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      if (form.password !== form.confirm) return setError('Passwords do not match.');
    } else {
      if (!form.email.includes('@')) return setError('Please enter a valid email.');
      if (!form.password) return setError('Please enter your password.');
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Demo: admin if email contains 'admin'
      const isAdmin = form.email.toLowerCase().includes('admin');
      onAuth({
        name: form.name || form.email.split('@')[0],
        email: form.email,
        isAdmin,
      });
    }, 900);
  };

  return (
    <div style={authStyles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={authStyles.modal}>
        {/* Header */}
        <div style={authStyles.header}>
          <div style={authStyles.logoRow}>
            <div style={authStyles.logoMark}></div>
            <div>
              <div style={authStyles.logoName}>RENEW</div>
              <div style={authStyles.logoSub}>Health Supplies Secunda</div>
            </div>
          </div>
          <button style={authStyles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div style={authStyles.tabs}>
          <button
            style={{ ...authStyles.tab, ...(mode === 'signin' ? authStyles.tabActive : {}) }}
            onClick={() => { setMode('signin'); setError(''); }}
          >Sign In</button>
          <button
            style={{ ...authStyles.tab, ...(mode === 'signup' ? authStyles.tabActive : {}) }}
            onClick={() => { setMode('signup'); setError(''); }}
          >Create Account</button>
        </div>

        <form style={authStyles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={authStyles.field}>
              <label style={authStyles.label}>Full Name</label>
              <input
                style={authStyles.input}
                type="text"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>
          )}
          <div style={authStyles.field}>
            <label style={authStyles.label}>Email Address</label>
            <input
              style={authStyles.input}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </div>
          <div style={authStyles.field}>
            <label style={authStyles.label}>Password</label>
            <input
              style={authStyles.input}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>
          {mode === 'signup' && (
            <div style={authStyles.field}>
              <label style={authStyles.label}>Confirm Password</label>
              <input
                style={authStyles.input}
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
              />
            </div>
          )}

          {error && <div style={authStyles.error}>{error}</div>}

          <button type="submit" style={authStyles.submitBtn} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In to Store' : 'Create Account'}
          </button>

          {mode === 'signin' && (
            <div style={authStyles.hint}>
              <span style={{color:'#9AABB0'}}>Tip: use </span>
              <code style={authStyles.code}>admin@renew.co.za</code>
              <span style={{color:'#9AABB0'}}> to access admin panel</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const authStyles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,30,38,0.65)',
    display: 'flex', alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(4px)',
  },
  modal: {
    background: '#fff', borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480,
    overflow: 'hidden', boxShadow: '0 -8px 48px rgba(0,0,0,0.2)',
  },
  header: {
    background: 'linear-gradient(135deg, #0d2b35, #1A5060)',
    padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoRow: { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #2BB5C8, #1A8A9A)',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  logoName: { fontSize: 22, fontWeight: 800, color: '#2BB5C8', letterSpacing: '-0.01em' },
  logoSub: { fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' },
  closeBtn: {
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
    fontSize: 18, cursor: 'pointer', padding: 4,
  },
  tabs: { display: 'flex', borderBottom: '1px solid #E8EEF0' },
  tab: {
    flex: 1, padding: '14px', background: 'none', border: 'none',
    fontSize: 14, fontWeight: 600, color: '#9AABB0', cursor: 'pointer',
    borderBottom: '2px solid transparent', transition: 'all 0.2s',
    fontFamily: "'DM Sans', sans-serif",
  },
  tabActive: { color: '#2BB5C8', borderBottomColor: '#2BB5C8' },
  form: { padding: '28px' },
  field: { marginBottom: 18 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#1a2b30', marginBottom: 6 },
  input: {
    width: '100%', padding: '11px 14px', border: '1.5px solid #DDE4E8',
    borderRadius: 8, fontSize: 14, color: '#1a2b30', outline: 'none',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  error: {
    background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8,
    padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16,
  },
  submitBtn: {
    width: '100%', background: '#2BB5C8', color: '#fff', border: 'none',
    borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
  },
  hint: { marginTop: 16, fontSize: 12, textAlign: 'center' },
  code: { background: '#F0FAFB', color: '#1A8A9A', padding: '2px 6px', borderRadius: 4, fontSize: 12 },
};

Object.assign(window, { AuthModal });
