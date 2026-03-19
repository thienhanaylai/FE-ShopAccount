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
    const response = await axiosService.post<SellRequest>("/sell-requests", data);
    return response.data;
  }

  async getList(filters?: SellRequestListFilters): Promise<PaginationResponse<SellRequest>> {
    const response = await axiosService.get<PaginationResponse<SellRequest>>("/sell-requests", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<SellRequest> {
    const response = await axiosService.get<SellRequest>(`/sell-requests/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateSellRequestRequest): Promise<SellRequest> {
    const response = await axiosService.patch<SellRequest>(`/sell-requests/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/sell-requests/${id}`);
  }
}

export const sellRequestService = new SellRequestService();
