import { axiosService } from "./axios";
import { Order, CreateOrderRequest, UpdateOrderRequest, PaginationResponse, OrderListFilters } from "./types";

class OrderService {
  async create(data: CreateOrderRequest): Promise<Order> {
    const response = await axiosService.post<Order>("/orders", data);
    return response.data;
  }

  async getList(filters?: OrderListFilters): Promise<PaginationResponse<Order>> {
    const response = await axiosService.get<PaginationResponse<Order>>("/orders", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<Order> {
    const response = await axiosService.get<Order>(`/orders/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateOrderRequest): Promise<Order> {
    const response = await axiosService.patch<Order>(`/orders/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/orders/${id}`);
  }
}

export const orderService = new OrderService();
