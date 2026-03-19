import { useParams, Link } from 'react-router';
import { Star, Shield, Clock, CheckCircle, AlertCircle, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

export function ProductDetailPage() {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock data - in real app, fetch based on id
  const product = {
    id: id,
    gameName: 'Liên Minh Huyền Thoại',
    rank: 'Kim Cương III',
    price: 2500000,
    originalPrice: 3500000,
    verified: true,
    seller: 'GameShop Pro',
    soldCount: 234,
    viewCount: 1523,
    images: [
      'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFndWUlMjBvZiUyMGxlZ2VuZHMlMjBnYW1lfGVufDF8fHx8MTc3MDAyOTEwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1652734935726-7afd52076e7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBlc3BvcnRzJTIwcGxheWVyfGVufDF8fHx8MTc3MDAxNjI0MXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb250cm9sbGVyfGVufDF8fHx8MTc3MDA0MDQzNXww&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    description: 'Tài khoản Liên Minh Huyền Thoại rank Kim Cương III, đầy đủ tướng và trang phục. Tài khoản đã được xác minh, an toàn 100%. Thông tin đầy đủ, có thể đổi email và mật khẩu ngay sau khi mua.',
    details: {
      server: 'Việt Nam',
      level: '234',
      champions: '145/165 Tướng',
      skins: '89 Trang phục',
      rp: '2,450 RP',
      be: '45,600 BE',
      honor: 'Level 5',
      email: 'Có thể đổi',
    },
    highlights: [
      'Full 165 tướng, bao gồm tướng mới nhất',
      '89 trang phục hiếm và đẹp',
      'Rank Kim Cương III - Cao',
      'Honor Level 5 - Uy tín cao',
      'Có thể đổi email và mật khẩu',
      'Bảo hành 30 ngày'
    ],
    warnings: [
      'Không chia sẻ thông tin tài khoản cho người khác',
      'Đổi mật khẩu ngay sau khi nhận',
      'Không vi phạm điều khoản của game'
    ]
  };

  const handleBuyNow = () => {
    alert('Chức năng mua hàng sẽ được triển khai với thanh toán thực tế');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Quay lại cửa hàng</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.gameName}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-[#0D4D8B]'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.gameName} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Title & Verified Badge */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.gameName}
                  </h1>
                  <p className="text-[#F5A65B] font-semibold">{product.rank}</p>
                </div>
                {product.verified && (
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>Uy tín</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mb-4 pb-4 border-b">
                <span className="text-sm text-gray-600">
                  Đã bán: {product.soldCount}
                </span>
                <span className="text-gray-400">|</span>
                <span className="text-sm text-gray-600">
                  Lượt xem: {product.viewCount}
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold text-red-600">
                    {product.price.toLocaleString('vi-VN')}đ
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="inline-block bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                  Tiết kiệm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              </div>

              {/* Seller Info */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-sm text-gray-600 mb-1">Người bán</p>
                <p className="font-semibold text-gray-800">{product.seller}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition"
                >
                  Mua ngay
                </button>
                <button className="w-full border-2 border-[#0D4D8B] text-[#0D4D8B] py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
                  Liên hệ người bán
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Bảo hành 30 ngày</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <span>Giao dịch an toàn</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Thông tin chi tiết
          </h2>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Mô tả</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          {/* Details Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Chi tiết tài khoản
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.details).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 capitalize">
                    {key === 'server' ? 'Máy chủ' :
                     key === 'level' ? 'Cấp độ' :
                     key === 'champions' ? 'Tướng' :
                     key === 'skins' ? 'Trang phục' :
                     key === 'honor' ? 'Danh dự' :
                     key === 'email' ? 'Email' : key}:
                  </span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Điểm nổi bật
            </h3>
            <ul className="space-y-2">
              {product.highlights.map((highlight, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Lưu ý quan trọng
            </h3>
            <ul className="space-y-2">
              {product.warnings.map((warning, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}