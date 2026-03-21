import { axiosService } from "./axios";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "./types";

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await axiosService.post<AuthResponse>("/auth/register", data);
    if (response.data.accessToken) {
      axiosService.setToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await axiosService.post<AuthResponse>("/auth/login", data);
    if (response.data.accessToken) {
      axiosService.setToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout(): void {
    axiosService.clearToken();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await axiosService.post<{ message: string }>("/auth/forgot-password", { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const response = await axiosService.post<{ message: string }>("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!axiosService.getToken();
  }
}

export const authService = new AuthService();
