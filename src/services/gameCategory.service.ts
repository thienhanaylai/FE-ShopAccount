import axios from "axios";
import { axiosService } from "./axios";
import { mediaService } from "./media.service";
import {
  GameCategory,
  CreateGameCategoryRequest,
  UpdateGameCategoryRequest,
  PaginationResponse,
  GameCategoryListFilters,
} from "./types";

class GameCategoryService {
  private unwrapCategoryResponse(payload: unknown): GameCategory {
    if (typeof payload === "object" && payload !== null && "data" in payload) {
      const nested = (payload as { data?: unknown }).data;
      if (nested && typeof nested === "object") {
        return nested as GameCategory;
      }
    }

    return payload as GameCategory;
  }

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
    const payload: Record<string, unknown> = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.description !== undefined) payload.description = data.description;
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive;
      // Compatibility alias for backends that use snake_case DTO mapping.
      payload.is_active = data.isActive;
    }
    if (data.icon !== undefined) payload.icon = data.icon;

    if (data.iconFile) {
      const uploaded = await mediaService.upload(data.iconFile, "game-categories");
      payload.icon = uploaded.url;
    }

    try {
      const response = await axiosService.patch<unknown>(`/game-categories/${id}`, payload);
      return this.unwrapCategoryResponse(response.data);
    } catch (error: unknown) {
      const statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;
      if (statusCode === 404 || statusCode === 405) {
        const fallbackResponse = await axiosService.put<unknown>(`/game-categories/${id}`, payload);
        return this.unwrapCategoryResponse(fallbackResponse.data);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/game-categories/${id}`);
  }
}

export const gameCategoryService = new GameCategoryService();
