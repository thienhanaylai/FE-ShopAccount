import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, MessageSquare, CheckCircle, Clock, Eye, RefreshCw, XCircle } from "lucide-react";
import { SupportDetailModal } from "../../components/admin/SupportDetailModal.tsx";
import { supportTicketService } from "../../services/supportTicket.service";
import { SupportTicket, SupportTicketStatus } from "../../services/types";
import ErrorHandler from "../../utils/errorHandler";

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

export function SupportManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | SupportTicketStatus>("all");
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDetailModal, setShowDetailModal] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setCurrentPage(1);
    }, 300);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchQuery]);

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await supportTicketService.getList({
        page: currentPage,
        limit: 10,
        search: debouncedSearchQuery || undefined,
        status: filterStatus === "all" ? undefined : filterStatus,
      });

      setTickets(response.data);
      setTotalTickets(response.pagination.total);
      setTotalPages(Math.max(response.pagination.totalPages, 1));
    } catch (error) {
      setTickets([]);
      setTotalTickets(0);
      setTotalPages(1);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchQuery, filterStatus]);

  useEffect(() => {
    void fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const openDetailModal = async (ticket: SupportTicket) => {
    setShowDetailModal(ticket);
    setErrorMessage(null);

    try {
      const latest = await supportTicketService.getById(ticket.id);
      setShowDetailModal(latest);
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  };

  const ensureTicketInProgress = async (ticket: SupportTicket): Promise<void> => {
    if (ticket.status === SupportTicketStatus.PENDING) {
      await supportTicketService.startProcessing(ticket.id);
    }
  };

  const handleResolve = async (ticket: SupportTicket) => {
    setIsActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await ensureTicketInProgress(ticket);
      await supportTicketService.update(ticket.id, {
        status: SupportTicketStatus.RESOLVED,
      });

      const latest = await supportTicketService.getById(ticket.id);
      setShowDetailModal(latest);
      setSuccessMessage(`Đã đánh dấu ticket ${ticket.id} là đã giải quyết.`);
      await fetchTickets();
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReply = async (ticket: SupportTicket, message: string) => {
    const content = message.trim();
    if (!content) return;

    setIsActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await ensureTicketInProgress(ticket);
      await supportTicketService.reply(ticket.id, { message: content });
      const latest = await supportTicketService.getById(ticket.id);
      setShowDetailModal(latest);
      setSuccessMessage(`Đã gửi phản hồi cho ticket ${ticket.id}.`);
      await fetchTickets();
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (ticket: SupportTicket, message: string) => {
    const content = message.trim() || "Yêu cầu đã bị từ chối bởi admin.";

    setIsActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await ensureTicketInProgress(ticket);
      await supportTicketService.reply(ticket.id, {
        message: content,
        status: SupportTicketStatus.REJECTED,
      });
      const latest = await supportTicketService.getById(ticket.id);
      setShowDetailModal(latest);
      setSuccessMessage(`Đã từ chối ticket ${ticket.id}.`);
      await fetchTickets();
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusColor = (status: SupportTicketStatus) => {
    switch (status) {
      case SupportTicketStatus.PENDING:
        return "bg-yellow-100 text-yellow-700";
      case SupportTicketStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-700";
      case SupportTicketStatus.RESOLVED:
        return "bg-green-100 text-green-700";
      case SupportTicketStatus.REJECTED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: SupportTicketStatus) => {
    switch (status) {
      case SupportTicketStatus.PENDING:
        return "Mới";
      case SupportTicketStatus.IN_PROGRESS:
        return "Đang xử lý";
      case SupportTicketStatus.RESOLVED:
        return "Đã giải quyết";
      case SupportTicketStatus.REJECTED:
        return "Từ chối";
      default:
        return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "account":
        return "Tài khoản";
      case "payment":
        return "Thanh toán";
      case "security":
        return "Bảo mật";
      case "technical":
        return "Kỹ thuật";
      case "general":
        return "Chung";
      default:
        return category;
    }
  };

  const stats = useMemo(() => {
    return {
      pending: tickets.filter(ticket => ticket.status === SupportTicketStatus.PENDING).length,
      inProgress: tickets.filter(ticket => ticket.status === SupportTicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter(ticket => ticket.status === SupportTicketStatus.RESOLVED).length,
      rejected: tickets.filter(ticket => ticket.status === SupportTicketStatus.REJECTED).length,
    };
  }, [tickets]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#252A34] mb-2">Quản lý hỗ trợ</h1>
          <p className="text-gray-600">Tổng số: {totalTickets} yêu cầu</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{errorMessage}</p>
          <button
            onClick={() => void fetchTickets()}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-red-200 hover:bg-red-100 transition text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-green-200 hover:bg-green-100 transition text-sm font-medium"
          >
            Đóng
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Mới (trên trang)</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý (trên trang)</p>
            <MessageSquare className="w-5 h-5 text-[#08D9D6]" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đã giải quyết (trên trang)</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.resolved}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Từ chối (trên trang)</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.rejected}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm yêu cầu hỗ trợ..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value as "all" | SupportTicketStatus);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={SupportTicketStatus.PENDING}>Mới</option>
              <option value={SupportTicketStatus.IN_PROGRESS}>Đang xử lý</option>
              <option value={SupportTicketStatus.RESOLVED}>Đã giải quyết</option>
              <option value={SupportTicketStatus.REJECTED}>Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tiêu đề</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Danh mục</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tin nhắn</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Cập nhật</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-10 px-6 text-center text-gray-500">
                    Đang tải danh sách yêu cầu hỗ trợ...
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 px-6 text-center text-gray-500">
                    Không có yêu cầu hỗ trợ phù hợp
                  </td>
                </tr>
              ) : (
                tickets.map(ticket => {
                  const username = ticket.user?.username || ticket.userId;
                  return (
                    <tr key={ticket.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6 font-medium text-[#FF2E63]">{ticket.id}</td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-gray-800">{username}</p>
                        <p className="text-sm text-gray-500">{ticket.userId}</p>
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-medium text-gray-800 max-w-xs truncate">{ticket.title}</p>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {getCategoryText(ticket.category)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-block bg-[#08D9D6]/10 text-[#08D9D6] px-3 py-1 rounded-full text-sm font-semibold">
                          {ticket.replies?.length ?? 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDateTime(ticket.createdAt)}</td>
                      <td className="py-4 px-6 text-sm text-gray-600">{formatDateTime(ticket.updatedAt)}</td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => void openDetailModal(ticket)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị trang {currentPage} / {totalPages} ({tickets.length} / {totalTickets} yêu cầu)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage <= 1 || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button className="px-4 py-2 bg-[#FF2E63] text-white rounded-lg">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages || isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {showDetailModal && (
        <SupportDetailModal
          ticket={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onResolve={() => handleResolve(showDetailModal)}
          onReply={(message: string) => handleReply(showDetailModal, message)}
          onReject={(message: string) => handleReject(showDetailModal, message)}
          isActionLoading={isActionLoading}
        />
      )}
    </div>
  );
}
