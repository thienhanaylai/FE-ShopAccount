import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  balance: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (username: string, email: string, password: string, phone: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Tài khoản mẫu
const DEMO_ACCOUNTS = [
  {
    id: 'admin1',
    username: 'admin',
    email: 'admin@gameaccount.vn',
    password: 'admin123',
    role: 'admin' as const,
    balance: 10000000
  },
  {
    id: 'user1',
    username: 'user',
    email: 'user@gameaccount.vn',
    password: 'user123',
    role: 'user' as const,
    balance: 1500000
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS.find(
      acc => acc.email === email && acc.password === password
    );

    if (account) {
      const { password: _, ...userWithoutPassword } = account;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (username: string, email: string, password: string, phone: string): boolean => {
    // Mock registration - in real app, save to backend
    const newUser = {
      id: `user${Date.now()}`,
      username,
      email,
      role: 'user' as const,
      balance: 0
    };

    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
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
