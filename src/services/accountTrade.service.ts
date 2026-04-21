import { axiosService } from "./axios";
import {
  AccountTradeHistory,
  BuyAccountRequest,
  BuyAccountResponse,
  ApproveSellRequestResponse,
  RejectSellRequestRequest,
  RejectSellRequestResponse,
  PaginationResponse,
  AccountTradeListFilters,
} from "./types";

class AccountTradeService {
  async getPurchaseHistory(filters?: AccountTradeListFilters): Promise<PaginationResponse<AccountTradeHistory>> {
    // Lay lich su mua tai khoan cua user hien tai voi bo loc tuy chon.
    const response = await axiosService.get<PaginationResponse<AccountTradeHistory>>("/account-trades/me/purchases", {
      params: filters,
    });
    return response.data;
  }

  async buy(gameAccountId: string, data?: BuyAccountRequest): Promise<BuyAccountResponse> {
    // Gui yeu cau mua cho game account cu the.
    const response = await axiosService.post<BuyAccountResponse>(`/account-trades/buy/${gameAccountId}`, data || {});
    return response.data;
  }

  async approveSellRequest(sellRequestId: string): Promise<ApproveSellRequestResponse> {
    // Duyet yeu cau ban dang cho theo id.
    const response = await axiosService.post<ApproveSellRequestResponse>(
      `/account-trades/sell-requests/${sellRequestId}/approve`,
      {},
    );
    return response.data;
  }

  async rejectSellRequest(sellRequestId: string, data: RejectSellRequestRequest): Promise<RejectSellRequestResponse> {
    // Tu choi yeu cau ban dang cho kem thong tin ly do.
    const response = await axiosService.post<RejectSellRequestResponse>(
      `/account-trades/sell-requests/${sellRequestId}/reject`,
      data,
    );
    return response.data;
  }
}

export const accountTradeService = new AccountTradeService();
