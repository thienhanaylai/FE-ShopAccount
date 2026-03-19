import { useState } from 'react';
import { Search, CheckCircle, XCircle, Eye, Upload } from 'lucide-react';
import { RejectModal } from '../../components/admin/RejectModal';
import { AccountDetailModal } from '../../components/admin/AccountDetailModal';

export function SellRequestsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showRejectModal, setShowRejectModal] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);

  const requests = [
    {
      id: '#REQ12345',
      user: 'Nguyễn Văn A',
      userId: 'U001',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Kim Cương III',
      price: 2500000,
      description: 'Full tướng, nhiều skin đẹp',
      images: 5,
      status: 'pending',
      submittedDate: '03/02/2024 14:30',
      reviewedDate: null
    },
    {
      id: '#REQ12344',
      user: 'Trần Thị B',
      userId: 'U002',
      gameName: 'PUBG Mobile',
      rank: 'Chinh Phục',
      price: 1800000,
      description: 'UC nhiều, skin hiếm',
      images: 4,
      status: 'approved',
      submittedDate: '02/02/2024 10:20',
      reviewedDate: '02/02/2024 15:30'
    },
    {
      id: '#REQ12343',
      user: 'Lê Văn C',
      userId: 'U003',
      gameName: 'Genshin Impact',
      rank: 'AR 45',
      price: 1200000,
      description: '12 nhân vật 5 sao',
      images: 6,
      status: 'pending',
      submittedDate: '03/02/2024 09:15',
      reviewedDate: null
    },
    {
      id: '#REQ12342',
      user: 'Phạm Thị D',
      userId: 'U004',
      gameName: 'FIFA Online 4',
      rank: 'VIP 10',
      price: 800000,
      description: 'BP thấp, không đúng mô tả',
      images: 2,
      status: 'rejected',
      rejectedReason: 'Thông tin không đầy đủ',
      submittedDate: '01/02/2024 16:45',
      reviewedDate: '02/02/2024 09:20'
    },
    {
      id: '#REQ12341',
      user: 'Hoàng Văn E',
      userId: 'U005',
      gameName: 'Minecraft',
      rank: 'Premium + Cape',
      price: 680000,
      description: 'Full quyền, có cape',
      images: 3,
      status: 'approved',
      submittedDate: '01/02/2024 11:30',
      reviewedDate: '01/02/2024 14:20'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'approved': return 'bg-green-100 text-green-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.gameName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (request: any) => {
    alert(`Đã phê duyệt yêu cầu ${request.id}`);
    // Reload data
  };

  const handleReject = (request: any, reason: string) => {
    alert(`Đã từ chối yêu cầu ${request.id}\nLý do: ${reason}`);
    setShowRejectModal(null);
    // Reload data
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý yêu cầu bán</h1>
          <p className="text-gray-600">Tổng số: {requests.length} yêu cầu</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Chờ duyệt</p>
            <Upload className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {requests.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đã duyệt</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {requests.filter(r => r.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Từ chối</p>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {requests.filter(r => r.status === 'rejected').length}
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
                placeholder="Tìm kiếm yêu cầu..."
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
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người gửi</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Game</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Giá đề xuất</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mô tả</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Hình ảnh</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày gửi</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#0D4D8B]">{request.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-800">{request.user}</p>
                    <p className="text-sm text-gray-500">{request.userId}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">{request.gameName}</td>
                  <td className="py-4 px-6 text-[#0D4D8B]">{request.rank}</td>
                  <td className="py-4 px-6 font-semibold text-red-600">
                    {request.price.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600 max-w-xs truncate">{request.description}</p>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {request.images} ảnh
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                      {getStatusText(request.status)}
                    </span>
                    {request.status === 'rejected' && request.rejectedReason && (
                      <p className="text-xs text-red-600 mt-1">Lý do: {request.rejectedReason}</p>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <p>{request.submittedDate}</p>
                    {request.reviewedDate && (
                      <p className="text-xs text-gray-500">{request.reviewedDate}</p>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowDetailModal(request)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(request)}
                            className="p-2 hover:bg-green-50 rounded-lg transition" 
                            title="Phê duyệt"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </button>
                          <button 
                            onClick={() => setShowRejectModal(request)}
                            className="p-2 hover:bg-red-50 rounded-lg transition" 
                            title="Từ chối"
                          >
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
            Hiển thị {filteredRequests.length} / {requests.length} yêu cầu
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

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          title="Từ chối yêu cầu bán tài khoản"
          itemId={showRejectModal.id}
          onClose={() => setShowRejectModal(null)}
          onConfirm={(reason) => handleReject(showRejectModal, reason)}
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && (
        <AccountDetailModal
          account={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onApprove={() => {
            handleApprove(showDetailModal);
            setShowDetailModal(null);
          }}
          onReject={() => {
            setShowDetailModal(null);
            setShowRejectModal(showDetailModal);
          }}
        />
      )}
    </div>
  );
}
