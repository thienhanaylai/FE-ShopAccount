import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { OrderDetailModal } from "../../components/admin/OrderDetailModal";
import { orderService, Order, OrderStatus, OrderListFilters } from "../../services";

type UiOrderStatus = "success" | "failed";

type UiOrder = {
  id: string;
  userId: string;
  gameAccountId: string;
  price: number | null;
  status: UiOrderStatus;
  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<UiOrderStatus, string> = {
  success: "Success",
  failed: "Failed",
};

function mapApiStatusToUi(status: OrderStatus): UiOrderStatus {
  switch (status) {
    case OrderStatus.PAID:
    case OrderStatus.COMPLETED:
      return "success";
    case OrderStatus.PENDING:
    case OrderStatus.CANCELLED:
    default:
      return "failed";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

function normalizePrice(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function formatPrice(value: number | null): string {
  if (value === null) {
    return "N/A";
  }

  return `${value.toLocaleString("vi-VN")}đ`;
}

function toUiOrder(order: Order): UiOrder {
  const status = mapApiStatusToUi(order.status);
  const price = normalizePrice((order as Partial<Order> & { price?: unknown }).price);

  return {
    id: order.id,
    userId: order.user?.username || order.user?.email || order.userId,
    gameAccountId: order.gameAccountId,
    price,
    status,
    createdAt: formatDate(order.createdAt),
    updatedAt: formatDate(order.updatedAt),
  };
}

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | UiOrderStatus>("all");
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [showDetailModal, setShowDetailModal] = useState<UiOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const filters: OrderListFilters = {
        page: 1,
        limit: 100,
      };

      const response = await orderService.getList(filters);
      setOrders(response.data.map(toUiOrder));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Không thể tải danh sách đơn hàng";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: UiOrderStatus) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: UiOrderStatus) => {
    return STATUS_LABELS[status];
  };

  const filteredOrders = useMemo(
    () =>
      orders.filter(order => {
        const matchesSearch =
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.gameAccountId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        return matchesSearch && matchesStatus;
      }),
    [orders, searchQuery, filterStatus],
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Tổng số: {orders.length} đơn hàng</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{errorMessage}</div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Success</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{orders.filter(o => o.status === "success").length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Failed</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{orders.filter(o => o.status === "failed").length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as "all" | UiOrderStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã đơn</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">User ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Game Account ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Giá</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Created At</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Updated At</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-10 px-6 text-center text-gray-500">
                    Đang tải dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 px-6 text-center text-gray-500">
                    Không có đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-[#0D4D8B]">{order.id}</td>
                    <td className="py-4 px-6 text-gray-800">{order.userId}</td>
                    <td className="py-4 px-6 text-gray-600">{order.gameAccountId}</td>
                    <td className="py-4 px-6 font-semibold text-gray-800">{formatPrice(order.price)}</td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">{order.createdAt}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">{order.updatedAt}</td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setShowDetailModal(order)}
                        className="rounded-lg p-2 transition hover:bg-gray-100"
                        title="Xem chi tiết"
                      >
                        <Eye className="h-5 w-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Trước</button>
            <button className="px-4 py-2 bg-[#0D4D8B] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Sau</button>
          </div>
        </div>
      </div>

      {showDetailModal && <OrderDetailModal order={showDetailModal} onClose={() => setShowDetailModal(null)} />}
    </div>
  );
}
