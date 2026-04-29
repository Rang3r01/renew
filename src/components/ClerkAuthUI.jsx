import { useEffect } from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';

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
  maxWidth: 480,
  overflow: 'auto',
  maxHeight: '92vh',
  boxShadow: '0 24px 64px rgba(0,0,0,0.25)',
};

function ClerkModal({ isOpen, onClose, onSuccess, children }) {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isOpen && isSignedIn) {
      onSuccess?.();
    }
  }, [isSignedIn, isOpen]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 16px 0' }}>
          <button
            style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9AABB0', lineHeight: 1 }}
            onClick={onClose}
          >✕</button>
        </div>
        <div style={{ padding: '0 20px 24px', display: 'flex', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function ClerkSignInModal({ isOpen, onClose, onSuccess }) {
  return (
    <ClerkModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess}>
      <SignIn routing="hash" signUpUrl="#signup" />
    </ClerkModal>
  );
}

export function ClerkSignUpModal({ isOpen, onClose, onSuccess }) {
  return (
    <ClerkModal isOpen={isOpen} onClose={onClose} onSuccess={onSuccess}>
      <SignUp routing="hash" signInUrl="#signin" />
    </ClerkModal>
  );
}
