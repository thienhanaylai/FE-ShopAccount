import { X, XCircle } from 'lucide-react';
import { useState } from 'react';

interface RejectModalProps {
  title: string;
  itemId: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectModal({ title, itemId, onClose, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const commonReasons = [
    'Thông tin không đầy đủ',
    'Hình ảnh không rõ ràng',
    'Giá không hợp lý',
    'Nghi ngờ gian lận',
    'Vi phạm chính sách',
    'Tài khoản không đúng mô tả',
    'Thiếu thông tin liên hệ',
    'Khác'
  ];

  const handleConfirm = () => {
    const finalReason = selectedReason === 'Khác' ? reason : selectedReason;
    if (!finalReason.trim()) {
      alert('Vui lòng nhập lý do từ chối!');
      return;
    }
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <XCircle className="w-6 h-6" />
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-red-100 text-sm">{itemId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Common Reasons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Chọn lý do từ chối
            </label>
            <div className="grid grid-cols-2 gap-3">
              {commonReasons.map((reasonOption) => (
                <label
                  key={reasonOption}
                  className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedReason === reasonOption
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200 hover:border-red-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reasonOption}
                    checked={selectedReason === reasonOption}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-red-600"
                  />
                  <span className="text-sm text-gray-700">{reasonOption}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Reason */}
          {selectedReason === 'Khác' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập lý do cụ thể <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Nhập lý do từ chối chi tiết..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
            </div>
          )}

          {/* Preview */}
          {selectedReason && selectedReason !== 'Khác' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm font-medium text-red-900 mb-1">Lý do sẽ được gửi:</p>
              <p className="text-sm text-red-700">{selectedReason}</p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Người dùng sẽ nhận được thông báo về lý do từ chối. Vui lòng đảm bảo lý do rõ ràng và chính xác.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              disabled={!selectedReason || (selectedReason === 'Khác' && !reason.trim())}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xác nhận từ chối
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
