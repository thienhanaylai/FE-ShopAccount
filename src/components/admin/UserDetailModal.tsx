import { useCallback, useEffect, useMemo, useState } from 'react';
import { X, Mail, Calendar, Wallet, ShoppingBag, CheckCircle, Ban, Shield, AlertTriangle } from 'lucide-react';
import {
  Order,
  OrderStatus,
  Transaction,
  TransactionMethod,
  TransactionStatus,
  User,
  UserRole,
  UserStatus,
} from '../../services/types';
import { orderService } from '../../services/order.service';
import { transactionService } from '../../services/transaction.service';
import ErrorHandler from '../../utils/errorHandler';

interface UserDetailModalProps {
  user: User;
  onClose: () => void;
  onBan?: () => void;
  onUnban?: () => void;
}

const ORDER_STATUS_TEXT: Record<OrderStatus, string> = {
  [OrderStatus.PAID]: 'Đã thanh toán',
  [OrderStatus.COMPLETED]: 'Hoàn tất',
  [OrderStatus.CANCELLED]: 'Đã hủy',
  [OrderStatus.PENDING]: 'Chờ xử lý',
};

const TRANSACTION_STATUS_TEXT: Record<TransactionStatus, string> = {
  [TransactionStatus.SUCCESS]: 'Thành công',
  [TransactionStatus.FAILED]: 'Thất bại',
  [TransactionStatus.REFUNDED]: 'Hoàn tiền',
  [TransactionStatus.PENDING]: 'Đang xử lý',
};

const USER_STATUS_META: Partial<Record<UserStatus, { text: string; className: string }>> = {
  [UserStatus.ACTIVE]: { text: 'Hoạt động', className: 'text-green-600' },
  [UserStatus.BLOCKED]: { text: 'Đã khóa', className: 'text-red-600' },
};

const DEFAULT_USER_STATUS_META = { text: 'Chờ xác thực', className: 'text-yellow-600' };

