import { createContext, useContext } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleLogout = () => {
    signOut();
  };

  const userData = user ? {
    id: user.id,
    name: user.fullName || user.emailAddresses[0]?.emailAddress?.split('@')[0] || 'User',
    email: user.emailAddresses[0]?.emailAddress || '',
    isAdmin: user.publicMetadata?.isAdmin === true,
    avatar: user.imageUrl,
  } : null;

  return (
    <AuthContext.Provider value={{ user: userData, isLoaded, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
