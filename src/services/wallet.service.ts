import { axiosService } from "./axios";
import {
  WalletBalance,
  TopUpRequest,
  WithdrawRequest,
  TransferRequest,
  BalanceAdjustRequest,
  WalletHistoryFilters,
  WalletAdminTopUpHistoryFilters,
  WalletAdminTopUpHistoryItem,
  PaginationResponse,
  Transaction,
  ApiResponse,
} from "./types";

class WalletService {
  async topUp(data: TopUpRequest): Promise<ApiResponse<unknown>> {
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/top-up", data);
    return response.data;
  }

  async withdraw(data: WithdrawRequest): Promise<ApiResponse<unknown>> {
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/withdraw", data);
    return response.data;
  }

  async transfer(data: TransferRequest): Promise<ApiResponse<unknown>> {
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/transfer", data);
    return response.data;
  }

  async getBalance(): Promise<WalletBalance> {
    const response = await axiosService.get<WalletBalance>("/wallets/me/balance");
    return response.data;
  }

  async getHistory(filters?: WalletHistoryFilters): Promise<PaginationResponse<Transaction>> {
    const response = await axiosService.get<PaginationResponse<Transaction>>("/wallets/me/history", {
      params: filters,
    });
    return response.data;
  }

  async getAdminTopUpHistory(filters?: WalletAdminTopUpHistoryFilters): Promise<PaginationResponse<WalletAdminTopUpHistoryItem>> {
    const response = await axiosService.get<PaginationResponse<WalletAdminTopUpHistoryItem>>("/wallets/admin/top-up-history", {
      params: filters,
    });
    return response.data;
  }

  async adminAdjust(data: BalanceAdjustRequest): Promise<ApiResponse<unknown>> {
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/admin/adjust", data);
    return response.data;
  }
}

export const walletService = new WalletService();
