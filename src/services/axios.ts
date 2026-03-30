import axios, { AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig, AxiosRequestConfig } from "axios";
import { API_CONFIG } from "../config/api.config";

class AxiosService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Check for token rotation
        const rotatedToken = response.headers["x-access-token"];
        if (rotatedToken && response.headers["x-token-rotated"] === "true") {
          this.setToken(rotatedToken);
        }
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
        const requestUrl = originalRequest?.url ?? "";
        const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"].some(endpoint =>
          requestUrl.includes(endpoint),
        );
        const isOnLoginPage = window.location.pathname === "/login";

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;
          // Clear token and redirect to login
          this.clearToken();
          // Prevent full-page reload loops when user is already on login screen.
          if (!isOnLoginPage) {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      },
    );
  }

  public getToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  public setToken(token: string): void {
    localStorage.setItem("accessToken", token);
  }

  public clearToken(): void {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  public getAxiosInstance(): AxiosInstance {
    return this.instance;
  }

  public async get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  public async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  public async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.patch<T>(url, data, config);
  }

  public async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}

export const axiosService = new AxiosService();
