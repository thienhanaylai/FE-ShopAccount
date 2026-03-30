import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ImageOff,
  Loader2,
  Wallet,
  XCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { accountTradeService } from "../services/accountTrade.service";
import { gameAccountService } from "../services/gameAccount.service";
import { walletService } from "../services/wallet.service";
import { GameAccountStatus, type GameAccount } from "../services/types";
import ErrorHandler from "../utils/errorHandler";

const FALLBACK_ACCOUNT_IMAGE =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const STATUS_LABEL: Record<GameAccountStatus, string> = {
  [GameAccountStatus.AVAILABLE]: "Đang bán",
  [GameAccountStatus.RESERVED]: "Đã giữ chỗ",
  [GameAccountStatus.SOLD]: "Đã bán",
  [GameAccountStatus.HIDDEN]: "Đang ẩn",
};

const STATUS_CLASS: Record<GameAccountStatus, string> = {
  [GameAccountStatus.AVAILABLE]: "bg-green-100 text-green-700",
  [GameAccountStatus.RESERVED]: "bg-yellow-100 text-yellow-700",
  [GameAccountStatus.SOLD]: "bg-gray-200 text-gray-700",
  [GameAccountStatus.HIDDEN]: "bg-slate-200 text-slate-700",
};

const resolveImageUrls = (images?: GameAccount["images"]): string[] => {
  if (!images || images.length === 0) {
    return [FALLBACK_ACCOUNT_IMAGE];
  }

  return images
    .map(image => (typeof image === "string" ? image : image?.url))
    .filter((value): value is string => Boolean(value));
};

const formatPrice = (price: number): string => `${price.toLocaleString("vi-VN")}đ`;

