import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';

const overlayStyle = {
  position: 'fixed', inset: 0,
  background: 'rgba(10,30,38,0.65)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  zIndex: 1000, backdropFilter: 'blur(4px)',
  padding: 16,
};

const sheetStyle = {
  background: '#fff',
  borderRadius: 16,
  width: '100%',
  maxWidth: 420,
  overflow: 'auto',
  maxHeight: '92vh',
  boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
  fontFamily: "'DM Sans', sans-serif",
};

const inputSt = {
  width: '100%', border: '1.5px solid #DDE4E8', borderRadius: 8,
  padding: '11px 14px', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', color: '#1a2b30',
  fontFamily: "'DM Sans', sans-serif", background: '#fff',
};

const btnSt = {
  width: '100%', background: '#2BB5C8', color: '#fff', border: 'none',
  borderRadius: 8, padding: '12px', fontSize: 15, fontWeight: 700,
  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
};

const googleBtnSt = {
  width: '100%', background: '#fff', color: '#1a2b30',
  border: '1.5px solid #DDE4E8', borderRadius: 8, padding: '11px 14px',
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
};

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function Divider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: '#DDE4E8' }} />
      <span style={{ fontSize: 12, color: '#9AABB0', fontWeight: 600, letterSpacing: '0.04em' }}>OR</span>
      <div style={{ flex: 1, height: 1, background: '#DDE4E8' }} />
    </div>
  );
}

function AuthModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={overlayStyle}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#2BB5C8,#1A8A9A)' }} />
            <span style={{ fontSize: 18, fontWeight: 800, color: '#2BB5C8' }}>RENEW</span>
          </div>
          <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9AABB0' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '20px 24px 28px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ClerkSignInModal({ isOpen, onClose, onSuccess }) {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState('credentials'); // 'credentials' | 'email_code'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const reset = () => { setEmail(''); setPassword(''); setCode(''); setStage('credentials'); setError(''); };
  const handleClose = () => { reset(); onClose(); };
  const handleSuccess = () => { reset(); onSuccess?.(); };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError('');
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin,
      });
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Google sign in failed.');
      setGoogleLoading(false);
    }
  };

  const handleCredentials = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      let result = await signIn.create({ identifier: email, password });

      if (result.status === 'needs_first_factor') {
        result = await signIn.attemptFirstFactor({ strategy: 'password', password });
      }

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        handleSuccess();
      } else if (result.status === 'needs_second_factor') {
        const emailFactor = result.supportedSecondFactors?.find(f => f.strategy === 'email_code');
        if (emailFactor) {
          await signIn.prepareSecondFactor({ strategy: 'email_code', emailAddressId: emailFactor.emailAddressId });
        } else {
          await signIn.prepareSecondFactor({ strategy: 'email_code' });
        }
        setStage('email_code');
      } else {
        setError(`Sign in failed (status: ${result.status}). Please try again.`);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailCode = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signIn.attemptSecondFactor({ strategy: 'email_code', code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        handleSuccess();
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={handleClose}>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1a2b30' }}>Sign in</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#9AABB0' }}>Welcome back to Renew Health Supplies</p>

      {stage === 'credentials' ? (
        <>
          <button style={{ ...googleBtnSt, opacity: googleLoading ? 0.7 : 1, cursor: googleLoading ? 'not-allowed' : 'pointer', marginBottom: 16 }} onClick={handleGoogle} disabled={googleLoading} type="button">
            <GoogleIcon />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <Divider />
          <form onSubmit={handleCredentials} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input style={inputSt} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input style={inputSt} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}
            <button style={{ ...btnSt, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} type="submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleEmailCode} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: '#4A6068' }}>We sent a verification code to <strong>{email}</strong>. Enter it below.</p>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code</label>
            <input style={inputSt} type="text" inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value)} placeholder="123456" required autoFocus />
          </div>
          {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}
          <button style={{ ...btnSt, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify'}
          </button>
          <button type="button" style={{ background: 'none', border: 'none', color: '#9AABB0', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={() => { setStage('credentials'); setCode(''); setError(''); }}>
            Back
          </button>
        </form>
      )}
    </AuthModal>
  );
}

export function ClerkSignUpModal({ isOpen, onClose, onSuccess }) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState('form'); // 'form' | 'verify'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const reset = () => { setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setCode(''); setStage('form'); setError(''); };
  const handleClose = () => { reset(); onClose(); };
  const handleSuccess = () => { reset(); onSuccess?.(); };

  const handleGoogle = async () => {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError('');
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: window.location.origin + '/sso-callback',
        redirectUrlComplete: window.location.origin,
      });
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Google sign up failed.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.create({ firstName, lastName, emailAddress: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        handleSuccess();
      } else if (result.status === 'missing_requirements') {
        await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
        setStage('verify');
      } else {
        setError(`Unexpected status: ${result.status}. Please try again.`);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        handleSuccess();
      } else {
        setError('Verification failed. Please check the code and try again.');
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthModal isOpen={isOpen} onClose={handleClose}>
      <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, color: '#1a2b30' }}>Create account</h2>
      <p style={{ margin: '0 0 20px', fontSize: 14, color: '#9AABB0' }}>Join Renew Health Supplies</p>

      {stage === 'form' ? (
        <>
          <button style={{ ...googleBtnSt, opacity: googleLoading ? 0.7 : 1, cursor: googleLoading ? 'not-allowed' : 'pointer', marginBottom: 16 }} onClick={handleGoogle} disabled={googleLoading} type="button">
            <GoogleIcon />
            {googleLoading ? 'Redirecting…' : 'Continue with Google'}
          </button>
          <Divider />
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First name</label>
                <input style={inputSt} type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Jane" required autoFocus />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last name</label>
                <input style={inputSt} type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Smith" />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
              <input style={inputSt} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input style={inputSt} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}
            <button style={{ ...btnSt, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} type="submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </>
      ) : (
        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: '#4A6068' }}>We sent a verification code to <strong>{email}</strong>. Enter it below.</p>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#4A6068', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Code</label>
            <input style={inputSt} type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" required autoFocus />
          </div>
          {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 7, padding: '10px 14px', fontSize: 13, color: '#DC2626' }}>{error}</div>}
          <button style={{ ...btnSt, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 4 }} type="submit" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify email'}
          </button>
          <button type="button" style={{ background: 'none', border: 'none', color: '#9AABB0', fontSize: 13, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={() => setStage('form')}>
            Back
          </button>
        </form>
      )}
    </AuthModal>
  );
}
