import { Filter } from "lucide-react";

interface FilterSidebarProps {
  categories: Array<{ id: string; name: string }>;
  selectedCategoryId: string;
  onCategoryChange: (categoryId: string) => void;
  selectedPriceRanges: string[];
  onPriceRangeToggle: (rangeId: string) => void;
}

const priceRanges = [
  { id: "under-100k", label: "Dưới 100k" },
  { id: "100k-500k", label: "100k - 500k" },
  { id: "500k-1m", label: "500k - 1tr" },
  { id: "1m-5m", label: "1tr - 5tr" },
  { id: "over-5m", label: "Trên 5tr" },
];

export function FilterSidebar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  selectedPriceRanges,
  onPriceRangeToggle,
}: FilterSidebarProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-[#F5A65B]" />
        <h2 className="font-semibold text-gray-800">Bộ lọc</h2>
      </div>

      {/* Game Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Loại game</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              name="game"
              checked={selectedCategoryId === "all"}
              onChange={() => onCategoryChange("all")}
              className="w-4 h-4 text-[#F5A65B] focus:ring-[#F5A65B]"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>

          {categories.map(category => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="game"
                checked={selectedCategoryId === category.id}
                onChange={() => onCategoryChange(category.id)}
                className="w-4 h-4 text-[#F5A65B] focus:ring-[#F5A65B]"
              />
              <span className="text-sm text-gray-700">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {priceRanges.map(range => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={selectedPriceRanges.includes(range.id)}
                onChange={() => onPriceRangeToggle(range.id)}
                className="w-4 h-4 text-[#F5A65B] rounded focus:ring-[#F5A65B]"
              />
              <span className="text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
