import { useState } from 'react';
import { Link } from 'react-router';
import { Mail, Wallet, ShoppingBag, Edit, Shield, LogOut, ArrowRight, Eye, ArrowLeftRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { OrderDetailModal } from '../components/user/OrderDetailModal';

interface Order {
  id: string;
  game: string;
  rank: string;
  amount: number;
  date: string;
  status: string;
}

export function UserProfilePage() {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showOrderDetail, setShowOrderDetail] = useState<Order | null>(null);

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

  const recentOrders = [
    { 
      id: '#ORD12345', 
      game: 'Liên Minh Huyền Thoại', 
      rank: 'Kim Cương III',
      amount: 2500000, 
      date: '03/02/2024', 
      status: 'completed' 
    },
    { 
      id: '#ORD12344', 
      game: 'PUBG Mobile', 
      rank: 'Chinh Phục',
      amount: 1800000, 
      date: '02/02/2024', 
      status: 'completed' 
    },
    { 
      id: '#ORD12343', 
      game: 'Genshin Impact', 
      rank: 'AR 58',
      amount: 3200000, 
      date: '01/02/2024', 
      status: 'completed' 
    },
  ];

  const recentDeposits = [
    { id: '#DEP12345', amount: 500000, method: 'MoMo', date: '03/02/2024', status: 'completed' },
    { id: '#DEP12344', amount: 1000000, method: 'Chuyển khoản', date: '02/02/2024', status: 'completed' },
    { id: '#DEP12343', amount: 200000, method: 'Thẻ ATM', date: '01/02/2024', status: 'completed' },
  ];

  const recentTransfers = [
    { id: '#TRF001', recipient: 'user2@gameaccount.vn', recipientName: 'Nguyễn Văn B', amount: 500000, status: 'success', date: '03/02/2024 14:30', note: 'Chuyển tiền mua tài khoản' },
    { id: '#TRF002', recipient: 'user3@gameaccount.vn', recipientName: 'Trần Thị C', amount: 1200000, status: 'success', date: '02/02/2024 09:15', note: 'Hoàn tiền' },
    { id: '#TRF003', recipient: 'user4@gameaccount.vn', recipientName: 'Lê Văn D', amount: 300000, status: 'failed', date: '01/02/2024 16:45', note: 'Thanh toán' },
  ];

  const stats = [
    { label: 'Số dư hiện tại', value: `${user.balance.toLocaleString('vi-VN')}đ`, icon: Wallet, color: 'bg-green-500' },
    { label: 'Tổng đơn hàng', value: '12', icon: ShoppingBag, color: 'bg-blue-500' },
    { label: 'Tổng chi tiêu', value: '15,000,000đ', icon: Wallet, color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl text-[#0D4D8B] font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {user.username}
                  {isAdmin && (
                    <span className="ml-3 px-3 py-1 bg-yellow-500 text-white text-sm rounded-full">
                      👑 Admin
                    </span>
                  )}
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-[#0D4D8B] text-[#0D4D8B]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Tổng quan
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-[#0D4D8B] text-[#0D4D8B]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Đơn hàng
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'transactions'
                    ? 'border-b-2 border-[#0D4D8B] text-[#0D4D8B]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Giao dịch
              </button>
              <button
                onClick={() => setActiveTab('transfers')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'transfers'
                    ? 'border-b-2 border-[#0D4D8B] text-[#0D4D8B]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Chuyển tiền
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-6 py-4 font-semibold transition whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-[#0D4D8B] text-[#0D4D8B]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Cài đặt
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
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
                      <p className="font-semibold text-gray-800">
                        {isAdmin ? '👑 Quản trị viên' : '👤 Người dùng'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Ngày tham gia</p>
                      <p className="font-semibold text-gray-800">15/01/2024</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div>
                          <p className="font-medium text-[#0D4D8B]">{order.id}</p>
                          <p className="text-sm text-gray-600">{order.game}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">{order.amount.toLocaleString('vi-VN')}đ</p>
                            <p className="text-xs text-gray-500">{order.date}</p>
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
                    ))}
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-[#0D4D8B] hover:underline text-sm mt-3 inline-block"
                  >
                    Xem tất cả đơn hàng →
                  </button>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
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
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-t border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-[#0D4D8B]">{order.id}</td>
                          <td className="py-3 px-4">{order.game}</td>
                          <td className="py-3 px-4 font-semibold">{order.amount.toLocaleString('vi-VN')}đ</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Hoàn thành
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
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
                      {recentDeposits.map((deposit) => (
                        <tr key={deposit.id} className="border-t border-gray-200">
                          <td className="py-3 px-4 font-medium text-[#0D4D8B]">{deposit.id}</td>
                          <td className="py-3 px-4">
                            <span className="text-green-600">+ Nạp tiền</span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-green-600">
                            +{deposit.amount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 px-4 text-sm">{deposit.method}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{deposit.date}</td>
                          <td className="py-3 px-4">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                              Hoàn thành
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transfers Tab */}
            {activeTab === 'transfers' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Lịch sử chuyển tiền</h2>
                  <Link
                    to="/transfer"
                    className="px-4 py-2 bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-lg hover:from-[#0D4D8B] hover:to-[#E58B3D] transition font-semibold flex items-center gap-2"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Chuyển tiền mới
                  </Link>
                </div>
                
                {recentTransfers.length === 0 ? (
                  <div className="text-center py-12">
                    <ArrowLeftRight className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">Chưa có giao dịch chuyển tiền nào</p>
                    <Link
                      to="/transfer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1EA7FD] text-[#0D4D8B] rounded-lg hover:bg-[#158DD8] transition font-semibold"
                    >
                      <ArrowLeftRight className="w-5 h-5" />
                      Chuyển tiền ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentTransfers.map((transfer) => (
                      <div
                        key={transfer.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            transfer.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                          }`}>
                            <ArrowLeftRight className={`w-6 h-6 ${
                              transfer.status === 'success' ? 'text-green-600' : 'text-red-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{transfer.recipientName}</p>
                            <p className="text-sm text-gray-500">{transfer.recipient}</p>
                            {transfer.note && (
                              <p className="text-xs text-gray-400 mt-1">{transfer.note}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">{transfer.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${
                            transfer.status === 'success' ? 'text-red-600' : 'text-gray-400'
                          }`}>
                            -{transfer.amount.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{transfer.date}</p>
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                            transfer.status === 'success'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {transfer.status === 'success' ? 'Thành công' : 'Thất bại'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin tài khoản</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên đăng nhập
                      </label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        placeholder="Chưa cập nhật"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                      />
                    </div>
                    <button className="px-6 py-3 bg-[#0D4D8B] text-white rounded-lg font-semibold hover:bg-[#0B4275] transition flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Cập nhật thông tin
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Đổi mật khẩu</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu hiện tại
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu hiện tại"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Xác nhận mật khẩu mới
                      </label>
                      <input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                      />
                    </div>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                      Đổi mật khẩu
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

      {/* Order Detail Modal */}
      {showOrderDetail && (
        <OrderDetailModal
          order={showOrderDetail}
          onClose={() => setShowOrderDetail(null)}
        />
      )}
    </div>
  );
}