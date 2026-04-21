import { axiosService } from "./axios";
import {
  SellRequest,
  CreateSellRequestRequest,
  UpdateSellRequestRequest,
  PaginationResponse,
  SellRequestListFilters,
} from "./types";

class SellRequestService {
  async create(data: CreateSellRequestRequest): Promise<SellRequest> {
    // Tao sell request moi cho mot account listing.
    const response = await axiosService.post<SellRequest>("/sell-requests", data);
    return response.data;
  }

  async getList(filters?: SellRequestListFilters): Promise<PaginationResponse<SellRequest>> {
    // Lay danh sach sell request co phan trang voi tieu chi loc tuy chon.
    const response = await axiosService.get<PaginationResponse<SellRequest>>("/sell-requests", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<SellRequest> {
    // Lay sell request theo id.
    const response = await axiosService.get<SellRequest>(`/sell-requests/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateSellRequestRequest): Promise<SellRequest> {
    // Cap nhat sell request voi gia tri truong moi.
    const response = await axiosService.patch<SellRequest>(`/sell-requests/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    // Xoa sell request theo id.
    await axiosService.delete(`/sell-requests/${id}`);
  }
}

export const sellRequestService = new SellRequestService();
