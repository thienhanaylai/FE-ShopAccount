import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Eye, CheckCircle, RefreshCw, Plus, Edit, Trash2 } from "lucide-react";
import { AccountDetailModal } from "../../components/admin/AccountDetailModal.tsx";
import { RejectModal } from "../../components/admin/RejectModal";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { gameAccountService, gameCategoryService } from "../../services";
import {
  GameAccountStatus,
  type CreateGameAccountRequest,
  type GameAccount,
  type GameCategory,
  type UpdateGameAccountRequest,
} from "../../services/types";
import ErrorHandler from "../../utils/errorHandler";

type TableStatus = "active" | "pending" | "sold" | "rejected";

type UiAccount = {
  id: string;
  categoryId: string;
  email: string;
  gameName: string;
  rank: string;
  price: number;
  seller: string;
  status: TableStatus;
  views: number;
  favorites: number;
  createdDate: string;
  verified: boolean;
  description?: string;
  images?: string[];
  level?: number;
  apiStatus: GameAccountStatus;
};

type AccountFormValue = {
  categoryId: string;
  username: string;
  email: string;
  password: string;
  price: string;
  status: GameAccountStatus;
  level: string;
  rank: string;
  description: string;
  imageFiles: File[];
};

const PAGE_SIZE = 10;

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

function formatMoney(value: number): string {
  return `${value.toLocaleString("vi-VN")}đ`;
}

function mapStatusToTable(status: GameAccountStatus): TableStatus {
  switch (status) {
    case GameAccountStatus.AVAILABLE:
      return "active";
    case GameAccountStatus.RESERVED:
      return "pending";
    case GameAccountStatus.SOLD:
      return "sold";
    case GameAccountStatus.HIDDEN:
    default:
      return "rejected";
  }
}

function toImageList(images: GameAccount["images"]): string[] {
  if (!images || images.length === 0) return [];

  return images
    .map(image => {
      if (typeof image === "string") return image;
      return image?.url || "";
    })
    .filter(Boolean);
}

