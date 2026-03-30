import { axiosService } from "./axios";
import { mediaService } from "./media.service";
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
    if (data.level !== undefined) formData.append("level", String(data.level));
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
    const payload: UpdateGameAccountRequest = {};

    if (data.categoryId !== undefined) payload.categoryId = data.categoryId;
    if (data.username !== undefined) payload.username = data.username;
    if (data.email !== undefined) payload.email = data.email;
    if (data.password !== undefined) payload.password = data.password;
    if (data.price !== undefined) payload.price = data.price;
    if (data.status !== undefined) payload.status = data.status;
    if (data.level !== undefined) payload.level = data.level;
    if (data.rank !== undefined) payload.rank = data.rank;
    if (data.description !== undefined) payload.description = data.description;
    if (data.images !== undefined) payload.images = data.images;

    if (data.imageFiles && data.imageFiles.length > 0) {
      const uploads = await Promise.all(data.imageFiles.map(file => mediaService.upload(file, "game-accounts")));
      payload.images = uploads.map(item => item.url);
    }

    const response = await axiosService.patch<GameAccount>(`/game-accounts/${id}`, payload);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/game-accounts/${id}`);
  }
}

export const gameAccountService = new GameAccountService();
