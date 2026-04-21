import { axiosService } from "./axios";
import { Order, CreateOrderRequest, UpdateOrderRequest, PaginationResponse, OrderListFilters } from "./types";

class OrderService {
  async create(data: CreateOrderRequest): Promise<Order> {
    // Tao ban ghi order moi.
    const response = await axiosService.post<Order>("/orders", data);
    return response.data;
  }

  async getList(filters?: OrderListFilters): Promise<PaginationResponse<Order>> {
    // Lay danh sach order co phan trang voi bo loc tuy chon.
    const response = await axiosService.get<PaginationResponse<Order>>("/orders", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<Order> {
    // Lay chi tiet cua mot order cu the.
    const response = await axiosService.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateOrderRequest): Promise<Order> {
    // Cap nhat order hien co theo id.
    const response = await axiosService.patch<Order>(`/orders/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    // Xoa order theo id.
    await axiosService.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
