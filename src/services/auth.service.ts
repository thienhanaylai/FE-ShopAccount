import { axiosService } from "./axios";
import { AuthResponse, LoginRequest, RegisterRequest, User } from "./types";

class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Dang ky tai khoan moi va luu trang thai dang nhap khi co token.
    const response = await axiosService.post<AuthResponse>("/auth/register", data);
    if (response.data.accessToken) {
      axiosService.setToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Xac thuc thong tin dang nhap va luu token/user vao local storage.
    const response = await axiosService.post<AuthResponse>("/auth/login", data);
    if (response.data.accessToken) {
      axiosService.setToken(response.data.accessToken);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  }

  logout(): void {
    // Xoa token xac thuc tren client.
    axiosService.clearToken();
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Gui yeu cau quen mat khau cho email duoc cung cap.
    const response = await axiosService.post<{ message: string }>("/auth/forgot-password", { email });
    return response.data;
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    // Dat lai mat khau bang reset token hop le.
    const response = await axiosService.post<{ message: string }>("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  }

  getCurrentUser(): User | null {
    // Doc va parse thong tin user dang duoc cache trong local storage.
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): boolean {
    // Xac dinh trang thai dang nhap dua tren access token hien co.
    return !!axiosService.getToken();
  }
}

export const authService = new AuthService();
