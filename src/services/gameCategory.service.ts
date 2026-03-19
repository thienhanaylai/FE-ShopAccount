import { axiosService } from "./axios";
import {
  GameCategory,
  CreateGameCategoryRequest,
  UpdateGameCategoryRequest,
  PaginationResponse,
  GameCategoryListFilters,
} from "./types";

class GameCategoryService {
  async create(data: CreateGameCategoryRequest): Promise<GameCategory> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    if (data.description) formData.append("description", data.description);
    if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
    if (data.icon) formData.append("icon", data.icon);
    if (data.iconFile) formData.append("iconFile", data.iconFile);

    const response = await axiosService.post<GameCategory>("/game-categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async getList(filters?: GameCategoryListFilters): Promise<PaginationResponse<GameCategory>> {
    const response = await axiosService.get<PaginationResponse<GameCategory>>("/game-categories", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<GameCategory> {
    const response = await axiosService.get<GameCategory>(`/game-categories/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateGameCategoryRequest): Promise<GameCategory> {
    const formData = new FormData();
    if (data.name) formData.append("name", data.name);
    if (data.slug) formData.append("slug", data.slug);
    if (data.description) formData.append("description", data.description);
    if (data.isActive !== undefined) formData.append("isActive", String(data.isActive));
    if (data.icon) formData.append("icon", data.icon);
    if (data.iconFile) formData.append("iconFile", data.iconFile);

    const response = await axiosService.patch<GameCategory>(`/game-categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/game-categories/${id}`);
  }
}

export const gameCategoryService = new GameCategoryService();
