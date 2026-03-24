import { X, Save } from 'lucide-react';
import { useState } from 'react';
import { BalanceAdjustDirection, User, UserStatus } from '../../services/types';

export interface BalanceAdjustmentPayload {
  amount: number;
  direction: BalanceAdjustDirection;
  reason: string;
}

interface EditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (userData: Partial<User>, balanceAdjustment?: BalanceAdjustmentPayload) => void;
}

export function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<User>>({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone || '',
    status: user?.status || UserStatus.ACTIVE,
    verified: user?.verified || false
  });
  const [balanceAdjustment, setBalanceAdjustment] = useState({
    amount: '',
    direction: BalanceAdjustDirection.CREDIT,
    reason: ''
  });
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    const amount = parseInt(balanceAdjustment.amount, 10);
    const hasAdjustment = isEdit && Number.isFinite(amount) && amount > 0;

    if (hasAdjustment && !balanceAdjustment.reason.trim()) {
      setSubmitError('Vui lòng nhập lý do điều chỉnh số dư.');
      return;
    }

    onSave(
      formData,
      hasAdjustment
        ? {
            amount,
            direction: balanceAdjustment.direction,
            reason: balanceAdjustment.reason.trim(),
          }
        : undefined,
    );
  };

  const isEdit = !!user;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Thông tin cơ bản</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>

          {/* Account Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Cài đặt tài khoản</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              >
                <option value={UserStatus.ACTIVE}>Hoạt động</option>
                <option value={UserStatus.BLOCKED}>Đã khóa</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="verified"
                checked={formData.verified}
                onChange={handleChange}
                className="w-4 h-4 text-[#FF2E63] rounded focus:ring-[#FF2E63]"
              />
              <label className="text-sm text-gray-700">Đã xác thực email</label>
            </div>
          </div>

          {isEdit && (
            <div className="space-y-4 border border-pink-100 bg-pink-50/40 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800">Điều chỉnh số dư ví (tùy chọn)</h3>
              <p className="text-sm text-gray-600">
                Theo chuẩn API, số dư được cập nhật qua endpoint ví admin, không đi qua cập nhật người dùng.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền điều chỉnh (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={balanceAdjustment.amount}
                    onChange={(e) => setBalanceAdjustment((prev) => ({ ...prev, amount: e.target.value }))}
                    placeholder="Ví dụ: 100000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hướng điều chỉnh
                  </label>
                  <select
                    value={balanceAdjustment.direction}
                    onChange={(e) =>
                      setBalanceAdjustment((prev) => ({
                        ...prev,
                        direction: e.target.value as BalanceAdjustDirection,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
                  >
                    <option value={BalanceAdjustDirection.CREDIT}>Cộng tiền (CREDIT)</option>
                    <option value={BalanceAdjustDirection.DEBIT}>Trừ tiền (DEBIT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lý do điều chỉnh</label>
                <input
                  type="text"
                  value={balanceAdjustment.reason}
                  onChange={(e) => setBalanceAdjustment((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Ví dụ: Điều chỉnh theo yêu cầu hỗ trợ"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
                />
              </div>
            </div>
          )}

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white py-3 rounded-lg font-semibold hover:from-[#252A34] hover:to-[#d9254f] transition flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
            >
              <Save className="w-5 h-5" />
              {isEdit ? 'Lưu thay đổi' : 'Thêm người dùng'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
