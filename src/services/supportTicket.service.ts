import { axiosService } from "./axios";
import {
  SupportTicket,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  ReplySupportTicketRequest,
  PaginationResponse,
  SupportTicketFilters,
} from "./types";

class SupportTicketService {
  async create(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    const response = await axiosService.post<SupportTicket>("/support-tickets", data);
    return response.data;
  }

  async getList(filters?: SupportTicketFilters): Promise<PaginationResponse<SupportTicket>> {
    const response = await axiosService.get<PaginationResponse<SupportTicket>>("/support-tickets", {
      params: filters,
    });
    return response.data;
  }

  async getById(id: string): Promise<SupportTicket> {
    const response = await axiosService.get<SupportTicket>(`/support-tickets/${id}`);
    return response.data;
  }

  async update(id: string, data: UpdateSupportTicketRequest): Promise<SupportTicket> {
    const response = await axiosService.patch<SupportTicket>(`/support-tickets/${id}`, data);
    return response.data;
  }

  async startProcessing(id: string): Promise<SupportTicket> {
    const response = await axiosService.post<SupportTicket>(`/support-tickets/${id}/start-processing`, {});
    return response.data;
  }

  async reply(id: string, data: ReplySupportTicketRequest): Promise<SupportTicket> {
    const response = await axiosService.post<SupportTicket>(`/support-tickets/${id}/reply`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await axiosService.delete(`/support-tickets/${id}`);
  }
}

export const supportTicketService = new SupportTicketService();