const formatDateTime = (value?: string): string => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("vi-VN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [account, setAccount] = useState<GameAccount | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [purchaseModal, setPurchaseModal] = useState<{
    type: "none" | "success" | "insufficient" | "unavailable" | "error";
    message: string;
  }>({
    type: "none",
    message: "",
  });

  const closePurchaseModal = () => {
    setPurchaseModal({ type: "none", message: "" });
  };

  const loadAccount = useCallback(async () => {
    if (!id) {
      setAccount(null);
      setErrorMessage("Không tìm thấy mã tài khoản.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await gameAccountService.getById(id);
      setAccount(response);
      setSelectedImage(0);
    } catch (error) {
      setAccount(null);
      setErrorMessage(
        ErrorHandler.isNotFoundError(error)
          ? "Tài khoản không tồn tại hoặc đã bị gỡ khỏi hệ thống."
          : ErrorHandler.getErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  const imageUrls = useMemo(() => {
    return resolveImageUrls(account?.images);
  }, [account?.images]);

  useEffect(() => {
    if (selectedImage >= imageUrls.length) {
      setSelectedImage(0);
    }
  }, [imageUrls.length, selectedImage]);

  const canBuy = account?.status === GameAccountStatus.AVAILABLE;

  const handleBuyNow = async () => {
    if (!id || !account) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!canBuy) {
      setPurchaseModal({
        type: "unavailable",
        message: "Tài khoản hiện không ở trạng thái có thể mua.",
      });
      return;
    }

    try {
      setIsBuying(true);

      const balanceData = await walletService.getBalance();
      const currentBalance = Number(balanceData?.balance || 0);

      if (currentBalance < account.price) {
        setPurchaseModal({
          type: "insufficient",
          message: "Tài khoản không đủ tiền. Vui lòng nạp thêm để tiếp tục mua.",
        });
        return;
      }

      await accountTradeService.buy(id, {
        expectedPrice: account.price,
      });

      setAccount(prev =>
        prev
          ? {
              ...prev,
              status: GameAccountStatus.SOLD,
            }
          : prev,
      );

      setPurchaseModal({
        type: "success",
        message: "Bạn đã mua thành công tài khoản.",
      });
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      const normalized = message.toLowerCase();

      if (normalized.includes("insufficient balance") || normalized.includes("không đủ")) {
        setPurchaseModal({
          type: "insufficient",
          message: "Tài khoản không đủ tiền. Vui lòng nạp thêm để tiếp tục mua.",
        });
        return;
      }

      setPurchaseModal({
        type: "error",
        message,
      });
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-white shadow-lg p-10 flex items-center justify-center gap-3 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Đang tải chi tiết tài khoản...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-5"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Quay lại cửa hàng</span>
          </Link>

          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-lg text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-semibold mb-2">Không thể tải dữ liệu tài khoản</p>
            <p className="text-gray-600 mb-4">{errorMessage || "Đã xảy ra lỗi không xác định."}</p>
            <button
              type="button"
              onClick={() => void loadAccount()}
              className="px-4 py-2 rounded-lg bg-[#0D4D8B] text-white hover:bg-[#0B4275] transition"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = imageUrls[selectedImage] ?? FALLBACK_ACCOUNT_IMAGE;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={account.username}
                  className="w-full h-[340px] sm:h-[420px] object-cover"
                />
              ) : (
                <div className="w-full h-[340px] sm:h-[420px] flex flex-col items-center justify-center text-gray-500 bg-gray-50">
                  <ImageOff className="w-8 h-8 mb-2" />
                  <span>Không có ảnh</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
              {imageUrls.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index
                      ? "border-[#0D4D8B] shadow"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${account.username}-${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 leading-tight">{account.username}</h1>
                  <p className="mt-2 text-2xl text-[#D4A15F] font-semibold">{account.rank || "Chưa cập nhật rank"}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_CLASS[account.status]}`}>
                  {STATUS_LABEL[account.status]}
                </span>
              </div>

              <p className="mt-5 text-5xl font-extrabold text-red-600">
                {formatPrice(account.price)}
              </p>

              <button
                type="button"
                onClick={() => void handleBuyNow()}
                disabled={isBuying || !canBuy}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] py-3 text-white text-xl font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBuying ? "Đang xử lý..." : canBuy ? "Mua ngay" : "Không thể mua"}
              </button>

              {errorMessage && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mt-5 border-t border-gray-100 pt-5 text-[15px] text-gray-600 space-y-1">
                <p>Danh mục: {account.categoryId}</p>
                <p>Cập nhật: {formatDateTime(account.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Thông tin chi tiết</h2>

          <div className="mb-10">
            <h3 className="text-3xl font-semibold text-gray-800 mb-4">Mô tả</h3>
            <p className="text-2xl text-gray-600 leading-relaxed whitespace-pre-line">
              {account.description || "Người bán chưa thêm mô tả cho tài khoản này."}
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-semibold text-gray-800 mb-5">Chi tiết tài khoản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="text-2xl text-gray-600">ID tài khoản:</span>
                <span className="text-2xl font-semibold text-gray-800">{account.id}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="text-2xl text-gray-600">Cấp độ:</span>
                <span className="text-2xl font-semibold text-gray-800">{account.level ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="text-2xl text-gray-600">Rank:</span>
                <span className="text-2xl font-semibold text-gray-800">{account.rank || "-"}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                <span className="text-2xl text-gray-600">Trạng thái:</span>
                <span className="text-2xl font-semibold text-gray-800">{account.status}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 md:col-span-2">
                <span className="text-2xl text-gray-600">Email:</span>
                <span className="text-2xl font-semibold text-gray-800">{account.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {purchaseModal.type !== "none" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] px-6 py-4 text-white">
              <h3 className="text-xl font-bold">
                {purchaseModal.type === "success" && "Mua tài khoản thành công"}
                {purchaseModal.type === "insufficient" && "Số dư không đủ"}
                {purchaseModal.type === "unavailable" && "Không thể mua"}
                {purchaseModal.type === "error" && "Mua tài khoản thất bại"}
              </h3>
            </div>

            <div className="px-6 py-6">
              <div className="flex items-start gap-3">
                {purchaseModal.type === "success" && <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />}
                {purchaseModal.type === "insufficient" && <Wallet className="w-6 h-6 text-orange-600 mt-0.5" />}
                {(purchaseModal.type === "unavailable" || purchaseModal.type === "error") && (
                  <XCircle className="w-6 h-6 text-red-600 mt-0.5" />
                )}
                <p className="text-gray-700 leading-relaxed">{purchaseModal.message}</p>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                {purchaseModal.type === "insufficient" && (
                  <button
                    type="button"
                    onClick={closePurchaseModal}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Để sau
                  </button>
                )}

                {purchaseModal.type === "success" && (
                  <button
                    type="button"
                    onClick={() => {
                      closePurchaseModal();
                      navigate("/profile?tab=orders");
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white font-semibold hover:opacity-90 transition"
                  >
                    Xem lịch sử đơn hàng
                  </button>
                )}

                {purchaseModal.type === "insufficient" && (
                  <button
                    type="button"
                    onClick={() => {
                      closePurchaseModal();
                      navigate("/deposit");
                    }}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white font-semibold hover:opacity-90 transition"
                  >
                    Nạp tiền ngay
                  </button>
                )}

                {(purchaseModal.type === "unavailable" || purchaseModal.type === "error") && (
                  <button
                    type="button"
                    onClick={closePurchaseModal}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white font-semibold hover:opacity-90 transition"
                  >
                    Đóng
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}