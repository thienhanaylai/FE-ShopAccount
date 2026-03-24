import { Gamepad2, Shield, Zap, TrendingUp, Star, Users } from 'lucide-react';
import { Link } from 'react-router';
import { GameAccountCard } from '../components/GameAccountCard';

export function HomePage() {
  const featuredAccounts = [
    {
      id: '1',
      gameName: 'Liên Minh Huyền Thoại',
      rank: 'Kim Cương III',
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFndWUlMjBvZiUyMGxlZ2VuZHMlMjBnYW1lfGVufDF8fHx8MTc3MDAyOTEwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: '145/165 Tướng',
      skins: '89 Trang phục'
    },
    {
      id: '2',
      gameName: 'PUBG Mobile',
      rank: 'Chinh Phục',
      price: 1800000,
      image: 'https://images.unsplash.com/photo-1564049489314-60d154ff107d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJnJTIwbW9iaWxlJTIwZ2FtaW5nfGVufDF8fHx8MTc3MDEwMzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      timeLeft: '2 ngày',
      champions: 'UC: 18,500',
      skins: '156 Set đồ'
    },
    {
      id: '3',
      gameName: 'Genshin Impact',
      rank: 'AR 58',
      price: 3200000,
      image: 'https://images.unsplash.com/photo-1769709992557-45387590ae7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5zaGluJTIwaW1wYWN0JTIwZ2FtZXxlbnwxfHx8fDE3NzAwNDAxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      verified: true,
      champions: '23 nhân vật 5⭐',
      skins: '12 vũ khí 5⭐'
    },
    {
      id: '4',
      gameName: 'FIFA Online 4',
      rank: 'VIP 15',
      price: 1500000,
      image: 'https://images.unsplash.com/photo-1520298064646-747b5051dbb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWZhJTIwZm9vdGJhbGwlMjBnYW1lfGVufDF8fHx8MTc3MDEwMzA0NHww&ixlib=rb-4.1.0&q=80&w=1080',
      verified: false,
      champions: '25 cầu thủ Icon',
      skins: 'BP: 850M+'
    }
  ];

  const stats = [
    { label: 'Tài khoản đã bán', value: '15,000+', icon: TrendingUp },
    { label: 'Người dùng', value: '50,000+', icon: Users },
    { label: 'Đánh giá 5 sao', value: '12,000+', icon: Star },
  ];

  const games = [
    { name: 'Liên Minh Huyền Thoại', count: 2345, image: 'https://images.unsplash.com/photo-1619017120498-872bb10a14a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWFndWUlMjBvZiUyMGxlZ2VuZHMlMjBnYW1lfGVufDF8fHx8MTc3MDAyOTEwOHww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'PUBG Mobile', count: 1876, image: 'https://images.unsplash.com/photo-1564049489314-60d154ff107d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwdWJnJTIwbW9iaWxlJTIwZ2FtaW5nfGVufDF8fHx8MTc3MDEwMzA0M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Genshin Impact', count: 1543, image: 'https://images.unsplash.com/photo-1769709992557-45387590ae7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW5zaGluJTIwaW1wYWN0JTIwZ2FtZXxlbnwxfHx8fDE3NzAwNDAxMDd8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { name: 'Minecraft', count: 987, image: 'https://images.unsplash.com/photo-1759663173762-29a82ef36daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5lY3JhZnQlMjBnYW1lJTIwd29ybGR8ZW58MXx8fHwxNzcwMTAzMDQzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0D4D8B] via-[#F5A65B] to-[#1EA7FD] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mua Bán Tài Khoản Game #1 Việt Nam
            </h1>
            <p className="text-xl text-gray-100 mb-8">
              Uy tín - An toàn - Giá tốt nhất thị trường
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-white text-[#F5A65B] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Khám phá ngay
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Đăng ký miễn phí
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-[#F5A65B]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Bảo mật cao</h3>
            <p className="text-sm text-gray-600">
              Cam kết bảo mật thông tin 100%, giao dịch an toàn
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#1EA7FD]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Giao dịch nhanh</h3>
            <p className="text-sm text-gray-600">
              Nhận tài khoản ngay sau khi thanh toán thành công
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#0D4D8B]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Đa dạng game</h3>
            <p className="text-sm text-gray-600">
              Hơn 1000+ tài khoản game hot nhất hiện nay
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-[#1EA7FD] to-[#F5A65B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <stat.icon className="w-8 h-8" />
                </div>
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-gray-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Games */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Game phổ biến
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {games.map((game, index) => (
            <Link
              key={index}
              to="/shop"
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition group"
            >
              <div className="relative h-32 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-white font-semibold text-sm">{game.name}</p>
                  <p className="text-white/80 text-xs">{game.count} tài khoản</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Accounts */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Tài khoản nổi bật
          </h2>
          <Link
            to="/shop"
            className="text-[#F5A65B] hover:text-[#1EA7FD] font-semibold"
          >
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAccounts.map((account) => (
            <GameAccountCard key={account.id} {...account} />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Bắt đầu ngay hôm nay!
          </h2>
          <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
            Đăng ký tài khoản miễn phí và khám phá hàng ngàn tài khoản game chất lượng
          </p>
          <Link
            to="/register"
            className="inline-block bg-[#1EA7FD] text-[#0D4D8B] px-8 py-3 rounded-lg font-semibold hover:bg-[#158DD8] transition"
          >
            Đăng ký miễn phí
          </Link>
        </div>
      </div>
    </div>
  );
}