export function UserDetailModal({ user, onClose, onBan, onUnban }: UserDetailModalProps) {
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<Transaction[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [pendingModerationAction, setPendingModerationAction] = useState<'ban' | 'unban' | null>(null);

  const statusMeta = USER_STATUS_META[user.status] || DEFAULT_USER_STATUS_META;

  const fetchUserActivity = useCallback(async () => {
    setIsLoadingActivity(true);
    setActivityError(null);

    try {
      const [ordersResponse, depositsResponse] = await Promise.all([
        orderService.getList({ page: 1, limit: 5, userId: user.id }),
        transactionService.getList({
          page: 1,
          limit: 5,
          userId: user.id,
          method: TransactionMethod.TOP_UP,
        }),
      ]);

      setRecentOrders(
        [...ordersResponse.data].sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        ),
      );

      setRecentDeposits(
        [...depositsResponse.data].sort(
          (first, second) =>
            new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
        ),
      );
    } catch (error) {
      setActivityError(ErrorHandler.getErrorMessage(error));
      setRecentOrders([]);
      setRecentDeposits([]);
    } finally {
      setIsLoadingActivity(false);
    }
  }, [user.id]);

  useEffect(() => {
    void fetchUserActivity();
  }, [fetchUserActivity]);

  const totalSpent = useMemo(() => {
    if (recentOrders.length === 0) {
      return user.totalSpent || 0;
    }

    return recentOrders
      .filter((order) => order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED)
      .reduce((sum, order) => sum + order.price, 0);
  }, [recentOrders, user.totalSpent]);

  const totalOrders = recentOrders.length > 0 ? recentOrders.length : user.orders || 0;
  const joinedDate = user.joinDate || new Date(user.createdAt || '').toLocaleDateString();
  const isProtectedAdmin = user.role === UserRole.ADMIN;
  const canBan = !isProtectedAdmin && user.status === UserStatus.ACTIVE;
  const canUnban = !isProtectedAdmin && user.status === UserStatus.BLOCKED;

  const handleBanClick = () => {
    if (onBan) {
      setPendingModerationAction('ban');
    }
  };

  const handleUnbanClick = () => {
    if (onUnban) {
      setPendingModerationAction('unban');
    }
  };

  const handleCloseModerationConfirm = () => {
    setPendingModerationAction(null);
  };

  const handleConfirmModeration = () => {
    if (pendingModerationAction === 'ban') {
      onBan?.();
    }

    if (pendingModerationAction === 'unban') {
      onUnban?.();
    }

    setPendingModerationAction(null);
  };

  const moderationConfirmTitle = pendingModerationAction === 'ban' ? 'Xác nhận khóa tài khoản' : 'Xác nhận mở khóa tài khoản';
  const moderationConfirmMessage = pendingModerationAction === 'ban'
    ? `Bạn có chắc muốn khóa tài khoản ${user.username}?`
    : `Bạn có chắc muốn mở khóa tài khoản ${user.username}?`;
  const moderationConfirmButtonClass = pendingModerationAction === 'ban'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-green-600 hover:bg-green-700 text-white';
  const moderationConfirmButtonText = pendingModerationAction === 'ban' ? 'Khóa tài khoản' : 'Mở khóa tài khoản';

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
                      {user.role === UserRole.ADMIN && <Shield className="w-5 h-5 text-purple-500" />}
                      {user.verified && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </p>
                    <p className={`text-sm ${statusMeta.className}`}>
                      {statusMeta.text}
                    </p>
                    <p className="text-xs text-gray-500">Role: {user.role === UserRole.ADMIN ? 'Admin' : 'User'}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Tham gia: {joinedDate}</span>
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
                      <p className="font-bold text-blue-600">{totalSpent.toLocaleString('vi-VN')}đ</p>
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
                      <p className="font-bold text-[#FF2E63]">{totalOrders}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {activityError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {activityError}
            </div>
          )}

          {/* Recent Orders */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Đơn hàng gần đây</h3>
            {isLoadingActivity ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="h-16 rounded-lg bg-white animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có đơn hàng gần đây.</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="font-medium text-[#FF2E63]">#{order.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{ORDER_STATUS_TEXT[order.status] || ORDER_STATUS_TEXT[OrderStatus.PENDING]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-800">{order.price.toLocaleString('vi-VN')}đ</p>
                      <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Deposits */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Nạp tiền gần đây</h3>
            {isLoadingActivity ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="h-16 rounded-lg bg-white animate-pulse border border-gray-100" />
                ))}
              </div>
            ) : recentDeposits.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có giao dịch nạp tiền.</p>
            ) : (
              <div className="space-y-3">
                {recentDeposits.map((deposit) => (
                  <div key={deposit.id} className="bg-white p-4 rounded-lg flex items-center justify-between border border-gray-100">
                    <div>
                      <p className="font-medium text-[#08D9D6]">#{deposit.id.slice(0, 8)}</p>
                      <p className="text-sm text-gray-600">{TRANSACTION_STATUS_TEXT[deposit.status] || TRANSACTION_STATUS_TEXT[TransactionStatus.PENDING]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{deposit.price.toLocaleString('vi-VN')}đ</p>
                      <p className="text-xs text-gray-500">{new Date(deposit.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {canBan ? (
              <button
                onClick={handleBanClick}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                <Ban className="w-5 h-5" />
                Khóa tài khoản
              </button>
            ) : canUnban ? (
              <button
                onClick={handleUnbanClick}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                <CheckCircle className="w-5 h-5" />
                Mở khóa tài khoản
              </button>
            ) : null}
            {isProtectedAdmin && (
              <div className="flex-1 bg-purple-50 text-purple-700 py-3 rounded-lg font-semibold text-center border border-purple-100">
                Tài khoản ADMIN được bảo vệ
              </div>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      {pendingModerationAction && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-5 rounded-t-2xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">{moderationConfirmTitle}</h3>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">{moderationConfirmMessage}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleConfirmModeration}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition ${moderationConfirmButtonClass}`}
                >
                  {moderationConfirmButtonText}
                </button>
                <button
                  onClick={handleCloseModerationConfirm}
                  className="flex-1 py-2.5 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
