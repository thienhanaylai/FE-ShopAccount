import { Filter } from 'lucide-react';

interface FilterSidebarProps {
  selectedGame: string;
  onGameChange: (game: string) => void;
}

export function FilterSidebar({ selectedGame, onGameChange }: FilterSidebarProps) {
  const games = [
    'Tất cả',
    'Liên Minh Huyền Thoại',
    'PUBG Mobile',
    'Minecraft',
    'Genshin Impact',
    'FIFA Online 4',
    'Free Fire',
    'Valorant'
  ];

  const priceRanges = [
    'Dưới 100k',
    '100k - 500k',
    '500k - 1tr',
    '1tr - 5tr',
    'Trên 5tr'
  ];

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
          {games.map((game) => (
            <label key={game} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="game"
                checked={selectedGame === game}
                onChange={() => onGameChange(game)}
                className="w-4 h-4 text-[#F5A65B] focus:ring-[#F5A65B]"
              />
              <span className="text-sm text-gray-700">{game}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#F5A65B] rounded focus:ring-[#F5A65B]"
              />
              <span className="text-sm text-gray-700">{range}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="font-medium text-gray-700 mb-3">Trạng thái</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#F5A65B] rounded focus:ring-[#F5A65B]"
            />
            <span className="text-sm text-gray-700">Tài khoản uy tín</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="checkbox"
              className="w-4 h-4 text-[#F5A65B] rounded focus:ring-[#F5A65B]"
            />
            <span className="text-sm text-gray-700">Giá tốt</span>
          </label>
        </div>
      </div>
    </div>
  );
}