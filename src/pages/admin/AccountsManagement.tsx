import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react';
import { AccountDetailModal } from '../../components/admin/AccountDetailModal';
import { RejectModal } from '../../components/admin/RejectModal';

export function AccountsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGame, setFilterGame] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);
  const [showRejectModal, setShowRejectModal] = useState<any>(null);

  const accounts = [
    {
      id: 'ACC001',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Kim Cương III',
      price: 2500000,
      seller: 'gameplayer123',
      status: 'active',
      views: 523,
      favorites: 45,
      createdDate: '10/01/2024',
      verified: true
    },
    {
      id: 'ACC002',
      gameName: 'PUBG Mobile',
      rank: 'Chinh Phục',
      price: 1800000,
      seller: 'progamer456',
      status: 'sold',
      views: 892,
      favorites: 78,
      createdDate: '12/01/2024',
      verified: true
    },
    {
      id: 'ACC003',
      gameName: 'Genshin Impact',
      rank: 'AR 58',
      price: 3200000,
      seller: 'vipgamer',
      status: 'pending',
      views: 234,
      favorites: 23,
      createdDate: '01/02/2024',
      verified: false
    },
    {
      id: 'ACC004',
      gameName: 'Minecraft',
      rank: 'Premium',
      price: 450000,
      seller: 'newbie789',
      status: 'active',
      views: 156,
      favorites: 12,
      createdDate: '15/01/2024',
      verified: true
    },
    {
      id: 'ACC005',
      gameName: 'FIFA Online 4',
      rank: 'VIP 15',
      price: 1500000,
      seller: 'gameplayer123',
      status: 'rejected',
      views: 89,
      favorites: 5,
      createdDate: '20/01/2024',
      verified: false,
      rejectedReason: 'Giá không hợp lý'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'sold': return 'bg-blue-100 text-blue-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Đang bán';
      case 'pending': return 'Chờ duyệt';
      case 'sold': return 'Đã bán';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.rank.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         account.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = filterGame === 'all' || account.gameName === filterGame;
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    return matchesSearch && matchesGame && matchesStatus;
  });

  const handleApprove = (account: any) => {
    alert(`Đã phê duyệt tài khoản ${account.id}`);
    setShowDetailModal(null);
  };

  const handleReject = (account: any, reason: string) => {
    alert(`Đã từ chối tài khoản ${account.id}\nLý do: ${reason}`);
    setShowRejectModal(null);
    setShowDetailModal(null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý tài khoản game</h1>
          <p className="text-gray-600">Tổng số: {accounts.length} tài khoản</p>
        </div>
        <button className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition">
          + Thêm tài khoản
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm tài khoản..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>

          {/* Game Filter */}
          <div>
            <select
              value={filterGame}
              onChange={(e) => setFilterGame(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
            >
              <option value="all">Tất cả game</option>
              <option value="Liên Minh Huyền Thoại">Liên Minh Huyền Thoại</option>
              <option value="PUBG Mobile">PUBG Mobile</option>
              <option value="Genshin Impact">Genshin Impact</option>
              <option value="Minecraft">Minecraft</option>
              <option value="FIFA Online 4">FIFA Online 4</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang bán</option>
              <option value="pending">Chờ duyệt</option>
              <option value="sold">Đã bán</option>
              <option value="rejected">Từ chối</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Game</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Rank</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Giá</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người bán</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Lượt xem</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Yêu thích</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#0D4D8B]">{account.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{account.gameName}</p>
                      {account.verified && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-[#0D4D8B]">{account.rank}</td>
                  <td className="py-4 px-6 font-semibold text-red-600">
                    {account.price.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6 text-gray-600">{account.seller}</td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {account.views}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {account.favorites}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(account.status)}`}>
                      {getStatusText(account.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{account.createdDate}</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => setShowDetailModal(account)}
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
            Hiển thị {filteredAccounts.length} / {accounts.length} tài khoản
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#0D4D8B] text-white rounded-lg">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && (
        <AccountDetailModal
          account={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onApprove={() => handleApprove(showDetailModal)}
          onReject={() => {
            setShowDetailModal(null);
            setShowRejectModal(showDetailModal);
          }}
          onEdit={() => alert('Chức năng chỉnh sửa')}
        />
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <RejectModal
          title="Từ chối tài khoản"
          itemId={showRejectModal.id}
          onClose={() => setShowRejectModal(null)}
          onConfirm={(reason) => handleReject(showRejectModal, reason)}
        />
      )}
    </div>
  );
}
