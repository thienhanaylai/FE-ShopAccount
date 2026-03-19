import { axiosService } from "./axios";
import {
  GameAccount,
  CreateGameAccountRequest,
  UpdateGameAccountRequest,
  PaginationResponse,
  GameAccountListFilters,
} from "./types";

class GameAccountService {
  async create(data: CreateGameAccountRequest): Promise<GameAccount> {
    const formData = new FormData();
    formData.append("categoryId", data.categoryId);
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("price", String(data.price));
    if (data.status) formData.append("status", data.status);
    if (data.level) formData.append("level", String(data.level));
    if (data.rank) formData.append("rank", data.rank);
    if (data.description) formData.append("description", data.description);
    if (data.images) {
      data.images.forEach(img => formData.append("images", img));
    }
    if (data.imageFiles) {
      data.imageFiles.forEach(file => formData.append("imageFiles", file));
    }

    const response = await axiosService.post<GameAccount>("/game-accounts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getList(filters?: GameAccountListFilters): Promise<PaginationResponse<GameAccount>> {
    const response = await axiosService.get<PaginationResponse<GameAccount>>("/game-accounts", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<GameAccount> {
    const response = await axiosService.get<GameAccount>(`/game-accounts/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateGameAccountRequest): Promise<GameAccount> {
    const formData = new FormData();
    if (data.username) formData.append("username", data.username);
    if (data.email) formData.append("email", data.email);
    if (data.password) formData.append("password", data.password);
    if (data.price) formData.append("price", String(data.price));
    if (data.status) formData.append("status", data.status);
    if (data.level) formData.append("level", String(data.level));
    if (data.rank) formData.append("rank", data.rank);
    if (data.description) formData.append("description", data.description);
    if (data.images) {
      data.images.forEach(img => formData.append("images", img));
    }
    if (data.imageFiles) {
      data.imageFiles.forEach(file => formData.append("imageFiles", file));
    }

    const response = await axiosService.patch<GameAccount>(`/game-accounts/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/game-accounts/${id}`);
  }
}

export const gameAccountService = new GameAccountService();
