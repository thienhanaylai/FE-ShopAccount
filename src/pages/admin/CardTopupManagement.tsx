import { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export function CardTopupManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const topups = [
    {
      id: '#CARD12345',
      user: 'Nguyễn Văn A',
      userId: 'U001',
      cardType: 'Viettel',
      cardValue: 100000,
      receiveAmount: 80000,
      discount: 20,
      serial: '1234567890123',
      code: '***********678',
      status: 'completed',
      requestDate: '03/02/2024 14:30',
      completedDate: '03/02/2024 14:45'
    },
    {
      id: '#CARD12344',
      user: 'Trần Thị B',
      userId: 'U002',
      cardType: 'Vinaphone',
      cardValue: 50000,
      receiveAmount: 40000,
      discount: 20,
      serial: '9876543210987',
      code: '***********234',
      status: 'pending',
      requestDate: '03/02/2024 15:20',
      completedDate: null
    },
    {
      id: '#CARD12343',
      user: 'Lê Văn C',
      userId: 'U003',
      cardType: 'Mobifone',
      cardValue: 200000,
      receiveAmount: 160000,
      discount: 20,
      serial: '5555666677778',
      code: '***********890',
      status: 'processing',
      requestDate: '03/02/2024 16:10',
      completedDate: null
    },
    {
      id: '#CARD12342',
      user: 'Phạm Thị D',
      userId: 'U004',
      cardType: 'Viettel',
      cardValue: 300000,
      receiveAmount: 240000,
      discount: 20,
      serial: '1111222233334',
      code: '***********456',
      status: 'completed',
      requestDate: '03/02/2024 10:15',
      completedDate: '03/02/2024 10:30'
    },
    {
      id: '#CARD12341',
      user: 'Hoàng Văn E',
      userId: 'U005',
      cardType: 'Vietnamobile',
      cardValue: 100000,
      receiveAmount: 75000,
      discount: 25,
      serial: '9999888877776',
      code: '***********123',
      status: 'failed',
      requestDate: '02/02/2024 20:30',
      completedDate: null
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Thành công';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  const filteredTopups = topups.filter(topup => {
    const matchesSearch = topup.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topup.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         topup.serial.includes(searchQuery);
    const matchesStatus = filterStatus === 'all' || topup.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCompleted = topups.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.receiveAmount, 0);
  const totalProfit = topups.filter(t => t.status === 'completed').reduce((sum, t) => sum + (t.cardValue - t.receiveAmount), 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý nạp thẻ cào</h1>
          <p className="text-gray-600">Tổng số: {topups.length} giao dịch</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl">
            <p className="text-sm opacity-90">Tổng đã nạp</p>
            <p className="text-2xl font-bold">{totalCompleted.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white px-6 py-4 rounded-xl shadow-lg shadow-pink-500/20">
            <p className="text-sm opacity-90">Lợi nhuận</p>
            <p className="text-2xl font-bold">{totalProfit.toLocaleString('vi-VN')}đ</p>
          </div>
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
            {topups.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {topups.filter(t => t.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Thành công</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {topups.filter(t => t.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Thất bại</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {topups.filter(t => t.status === 'failed').length}
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
                placeholder="Tìm kiếm giao dịch..."
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
              <option value="completed">Thành công</option>
              <option value="failed">Thất bại</option>
            </select>
          </div>
        </div>
      </div>

      {/* Topups Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã GD</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Loại thẻ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mệnh giá</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Chiết khấu</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Số tiền nhận</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Serial</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã thẻ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTopups.map((topup) => (
                <tr key={topup.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#FF2E63]">{topup.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-800">{topup.user}</p>
                    <p className="text-sm text-gray-500">{topup.userId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {topup.cardType}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    {topup.cardValue.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 text-red-600 font-semibold">
                    {topup.discount}%
                  </td>
                  <td className="py-4 px-6 font-bold text-green-600 text-lg">
                    {topup.receiveAmount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 font-mono text-sm text-gray-600">{topup.serial}</td>
                  <td className="py-4 px-6 font-mono text-sm text-gray-600">{topup.code}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(topup.status)}`}>
                      {getStatusText(topup.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <p>{topup.requestDate}</p>
                    {topup.completedDate && (
                      <p className="text-xs text-green-600">{topup.completedDate}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Xem chi tiết">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      {topup.status === 'pending' && (
                        <>
                          <button className="p-2 hover:bg-green-50 rounded-lg transition" title="Xác nhận">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                          <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Từ chối">
                            <XCircle className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredTopups.length} / {topups.length} giao dịch
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#FF2E63] text-white rounded-lg shadow-md shadow-pink-500/20">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
