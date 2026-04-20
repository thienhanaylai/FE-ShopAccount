import { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { TransactionStatus, walletService, WalletAdminTopUpHistoryItem } from "../../services";
import ErrorHandler from "../../utils/errorHandler";

type DepositStatusFilter = "all" | "pending" | "processing" | "completed" | "failed";

const PAGE_LIMIT = 20;

interface DepositItem {
  id: string;
  userId: string;
  userDisplay: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  requestDate: string;
  completedDate: string | null;
}

function normalizeStatus(status: string): DepositStatusFilter | "other" {
  const normalized = status.toUpperCase();

  switch (normalized) {
    case "SUCCESS":
    case "COMPLETED":
      return "completed";
    case "PENDING":
      return "pending";
    case "PROCESSING":
    case "IN_PROGRESS":
      return "processing";
    case "FAILED":
    case "CANCELLED":
    case "REJECTED":
      return "failed";
    default:
      return "other";
  }
}

function mapFilterStatusToApiStatus(status: DepositStatusFilter): TransactionStatus | undefined {
  switch (status) {
    case "completed":
      return TransactionStatus.SUCCESS;
    case "pending":
      return TransactionStatus.PENDING;
    case "failed":
      return TransactionStatus.FAILED;
    default:
      return undefined;
  }
}

function mapApiItemToDeposit(item: WalletAdminTopUpHistoryItem): DepositItem {
  const userDisplay = item.user?.username || item.user?.email || item.userId;
  const normalizedStatus = normalizeStatus(item.status);

  return {
    id: item.id,
    userId: item.userId,
    userDisplay,
    amount: Number(item.price || 0),
    method: item.method || "TOP_UP",
    status: item.status || "SUCCESS",
    transactionId: item.referenceId || item.id,
    requestDate: item.createdAt,
    completedDate: normalizedStatus === "completed" ? item.updatedAt || item.createdAt : null,
  };
}

export function DepositsManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<DepositStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [reloadTick, setReloadTick] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deposits, setDeposits] = useState<DepositItem[]>([]);

  useEffect(() => {
    const loadDeposits = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await walletService.getAdminTopUpHistory({
          page: currentPage,
          limit: PAGE_LIMIT,
          status: mapFilterStatusToApiStatus(filterStatus),
        });

        setDeposits(res.data.map(mapApiItemToDeposit));
        setTotalPages(Math.max(1, res.pagination?.totalPages || 1));
        setTotalDeposits(res.pagination?.total || res.data.length);
      } catch (err: unknown) {
        console.error("Load admin top-up history error:", err);

        setDeposits([]);
        setTotalPages(1);
        setTotalDeposits(0);

        if (ErrorHandler.isAuthError(err)) {
          setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản admin.");
        } else if (ErrorHandler.isForbiddenError(err)) {
          setError("Tài khoản hiện tại không có quyền ADMIN để xem lịch sử nạp tiền toàn hệ thống.");
        } else {
          setError(ErrorHandler.getErrorMessage(err) || "Không thể tải lịch sử nạp tiền");
        }
      } finally {
        setLoading(false);
      }
    };

    void loadDeposits();
  }, [currentPage, filterStatus, reloadTick]);

  const getStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: string) => {
    switch (normalizeStatus(status)) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case "TOP_UP":
        return "Nạp tiền";
      default:
        return method;
    }
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "--";
    return new Date(value).toLocaleString("vi-VN");
  };

  const filteredDeposits = useMemo(() => {
    return deposits.filter(deposit => {
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch =
        deposit.id.toLowerCase().includes(normalizedQuery) ||
        deposit.transactionId.toLowerCase().includes(normalizedQuery) ||
        deposit.userDisplay.toLowerCase().includes(normalizedQuery) ||
        deposit.userId.toLowerCase().includes(normalizedQuery);

      const matchesStatus = filterStatus === "all" || normalizeStatus(deposit.status) === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [deposits, searchQuery, filterStatus]);

  const totalCompleted = deposits.filter(d => normalizeStatus(d.status) === "completed").reduce((sum, d) => sum + d.amount, 0);

  const pendingCount = deposits.filter(d => normalizeStatus(d.status) === "pending").length;
  const processingCount = deposits.filter(d => normalizeStatus(d.status) === "processing").length;
  const completedCount = deposits.filter(d => normalizeStatus(d.status) === "completed").length;
  const failedCount = deposits.filter(d => normalizeStatus(d.status) === "failed").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Lịch sử nạp tiền toàn hệ thống</h1>
          <p className="text-gray-600">Tổng số: {totalDeposits} giao dịch</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl">
          <p className="text-sm opacity-90">Tổng nạp thành công (trang hiện tại)</p>
          <p className="text-2xl font-bold">{totalCompleted.toLocaleString("vi-VN")}đ</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => {
              setReloadTick(value => value + 1);
            }}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-red-200 hover:bg-red-100 transition text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Chờ xử lý</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{processingCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Hoàn thành</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Thất bại</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{failedCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm giao dịch..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value as DepositStatusFilter);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã GD</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Loại</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã tham chiếu</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-gray-500">
                    Đang tải lịch sử nạp tiền...
                  </td>
                </tr>
              ) : filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 px-6 text-center text-gray-500">
                    Không có giao dịch nạp tiền nào
                  </td>
                </tr>
              ) : (
                filteredDeposits.map(deposit => (
                  <tr key={deposit.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-[#FF2E63]">{deposit.id}</td>

                    <td className="py-4 px-6 text-gray-700">
                      <p className="font-medium">{deposit.userDisplay}</p>
                      <p className="text-xs text-gray-500">{deposit.userId}</p>
                    </td>

                    <td className="py-4 px-6 font-bold text-green-600 text-lg">{deposit.amount.toLocaleString("vi-VN")}đ</td>

                    <td className="py-4 px-6">
                      <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {getMethodText(deposit.method)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-gray-600 font-mono text-sm">{deposit.transactionId}</td>

                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deposit.status)}`}>
                        {getStatusText(deposit.status)}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-600">
                      <p>{formatDateTime(deposit.requestDate)}</p>
                      {deposit.completedDate && <p className="text-xs text-green-600">{formatDateTime(deposit.completedDate)}</p>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">
              Hiển thị {filteredDeposits.length} / {deposits.length} giao dịch trên trang
            </p>
            <p className="text-xs text-gray-500">
              Trang {currentPage} / {totalPages} - Tổng toàn hệ thống: {totalDeposits} giao dịch
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button className="px-4 py-2 bg-[#FF2E63] text-white rounded-lg shadow-md shadow-pink-500/20">{currentPage}</button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages || loading}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
