import { useState } from 'react';
import { Search, Filter, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';

export function DepositsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const deposits = [
    {
      id: '#DEP12345',
      user: 'Nguyễn Văn A',
      userId: 'U001',
      amount: 500000,
      method: 'MoMo',
      status: 'completed',
      transactionId: 'MOMO123456',
      requestDate: '03/02/2024 14:30',
      completedDate: '03/02/2024 14:32'
    },
    {
      id: '#DEP12344',
      user: 'Trần Thị B',
      userId: 'U002',
      amount: 1000000,
      method: 'Chuyển khoản',
      status: 'pending',
      transactionId: 'BANK789012',
      requestDate: '03/02/2024 15:20',
      completedDate: null
    },
    {
      id: '#DEP12343',
      user: 'Lê Văn C',
      userId: 'U003',
      amount: 200000,
      method: 'Thẻ ATM',
      status: 'processing',
      transactionId: 'CARD345678',
      requestDate: '03/02/2024 16:10',
      completedDate: null
    },
    {
      id: '#DEP12342',
      user: 'Phạm Thị D',
      userId: 'U004',
      amount: 300000,
      method: 'ZaloPay',
      status: 'completed',
      transactionId: 'ZALO901234',
      requestDate: '03/02/2024 10:15',
      completedDate: '03/02/2024 10:17'
    },
    {
      id: '#DEP12341',
      user: 'Hoàng Văn E',
      userId: 'U005',
      amount: 150000,
      method: 'MoMo',
      status: 'failed',
      transactionId: 'MOMO567890',
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
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'failed': return 'Thất bại';
      default: return status;
    }
  };

  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deposit.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deposit.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || deposit.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCompleted = deposits.filter(d => d.status === 'completed').reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý nạp tiền</h1>
          <p className="text-gray-600">Tổng số: {deposits.length} giao dịch</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl">
          <p className="text-sm opacity-90">Tổng nạp thành công</p>
          <p className="text-2xl font-bold">{totalCompleted.toLocaleString('vi-VN')}đ</p>
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
            {deposits.filter(d => d.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {deposits.filter(d => d.status === 'processing').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Hoàn thành</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {deposits.filter(d => d.status === 'completed').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Thất bại</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {deposits.filter(d => d.status === 'failed').length}
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
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
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

      {/* Deposits Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã GD</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Phương thức</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã giao dịch</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#0D4D8B]">{deposit.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-800">{deposit.user}</p>
                    <p className="text-sm text-gray-500">{deposit.userId}</p>
                  </td>
                  <td className="py-4 px-6 font-bold text-green-600 text-lg">
                    {deposit.amount.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {deposit.method}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 font-mono text-sm">{deposit.transactionId}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(deposit.status)}`}>
                      {getStatusText(deposit.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <p>{deposit.requestDate}</p>
                    {deposit.completedDate && (
                      <p className="text-xs text-green-600">{deposit.completedDate}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Xem chi tiết">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      {deposit.status === 'pending' && (
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
            Hiển thị {filteredDeposits.length} / {deposits.length} giao dịch
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
    </div>
  );
}
