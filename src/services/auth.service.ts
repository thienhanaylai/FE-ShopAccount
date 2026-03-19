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

  getCurrentUser(): User | null {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    return !!axiosService.getToken();
  }
}

export const authService = new AuthService();
