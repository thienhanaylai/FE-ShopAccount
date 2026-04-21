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
    // Gui yeu cau nap tien vao vi.
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/top-up", data);
    return response.data;
  }

  async withdraw(data: WithdrawRequest): Promise<ApiResponse<unknown>> {
    // Gui yeu cau rut tien tu vi hien tai.
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/withdraw", data);
    return response.data;
  }

  async transfer(data: TransferRequest): Promise<ApiResponse<unknown>> {
    // Chuyen so du vi sang tai khoan khac.
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/transfer", data);
    return response.data;
  }

  async getBalance(): Promise<WalletBalance> {
    // Lay so du vi cua user hien tai.
    const response = await axiosService.get<WalletBalance>("/wallets/me/balance");
    return response.data;
  }

  async getHistory(filters?: WalletHistoryFilters): Promise<PaginationResponse<Transaction>> {
    // Lay lich su giao dich vi co phan trang.
    const response = await axiosService.get<PaginationResponse<Transaction>>("/wallets/me/history", {
      params: filters,
    });
    return response.data;
  }

  async getAdminTopUpHistory(filters?: WalletAdminTopUpHistoryFilters): Promise<PaginationResponse<WalletAdminTopUpHistoryItem>> {
    // Lay lich su nap tien cho admin voi bo loc ngay va trang thai tuy chon.
    const response = await axiosService.get<PaginationResponse<WalletAdminTopUpHistoryItem>>("/wallets/admin/top-up-history", {
      params: filters,
    });
    return response.data;
  }

  async adminAdjust(data: BalanceAdjustRequest): Promise<ApiResponse<unknown>> {
    // Dieu chinh so du vi cua user tu endpoint admin.
    const response = await axiosService.post<ApiResponse<unknown>>("/wallets/admin/adjust", data);
    return response.data;
  }
}

export const walletService = new WalletService();
