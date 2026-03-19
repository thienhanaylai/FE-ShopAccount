import { TOKEN_STORAGE_KEYS } from "../config/api.config";
import { User } from "../services/types";

class TokenUtils {
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  }

  static setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  static clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
  }

  static getUser(): User | null {
    const userStr = localStorage.getItem(TOKEN_STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: User): void {
    localStorage.setItem(TOKEN_STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static clearUser(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEYS.USER);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static clear(): void {
    this.clearToken();
    this.clearUser();
  }

  static hasRole(role: string | string[]): boolean {
    const user = this.getUser();
    if (!user) return false;

    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  }

  static isAdmin(): boolean {
    return this.hasRole("ADMIN");
  }

  static isCustomer(): boolean {
    return this.hasRole("CUSTOMER");
  }
}

export default TokenUtils;
