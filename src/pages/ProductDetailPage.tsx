import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { AlertCircle, CheckCircle2, ChevronLeft, ImageOff, Loader2, Wallet, XCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { accountTradeService } from "../services/accountTrade.service";
import { gameAccountService } from "../services/gameAccount.service";
import { walletService } from "../services/wallet.service";
import { GameAccountStatus, type GameAccount } from "../services/types";
import ErrorHandler from "../utils/errorHandler";

const FALLBACK_ACCOUNT_IMAGE =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const SWIPE_THRESHOLD = 40;
const IMAGE_TRANSITION_MS = 260;
const IMAGE_SWAP_DELAY_MS = 90;

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

  return images.map(image => (typeof image === "string" ? image : image?.url)).filter((value): value is string => Boolean(value));
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
  const [isMainImageVisible, setIsMainImageVisible] = useState(true);
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

  const swipeStartXRef = useRef<number | null>(null);
  const swipeEndXRef = useRef<number | null>(null);
  const imageTransitionTimerRef = useRef<number | null>(null);

  const changeImageWithTransition = useCallback(
    (nextIndex: number) => {
      if (imageUrls.length <= 1) return;

      const normalizedIndex = (nextIndex + imageUrls.length) % imageUrls.length;
      if (normalizedIndex === selectedImage) return;

      setIsMainImageVisible(false);

      if (imageTransitionTimerRef.current !== null) {
        window.clearTimeout(imageTransitionTimerRef.current);
      }

      imageTransitionTimerRef.current = window.setTimeout(() => {
        setSelectedImage(normalizedIndex);
        setIsMainImageVisible(true);
        imageTransitionTimerRef.current = null;
      }, IMAGE_SWAP_DELAY_MS);
    },
    [imageUrls.length, selectedImage],
  );

  const goToNextImage = useCallback(() => {
    changeImageWithTransition(selectedImage + 1);
  }, [changeImageWithTransition, selectedImage]);

  const goToPrevImage = useCallback(() => {
    changeImageWithTransition(selectedImage - 1);
  }, [changeImageWithTransition, selectedImage]);

  const handleImageTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    swipeStartXRef.current = event.touches[0]?.clientX ?? null;
    swipeEndXRef.current = null;
  };

  const handleImageTouchMove = (event: TouchEvent<HTMLDivElement>) => {
    swipeEndXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleImageTouchEnd = () => {
    if (swipeStartXRef.current === null || swipeEndXRef.current === null) return;

    const distance = swipeStartXRef.current - swipeEndXRef.current;
    if (Math.abs(distance) < SWIPE_THRESHOLD) return;

    if (distance > 0) {
      goToNextImage();
    } else {
      goToPrevImage();
    }

    swipeStartXRef.current = null;
    swipeEndXRef.current = null;
  };

  useEffect(() => {
    if (selectedImage >= imageUrls.length) {
      setSelectedImage(0);
    }
  }, [imageUrls.length, selectedImage]);

  useEffect(() => {
    return () => {
      if (imageTransitionTimerRef.current !== null) {
        window.clearTimeout(imageTransitionTimerRef.current);
      }
    };
  }, []);

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
      <div className="min-h-screen bg-gray-100 py-8 lg:py-10">
        <div className="container mx-auto max-w-7xl px-4">
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
      <div className="min-h-screen bg-gray-100 py-8 lg:py-10">
        <div className="container mx-auto max-w-7xl px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-5">
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
    <div className="min-h-screen bg-gray-100 py-8 lg:py-10">
      <div className="container mx-auto max-w-7xl px-4">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-6">
          <ChevronLeft className="w-5 h-5" />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(390px,0.88fr)] xl:grid-cols-[minmax(0,1.18fr)_minmax(430px,0.82fr)]">
          <div>
            <div
              className="relative rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-lg [touch-action:pan-y]"
              onTouchStart={handleImageTouchStart}
              onTouchMove={handleImageTouchMove}
              onTouchEnd={handleImageTouchEnd}
            >
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={account.username}
                  className={`w-full aspect-[16/10] xl:aspect-[16/9] object-cover transition-all ease-out ${
                    isMainImageVisible ? "opacity-100 scale-100" : "opacity-0 scale-[1.015]"
                  }`}
                  style={{ transitionDuration: `${IMAGE_TRANSITION_MS}ms` }}
                />
              ) : (
                <div
                  className={`w-full aspect-[16/10] xl:aspect-[16/9] flex flex-col items-center justify-center text-gray-500 bg-gray-50 transition-opacity ease-out ${
                    isMainImageVisible ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDuration: `${IMAGE_TRANSITION_MS}ms` }}
                >
                  <ImageOff className="w-8 h-8 mb-2" />
                  <span>Không có ảnh</span>
                </div>
              )}

              {imageUrls.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevImage}
                    aria-label="Ảnh trước"
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white transition hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={goToNextImage}
                    aria-label="Ảnh tiếp theo"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2.5 text-white transition hover:bg-black/60"
                  >
                    <ChevronLeft className="h-5 w-5 rotate-180" />
                  </button>
                </>
              )}
            </div>

            <div className="mt-3 grid max-w-[620px] grid-cols-5 gap-2 md:max-w-[700px] md:grid-cols-6 lg:max-w-[620px] lg:grid-cols-5 xl:max-w-[700px]">
              {imageUrls.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => changeImageWithTransition(index)}
                  className={`rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === index ? "border-[#0D4D8B] shadow" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img src={image} alt={`${account.username}-${index + 1}`} className="w-full aspect-[16/8] object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg xl:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold leading-tight text-gray-800 md:text-3xl xl:text-[2rem]">
                    {account.username}
                  </h1>
                  <p className="mt-2 text-lg font-semibold text-[#D4A15F] md:text-xl">{account.rank || "Chưa cập nhật rank"}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold md:text-sm ${STATUS_CLASS[account.status]}`}>
                  {STATUS_LABEL[account.status]}
                </span>
              </div>

              <p className="mt-6 text-3xl font-extrabold text-red-600 md:text-4xl">{formatPrice(account.price)}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">ID tài khoản</p>
                  <p className="mt-1 truncate text-sm font-semibold text-gray-800 md:text-base">{account.id}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Cấp độ</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800 md:text-base">{account.level ?? "-"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void handleBuyNow()}
                disabled={isBuying || !canBuy}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] py-3 text-lg font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBuying ? "Đang xử lý..." : canBuy ? "Mua ngay" : "Không thể mua"}
              </button>

              {errorMessage && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="mt-5 space-y-1 border-t border-gray-100 pt-5 text-sm text-gray-600 md:text-[15px]">
                <p>Danh mục: {account.categoryId}</p>
                <p>Cập nhật: {formatDateTime(account.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:p-5 xl:p-6">
          <h2 className="mb-4 text-xl font-bold text-gray-800 md:text-2xl">Thông tin chi tiết</h2>

          <div className="mb-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-800 md:text-xl">Mô tả</h3>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600 md:text-base">
              {account.description || "Người bán chưa thêm mô tả cho tài khoản này."}
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-800 md:text-xl">Chi tiết tài khoản</h3>
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 md:gap-3">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-xs text-gray-600 md:text-sm">ID tài khoản:</span>
                <span className="max-w-[60%] break-all text-right text-xs font-semibold text-gray-800 md:text-sm">
                  {account.id}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-xs text-gray-600 md:text-sm">Cấp độ:</span>
                <span className="text-xs font-semibold text-gray-800 md:text-sm">{account.level ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-xs text-gray-600 md:text-sm">Rank:</span>
                <span className="text-xs font-semibold text-gray-800 md:text-sm">{account.rank || "-"}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-xs text-gray-600 md:text-sm">Trạng thái:</span>
                <span className="text-xs font-semibold text-gray-800 md:text-sm">{account.status}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3 md:col-span-2">
                <span className="text-xs text-gray-600 md:text-sm">Email:</span>
                <span className="max-w-[65%] break-all text-right text-xs font-semibold text-gray-800 md:text-sm">
                  {account.email}
                </span>
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
