import { useState } from 'react';
import { colors, gradients, typography } from '../theme';

const s = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(10,30,38,0.65)',
    display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    zIndex: 1000, backdropFilter: 'blur(4px)',
  },
  modal: {
    background: colors.bgCard, borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 480,
    overflow: 'hidden', boxShadow: '0 -8px 48px rgba(0,0,0,0.2)',
  },
  header: {
    background: gradients.modal,
    padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  logoRow:  { display: 'flex', alignItems: 'center', gap: 12 },
  logoMark: { width: 36, height: 36, borderRadius: '50%', background: gradients.primary, border: '2px solid rgba(255,255,255,0.3)' },
  logoName: { fontSize: 22, fontWeight: 800, color: colors.primary, letterSpacing: '-0.01em' },
  logoSub:  { fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em' },
  closeBtn: { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer', padding: 4 },
  tabs:     { display: 'flex', borderBottom: `1px solid ${colors.borderSubtle}` },
  tab: {
    flex: 1, padding: '14px', background: 'none', border: 'none',
    fontSize: 14, fontWeight: 600, color: colors.textTertiary, cursor: 'pointer',
    borderBottom: '2px solid transparent', transition: 'all 0.2s',
    fontFamily: typography.fontFamily,
  },
  tabActive:  { color: colors.primary, borderBottomColor: colors.primary },
  form:       { padding: '28px' },
  field:      { marginBottom: 18 },
  label:      { display: 'block', fontSize: 13, fontWeight: 600, color: colors.textPrimary, marginBottom: 6 },
  input: {
    width: '100%', padding: '11px 14px', border: `1.5px solid ${colors.borderInput}`,
    borderRadius: 8, fontSize: 14, color: colors.textPrimary, outline: 'none',
    boxSizing: 'border-box', fontFamily: typography.fontFamily, transition: 'border-color 0.2s',
  },
  error: {
    background: colors.errorBg, border: `1px solid ${colors.errorBorder}`, borderRadius: 8,
    padding: '10px 14px', fontSize: 13, color: colors.error, marginBottom: 16,
  },
  submitBtn: {
    width: '100%', background: colors.primary, color: colors.white, border: 'none',
    borderRadius: 8, padding: '13px', fontSize: 15, fontWeight: 700,
    cursor: 'pointer', fontFamily: typography.fontFamily,
  },
  hint: { marginTop: 16, fontSize: 12, textAlign: 'center' },
  code: { background: '#F0FAFB', color: colors.primaryDark, padding: '2px 6px', borderRadius: 4, fontSize: 12 },
};

export function AuthModal({ mode: initialMode, onClose, onAuth }) {
  const [mode, setMode] = useState(initialMode || 'signin');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      const isAdmin = form.email.toLowerCase().includes('admin');
      onAuth({ name: form.name || form.email.split('@')[0], email: form.email, isAdmin });
    }, 900);
  };

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <div style={s.logoRow}>
            <div style={s.logoMark}></div>
            <div>
              <div style={s.logoName}>RENEW</div>
              <div style={s.logoSub}>Health Supplies Secunda</div>
            </div>
          </div>
          <button style={s.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(mode === 'signin' ? s.tabActive : {}) }} onClick={() => { setMode('signin'); setError(''); }}>Sign In</button>
          <button style={{ ...s.tab, ...(mode === 'signup' ? s.tabActive : {}) }} onClick={() => { setMode('signup'); setError(''); }}>Create Account</button>
        </div>

        <form style={s.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} type="text" placeholder="Jane Smith" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
          )}
          <div style={s.field}>
            <label style={s.label}>Email Address</label>
            <input style={s.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <input style={s.input} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
          </div>
          {mode === 'signup' && (
            <div style={s.field}>
              <label style={s.label}>Confirm Password</label>
              <input style={s.input} type="password" placeholder="••••••••" value={form.confirm} onChange={e => set('confirm', e.target.value)} />
            </div>
          )}

          {error && <div style={s.error}>{error}</div>}

          <button type="submit" style={s.submitBtn} disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In to Store' : 'Create Account'}
          </button>

          {mode === 'signin' && (
            <div style={s.hint}>
              <span style={{ color: colors.textTertiary }}>Tip: use </span>
              <code style={s.code}>admin@renew.co.za</code>
              <span style={{ color: colors.textTertiary }}> to access admin panel</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
