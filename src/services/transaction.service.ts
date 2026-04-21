import { axiosService } from "./axios";
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  PaginationResponse,
  TransactionListFilters,
} from "./types";

class TransactionService {
  async create(data: CreateTransactionRequest): Promise<Transaction> {
    // Tao ban ghi transaction moi.
    const response = await axiosService.post<Transaction>("/transactions", data);
    return response.data;
  }

  async getList(filters?: TransactionListFilters): Promise<PaginationResponse<Transaction>> {
    // Lay danh sach transaction co phan trang voi bo loc tuy chon.
    const response = await axiosService.get<PaginationResponse<Transaction>>("/transactions", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<Transaction> {
    // Lay chi tiet cho transaction cu the.
    const response = await axiosService.get<Transaction>(`/transactions/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    // Cap nhat transaction hien co theo id.
    const response = await axiosService.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    // Xoa transaction theo id.
    await axiosService.delete(`/transactions/${id}`);
  }
}

export const transactionService = new TransactionService();
