import { useState, useEffect } from 'react';
import { Search, Filter, Edit, Trash2, Eye, Plus, RefreshCw, Users, UserCheck, UserX } from 'lucide-react';
import { UserDetailModal } from '../../components/admin/UserDetailModal';
import { BalanceAdjustmentPayload, EditUserModal } from '../../components/admin/EditUserModal';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';
import { userService } from '../../services/user.service';
import { User, UserStatus, CreateUserRequest, UpdateUserRequest } from '../../services/types';
import ErrorHandler from '../../utils/errorHandler';
import { walletService } from '../../services/wallet.service';

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState<Partial<User> | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filterStatus]); // searchQuery checked manually on btn click

  const fetchUsers = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await userService.getList({
        page: currentPage,
        limit: 10,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? (filterStatus as UserStatus) : undefined
      });
      setUsers(response.data);
      setTotalUsers(response.pagination.total);
      setTotalPages(response.pagination.totalPages);
    } catch (error) {
      console.error('Lỗi khi tải danh sách người dùng:', error);

      setUsers([]);
      setTotalUsers(0);
      setTotalPages(1);

      if (ErrorHandler.isAuthError(error)) {
        setErrorMessage('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản admin.');
      } else if (ErrorHandler.isForbiddenError(error)) {
        setErrorMessage('Tài khoản hiện tại không có quyền ADMIN để xem danh sách người dùng.');
      } else {
        setErrorMessage(ErrorHandler.getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchClick = () => {
    setCurrentPage(1);
    fetchUsers();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'bg-green-100 text-green-700';
      case UserStatus.BLOCKED: return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case UserStatus.ACTIVE: return 'Hoạt động';
      case UserStatus.BLOCKED: return 'Đã khóa';
      default: return status;
    }
  };

  const runUserAction = async (
    action: () => Promise<unknown>,
    successMessage: string,
    closeModal?: () => void,
  ) => {
    try {
      await action();
      closeModal?.();
      alert(successMessage);
      fetchUsers();
    } catch (error) {
      alert(ErrorHandler.getErrorMessage(error));
    }
  };

  const handleSaveUser = async (userData: Partial<User>, balanceAdjustment?: BalanceAdjustmentPayload) => {
    if (showEditModal && showEditModal.id) {
      const updatePayload: UpdateUserRequest = {
        username: userData.username,
        email: userData.email,
        phone: userData.phone,
        status: userData.status,
      };

      try {
        await userService.update(showEditModal.id!, updatePayload);

        if (balanceAdjustment && balanceAdjustment.amount > 0) {
          await walletService.adminAdjust({
            userId: showEditModal.id!,
            amount: balanceAdjustment.amount,
            direction: balanceAdjustment.direction,
            reason: balanceAdjustment.reason,
          });
        }

        setShowEditModal(null);
        alert(
          balanceAdjustment
            ? 'Đã cập nhật người dùng và điều chỉnh số dư ví!'
            : 'Đã cập nhật người dùng!',
        );
        fetchUsers();
      } catch (error) {
        alert(ErrorHandler.getErrorMessage(error));
      }
      return;
    }

    await runUserAction(
      () => userService.create(userData as CreateUserRequest),
      'Đã thêm người dùng mới!',
      () => setShowEditModal(null),
    );
  };

  const handleDeleteUser = async (user: User) => {
    await runUserAction(
      () => userService.delete(user.id),
      `Đã xóa người dùng ${user.username}`,
      () => setShowDeleteModal(null),
    );
  };

  const handleBan = async (user: User) => {
    await runUserAction(
      () => userService.adminUpdate(user.id, { status: UserStatus.BLOCKED }),
      `Đã khóa tài khoản ${user.username}`,
      () => setShowDetailModal(null),
    );
  };

  const handleUnban = async (user: User) => {
    await runUserAction(
      () => userService.adminUpdate(user.id, { status: UserStatus.ACTIVE }),
      `Đã mở khóa tài khoản ${user.username}`,
      () => setShowDetailModal(null),
    );
  };

  const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE).length;
  const blockedUsers = users.filter((user) => user.status === UserStatus.BLOCKED).length;
  const hasFilter = searchQuery.trim().length > 0 || filterStatus !== 'all';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#252A34] mb-2">Quản lý người dùng</h1>
          <p className="text-gray-600">Tổng số: {totalUsers} người dùng</p>
        </div>
        <button 
          onClick={() => setShowEditModal({})}
          className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#252A34] hover:to-[#d9254f] transition flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <Plus className="w-5 h-5" />
          Thêm người dùng
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Người dùng trên trang</p>
              <p className="text-2xl font-bold text-[#252A34]">{users.length}</p>
            </div>
            <Users className="w-6 h-6 text-[#FF2E63]" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đang hoạt động</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
            <UserCheck className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Đã khóa</p>
              <p className="text-2xl font-bold text-red-600">{blockedUsers}</p>
            </div>
            <UserX className="w-6 h-6 text-red-600" />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
          <p className="text-sm font-medium">{errorMessage}</p>
          <button
            onClick={fetchUsers}
            className="shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-red-200 hover:bg-red-100 transition text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
             <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm theo tên, email..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchClick(); }}
                />
              </div>
              <button 
                 onClick={handleSearchClick}
                 className="px-4 py-3 bg-[#FF2E63] text-white rounded-lg hover:bg-[#d9254f] transition shadow-md shadow-pink-500/20 font-medium"
              >
                  Tìm
              </button>
            </div>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
              }}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63] appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={UserStatus.ACTIVE}>Hoạt động</option>
              <option value={UserStatus.BLOCKED}>Đã khóa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {isLoading ? (
             <div className="px-6 py-5 space-y-3">
               {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 bg-gray-100 animate-pulse rounded-lg" />
               ))}
             </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">ID</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Người dùng</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Liên hệ</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Số dư</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Ngày tham gia</th>
                  <th className="py-4 px-6 text-sm font-semibold text-gray-600">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6 font-medium text-[#FF2E63] text-sm" title={user.id}>
                    {user.id.substring(0,8)}...
                  </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center shrink-0 border border-pink-100">
                        <span className="text-[#FF2E63] font-semibold">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                        <p className="font-semibold text-gray-800">{user.username}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </td>
                    <td className="py-4 px-6 font-semibold text-green-600">
                      {(user.balance || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                        {getStatusText(user.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDetailModal(user)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition"
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
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center gap-2">
                        <p className="font-medium">Không tìm thấy người dùng nào.</p>
                        {hasFilter && (
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setFilterStatus('all');
                              setCurrentPage(1);
                              fetchUsers();
                            }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 transition text-sm"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && users.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Hiển thị {users.length} người dùng · Trang {currentPage}/{totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Trước
              </button>
              <span className="px-4 py-2 bg-[#FF2E63] text-white rounded-lg font-medium">{currentPage}</span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
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
          user={(showEditModal as User | null)?.id ? (showEditModal as User) : null}
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
