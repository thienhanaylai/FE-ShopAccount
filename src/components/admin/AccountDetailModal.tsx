import { X, User, DollarSign, Eye, Heart, Calendar, CheckCircle, XCircle, Edit } from 'lucide-react';

interface AccountDetailModalProps {
  account: any;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
}

export function AccountDetailModal({ account, onClose, onApprove, onReject, onEdit }: AccountDetailModalProps) {
  const images = [
    'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?w=400',
    'https://images.unsplash.com/photo-1652734935726-7afd52076e7f?w=400',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400',
  ];

  const details = [
    { label: 'Server', value: 'Việt Nam' },
    { label: 'Level', value: '234' },
    { label: 'Tướng', value: '145/165' },
    { label: 'Trang phục', value: '89' },
    { label: 'RP', value: '2,450' },
    { label: 'BE', value: '45,600' },
    { label: 'Honor', value: 'Level 5' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold mb-1">{account.gameName}</h2>
            <p className="text-blue-100">{account.id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Images Gallery */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Screenshot ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Thông tin tài khoản</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Game:</span>
                  <span className="font-semibold">{account.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rank:</span>
                  <span className="font-semibold text-[#0D4D8B]">{account.rank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá:</span>
                  <span className="font-bold text-red-600 text-lg">
                    {account.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    account.status === 'active' ? 'bg-green-100 text-green-700' :
                    account.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    account.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {account.status === 'active' ? 'Đang bán' :
                     account.status === 'pending' ? 'Chờ duyệt' :
                     account.status === 'sold' ? 'Đã bán' :
                     'Từ chối'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Người bán & Thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Người bán:</span>
                  <span className="font-semibold">{account.seller}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-semibold">{account.views}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Yêu thích:</span>
                  <span className="font-semibold">{account.favorites}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-semibold">{account.createdDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-4">Chi tiết</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {details.map((detail, index) => (
                <div key={index} className="bg-white p-3 rounded-lg">
                  <p className="text-sm text-gray-600">{detail.label}</p>
                  <p className="font-semibold text-gray-800">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="font-semibold text-gray-800 mb-3">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed">
              Tài khoản Liên Minh Huyền Thoại rank Kim Cương III, đầy đủ tướng và trang phục. 
              Tài khoản đã được xác minh, an toàn 100%. Thông tin đầy đủ, có thể đổi email và mật khẩu ngay sau khi mua.
              Full 145 tướng, 89 trang phục đẹp và hiếm. Honor Level 5 - Uy tín cao.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {account.status === 'pending' && (
              <>
                <button
                  onClick={onApprove}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  <CheckCircle className="w-5 h-5" />
                  Phê duyệt
                </button>
                <button
                  onClick={onReject}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  <XCircle className="w-5 h-5" />
                  Từ chối
                </button>
              </>
            )}
            <button
              onClick={onEdit}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              <Edit className="w-5 h-5" />
              Chỉnh sửa
            </button>
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
