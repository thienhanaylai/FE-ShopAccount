import { useState, ReactNode } from "react";
import { AuthContext, User } from "./AuthContextCore";
import { authService } from "../services/auth.service";
import { UserRole } from "../services/types";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (!authService.isAuthenticated()) {
      return null;
    }

    return authService.getCurrentUser();
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    const response = await authService.login({ email, password });
    setUser(response.user);
    return true;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    const response = await authService.register({
      username,
      email,
      password,
    });

    setUser(response.user);
    return true;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user && authService.isAuthenticated(),
        isAdmin: !!user && authService.isAuthenticated() && user.role === UserRole.ADMIN,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
