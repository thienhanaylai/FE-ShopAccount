import { useEffect, useMemo, useState } from "react";
import { axiosService } from "../services/axios";
import { Link } from "react-router";
import { Mail, Wallet, ShoppingBag, Edit, Shield, LogOut, ArrowRight, Eye, ArrowLeftRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { OrderDetailModal } from "../components/user/OrderDetailModal";

interface OrderItem {
  id: string;
  game: string;
  rank: string;
  amount: number;
  date: string;
  status: string;
}

interface TransactionItem {
  id: string;
  type: string;
  amount: number;
  method: string;
  date: string;
  status: string;
}

interface TransferItem {
  id: string;
  recipient: string;
  recipientName: string;
  amount: number;
  status: string;
  date: string;
  note: string;
}

const formatCurrency = (value?: number) => `${(value || 0).toLocaleString("vi-VN")}đ`;

const formatDate = (value?: string | Date) => {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("vi-VN");
};

const formatDateTime = (value?: string | Date) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN");
};

const getOrderStatusUi = (status?: string) => {
  switch (status) {
    case "COMPLETED":
      return { label: "Hoàn thành", className: "bg-green-100 text-green-700" };
    case "PAID":
      return { label: "Đã thanh toán", className: "bg-blue-100 text-blue-700" };
    case "PENDING":
      return {
        label: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "CANCELLED":
      return { label: "Đã hủy", className: "bg-red-100 text-red-700" };
    default:
      return {
        label: status || "Không rõ",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

const getTransactionStatusUi = (status?: string) => {
  switch (status) {
    case "SUCCESS":
      return { label: "Thành công", className: "bg-green-100 text-green-700" };
    case "PENDING":
      return {
        label: "Đang xử lý",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "FAILED":
      return { label: "Thất bại", className: "bg-red-100 text-red-700" };
    case "REFUNDED":
      return { label: "Hoàn tiền", className: "bg-purple-100 text-purple-700" };
    default:
      return {
        label: status || "Không rõ",
        className: "bg-gray-100 text-gray-700",
      };
  }
};

export function UserProfilePage() {
  const { user, logout, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [showOrderDetail, setShowOrderDetail] = useState<OrderItem | null>(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [balance, setBalance] = useState<number>(user?.balance || 0);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [phone, setPhone] = useState((user as any)?.phone || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Vui lòng đăng nhập để xem trang này</p>
          <Link to="/login" className="text-[#0D4D8B] hover:underline mt-2 inline-block">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const loadProfileData = async () => {
      setLoading(true);
      setPageError("");

      try {
        const [balanceRes, purchasesRes, historyRes, transferRes] = await Promise.all([
          axiosService.get("/wallets/me/balance"),
          axiosService.get("/account-trades/me/purchases", {
            params: { page: 1, limit: 20 },
          }),
          axiosService.get("/wallets/me/history", {
            params: { page: 1, limit: 20 },
          }),
          axiosService.get("/wallets/me/history", {
            params: { page: 1, limit: 20, type: "TRANSFER" as const },
          }),
        ]);

        const balanceData = balanceRes.data as any;
        setBalance(Number(balanceData?.balance || 0));

        const purchasesData = (purchasesRes.data as any)?.data || [];
        const mappedOrders: OrderItem[] = purchasesData.map((item: any) => ({
          id: item.id,
          game: item.gameAccount?.category?.name || "Tài khoản game",
          rank: item.gameAccount?.rank || (item.gameAccount?.level ? `Level ${item.gameAccount.level}` : "Chưa cập nhật"),
          amount: Number(item.price || 0),
          date: item.createdAt,
          status: item.status,
        }));
        setOrders(mappedOrders);

        const historyData = (historyRes.data as any)?.data || [];
        const mappedTransactions: TransactionItem[] = historyData.map((item: any) => ({
          id: item.id,
          type: item.method,
          amount: Number(item.price || 0),
          method: item.method,
          date: item.createdAt,
          status: item.status,
        }));
        setTransactions(mappedTransactions);
      } catch (error) {
        console.error(error);
        setPageError("Không thể tải dữ liệu trang cá nhân");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const totalSpent = useMemo(() => {
    return orders.filter(item => ["PAID", "COMPLETED"].includes(item.status)).reduce((sum, item) => sum + item.amount, 0);
  }, [orders]);

  const stats = [
    {
      label: "Số dư hiện tại",
      value: formatCurrency(balance),
      icon: Wallet,
      color: "bg-green-500",
    },
    {
      label: "Tổng đơn hàng",
      value: String(orders.length),
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Tổng chi tiêu",
      value: formatCurrency(totalSpent),
      icon: Wallet,
      color: "bg-blue-500",
    },
  ];

  const handleUpdateProfile = async () => {
    try {
      setSavingProfile(true);
      await axiosService.patch(`/users/${user.id}`, { phone });
      alert("Cập nhật thông tin thành công");
    } catch (error) {
      console.error(error);
      alert("Cập nhật thông tin thất bại");
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl text-[#0D4D8B] font-bold">{user.username.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user.username}
                  {isAdmin && <span className="ml-3 px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">👑 Admin</span>}
                </h1>
                <p className="text-blue-100 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>
                <p className="text-blue-100 text-sm mt-1">ID: {user.id}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/deposit"
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                <Wallet className="w-5 h-5" />
                Nạp tiền
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-6 py-3 bg-white hover:bg-gray-100 text-[#0D4D8B] rounded-lg font-semibold transition flex items-center justify-center gap-2"
                >
                  <Shield className="w-5 h-5" />
                  Vào trang Admin
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {pageError && <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{pageError}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{loading ? "Đang tải..." : stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                ["overview", "Tổng quan"],
                ["orders", "Đơn hàng"],
                ["transactions", "Giao dịch"],
                ["settings", "Cài đặt"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                    activeTab === key ? "border-b-2 border-[#0D4D8B] text-[#0D4D8B]" : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin cá nhân</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Tên đăng nhập</p>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Email</p>
                      <p className="font-semibold text-gray-800">{user.email}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Vai trò</p>
                      <p className="font-semibold text-gray-800">{isAdmin ? "👑 Quản trị viên" : "👤 Người dùng"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ngày tham gia</p>
                      <p className="font-semibold text-gray-800">{formatDate((user as any).createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
                  <div className="space-y-3">
                    {orders.slice(0, 5).length === 0 ? (
                      <div className="text-gray-500">Chưa có đơn hàng nào</div>
                    ) : (
                      orders.slice(0, 5).map(order => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                        >
                          <div>
                            <p className="font-medium text-[#0D4D8B]">{order.id}</p>
                            <p className="text-sm text-gray-600">{order.game}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">{formatCurrency(order.amount)}</p>
                              <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                            </div>
                            <button
                              onClick={() => setShowOrderDetail(order)}
                              className="p-2 hover:bg-blue-100 rounded-lg transition"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5 text-[#0D4D8B]" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-[#0D4D8B] hover:underline text-sm mt-3 inline-block"
                  >
                    Xem tất cả đơn hàng →
                  </button>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử đơn hàng</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã đơn</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Game</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ngày mua</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                            Chưa có đơn hàng nào
                          </td>
                        </tr>
                      ) : (
                        orders.map(order => {
                          const statusUi = getOrderStatusUi(order.status);
                          return (
                            <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium text-[#0D4D8B]">{order.id}</td>
                              <td className="py-3 px-4">{order.game}</td>
                              <td className="py-3 px-4 font-semibold">{formatCurrency(order.amount)}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusUi.className}`}>
                                  {statusUi.label}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button
                                  onClick={() => setShowOrderDetail(order)}
                                  className="flex items-center gap-2 px-4 py-2 bg-[#0D4D8B] text-white rounded-lg hover:bg-[#0B4275] transition text-sm font-semibold"
                                >
                                  <Eye className="w-4 h-4" />
                                  Xem chi tiết
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Lịch sử giao dịch</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã GD</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Loại</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Số tiền</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phương thức</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ngày</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-6 px-4 text-center text-gray-500">
                            Chưa có giao dịch nào
                          </td>
                        </tr>
                      ) : (
                        transactions.map(tx => {
                          const isPositive = tx.method === "TOP_UP";
                          const statusUi = getTransactionStatusUi(tx.status);

                          return (
                            <tr key={tx.id} className="border-t border-gray-200">
                              <td className="py-3 px-4 font-medium text-[#0D4D8B]">{tx.id}</td>
                              <td className="py-3 px-4">
                                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                                  {isPositive ? "+ " : "- "}
                                  {tx.type}
                                </span>
                              </td>
                              <td className={`py-3 px-4 font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                {isPositive ? "+" : "-"}
                                {formatCurrency(tx.amount)}
                              </td>
                              <td className="py-3 px-4 text-sm">{tx.method}</td>
                              <td className="py-3 px-4 text-sm text-gray-600">{formatDateTime(tx.date)}</td>
                              <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusUi.className}`}>
                                  {statusUi.label}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin tài khoản</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="Chưa cập nhật"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                      />
                    </div>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={savingProfile}
                      className="px-6 py-3 bg-[#0D4D8B] text-white rounded-lg font-semibold hover:bg-[#0B4275] transition flex items-center gap-2 disabled:opacity-50"
                    >
                      <Edit className="w-5 h-5" />
                      {savingProfile ? "Đang cập nhật..." : "Cập nhật thông tin"}
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Khu vực nguy hiểm</h2>
                  <button
                    onClick={logout}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                  >
                    <LogOut className="w-5 h-5" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showOrderDetail && <OrderDetailModal order={showOrderDetail} onClose={() => setShowOrderDetail(null)} />}
    </div>
  );
}
