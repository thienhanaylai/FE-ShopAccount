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
    // Chuan hoa response API co the boc du lieu category trong truong data long nhau.
    if (typeof payload === "object" && payload !== null && "data" in payload) {
      const nested = (payload as { data?: unknown }).data;
      if (nested && typeof nested === "object") {
        return nested as GameCategory;
      }
    }

    return payload as GameCategory;
  }

  async create(data: CreateGameCategoryRequest): Promise<GameCategory> {
    // Tao game category bang multipart data de ho tro upload icon tuy chon.
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
    // Lay danh sach game category co phan trang voi bo loc tuy chon.
    const response = await axiosService.get<PaginationResponse<GameCategory>>("/game-categories", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<GameCategory> {
    // Lay chi tiet cua game category cu the.
    const response = await axiosService.get<GameCategory>(`/game-categories/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateGameCategoryRequest): Promise<GameCategory> {
    // Cap nhat cac truong category va fallback sang PUT neu PATCH khong duoc ho tro.
    const payload: Record<string, unknown> = {};

    if (data.name !== undefined) payload.name = data.name;
    if (data.slug !== undefined) payload.slug = data.slug;
    if (data.description !== undefined) payload.description = data.description;
    if (data.isActive !== undefined) {
      payload.isActive = data.isActive;
      // Truong thay the de tuong thich backend su dung DTO mapping theo snake_case.
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
    // Xoa game category theo id.
    await axiosService.delete(`/game-categories/${id}`);
  }
}

export const gameCategoryService = new GameCategoryService();
