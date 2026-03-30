import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Eye, CheckCircle, XCircle, Clock } from "lucide-react";
import { OrderDetailModal } from "../../components/admin/OrderDetailModal";
import { axiosService } from "../../services/axios";

type ApiOrderStatus = "PENDING" | "PAID" | "CANCELLED" | "COMPLETED";
type UiOrderStatus = "pending" | "processing" | "completed" | "cancelled";

type ApiOrder = {
  id: string;
  userId: string;
  gameAccountId: string;
  price: number;
  status: ApiOrderStatus;
  createdAt: string;
  updatedAt: string;
};

type ApiUser = {
  id: string;
  username?: string;
  email?: string;
};

type ApiGameAccount = {
  id: string;
  username?: string;
  rank?: string | null;
  level?: number;
};

type UiOrder = {
  id: string;
  buyer: string;
  seller: string;
  accountId: string;
  gameName: string;
  rank: string;
  price: number;
  fee: number;
  sellerReceive: number;
  status: UiOrderStatus;
  paymentMethod: string;
  orderDate: string;
  completedDate: string | null;
};

const STATUS_LABELS: Record<UiOrderStatus, string> = {
  pending: "Chờ xử lý",
  processing: "Đang xử lý",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

function mapApiStatusToUi(status: ApiOrderStatus): UiOrderStatus {
  switch (status) {
    case "PAID":
      return "processing";
    case "COMPLETED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "PENDING":
    default:
      return "pending";
  }
}

function mapUiStatusToApi(status: UiOrderStatus): ApiOrderStatus {
  switch (status) {
    case "processing":
      return "PAID";
    case "completed":
      return "COMPLETED";
    case "cancelled":
      return "CANCELLED";
    case "pending":
    default:
      return "PENDING";
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

async function enrichOrder(order: ApiOrder): Promise<UiOrder> {
  const fee = Math.round(order.price * 0.05);
  const status = mapApiStatusToUi(order.status);

  const [userRes, accountRes] = await Promise.allSettled([
    axiosService.get(`/users/${order.userId}`),
    axiosService.get(`/game-accounts/${order.gameAccountId}`),
  ]);

  const userData: ApiUser | null =
    userRes.status === "fulfilled" ? (userRes.value.data as any) || null : null;

  const accountData: ApiGameAccount | null =
    accountRes.status === "fulfilled"
      ? (accountRes.value.data as any) || null
      : null;

  return {
    id: order.id,
    buyer: userData?.username || userData?.email || order.userId,
    seller: "N/A",
    accountId: order.gameAccountId,
    gameName: accountData?.username || "Tài khoản game",
    rank:
      accountData?.rank ||
      (accountData?.level ? `Level ${accountData.level}` : "Chưa có"),
    price: order.price,
    fee,
    sellerReceive: Math.max(order.price - fee, 0),
    status,
    paymentMethod: "Online",
    orderDate: formatDate(order.createdAt),
    completedDate: status === "completed" ? formatDate(order.updatedAt) : null,
  };
}

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | UiOrderStatus>(
    "all",
  );
  const [showDetailModal, setShowDetailModal] = useState<UiOrder | null>(null);
  const [orders, setOrders] = useState<UiOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params: Record<string, any> = {
        page: 1,
        limit: 100,
      };

      if (filterStatus !== "all") {
        params.status = mapUiStatusToApi(filterStatus);
      }

      const response = await axiosService.get("/orders", { params });
      const rawOrders: ApiOrder[] = ((response.data as any)?.data ||
        []) as ApiOrder[];

      const enrichedOrders = await Promise.all(rawOrders.map(enrichOrder));
      setOrders(enrichedOrders);
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Không thể tải danh sách đơn hàng",
      );
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status: UiOrderStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status: UiOrderStatus) => STATUS_LABELS[status];

  const filteredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          order.id.toLowerCase().includes(q) ||
          order.buyer.toLowerCase().includes(q) ||
          order.seller.toLowerCase().includes(q) ||
          order.gameName.toLowerCase().includes(q) ||
          order.accountId.toLowerCase().includes(q);

        const matchesStatus =
          filterStatus === "all" || order.status === filterStatus;

        return matchesSearch && matchesStatus;
      }),
    [orders, searchQuery, filterStatus],
  );

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((order) => order.status === "completed")
        .reduce((sum, order) => sum + order.fee, 0),
    [orders],
  );

  const handleComplete = async (order: UiOrder) => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      await axiosService.patch(`/orders/${order.id}`, {
        status: "COMPLETED",
      });
      setShowDetailModal(null);
      await fetchOrders();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
          `Không thể xác nhận đơn hàng ${order.id}`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = async (order: UiOrder) => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      await axiosService.patch(`/orders/${order.id}`, {
        status: "CANCELLED",
      });
      setShowDetailModal(null);
      await fetchOrders();
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || `Không thể hủy đơn hàng ${order.id}`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">Tổng số: {orders.length} đơn hàng</p>
        </div>
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white px-6 py-4 rounded-xl">
          <p className="text-sm opacity-90">Tổng hoa hồng</p>
          <p className="text-2xl font-bold">
            {totalRevenue.toLocaleString("vi-VN")}đ
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Chờ xử lý</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "processing").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Hoàn thành</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "completed").length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đã hủy</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter((o) => o.status === "cancelled").length}
          </p>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as "all" | UiOrderStatus)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Mã đơn
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Người mua
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Người bán
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Tài khoản game
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Giá
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Hoa hồng
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Người bán nhận
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Trạng thái
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Thời gian
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-10 px-6 text-center text-gray-500"
                  >
                    Đang tải dữ liệu đơn hàng...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
                    className="py-10 px-6 text-center text-gray-500"
                  >
                    Không có đơn hàng phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6 font-medium text-[#0D4D8B]">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 text-gray-800">{order.buyer}</td>
                    <td className="py-4 px-6 text-gray-600">{order.seller}</td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-gray-800">
                        {order.gameName}
                      </p>
                      <p className="text-sm text-[#0D4D8B]">{order.rank}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-800">
                      {order.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {order.fee.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6 font-semibold text-blue-600">
                      {order.sellerReceive.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status,
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <p>{order.orderDate}</p>
                      {order.completedDate && (
                        <p className="text-xs text-green-600">
                          {order.completedDate}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setShowDetailModal(order)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#0D4D8B] text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Sau
            </button>
          </div>
        </div>
      </div>

      {showDetailModal && (
        <OrderDetailModal
          order={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onComplete={() => handleComplete(showDetailModal)}
          onCancel={() => handleCancel(showDetailModal)}
        />
      )}

      {isUpdating && (
        <div className="fixed bottom-4 right-4 rounded-lg bg-[#0D4D8B] px-4 py-2 text-sm font-semibold text-white shadow-lg">
          Đang cập nhật đơn hàng...
        </div>
      )}
    </div>
  );
}
