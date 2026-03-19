import { Shield } from 'lucide-react';
import { Link } from 'react-router';

interface GameAccountCardProps {
  id: string;
  gameName: string;
  rank: string;
  price: number;
  image: string;
  verified: boolean;
  timeLeft?: string;
  champions?: string;
  skins?: string;
}

export function GameAccountCard({
  id,
  gameName,
  rank,
  price,
  image,
  verified,
  timeLeft,
  champions,
  skins
}: GameAccountCardProps) {
  return (
    <Link to={`/product/${id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative overflow-hidden h-48">
          <img
            src={image}
            alt={gameName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {verified && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Uy tín
            </div>
          )}
          {timeLeft && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <span className="animate-pulse">🔥</span>
              {timeLeft}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 mb-1">{gameName}</h3>
          <p className="text-[#F5A65B] text-sm mb-3">{rank}</p>

          {/* Details */}
          <div className="space-y-1 mb-4 text-sm text-gray-600">
            {champions && <p>• {champions}</p>}
            {skins && <p>• {skins}</p>}
          </div>

          {/* Price & Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Giá bán</p>
              <p className="text-xl font-bold text-red-600">
                {price.toLocaleString('vi-VN')}đ
              </p>
            </div>
            <button className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white px-4 py-2 rounded-lg hover:from-[#0D4D8B] hover:to-[#E58B3D] transition">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}