import { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { DeleteConfirmModal } from '../../components/admin/DeleteConfirmModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  accountCount: number;
  isActive: boolean;
  order: number;
  createdDate: string;
}

export function CategoriesManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState<Partial<Category> | null>(null);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'CAT001',
      name: 'Liên Minh Huyền Thoại',
      slug: 'lien-minh-huyen-thoai',
      icon: '🎮',
      description: 'MOBA 5v5 hấp dẫn nhất thế giới',
      accountCount: 2345,
      isActive: true,
      order: 1,
      createdDate: '01/01/2024'
    },
    {
      id: 'CAT002',
      name: 'PUBG Mobile',
      slug: 'pubg-mobile',
      icon: '🔫',
      description: 'Game bắn súng sinh tồn',
      accountCount: 1876,
      isActive: true,
      order: 2,
      createdDate: '01/01/2024'
    },
    {
      id: 'CAT003',
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      icon: '⚔️',
      description: 'RPG thế giới mở',
      accountCount: 1543,
      isActive: true,
      order: 3,
      createdDate: '01/01/2024'
    },
    {
      id: 'CAT004',
      name: 'Minecraft',
      slug: 'minecraft',
      icon: '🧱',
      description: 'Game xây dựng sáng tạo',
      accountCount: 987,
      isActive: true,
      order: 4,
      createdDate: '01/01/2024'
    },
    {
      id: 'CAT005',
      name: 'FIFA Online 4',
      slug: 'fifa-online-4',
      icon: '⚽',
      description: 'Game bóng đá trực tuyến',
      accountCount: 654,
      isActive: false,
      order: 5,
      createdDate: '01/01/2024'
    },
  ]);

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (category: Category) => {
    setCategories(prev => prev.filter(c => c.id !== category.id));
    setShowDeleteModal(null);
    alert(`Đã xóa danh mục ${category.name}`);
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý danh mục Game</h1>
          <p className="text-gray-600">Tổng số: {categories.length} danh mục</p>
        </div>
        <button 
          onClick={() => setShowEditModal({})}
          className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#252A34] hover:to-[#d9254f] transition flex items-center gap-2 shadow-lg shadow-pink-500/20"
        >
          <Plus className="w-5 h-5" />
          Thêm danh mục
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 mb-1">Tổng danh mục</p>
          <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 mb-1">Đang hoạt động</p>
          <p className="text-3xl font-bold text-green-600">
            {categories.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-gray-600 mb-1">Tổng tài khoản</p>
          <p className="text-3xl font-bold text-[#FF2E63]">
            {categories.reduce((sum, c) => sum + c.accountCount, 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
          >
            <div className={`h-2 ${category.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{category.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {category.isActive ? 'Hoạt động' : 'Tắt'}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{category.description}</p>

              {/* Stats */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Số tài khoản:</span>
                  <span className="font-bold text-[#FF2E63]">{category.accountCount}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-600">Thứ tự:</span>
                  <span className="font-semibold text-gray-800">#{category.order}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleStatus(category.id)}
                  className={`flex-1 py-2 rounded-lg font-semibold transition ${
                    category.isActive
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {category.isActive ? 'Tắt' : 'Bật'}
                </button>
                <button
                  onClick={() => setShowEditModal(category)}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(category)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                  title="Xóa"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy danh mục nào</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa danh mục"
          message="Hành động này sẽ xóa vĩnh viễn danh mục. Tất cả tài khoản thuộc danh mục này sẽ bị ẩn."
          itemName={showDeleteModal.name}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={() => handleDelete(showDeleteModal)}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <EditCategoryModal
          category={showEditModal.id ? showEditModal : null}
          onClose={() => setShowEditModal(null)}
          onSave={(data) => {
            if (showEditModal.id) {
              // Edit
              setCategories(prev =>
                prev.map(cat => (cat.id === showEditModal.id ? { ...cat, ...data } : cat))
              );
              alert('Đã cập nhật danh mục!');
            } else {
              // Create
              const newCategory: Category = {
                ...(data as Category),
                id: `CAT${(categories.length + 1).toString().padStart(3, '0')}`,
                accountCount: 0,
                createdDate: new Date().toLocaleDateString('vi-VN')
              };
              setCategories(prev => [...prev, newCategory]);
              alert('Đã thêm danh mục mới!');
            }
            setShowEditModal(null);
          }}
        />
      )}
    </div>
  );
}

interface EditCategoryModalProps {
  category: Partial<Category> | null;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}

// Edit Category Modal Component
function EditCategoryModal({ category, onClose, onSave }: EditCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    icon: category?.icon || '🎮',
    description: category?.description || '',
    order: category?.order || 1,
    isActive: category?.isActive ?? true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEdit = !!category;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full">
        <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <h2 className="text-2xl font-bold">
            {isEdit ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition text-white">
            <Plus className="w-6 h-6 rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên danh mục <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="VD: Liên Minh Huyền Thoại"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="VD: lien-minh-huyen-thoai"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon (Emoji)
            </label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
              placeholder="🎮"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63] resize-none"
              placeholder="Mô tả ngắn về danh mục"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự hiển thị
            </label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF2E63]"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-[#FF2E63] rounded focus:ring-[#FF2E63]"
            />
            <label className="text-sm text-gray-700">Kích hoạt danh mục</label>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white py-3 rounded-lg font-semibold hover:from-[#252A34] hover:to-[#d9254f] transition shadow-lg shadow-pink-500/20"
            >
              {isEdit ? 'Lưu thay đổi' : 'Thêm danh mục'}
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
