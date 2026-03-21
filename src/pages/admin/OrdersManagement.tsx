import { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, Clock } from 'lucide-react';
import { OrderDetailModal } from '../../components/admin/OrderDetailModal';

export interface OrderData {
  id: string;
  buyer: string;
  seller: string;
  accountId: string;
  gameName: string;
  rank: string;
  price: number;
  fee: number;
  sellerReceive: number;
  status: string;
  paymentMethod: string;
  orderDate: string;
  completedDate: string | null;
}

export function OrdersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState<OrderData | null>(null);

  const orders = [
    {
      id: '#ORD12345',
      buyer: 'Nguyễn Văn A',
      seller: 'gameplayer123',
      accountId: 'ACC001',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Kim Cương III',
      price: 2500000,
      fee: 125000,
      sellerReceive: 2375000,
      status: 'completed',
      paymentMethod: 'MoMo',
      orderDate: '03/02/2024 14:30',
      completedDate: '03/02/2024 14:35'
    },
    {
      id: '#ORD12344',
      buyer: 'Trần Thị B',
      seller: 'progamer456',
      accountId: 'ACC002',
      gameName: 'PUBG Mobile',
      rank: 'Chinh Phục',
      price: 1800000,
      fee: 90000,
      sellerReceive: 1710000,
      status: 'pending',
      paymentMethod: 'Chuyển khoản',
      orderDate: '03/02/2024 15:20',
      completedDate: null
    },
    {
      id: '#ORD12343',
      buyer: 'Lê Văn C',
      seller: 'vipgamer',
      accountId: 'ACC003',
      gameName: 'Genshin Impact',
      rank: 'AR 58',
      price: 3200000,
      fee: 160000,
      sellerReceive: 3040000,
      status: 'processing',
      paymentMethod: 'Thẻ ATM',
      orderDate: '03/02/2024 16:10',
      completedDate: null
    },
    {
      id: '#ORD12342',
      buyer: 'Phạm Thị D',
      seller: 'gameplayer123',
      accountId: 'ACC004',
      gameName: 'Minecraft',
      rank: 'Premium',
      price: 450000,
      fee: 22500,
      sellerReceive: 427500,
      status: 'completed',
      paymentMethod: 'ZaloPay',
      orderDate: '03/02/2024 10:15',
      completedDate: '03/02/2024 10:20'
    },
    {
      id: '#ORD12341',
      buyer: 'Hoàng Văn E',
      seller: 'progamer456',
      accountId: 'ACC005',
      gameName: 'FIFA Online 4',
      rank: 'VIP 15',
      price: 1500000,
      fee: 75000,
      sellerReceive: 1425000,
      status: 'cancelled',
      paymentMethod: 'MoMo',
      orderDate: '02/02/2024 20:30',
      completedDate: null
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.gameName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.fee, 0);

  const handleComplete = (order: OrderData) => {
    alert(`Đã xác nhận đơn hàng ${order.id}`);
    setShowDetailModal(null);
  };

  const handleCancel = (order: OrderData) => {
    alert(`Đã hủy đơn hàng ${order.id}`);
    setShowDetailModal(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#252A34] mb-2">Quản lý đơn hàng</h1>
          <p className="text-gray-600">Tổng số: {orders.length} đơn hàng</p>
        </div>
        <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white px-6 py-4 rounded-xl shadow-lg shadow-pink-500/20">
          <p className="text-sm opacity-90">Tổng hoa hồng</p>
          <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Chờ xử lý</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Hoàn thành</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đã hủy</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {orders.filter(o => o.status === 'cancelled').length}
          </p>
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
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm đơn hàng..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
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

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã đơn</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người mua</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người bán</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tài khoản game</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Giá</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Hoa hồng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người bán nhận</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#FF2E63]">{order.id}</td>
                  <td className="py-4 px-6 text-gray-800">{order.buyer}</td>
                  <td className="py-4 px-6 text-gray-600">{order.seller}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-800">{order.gameName}</p>
                    <p className="text-sm text-[#08D9D6]">{order.rank}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    {order.price.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 font-semibold text-green-600">
                    {order.fee.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 font-semibold text-blue-600">
                    {order.sellerReceive.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <p>{order.orderDate}</p>
                    {order.completedDate && (
                      <p className="text-xs text-green-600">{order.completedDate}</p>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredOrders.length} / {orders.length} đơn hàng
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#FF2E63] text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <OrderDetailModal
          order={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onComplete={() => handleComplete(showDetailModal)}
          onCancel={() => handleCancel(showDetailModal)}
        />
      )}
    </div>
  );
}
