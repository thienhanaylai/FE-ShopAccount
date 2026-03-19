import { useState } from 'react';
import { Search, MessageSquare, CheckCircle, Clock, Eye } from 'lucide-react';
import { SupportDetailModal } from '../../components/admin/SupportDetailModal';

export function SupportManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState<any>(null);

  const tickets = [
    {
      id: '#SUP12345',
      user: 'Nguyễn Văn A',
      userId: 'U001',
      subject: 'Không nhận được tài khoản sau khi mua',
      category: 'account',
      priority: 'high',
      status: 'open',
      messages: 3,
      createdDate: '03/02/2024 14:30',
      lastUpdate: '03/02/2024 15:45'
    },
    {
      id: '#SUP12344',
      user: 'Trần Thị B',
      userId: 'U002',
      subject: 'Hỏi về phương thức thanh toán',
      category: 'payment',
      priority: 'low',
      status: 'resolved',
      messages: 5,
      createdDate: '03/02/2024 10:20',
      lastUpdate: '03/02/2024 14:30'
    },
    {
      id: '#SUP12343',
      user: 'Lê Văn C',
      userId: 'U003',
      subject: 'Tài khoản bị khóa không rõ lý do',
      category: 'security',
      priority: 'high',
      status: 'in_progress',
      messages: 8,
      createdDate: '02/02/2024 16:10',
      lastUpdate: '03/02/2024 09:15'
    },
    {
      id: '#SUP12342',
      user: 'Phạm Thị D',
      userId: 'U004',
      subject: 'Làm sao để đăng bán tài khoản?',
      category: 'general',
      priority: 'low',
      status: 'resolved',
      messages: 2,
      createdDate: '01/02/2024 11:30',
      lastUpdate: '01/02/2024 13:20'
    },
    {
      id: '#SUP12341',
      user: 'Hoàng Văn E',
      userId: 'U005',
      subject: 'Lỗi khi nạp tiền qua MoMo',
      category: 'technical',
      priority: 'high',
      status: 'open',
      messages: 6,
      createdDate: '03/02/2024 08:45',
      lastUpdate: '03/02/2024 16:20'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Mới';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-orange-100 text-orange-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Cao';
      case 'medium': return 'Trung bình';
      case 'low': return 'Thấp';
      default: return priority;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'account': return 'Tài khoản';
      case 'payment': return 'Thanh toán';
      case 'security': return 'Bảo mật';
      case 'technical': return 'Kỹ thuật';
      case 'general': return 'Chung';
      default: return category;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleResolve = (ticket: any) => {
    alert(`Đã đánh dấu ticket ${ticket.id} là đã giải quyết`);
    setShowDetailModal(null);
  };

  const handleReply = (ticket: any, message: string) => {
    alert(`Đã gửi tin nhắn: ${message}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý hỗ trợ</h1>
          <p className="text-gray-600">Tổng số: {tickets.length} yêu cầu</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Mới</p>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tickets.filter(t => t.status === 'open').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đang xử lý</p>
            <MessageSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tickets.filter(t => t.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Đã giải quyết</p>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tickets.filter(t => t.status === 'resolved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-600">Ưu tiên cao</p>
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {tickets.filter(t => t.priority === 'high').length}
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
                placeholder="Tìm kiếm yêu cầu hỗ trợ..."
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
              <option value="open">Mới</option>
              <option value="in_progress">Đang xử lý</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="closed">Đã đóng</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Mã</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tiêu đề</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Danh mục</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ưu tiên</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Tin nhắn</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Cập nhật</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#0D4D8B]">{ticket.id}</td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-800">{ticket.user}</p>
                    <p className="text-sm text-gray-500">{ticket.userId}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-800 max-w-xs truncate">{ticket.subject}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {getCategoryText(ticket.category)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(ticket.priority)}`}>
                      {getPriorityText(ticket.priority)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {ticket.messages}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                      {getStatusText(ticket.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{ticket.createdDate}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">{ticket.lastUpdate}</td>
                  <td className="py-4 px-6">
                    <button 
                      onClick={() => setShowDetailModal(ticket)}
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
            Hiển thị {filteredTickets.length} / {tickets.length} yêu cầu
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

      {/* Detail Modal */}
      {showDetailModal && (
        <SupportDetailModal
          ticket={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onResolve={() => handleResolve(showDetailModal)}
          onReply={(message) => handleReply(showDetailModal, message)}
        />
      )}
    </div>
  );
}