function toNumber(value: string, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function AccountsManagement() {
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGame, setFilterGame] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | GameAccountStatus>("all");
  const [showDetailModal, setShowDetailModal] = useState<UiAccount | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<UiAccount | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<UiAccount | null>(null);
  const [showEditModal, setShowEditModal] = useState<{ mode: "create" } | { mode: "edit"; account: UiAccount } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const categoryMap = useMemo(
    () =>
      categories.reduce<Record<string, string>>((acc, category) => {
        acc[category.id] = category.name;
        return acc;
      }, {}),
    [categories],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const response = await gameCategoryService.getList({ page: 1, limit: 100 });
      setCategories(response.data || []);
    } catch {
      setCategories([]);
    }
  }, []);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await gameAccountService.getList({
        page: currentPage,
        limit: PAGE_SIZE,
        search: searchQuery || undefined,
        categoryId: filterGame !== "all" ? filterGame : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
      });

      setAccounts(response.data || []);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalAccounts(response.pagination.total || 0);
    } catch (error) {
      setAccounts([]);
      setTotalPages(1);
      setTotalAccounts(0);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filterGame, filterStatus, searchQuery]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const tableAccounts: UiAccount[] = useMemo(
    () =>
      accounts.map(account => ({
        id: account.id,
        categoryId: account.categoryId,
        email: account.email,
        gameName: categoryMap[account.categoryId] || "Game chưa phân loại",
        rank: account.rank || (account.level ? `Level ${account.level}` : "Chưa có rank"),
        price: Number.isFinite(account.price) ? account.price : 0,
        seller: account.username || account.email,
        status: mapStatusToTable(account.status),
        views: 0,
        favorites: 0,
        createdDate: formatDate(account.createdAt),
        verified: account.status === GameAccountStatus.AVAILABLE,
        description: account.description,
        images: toImageList(account.images),
        level: account.level,
        apiStatus: account.status,
      })),
    [accounts, categoryMap],
  );

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "sold":
        return "bg-blue-100 text-blue-700";
      case "rejected":
      default:
        return "bg-red-100 text-red-700";
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case "active":
        return "Đang bán";
      case "pending":
        return "Đã giữ chỗ";
      case "sold":
        return "Đã bán";
      case "rejected":
      default:
        return "Đã ẩn";
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleApprove = async (account: UiAccount) => {
    try {
      await gameAccountService.update(account.id, { status: GameAccountStatus.AVAILABLE });
      setSuccessMessage(`Đã chuyển tài khoản ${account.id} sang trạng thái Đang bán.`);
      setErrorMessage(null);
      setShowDetailModal(null);
      await fetchAccounts();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  };

  const handleReject = async (account: UiAccount, reason: string) => {
    try {
      const note = `[Admin ẩn tài khoản] ${reason}`;
      const newDescription = account.description?.trim() ? `${account.description}\n${note}` : note;

      await gameAccountService.update(account.id, {
        status: GameAccountStatus.HIDDEN,
        description: newDescription,
      });

      setSuccessMessage(`Đã ẩn tài khoản ${account.id}.`);
      setErrorMessage(null);
      setShowRejectModal(null);
      setShowDetailModal(null);
      await fetchAccounts();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  };

  const handleDelete = async (account: UiAccount) => {
    if (account.apiStatus === GameAccountStatus.SOLD) {
      setSuccessMessage(null);
      setErrorMessage("Tài khoản đã bán không thể xóa.");
      return;
    }

    try {
      await gameAccountService.delete(account.id);
      setSuccessMessage(`Đã xóa tài khoản ${account.id}.`);
      setErrorMessage(null);
      setShowDeleteModal(null);

      if (accounts.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await fetchAccounts();
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  };

  const handleSaveAccount = async (payload: AccountFormValue) => {
    if (isSavingAccount) return;

    const categoryId = payload.categoryId;
    const username = payload.username.trim();
    const email = payload.email.trim();
    const password = payload.password.trim();
    const price = toNumber(payload.price, -1);

    if (!categoryId || !username || !email || price < 0) {
      setSuccessMessage(null);
      setErrorMessage("Vui lòng nhập đầy đủ thông tin bắt buộc và giá hợp lệ.");
      return;
    }

    if (showEditModal?.mode === "edit" && showEditModal.account.apiStatus === GameAccountStatus.SOLD) {
      setSuccessMessage(null);
      setErrorMessage("Tài khoản đã bán không thể chỉnh sửa.");
      return;
    }

    setIsSavingAccount(true);
    try {
      if (showEditModal?.mode === "create") {
        if (!password) {
          setSuccessMessage(null);
          setErrorMessage("Mật khẩu là bắt buộc khi tạo tài khoản mới.");
          return;
        }

        const createData: CreateGameAccountRequest = {
          categoryId,
          username,
          email,
          password,
          price,
          status: payload.status,
          level: payload.level.trim() ? toNumber(payload.level) : undefined,
          rank: payload.rank.trim() || undefined,
          description: payload.description.trim() || undefined,
          imageFiles: payload.imageFiles.length > 0 ? payload.imageFiles : undefined,
        };

        await gameAccountService.create(createData);
        setSuccessMessage("Đã thêm tài khoản mới.");
        setCurrentPage(1);
      } else if (showEditModal?.mode === "edit") {
        const updateData: UpdateGameAccountRequest = {
          categoryId,
          username,
          email,
          price,
          status: payload.status,
          rank: payload.rank.trim() || undefined,
          description: payload.description.trim() || undefined,
          imageFiles: payload.imageFiles.length > 0 ? payload.imageFiles : undefined,
        };

        if (payload.level.trim()) {
          updateData.level = toNumber(payload.level);
        }

        if (password) {
          updateData.password = password;
        }

        await gameAccountService.update(showEditModal.account.id, updateData);
        setSuccessMessage(`Đã cập nhật tài khoản ${showEditModal.account.id}.`);
      }

      setShowEditModal(null);
      setShowDetailModal(null);
      setErrorMessage(null);
      await fetchAccounts();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsSavingAccount(false);
    }
  };

  const activeCount = tableAccounts.filter(account => account.status === "active").length;

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Quản lý tài khoản game</h1>
          <p className="text-gray-600">Tổng số: {totalAccounts} tài khoản</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowEditModal({ mode: "create" })}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#252A34] to-[#FF2E63] px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:from-[#252A34] hover:to-[#d9254f]"
          >
            <Plus className="h-5 w-5" />
            Thêm tài khoản
          </button>
          <button
            onClick={fetchAccounts}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCw className="h-5 w-5" />
            Làm mới
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="text-sm font-medium">{errorMessage}</p>
          <button
            onClick={fetchAccounts}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            Thử lại
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <p className="text-sm font-medium">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-green-200 bg-white px-3 py-1.5 text-sm font-medium transition hover:bg-green-100"
          >
            Đóng
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-500">Tài khoản trên trang</p>
          <p className="text-2xl font-bold text-[#252A34]">{tableAccounts.length}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-500">Đang bán</p>
          <p className="text-2xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-500">Đã giữ chỗ</p>
          <p className="text-2xl font-bold text-yellow-600">
            {tableAccounts.filter(account => account.status === "pending").length}
          </p>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-lg">
          <p className="text-sm text-gray-500">Đã bán</p>
          <p className="text-2xl font-bold text-blue-600">{tableAccounts.filter(account => account.status === "sold").length}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm theo ID, username, rank..."
                  className="w-full rounded-lg border border-gray-300 py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-lg bg-[#FF2E63] px-4 py-3 font-medium text-white transition hover:bg-[#d9254f]"
              >
                Tìm
              </button>
            </div>
          </div>

          <div>
            <select
              value={filterGame}
              onChange={e => {
                setCurrentPage(1);
                setFilterGame(e.target.value);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            >
              <option value="all">Tất cả game</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={e => {
                setCurrentPage(1);
                setFilterStatus(e.target.value as "all" | GameAccountStatus);
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={GameAccountStatus.AVAILABLE}>Đang bán</option>
              <option value={GameAccountStatus.RESERVED}>Đã giữ chỗ</option>
              <option value={GameAccountStatus.SOLD}>Đã bán</option>
              <option value={GameAccountStatus.HIDDEN}>Đã ẩn</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Game</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Giá</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Người bán</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Đang tải dữ liệu tài khoản...
                  </td>
                </tr>
              ) : tableAccounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    Không có tài khoản phù hợp.
                  </td>
                </tr>
              ) : (
                tableAccounts.map(account => (
                  <tr key={account.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-[#FF2E63]">{account.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{account.gameName}</p>
                        {account.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#FF2E63]">{account.rank}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">{formatMoney(account.price)}</td>
                    <td className="px-6 py-4 text-gray-600">{account.seller}</td>
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(account.status)}`}>
                        {getStatusText(account.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{account.createdDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {account.apiStatus === GameAccountStatus.SOLD ? (
                          <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">Đã bán</span>
                        ) : null}
                        <button
                          onClick={() => setShowDetailModal(account)}
                          className="rounded-lg p-2 transition hover:bg-gray-100"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-5 w-5 text-gray-600" />
                        </button>
                        <button
                          onClick={() => setShowEditModal({ mode: "edit", account })}
                          disabled={account.apiStatus === GameAccountStatus.SOLD}
                          className="rounded-lg p-2 transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-40"
                          title={
                            account.apiStatus === GameAccountStatus.SOLD ? "Tài khoản đã bán không thể chỉnh sửa" : "Chỉnh sửa"
                          }
                        >
                          <Edit className="h-5 w-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => setShowDeleteModal(account)}
                          disabled={account.apiStatus === GameAccountStatus.SOLD}
                          className="rounded-lg p-2 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                          title={account.apiStatus === GameAccountStatus.SOLD ? "Tài khoản đã bán không thể xóa" : "Xóa"}
                        >
                          <Trash2 className="h-5 w-5 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-gray-600">
              Trang {currentPage} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Trước
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="rounded-lg border border-gray-300 px-4 py-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {showDetailModal && (
        <AccountDetailModal
          account={showDetailModal}
          onClose={() => setShowDetailModal(null)}
          onApprove={showDetailModal.apiStatus !== GameAccountStatus.AVAILABLE ? () => handleApprove(showDetailModal) : undefined}
          onReject={() => {
            setShowDetailModal(null);
            setShowRejectModal(showDetailModal);
          }}
          onEdit={
            showDetailModal.apiStatus === GameAccountStatus.SOLD
              ? undefined
              : () => {
                  setShowDetailModal(null);
                  setShowEditModal({ mode: "edit", account: showDetailModal });
                }
          }
        />
      )}

      {showRejectModal && (
        <RejectModal
          title="Ẩn tài khoản"
          itemId={showRejectModal.id}
          onClose={() => setShowRejectModal(null)}
          onConfirm={reason => handleReject(showRejectModal, reason)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa tài khoản"
          message="Hành động này sẽ xóa vĩnh viễn tài khoản game khỏi hệ thống."
          itemName={`${showDeleteModal.id} - ${showDeleteModal.gameName}`}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDelete(showDeleteModal)}
        />
      )}

      {showEditModal && (
        <EditAccountModal
          mode={showEditModal.mode}
          categories={categories}
          account={showEditModal.mode === "edit" ? showEditModal.account : null}
          isSaving={isSavingAccount}
          onClose={() => {
            if (isSavingAccount) return;
            setShowEditModal(null);
          }}
          onSave={handleSaveAccount}
        />
      )}
    </div>
  );
}

interface EditAccountModalProps {
  mode: "create" | "edit";
  categories: GameCategory[];
  account: UiAccount | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: (data: AccountFormValue) => void;
}

function EditAccountModal({ mode, categories, account, isSaving, onClose, onSave }: EditAccountModalProps) {
  const [formData, setFormData] = useState<AccountFormValue>({
    categoryId: account?.categoryId || categories[0]?.id || "",
    username: account?.seller || "",
    email: account?.email || "",
    password: "",
    price: String(account?.price ?? 0),
    status: account?.apiStatus || GameAccountStatus.AVAILABLE,
    level: account?.level ? String(account.level) : "",
    rank: account?.rank || "",
    description: account?.description || "",
    imageFiles: [],
  });
  const [imageError, setImageError] = useState<string>("");

  const isCreate = mode === "create";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length > 6) {
      setImageError("Bạn chỉ được chọn tối đa 6 ảnh. Hệ thống sẽ lấy 6 ảnh đầu tiên.");
    } else {
      setImageError("");
    }

    setFormData(prev => ({ ...prev, imageFiles: files.slice(0, 6) }));
  };

  return (
    <div className="scrollbar-hidden fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 sm:items-center">
      <div className="scrollbar-hidden my-4 w-full max-w-3xl max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl bg-white">
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#252A34] to-[#FF2E63] p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">{isCreate ? "Thêm tài khoản game" : "Chỉnh sửa tài khoản game"}</h2>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="rounded-lg p-2 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-6 w-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Danh mục game <span className="text-red-500">*</span>
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isSaving}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              >
                <option value="" disabled>
                  Chọn danh mục
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Trạng thái</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              >
                <option value={GameAccountStatus.AVAILABLE}>Đang bán</option>
                <option value={GameAccountStatus.RESERVED}>Đã giữ chỗ</option>
                <option value={GameAccountStatus.SOLD}>Đã bán</option>
                <option value={GameAccountStatus.HIDDEN}>Đã ẩn</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isSaving}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isSaving}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                disabled={isSaving}
                min="0"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Level</label>
              <input
                type="number"
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={isSaving}
                min="0"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Rank</label>
              <input
                type="text"
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                disabled={isSaving}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu {isCreate && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isSaving}
              required={isCreate}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder={isCreate ? "Nhập mật khẩu tài khoản game" : "Để trống nếu không đổi"}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Ảnh tài khoản (tối đa 6 tệp)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageFilesChange}
              disabled={isSaving}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 file:mr-3 file:rounded-md file:border-0 file:bg-[#FF2E63] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#d9254f]"
            />
            {imageError && <p className="mt-2 text-xs text-red-600">{imageError}</p>}
            <p className="mt-2 text-xs text-gray-500">Đã chọn: {formData.imageFiles.length}/6 ảnh</p>
            {account?.images?.[0] && formData.imageFiles.length === 0 && (
              <p className="mt-1 text-xs text-gray-500">Ảnh hiện tại sẽ được giữ nguyên nếu bạn không chọn ảnh mới.</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={isSaving}
              rows={4}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            />
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#252A34] to-[#FF2E63] py-3 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:from-[#252A34] hover:to-[#d9254f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : null}
              {isSaving ? "Đang lưu..." : isCreate ? "Thêm tài khoản" : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
