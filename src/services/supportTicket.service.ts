import { axiosService } from "./axios";
import {
  SupportTicket,
  CreateSupportTicketRequest,
  UpdateSupportTicketRequest,
  ReplySupportTicketRequest,
  PaginationResponse,
  SupportTicketFilters,
  SupportTicketReply,
  SupportTicketStatus,
} from "./types";

const SUPPORT_TICKETS_FALLBACK_KEY = "supportTicketsFallback";

type LocalUser = {
  id: string;
  username: string;
  email: string;
  role?: string;
};

class SupportTicketService {
  private shouldUseFallback(error: unknown): boolean {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401 || status === 403 || status === 404) {
      return false;
    }
    return !status || status >= 500;
  }

  private getCurrentUser(): LocalUser | null {
    if (typeof window === "undefined") return null;

    try {
      const raw = window.localStorage.getItem("user");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as LocalUser;
      if (!parsed?.id) return null;
      return parsed;
    } catch {
      return null;
    }
  }

  private readFallbackTickets(): SupportTicket[] {
    if (typeof window === "undefined") return [];

    try {
      const raw = window.localStorage.getItem(SUPPORT_TICKETS_FALLBACK_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as SupportTicket[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeFallbackTickets(tickets: SupportTicket[]): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SUPPORT_TICKETS_FALLBACK_KEY, JSON.stringify(tickets));
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private applyFilters(tickets: SupportTicket[], filters?: SupportTicketFilters): SupportTicket[] {
    const currentUser = this.getCurrentUser();
    const isAdmin = currentUser?.role === "ADMIN";

    let filtered = [...tickets];

    if (!isAdmin && currentUser?.id) {
      filtered = filtered.filter(ticket => ticket.userId === currentUser.id);
    }

    if (filters?.userId) {
      filtered = filtered.filter(ticket => ticket.userId === filters.userId);
    }

    if (filters?.category) {
      filtered = filtered.filter(ticket => ticket.category === filters.category);
    }

    if (filters?.status) {
      filtered = filtered.filter(ticket => ticket.status === filters.status);
    }

    if (filters?.search) {
      const keyword = filters.search.trim().toLowerCase();
      if (keyword) {
        filtered = filtered.filter(ticket => {
          const username = ticket.user?.username || "";
          return [ticket.id, ticket.title, ticket.description, ticket.userId, username].join(" ").toLowerCase().includes(keyword);
        });
      }
    }

    if (filters?.fromDate) {
      const from = new Date(filters.fromDate).getTime();
      if (!Number.isNaN(from)) {
        filtered = filtered.filter(ticket => new Date(ticket.createdAt).getTime() >= from);
      }
    }

    if (filters?.toDate) {
      const to = new Date(filters.toDate).getTime();
      if (!Number.isNaN(to)) {
        filtered = filtered.filter(ticket => new Date(ticket.createdAt).getTime() <= to);
      }
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return filtered;
  }

  private toPaginationResponse(data: SupportTicket[], page: number, limit: number): PaginationResponse<SupportTicket> {
    const safeLimit = Math.max(1, limit);
    const safePage = Math.max(1, page);
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const start = (safePage - 1) * safeLimit;
    const sliced = data.slice(start, start + safeLimit);

    return {
      data: sliced,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
      },
    };
  }

  async create(data: CreateSupportTicketRequest): Promise<SupportTicket> {
    try {
      const response = await axiosService.post<SupportTicket>("/support-tickets", data);
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const currentUser = this.getCurrentUser();
      const now = new Date().toISOString();
      const ticket: SupportTicket = {
        id: this.generateId("st_local"),
        userId: currentUser?.id || "unknown-user",
        title: data.title,
        description: data.description,
        category: data.category,
        status: SupportTicketStatus.PENDING,
        handledBy: null,
        handledAt: null,
        resolvedAt: null,
        replies: [],
        user: currentUser
          ? {
              id: currentUser.id,
              username: currentUser.username,
              email: currentUser.email,
            }
          : undefined,
        handler: null,
        createdAt: now,
        updatedAt: now,
      };

      const tickets = this.readFallbackTickets();
      tickets.unshift(ticket);
      this.writeFallbackTickets(tickets);
      return ticket;
    }
  }

  async getList(filters?: SupportTicketFilters): Promise<PaginationResponse<SupportTicket>> {
    try {
      const response = await axiosService.get<PaginationResponse<SupportTicket>>("/support-tickets", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const filtered = this.applyFilters(this.readFallbackTickets(), filters);
      const page = filters?.page || 1;
      const limit = filters?.limit || 20;
      return this.toPaginationResponse(filtered, page, limit);
    }
  }

  async getById(id: string): Promise<SupportTicket> {
    try {
      const response = await axiosService.get<SupportTicket>(`/support-tickets/${id}`);
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const ticket = this.readFallbackTickets().find(item => item.id === id);
      if (!ticket) {
        throw error;
      }
      return ticket;
    }
  }

  async update(id: string, data: UpdateSupportTicketRequest): Promise<SupportTicket> {
    try {
      const response = await axiosService.patch<SupportTicket>(`/support-tickets/${id}`, data);
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const tickets = this.readFallbackTickets();
      const index = tickets.findIndex(item => item.id === id);
      if (index < 0) throw error;

      const current = tickets[index];
      const nextStatus = data.status ?? current.status;
      const resolvedAt = nextStatus === SupportTicketStatus.RESOLVED ? new Date().toISOString() : current.resolvedAt || null;

      const updated: SupportTicket = {
        ...current,
        title: data.title ?? current.title,
        description: data.description ?? current.description,
        category: data.category ?? current.category,
        status: nextStatus,
        resolvedAt,
        updatedAt: new Date().toISOString(),
      };

      tickets[index] = updated;
      this.writeFallbackTickets(tickets);
      return updated;
    }
  }

  async startProcessing(id: string): Promise<SupportTicket> {
    try {
      const response = await axiosService.post<SupportTicket>(`/support-tickets/${id}/start-processing`, {});
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const currentUser = this.getCurrentUser();
      const tickets = this.readFallbackTickets();
      const index = tickets.findIndex(item => item.id === id);
      if (index < 0) throw error;

      const now = new Date().toISOString();
      const updated: SupportTicket = {
        ...tickets[index],
        status: SupportTicketStatus.IN_PROGRESS,
        handledBy: currentUser?.id || tickets[index].handledBy || null,
        handledAt: now,
        updatedAt: now,
      };

      tickets[index] = updated;
      this.writeFallbackTickets(tickets);
      return updated;
    }
  }

  async reply(id: string, data: ReplySupportTicketRequest): Promise<SupportTicket> {
    try {
      const response = await axiosService.post<SupportTicket>(`/support-tickets/${id}/reply`, data);
      return response.data;
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const currentUser = this.getCurrentUser();
      const tickets = this.readFallbackTickets();
      const index = tickets.findIndex(item => item.id === id);
      if (index < 0) throw error;

      const current = tickets[index];
      const now = new Date().toISOString();
      const adminName = currentUser?.username || "Admin";
      const reply: SupportTicketReply = {
        id: this.generateId("str_local"),
        message: data.message,
        handledBy: currentUser?.id,
        adminId: currentUser?.id,
        admin: currentUser
          ? {
              id: currentUser.id,
              username: adminName,
              email: currentUser.email,
            }
          : {
              id: "admin-local",
              username: adminName,
              email: "admin@local",
            },
        createdAt: now,
      };

      const currentReplies = current.replies || [];
      const nextStatus =
        data.status || (current.status === SupportTicketStatus.PENDING ? SupportTicketStatus.IN_PROGRESS : current.status);

      const updated: SupportTicket = {
        ...current,
        replies: [...currentReplies, reply],
        status: nextStatus,
        handledBy: currentUser?.id || current.handledBy || null,
        handledAt: current.handledAt || now,
        resolvedAt: nextStatus === SupportTicketStatus.RESOLVED ? now : current.resolvedAt || null,
        updatedAt: now,
      };

      tickets[index] = updated;
      this.writeFallbackTickets(tickets);
      return updated;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await axiosService.delete(`/support-tickets/${id}`);
    } catch (error) {
      if (!this.shouldUseFallback(error)) throw error;

      const tickets = this.readFallbackTickets();
      const filtered = tickets.filter(item => item.id !== id);
      this.writeFallbackTickets(filtered);
    }
  }
}

export const supportTicketService = new SupportTicketService();
