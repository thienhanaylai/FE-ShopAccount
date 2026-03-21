import { X, Mail, Phone, Calendar, Wallet, ShoppingBag, CheckCircle, Ban } from 'lucide-react';
import { User, UserStatus } from '../../services/types';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onBan?: () => void;
  onUnban?: () => void;
}

export function UserDetailModal({ user, onClose, onBan, onUnban }: UserDetailModalProps) {
  const recentOrders = [
    { id: '#ORD12345', game: 'Liên Minh', amount: 2500000, date: '03/02/2024', status: 'completed' },
    { id: '#ORD12344', game: 'PUBG Mobile', amount: 1800000, date: '02/02/2024', status: 'completed' },
    { id: '#ORD12343', game: 'Genshin Impact', amount: 3200000, date: '01/02/2024', status: 'completed' },
  ];

  const recentDeposits = [
    { id: '#DEP12345', amount: 500000, method: 'MoMo', date: '03/02/2024', status: 'completed' },
    { id: '#DEP12344', amount: 1000000, method: 'Chuyển khoản', date: '02/02/2024', status: 'completed' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <div>
            <h2 className="text-2xl font-bold mb-1">Chi tiết người dùng</h2>
            <p className="text-gray-200 opacity-90">ID: {user.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin cá nhân</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center border border-pink-100">
                    <span className="text-2xl text-[#FF2E63] font-bold">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                      {user.username}
                      {user.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </p>
                    <p className={`text-sm ${
                      user.status === UserStatus.ACTIVE ? 'text-green-600' :
                      user.status === UserStatus.BLOCKED ? 'text-red-600' :
                      'text-yellow-600'
                    }`}>
                      {user.status === UserStatus.ACTIVE ? 'Hoạt động' :
                       user.status === UserStatus.BLOCKED ? 'Đã khóa' :
                       'Chờ xác thực'}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Tham gia: {user.joinDate || new Date(user.createdAt || '').toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thống kê</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số dư hiện tại</p>
                      <p className="font-bold text-green-600">{(user.balance || 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                      <p className="font-bold text-blue-600">{(user.totalSpent || 0).toLocaleString('vi-VN')}đ</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-[#FF2E63]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Số đơn hàng</p>
                      <p className="font-bold text-[#FF2E63]">{user.orders || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h3>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="font-medium text-[#FF2E63]">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.game}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{order.amount.toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-500">{order.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Deposits */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Nạp tiền gần đây</h3>
            <div className="space-y-3">
              {recentDeposits.map((deposit) => (
                <div key={deposit.id} className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="font-medium text-[#08D9D6]">{deposit.id}</p>
                    <p className="text-sm text-gray-600">{deposit.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{deposit.amount.toLocaleString('vi-VN')}đ</p>
                    <p className="text-xs text-gray-500">{deposit.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {user.status === UserStatus.ACTIVE ? (
              <button
                onClick={onBan}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <Ban className="w-5 h-5" />
                Khóa tài khoản
              </button>
            ) : user.status === UserStatus.BLOCKED ? (
              <button
                onClick={onUnban}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Mở khóa tài khoản
              </button>
            ) : null}
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
