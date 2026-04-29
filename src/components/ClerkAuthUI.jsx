import { SignIn, SignUp } from '@clerk/clerk-react';

export function ClerkSignInModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,30,38,0.65)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        width: '100%',
        maxWidth: 480,
        overflow: 'auto',
        maxHeight: '90vh',
        boxShadow: '0 -8px 48px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a2b30', margin: 0 }}>Sign In</h2>
          <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9AABB0' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <SignIn />
        </div>
      </div>
    </div>
  );
}

export function ClerkSignUpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(10,30,38,0.65)',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff',
        borderRadius: '16px 16px 0 0',
        width: '100%',
        maxWidth: 480,
        overflow: 'auto',
        maxHeight: '90vh',
        boxShadow: '0 -8px 48px rgba(0,0,0,0.2)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: '#1a2b30', margin: 0 }}>Create Account</h2>
          <button style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9AABB0' }} onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '0 20px 20px' }}>
          <SignUp />
        </div>
      </div>
    </div>
  );
}
