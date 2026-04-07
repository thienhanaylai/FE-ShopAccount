import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { DeleteConfirmModal } from "../../components/admin/DeleteConfirmModal";
import { gameAccountService, gameCategoryService } from "../../services";
import {
  GameAccountStatus,
  type CreateGameCategoryRequest,
  type GameCategory,
  type UpdateGameCategoryRequest,
} from "../../services/types";
import ErrorHandler from "../../utils/errorHandler";

type CategoryFormValue = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  iconFile: File | null;
};

const PAGE_SIZE = 9;

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

function toSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isUrlIcon(icon: string | null | undefined): boolean {
  if (!icon) return false;
  return /^https?:\/\//i.test(icon);
}

function renderCategoryIcon(icon: string | null, name: string) {
  if (isUrlIcon(icon)) {
    return <img src={icon as string} alt={name} className="h-12 w-12 rounded-lg object-cover" />;
  }

  return <div className="text-4xl leading-none">{icon || "🎮"}</div>;
}

export function CategoriesManagement() {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [accountCountByCategory, setAccountCountByCategory] = useState<Record<string, number>>({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [updatingCategoryId, setUpdatingCategoryId] = useState<string | null>(null);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<GameCategory | null>(null);
  const [showEditModal, setShowEditModal] = useState<GameCategory | "create" | null>(null);

  const loadAccountCounts = useCallback(async () => {
    try {
      let page = 1;
      let total = 1;
      const counter: Record<string, number> = {};

      while (page <= total) {
        const response = await gameAccountService.getList({ page, limit: 100 });
        response.data.forEach(account => {
          counter[account.categoryId] = (counter[account.categoryId] || 0) + 1;
        });

        total = response.pagination.totalPages || 1;
        page += 1;
      }

      setAccountCountByCategory(counter);
    } catch {
      setAccountCountByCategory({});
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await gameCategoryService.getList({
        page: currentPage,
        limit: PAGE_SIZE,
        search: searchQuery || undefined,
      });

      setCategories(response.data || []);
      setTotalPages(response.pagination.totalPages || 1);
      setTotalCategories(response.pagination.total || 0);
    } catch (error) {
      setCategories([]);
      setTotalPages(1);
      setTotalCategories(0);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery]);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    void loadAccountCounts();
  }, [loadAccountCounts]);

  const totalAccounts = useMemo(
    () => categories.reduce((sum, category) => sum + (accountCountByCategory[category.id] || 0), 0),
    [accountCountByCategory, categories],
  );

  const activeCount = useMemo(() => categories.filter(category => category.isActive).length, [categories]);

  const syncAccountsByCategoryStatus = useCallback(async (categoryId: string, isCategoryActive: boolean) => {
    let page = 1;
    let totalPages = 1;
    const accounts = [] as Array<{ id: string; status: GameAccountStatus }>;

    while (page <= totalPages) {
      const response = await gameAccountService.getList({
        page,
        limit: 100,
        categoryId,
      });

      response.data.forEach(account => {
        accounts.push({ id: account.id, status: account.status });
      });

      totalPages = response.pagination.totalPages || 1;
      page += 1;
    }

    const updates = isCategoryActive
      ? accounts.filter(account => account.status === GameAccountStatus.HIDDEN)
      : accounts.filter(account => account.status !== GameAccountStatus.HIDDEN && account.status !== GameAccountStatus.SOLD);

    if (updates.length === 0) {
      return { updated: 0, failed: 0 };
    }

    const targetStatus = isCategoryActive ? GameAccountStatus.AVAILABLE : GameAccountStatus.HIDDEN;

    const results = await Promise.allSettled(
      updates.map(account =>
        gameAccountService.update(account.id, {
          status: targetStatus,
        }),
      ),
    );

    const updated = results.filter(result => result.status === "fulfilled").length;
    const failed = results.length - updated;

    return { updated, failed };
  }, []);

  const handleSearch = () => {
    setCurrentPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleToggleStatus = async (category: GameCategory) => {
    const nextState = !category.isActive;

    setUpdatingCategoryId(category.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await gameCategoryService.update(category.id, { isActive: nextState });

      const syncResult = await syncAccountsByCategoryStatus(category.id, nextState);

      await fetchCategories();
      await loadAccountCounts();

      if (syncResult.failed > 0) {
        setSuccessMessage(
          `Đã ${nextState ? "bật" : "tắt"} danh mục ${category.name}. Đồng bộ ${syncResult.updated} tài khoản, lỗi ${syncResult.failed} tài khoản.`,
        );
      } else {
        setSuccessMessage(`Đã ${nextState ? "bật" : "tắt"} danh mục ${category.name}. Đồng bộ ${syncResult.updated} tài khoản.`);
      }
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setUpdatingCategoryId(null);
    }
  };

  const handleDelete = async (category: GameCategory) => {
    try {
      await gameCategoryService.delete(category.id);
      setShowDeleteModal(null);
      setSuccessMessage(`Đã xóa danh mục ${category.name}`);
      setErrorMessage(null);

      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        await fetchCategories();
      }

      await loadAccountCounts();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  };

  const handleSaveCategory = async (payload: CategoryFormValue) => {
    if (isSavingCategory) return;

    setIsSavingCategory(true);

    try {
      const normalizedSlug = payload.slug.trim() || toSlug(payload.name);
      const editingCategory = showEditModal && showEditModal !== "create" ? showEditModal : null;

      if (!editingCategory && !payload.iconFile) {
        setSuccessMessage(null);
        setErrorMessage("Vui lòng chọn ảnh icon cho danh mục mới.");
        return;
      }

      const commonData = {
        name: payload.name.trim(),
        slug: normalizedSlug,
        description: payload.description.trim() || undefined,
        isActive: payload.isActive,
        iconFile: payload.iconFile || undefined,
      };

      if (editingCategory?.id) {
        const updateData: UpdateGameCategoryRequest = commonData;
        await gameCategoryService.update(editingCategory.id, updateData);
        setSuccessMessage("Đã cập nhật danh mục!");
      } else {
        const createData: CreateGameCategoryRequest = commonData;
        await gameCategoryService.create(createData);
        setSuccessMessage("Đã thêm danh mục mới!");
        setCurrentPage(1);
      }

      setShowEditModal(null);
      setErrorMessage(null);
      await fetchCategories();
    } catch (error) {
      setSuccessMessage(null);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsSavingCategory(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Quản lý danh mục Game</h1>
          <p className="text-gray-600">Tổng số: {totalCategories} danh mục</p>
        </div>
        <button
          onClick={() => setShowEditModal("create")}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#252A34] to-[#FF2E63] px-6 py-3 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:from-[#252A34] hover:to-[#d9254f]"
        >
          <Plus className="h-5 w-5" />
          Thêm danh mục
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          <p className="text-sm font-medium">{errorMessage}</p>
          <button
            onClick={fetchCategories}
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

      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <p className="mb-1 text-gray-600">Danh mục trên trang</p>
          <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <p className="mb-1 text-gray-600">Đang hoạt động</p>
          <p className="text-3xl font-bold text-green-600">{activeCount}</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <p className="mb-1 text-gray-600">Tổng tài khoản trên trang</p>
          <p className="text-3xl font-bold text-[#FF2E63]">{totalAccounts}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm danh mục..."
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

      {isLoading ? (
        <div className="py-12 text-center text-gray-500">Đang tải danh mục...</div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">Không tìm thấy danh mục nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <div key={category.id} className="overflow-hidden rounded-xl bg-white shadow-lg transition hover:shadow-xl">
              <div className={`h-2 ${category.isActive ? "bg-green-500" : "bg-gray-400"}`} />

              <div className="p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {renderCategoryIcon(category.icon, category.name)}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.slug}</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category.isActive ? "Hoạt động" : "Tắt"}
                  </span>
                </div>

                <p className="mb-4 line-clamp-2 text-sm text-gray-600">{category.description || "Chưa có mô tả"}</p>

                <div className="mb-4 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Số tài khoản:</span>
                    <span className="font-bold text-[#FF2E63]">{accountCountByCategory[category.id] || 0}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Ngày tạo:</span>
                    <span className="text-sm font-semibold text-gray-800">{formatDate(category.createdAt)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(category)}
                    disabled={updatingCategoryId === category.id}
                    className={`flex-1 rounded-lg py-2 font-semibold transition ${
                      category.isActive
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-green-600 text-white hover:bg-green-700"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {updatingCategoryId === category.id ? "Đang lưu..." : category.isActive ? "Tắt" : "Bật"}
                  </button>
                  <button
                    onClick={() => setShowEditModal(category)}
                    className="rounded-lg bg-blue-100 p-2 text-blue-700 transition hover:bg-blue-200"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(category)}
                    className="rounded-lg bg-red-100 p-2 text-red-700 transition hover:bg-red-200"
                    title="Xóa"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-200 px-2 py-4">
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

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa danh mục"
          message="Hành động này sẽ xóa vĩnh viễn danh mục. Tất cả tài khoản thuộc danh mục này có thể bị ảnh hưởng."
          itemName={showDeleteModal.name}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDelete(showDeleteModal)}
        />
      )}

      {showEditModal && (
        <EditCategoryModal
          category={showEditModal === "create" ? null : showEditModal}
          onClose={() => {
            if (isSavingCategory) return;
            setShowEditModal(null);
          }}
          onSave={handleSaveCategory}
          isSubmitting={isSavingCategory}
        />
      )}
    </div>
  );
}

interface EditCategoryModalProps {
  category: GameCategory | null;
  onClose: () => void;
  onSave: (data: CategoryFormValue) => void;
  isSubmitting: boolean;
}

function EditCategoryModal({ category, onClose, onSave, isSubmitting }: EditCategoryModalProps) {
  const [formData, setFormData] = useState<CategoryFormValue>({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    isActive: category?.isActive ?? true,
    iconFile: null,
  });
  const [iconPreview, setIconPreview] = useState<string>(category?.icon || "");

  const isEdit = !!category;

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      if (name === "name" && !isEdit && !prev.slug) {
        return { ...prev, name: value, slug: toSlug(value) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, iconFile: file }));

    if (!file) {
      setIconPreview(category?.icon || "");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        setIconPreview(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white">
        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#252A34] to-[#FF2E63] p-6 text-white shadow-lg">
          <h2 className="text-2xl font-bold">{isEdit ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-white transition hover:bg-white/20">
            <Plus className="h-6 w-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleTextChange}
              disabled={isSubmitting}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="VD: Liên Minh Huyền Thoại"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleTextChange}
              disabled={isSubmitting}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="VD: lien-minh-huyen-thoai"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Ảnh icon {!isEdit && <span className="text-red-500">*</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleIconFileChange}
              disabled={isSubmitting}
              required={!isEdit}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 file:mr-3 file:rounded-md file:border-0 file:bg-[#FF2E63] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[#d9254f]"
            />
            {iconPreview && (
              <div className="mt-3 inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
                <img src={iconPreview} alt="Icon preview" className="h-10 w-10 rounded-md object-cover" />
                <span className="text-sm text-gray-600">Ảnh xem trước</span>
              </div>
            )}
            <p className="mt-2 text-xs text-gray-500">Chỉ chọn 1 ảnh, dung lượng phù hợp để hiển thị icon danh mục.</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Mô tả</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleTextChange}
              disabled={isSubmitting}
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="Mô tả ngắn về danh mục"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              disabled={isSubmitting}
              onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="h-4 w-4 rounded text-[#FF2E63] focus:ring-[#FF2E63]"
            />
            <label className="text-sm text-gray-700">Kích hoạt danh mục</label>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#252A34] to-[#FF2E63] py-3 font-semibold text-white shadow-lg shadow-pink-500/20 transition hover:from-[#252A34] hover:to-[#d9254f] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting && !isEdit && <RefreshCw className="h-4 w-4 animate-spin" />}
              {isSubmitting ? (isEdit ? "Đang lưu..." : "Đang tạo...") : isEdit ? "Lưu thay đổi" : "Thêm danh mục"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
