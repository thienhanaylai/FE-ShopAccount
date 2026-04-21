import axios from "axios";
import { axiosService } from "./axios";
import { User, CreateUserRequest, UpdateUserRequest, AdminUpdateUserRequest, PaginationResponse, UserListFilters } from "./types";

class UserService {
  async create(data: CreateUserRequest): Promise<User> {
    // Tao tai khoan user moi.
    const response = await axiosService.post<User>("/users", data);
    return response.data;
  }

  async getList(filters?: UserListFilters): Promise<PaginationResponse<User>> {
    // Lay danh sach user co phan trang voi dieu kien loc tuy chon.
    const response = await axiosService.get<PaginationResponse<User>>("/users", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<User> {
    // Lay chi tiet user theo id.
    const response = await axiosService.get<User>(`/users/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    // Cap nhat cac truong profile cho user cu the.
    const response = await axiosService.patch<User>(`/users/${id}`, data);
    return response.data;
  }

  async adminUpdate(id: string, data: AdminUpdateUserRequest): Promise<User> {
    // Cap nhat user o muc admin voi endpoint fallback de tuong thich.
    try {
      const response = await axiosService.patch<User>(`/users/${id}/admin-update`, data);
      return response.data;
    } catch (error: unknown) {
      const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (statusCode === 404 || statusCode === 405) {
        const fallbackResponse = await axiosService.patch<User>(`/users/${id}`, data);
        return fallbackResponse.data;
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    // Xoa user theo id.
    await axiosService.delete(`/users/${id}`);
  }
}

export const userService = new UserService();
