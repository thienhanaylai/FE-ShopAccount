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
    const response = await axiosService.get<PaginationResponse<AccountTradeHistory>>("/account-trades/me/purchases", {
      params: filters,
    });
    return response.data;
  }

  async buy(gameAccountId: string, data?: BuyAccountRequest): Promise<BuyAccountResponse> {
    const response = await axiosService.post<BuyAccountResponse>(`/account-trades/buy/${gameAccountId}`, data || {});
    return response.data;
  }

  async approveSellRequest(sellRequestId: string): Promise<ApproveSellRequestResponse> {
    const response = await axiosService.post<ApproveSellRequestResponse>(
      `/account-trades/sell-requests/${sellRequestId}/approve`,
      {},
    );
    return response.data;
  }

  async rejectSellRequest(sellRequestId: string, data: RejectSellRequestRequest): Promise<RejectSellRequestResponse> {
    const response = await axiosService.post<RejectSellRequestResponse>(
      `/account-trades/sell-requests/${sellRequestId}/reject`,
      data,
    );
    return response.data;
  }
}

export const accountTradeService = new AccountTradeService();
