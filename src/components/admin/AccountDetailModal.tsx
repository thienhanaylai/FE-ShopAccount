import { X, User, Eye, Heart, Calendar, CheckCircle, XCircle, Edit } from "lucide-react";

type StatusMeta = {
  label: string;
  className: string;
};

interface AccountData {
  id: string;
  gameName: string;
  rank: string;
  price: number;
  status: string;
  seller: string;
  views: number;
  favorites: number;
  createdDate: string;
  description?: string;
  images?: string[];
  level?: number;
}

interface AccountDetailModalProps {
  account: AccountData;
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onEdit?: () => void;
}

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1619017120498-872bb10a14a6?w=400",
  "https://images.unsplash.com/photo-1652734935726-7afd52076e7f?w=400",
  "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=400",
];

function getStatusMeta(status: string): StatusMeta {
  switch (status) {
    case "active":
    case "AVAILABLE":
      return { label: "Đang bán", className: "bg-green-100 text-green-700" };
    case "pending":
    case "RESERVED":
      return { label: "Đã giữ chỗ", className: "bg-yellow-100 text-yellow-700" };
    case "approved":
      return { label: "Đã duyệt", className: "bg-emerald-100 text-emerald-700" };
    case "sold":
    case "SOLD":
      return { label: "Đã bán", className: "bg-blue-100 text-blue-700" };
    case "HIDDEN":
      return { label: "Đã ẩn", className: "bg-gray-100 text-gray-700" };
    case "rejected":
    default:
      return { label: "Từ chối", className: "bg-red-100 text-red-700" };
  }
}

function formatMoney(value: number): string {
  const amount = Number.isFinite(value) ? value : 0;
  return `${amount.toLocaleString("vi-VN")}đ`;
}

export function AccountDetailModal({ account, onClose, onApprove, onReject, onEdit }: AccountDetailModalProps) {
  const images = account.images && account.images.length > 0 ? account.images : FALLBACK_IMAGES;
  const statusMeta = getStatusMeta(account.status);
  const isReviewPending = account.status === "pending" || account.status === "RESERVED";

  const details = [
    { label: "Rank", value: account.rank || "Chưa có" },
    { label: "Level", value: account.level ? String(account.level) : "-" },
    { label: "Lượt xem", value: String(account.views || 0) },
    { label: "Yêu thích", value: String(account.favorites || 0) },
    { label: "Giá", value: formatMoney(account.price) },
    { label: "Trạng thái", value: statusMeta.label },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white">
        <div className="sticky top-0 flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#252A34] to-[#FF2E63] p-6 text-white shadow-lg">
          <div>
            <h2 className="mb-1 text-2xl font-bold">{account.gameName}</h2>
            <p className="text-gray-200 opacity-90">{account.id}</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 transition hover:bg-white/20">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 font-semibold text-gray-800">Hình ảnh</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={`Screenshot ${index + 1}`}
                  className="h-48 w-full rounded-lg object-cover"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 font-semibold text-gray-800">Thông tin tài khoản</h3>
              <div className="space-y-3">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Game:</span>
                  <span className="text-right font-semibold">{account.gameName}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Rank:</span>
                  <span className="text-right font-semibold text-[#FF2E63]">{account.rank}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Giá:</span>
                  <span className="text-right text-lg font-bold text-red-600">{formatMoney(account.price)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}>
                    {statusMeta.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 font-semibold text-gray-800">Người bán và thống kê</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Người bán:</span>
                  <span className="font-semibold">{account.seller}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Lượt xem:</span>
                  <span className="font-semibold">{account.views || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Yêu thích:</span>
                  <span className="font-semibold">{account.favorites || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span className="font-semibold">{account.createdDate}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-4 font-semibold text-gray-800">Chi tiết</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {details.map(detail => (
                <div key={detail.label} className="rounded-lg bg-white p-3">
                  <p className="text-sm text-gray-600">{detail.label}</p>
                  <p className="font-semibold text-gray-800">{detail.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-6">
            <h3 className="mb-3 font-semibold text-gray-800">Mô tả</h3>
            <p className="leading-relaxed text-gray-600">{account.description || "Chưa có mô tả cho tài khoản này."}</p>
          </div>

          <div className="flex gap-3">
            {isReviewPending && onApprove && (
              <button
                onClick={onApprove}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                <CheckCircle className="h-5 w-5" />
                Phê duyệt
              </button>
            )}
            {isReviewPending && onReject && (
              <button
                onClick={onReject}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
              >
                <XCircle className="h-5 w-5" />
                Từ chối
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                <Edit className="h-5 w-5" />
                Đóng chỉnh sửa
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-300"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
