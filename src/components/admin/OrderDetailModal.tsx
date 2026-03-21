import { X, User, Gamepad2, DollarSign, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import { OrderData } from '../../pages/admin/OrdersManagement';

interface OrderDetailModalProps {
  order: OrderData;
  onClose: () => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

export function OrderDetailModal({ order, onClose, onComplete, onCancel }: OrderDetailModalProps) {
  const timeline = [
    { status: 'Đơn hàng đã tạo', time: order.orderDate, completed: true },
    { status: 'Thanh toán thành công', time: order.orderDate, completed: order.status !== 'pending' },
    { status: 'Đang xử lý', time: order.orderDate, completed: order.status === 'completed' || order.status === 'processing' },
    { status: 'Hoàn thành', time: order.completedDate, completed: order.status === 'completed' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <div>
            <h2 className="text-2xl font-bold mb-1">Chi tiết đơn hàng</h2>
            <p className="text-gray-200 opacity-90">{order.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-6 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg mb-3">
              <span className={`w-3 h-3 rounded-full ${order.status === 'completed' ? 'bg-green-500' :
                  order.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    order.status === 'pending' ? 'bg-yellow-500' :
                      'bg-red-500'
                }`} />
              <span className="font-semibold text-gray-800">
                {order.status === 'completed' ? 'Đơn hàng đã hoàn thành' :
                  order.status === 'processing' ? 'Đang xử lý đơn hàng' :
                    order.status === 'pending' ? 'Chờ xử lý' :
                      'Đã hủy'}
              </span>
            </div>
          </div>

          {/* Customer & Seller Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 hover:border-[#08D9D6] transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-[#08D9D6]" />
                <h3 className="font-semibold text-gray-800">Người mua</h3>
              </div>
              <p className="text-lg font-semibold text-gray-800">{order.buyer}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-800">Người bán</h3>
              </div>
              <p className="text-lg font-semibold text-gray-800">{order.seller}</p>
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-5 h-5 text-[#FF2E63]" />
              <h3 className="font-semibold text-gray-800">Sản phẩm</h3>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-gray-800 text-lg">{order.gameName}</p>
                  <p className="text-[#FF2E63]">{order.rank}</p>
                </div>
                <p className="text-sm text-gray-500">ID: {order.accountId}</p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-gray-800">Chi tiết thanh toán</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Giá sản phẩm:</span>
                <span className="font-semibold text-gray-800">{order.price.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Hoa hồng (5%):</span>
                <span className="font-semibold text-orange-600">-{order.fee.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-800">Người bán nhận:</span>
                  <span className="font-bold text-green-600 text-lg">{order.sellerReceive.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#08D9D6]" />
                <span className="text-sm text-gray-700">
                  Phương thức: <span className="font-semibold">{order.paymentMethod}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-[#FF2E63]" />
              <h3 className="font-semibold text-gray-800">Tiến trình</h3>
            </div>
            <div className="space-y-4">
              {timeline.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                      {step.completed && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    {index < timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${step.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <p className={`font-semibold ${step.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                      {step.status}
                    </p>
                    {step.time && (
                      <p className="text-sm text-gray-500">{step.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {order.status === 'pending' && (
              <>
                <button
                  onClick={onComplete}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  Xác nhận đơn hàng
                </button>
                <button
                  onClick={onCancel}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Hủy đơn
                </button>
              </>
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
    </div>
  );
}
