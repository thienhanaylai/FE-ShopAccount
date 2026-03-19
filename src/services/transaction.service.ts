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
    const response = await axiosService.post<Transaction>("/transactions", data);
    return response.data;
  }

  async getList(filters?: TransactionListFilters): Promise<PaginationResponse<Transaction>> {
    const response = await axiosService.get<PaginationResponse<Transaction>>("/transactions", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<Transaction> {
    const response = await axiosService.get<Transaction>(`/transactions/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateTransactionRequest): Promise<Transaction> {
    const response = await axiosService.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/transactions/${id}`);
  }
}

export const transactionService = new TransactionService();
