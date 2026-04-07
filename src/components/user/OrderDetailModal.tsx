import { X, Copy, Download, CheckCircle, Eye, EyeOff, Gamepad2, User, Lock, Mail, Shield } from "lucide-react";
import { useState } from "react";

interface UserOrder {
  id: string;
  gameAccountId: string;
  game: string;
  rank?: string;
  date: string;
  amount: number;
  status: string;
}

interface PurchaseGameAccount {
  id: string;
  category?: {
    id: string;
    name: string;
  };
  username?: string;
  password?: string;
  email?: string;
  rank?: string;
  level?: number;
  description?: string;
}

interface PurchaseItem {
  id: string;
  gameAccountId: string;
  price: number;
  status: string;
  createdAt: string;
  gameAccount?: PurchaseGameAccount;
}

interface OrderDetailModalProps {
  order: UserOrder;
  purchase: PurchaseItem | null;
  onClose: () => void;
}

export function OrderDetailModal({ order, purchase, onClose }: OrderDetailModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const accountInfo = {
    username: purchase?.gameAccount?.username || "Chưa có dữ liệu",
    password: purchase?.gameAccount?.password || "Chưa có dữ liệu",
    email: purchase?.gameAccount?.email || "Chưa có dữ liệu",
    rank: purchase?.gameAccount?.rank || order.rank || "Chưa cập nhật",
    level: purchase?.gameAccount?.level ? String(purchase.gameAccount.level) : "Chưa cập nhật",
    description: purchase?.gameAccount?.description || "Không có mô tả",
    gameName: purchase?.gameAccount?.category?.name || order.game,
    accountId: purchase?.gameAccount?.id || order.gameAccountId,
  };

  const hasRealCredentials = Boolean(
    purchase?.gameAccount?.username || purchase?.gameAccount?.password || purchase?.gameAccount?.email,
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const downloadAccountInfo = () => {
    const info = `
=== THÔNG TIN TÀI KHOẢN ===
Đơn hàng: ${order.id}
Game: ${order.game}
Rank: ${accountInfo.rank}

--- ĐĂNG NHẬP GAME ---
Account ID: ${accountInfo.accountId}
Username: ${accountInfo.username}
Password: ${accountInfo.password}

--- EMAIL LIÊN KẾT ---
Email: ${accountInfo.email}

--- CHI TIẾT ---
Rank: ${accountInfo.rank}
Level: ${accountInfo.level}
Mô tả: ${accountInfo.description}

Ngày mua: ${order.date}
Giá: ${order.amount.toLocaleString("vi-VN")}đ

⚠️ LƯU Ý QUAN TRỌNG:
- Đổi mật khẩu ngay sau khi nhận
- Đổi email liên kết để bảo mật
- Không chia sẻ thông tin cho người khác
- Liên hệ hỗ trợ nếu có vấn đề

Shopaccgiare.tech - Uy tín #1 Việt Nam
    `.trim();

    const blob = new Blob([info], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `TaiKhoan_${order.id}_${order.game.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold mb-1">Thông tin tài khoản</h2>
            <p className="text-blue-100">
              {order.id} - {accountInfo.gameName}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!hasRealCredentials && (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
              Chưa tìm thấy đầy đủ thông tin tài khoản trong danh sách đã mua. Vui lòng tải lại trang để đồng bộ dữ liệu mới nhất.
            </div>
          )}

          {/* Success Notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-900 mb-1">Đơn hàng đã hoàn thành!</p>
              <p className="text-sm text-green-700">
                Bạn đã mua tài khoản này vào ngày {order.date}. Vui lòng đổi mật khẩu ngay để bảo mật.
              </p>
            </div>
          </div>

          {/* Game Account Login */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#0D4D8B] rounded-lg flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Thông tin đăng nhập Game</h3>
                <p className="text-sm text-gray-600">Sử dụng để đăng nhập vào game</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username / ID
                  </label>
                  <button
                    onClick={() => copyToClipboard(accountInfo.username, "username")}
                    disabled={!hasRealCredentials}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-[#0B4275] rounded-lg hover:bg-blue-200 transition"
                  >
                    {copiedField === "username" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Đã copy
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono font-semibold text-lg text-gray-800 bg-gray-50 px-4 py-2 rounded">
                  {accountInfo.username}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          Ẩn
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          Hiện
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(accountInfo.password, "password")}
                      disabled={!hasRealCredentials}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-[#0B4275] rounded-lg hover:bg-blue-200 transition"
                    >
                      {copiedField === "password" ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Đã copy
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <p className="font-mono font-semibold text-lg text-gray-800 bg-gray-50 px-4 py-2 rounded">
                  {showPassword ? accountInfo.password : "••••••••••"}
                </p>
              </div>
            </div>
          </div>

          {/* Email Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email liên kết tài khoản</h3>
                <p className="text-sm text-gray-600">Dùng để khôi phục tài khoản</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <button
                    onClick={() => copyToClipboard(accountInfo.email, "email")}
                    disabled={!hasRealCredentials}
                    className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    {copiedField === "email" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Đã copy
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono font-semibold text-gray-800 bg-gray-50 px-4 py-2 rounded">{accountInfo.email}</p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Chi tiết tài khoản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600">ID tài khoản</p>
                <p className="font-semibold text-gray-800 break-all">{accountInfo.accountId}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600">Level</p>
                <p className="font-semibold text-gray-800">{accountInfo.level}</p>
              </div>
              <div className="bg-white p-3 rounded-lg">
                <p className="text-sm text-gray-600">Rank</p>
                <p className="font-semibold text-gray-800">{accountInfo.rank}</p>
              </div>
              <div className="bg-white p-3 rounded-lg col-span-2">
                <p className="text-sm text-gray-600">Mô tả</p>
                <p className="font-semibold text-gray-800">{accountInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Thông tin đơn hàng</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold text-[#0D4D8B]">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày mua:</span>
                <span className="font-semibold text-gray-800">{order.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-bold text-red-600 text-lg">{order.amount.toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Lưu ý quan trọng</h3>
                <ul className="text-sm text-yellow-800 space-y-2">
                  <li>✓ Đổi mật khẩu game và email ngay lập tức</li>
                  <li>✓ Bật xác thực 2 yếu tố nếu có</li>
                  <li>✓ Không chia sẻ thông tin với người khác</li>
                  <li>✓ Liên kết email/SĐT của bạn vào tài khoản</li>
                  <li>✓ Không vi phạm điều khoản của game</li>
                  <li>✓ Bảo hành 30 ngày kể từ ngày mua</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={downloadAccountInfo}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Tải xuống thông tin
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
