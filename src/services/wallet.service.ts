import { axiosService } from "./axios";
import {
  WalletBalance,
  TopUpRequest,
  WithdrawRequest,
  TransferRequest,
  BalanceAdjustRequest,
  WalletHistoryFilters,
  PaginationResponse,
  Transaction,
} from "./types";

class WalletService {
  async topUp(data: TopUpRequest): Promise<any> {
    const response = await axiosService.post("/wallets/top-up", data);
    return response.data;
  }

  async withdraw(data: WithdrawRequest): Promise<any> {
    const response = await axiosService.post("/wallets/withdraw", data);
    return response.data;
  }

  async transfer(data: TransferRequest): Promise<any> {
    const response = await axiosService.post("/wallets/transfer", data);
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

  async adminAdjust(data: BalanceAdjustRequest): Promise<any> {
    const response = await axiosService.post("/wallets/admin/adjust", data);
    return response.data;
  }
}

export const walletService = new WalletService();
