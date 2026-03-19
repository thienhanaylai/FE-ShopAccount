import { useState } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus } from 'lucide-react';
import { UserDetailModal } from '../../components/admin/UserDetailModal';
import { EditUserModal } from '../../components/admin/EditUserModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showDetailModal, setShowDetailModal] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<any>(null);

  const [users, setUsers] = useState([
    { 
      id: 'U001', 
      username: 'gameplayer123', 
      email: 'player123@email.com', 
      phone: '0901234567',
      balance: 1500000,
      totalSpent: 15000000,
      orders: 12,
      status: 'active',
      verified: true,
      joinDate: '15/01/2024'
    },
    { 
      id: 'U002', 
      username: 'progamer456', 
      email: 'gamer456@email.com', 
      phone: '0907654321',
      balance: 2300000,
      totalSpent: 25000000,
      orders: 23,
      status: 'active',
      verified: true,
      joinDate: '20/01/2024'
    },
    { 
      id: 'U003', 
      username: 'newbie789', 
      email: 'newbie@email.com', 
      phone: '0903456789',
      balance: 50000,
      totalSpent: 500000,
      orders: 2,
      status: 'pending',
      verified: false,
      joinDate: '01/02/2024'
    },
    { 
      id: 'U004', 
      username: 'banned_user', 
      email: 'banned@email.com', 
      phone: '0909876543',
      balance: 0,
      totalSpent: 2000000,
      orders: 5,
      status: 'banned',
      verified: true,
      joinDate: '10/12/2023'
    },
    { 
      id: 'U005', 
      username: 'vipgamer', 
      email: 'vip@email.com', 
      phone: '0905555555',
      balance: 5000000,
      totalSpent: 50000000,
      orders: 45,
      status: 'active',
      verified: true,
      joinDate: '05/11/2023'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'banned': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'pending': return 'Chờ xác thực';
      case 'banned': return 'Đã khóa';
      default: return status;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSaveUser = (userData: any) => {
    if (showEditModal?.id) {
      // Edit existing user
      setUsers(prev =>
        prev.map(user => (user.id === showEditModal.id ? { ...user, ...userData } : user))
      );
      alert('Đã cập nhật người dùng!');
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: `U${(users.length + 1).toString().padStart(3, '0')}`,
        totalSpent: 0,
        orders: 0,
        joinDate: new Date().toLocaleDateString('vi-VN')
      };
      setUsers(prev => [...prev, newUser]);
      alert('Đã thêm người dùng mới!');
    }
    setShowEditModal(null);
  };

  const handleDeleteUser = (user: any) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
    setShowDeleteModal(null);
    alert(`Đã xóa người dùng ${user.username}`);
  };

  const handleBan = (user: any) => {
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: 'banned' } : u))
    );
    setShowDetailModal(null);
    alert(`Đã khóa tài khoản ${user.username}`);
  };

  const handleUnban = (user: any) => {
    setUsers(prev =>
      prev.map(u => (u.id === user.id ? { ...u, status: 'active' } : u))
    );
    setShowDetailModal(null);
    alert(`Đã mở khóa tài khoản ${user.username}`);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Tổng số: {users.length} người dùng</p>
        </div>
        <button 
          onClick={() => setShowEditModal({})}
          className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Thêm người dùng
        </button>
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
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ xác thực</option>
              <option value="banned">Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Liên hệ</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Số dư</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Ngày tham gia</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#0D4D8B]">{user.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-[#0D4D8B] font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-800">{user.username}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </td>
                  <td className="py-4 px-6 font-semibold text-green-600">
                    {user.balance.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowDetailModal(user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => setShowEditModal(user)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => setShowDeleteModal(user)}
                        className="p-2 hover:bg-red-100 rounded-lg transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
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
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Trước
            </button>
            <button className="px-4 py-2 bg-[#0D4D8B] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Sau
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && (
        <UserDetailModal
          user={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onBan={() => handleBan(showDetailModal)}
          onUnban={() => handleUnban(showDetailModal)}
        />
      )}

      {showEditModal && (
        <EditUserModal
          user={showEditModal.id ? showEditModal : null}
          onClose={() => setShowEditModal(null)}
          onSave={handleSaveUser}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa người dùng"
          message="Hành động này sẽ xóa vĩnh viễn người dùng và toàn bộ dữ liệu liên quan."
          itemName={showDeleteModal.username}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDeleteUser(showDeleteModal)}
        />
      )}
    </div>
  );
}
