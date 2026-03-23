import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { User } from '../services/types';

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage on mount + listen for changes
  useEffect(() => {
    const initializeAuth = () => {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsLoading(false);
    };

    initializeAuth();

    // Listen for storage changes (login from another tab, logout, etc)
    const handleStorageChange = () => {
      initializeAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'ADMIN',
        isLoading,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
