import { X, User, Gamepad2, DollarSign, Calendar, CheckCircle, XCircle } from 'lucide-react';

export type AdminOrderDetail = {
  id: string;
  userId: string;
  gameAccountId: string;
  price?: number | null;
  status: 'success' | 'failed';
  createdAt: string;
  updatedAt: string;
};

interface OrderDetailModalProps {
  order: AdminOrderDetail;
  onClose: () => void;
}

function formatPrice(value: number | null | undefined): string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 'N/A';
  }

  return `${value.toLocaleString('vi-VN')}đ`;
}

export function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const isSuccess = order.status === 'success';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#252A34] to-[#FF2E63] p-6 text-white shadow-lg">
          <div>
            <h2 className="mb-1 text-2xl font-bold">Chi tiết đơn hàng</h2>
            <p className="opacity-90">{order.id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="rounded-xl bg-gray-50 p-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 shadow-lg">
              {isSuccess ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
              <span className={`font-semibold ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
                {isSuccess ? 'Success' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-gray-700">
                <User className="h-4 w-4" />
                <p className="font-semibold">User ID</p>
              </div>
              <p className="break-all font-medium text-gray-900">{order.userId}</p>
            </div>

            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-gray-700">
                <Gamepad2 className="h-4 w-4" />
                <p className="font-semibold">Game Account ID</p>
              </div>
              <p className="break-all font-medium text-gray-900">{order.gameAccountId}</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <div className="mb-2 flex items-center gap-2 text-gray-700">
              <DollarSign className="h-4 w-4" />
              <p className="font-semibold">Giá</p>
            </div>
            <p className="text-lg font-bold text-gray-900">{formatPrice(order.price)}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <p className="font-semibold">Created At</p>
              </div>
              <p className="font-medium text-gray-900">{order.createdAt}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
              <div className="mb-2 flex items-center gap-2 text-gray-700">
                <Calendar className="h-4 w-4" />
                <p className="font-semibold">Updated At</p>
              </div>
              <p className="font-medium text-gray-900">{order.updatedAt}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
