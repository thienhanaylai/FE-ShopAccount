import { useCallback, useEffect, useMemo, useState } from "react";
import { Gamepad2, Shield, Zap, TrendingUp, Star, Users } from "lucide-react";
import { Link } from "react-router";
import { GameAccountCard } from "../components/GameAccountCard";
import { gameCategoryService } from "../services/gameCategory.service";
import { gameAccountService } from "../services/gameAccount.service";
import {
  GameAccountStatus,
  type GameAccount,
  type GameCategory,
  type HomeAccountCard,
  type HomeGameCard,
} from "../services/types";
import ErrorHandler from "../utils/errorHandler";

const FALLBACK_GAME_IMAGE =
  "https://images.unsplash.com/photo-1511512578047-dfb367046420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

const HOME_STATS = [
  { label: "Tài khoản đã bán", value: "15,000+", icon: TrendingUp },
  { label: "Người dùng", value: "50,000+", icon: Users },
  { label: "Đánh giá 5 sao", value: "12,000+", icon: Star },
];

const resolveAccountImage = (images?: GameAccount["images"]): string => {
  if (!images || images.length === 0) {
    return FALLBACK_GAME_IMAGE;
  }

  const firstImage = images[0];
  if (typeof firstImage === "string") {
    return firstImage;
  }

  return firstImage?.url || FALLBACK_GAME_IMAGE;
};

const mapFeaturedAccounts = (accounts: GameAccount[], categoryMap: Map<string, GameCategory>): HomeAccountCard[] => {
  return accounts.slice(0, 4).map(account => {
    const category = categoryMap.get(account.categoryId);
    const rank = account.rank || (account.level ? `Level ${account.level}` : "Tài khoản game");

    return {
      id: account.id,
      gameName: category?.name || "Tài khoản game",
      rank,
      price: account.price,
      image: resolveAccountImage(account.images),
      verified: true,
      champions: account.description ? account.description.slice(0, 48) : `ID: ${account.username}`,
      skins: account.level ? `Level ${account.level}` : undefined,
    };
  });
};

const mapGames = (categories: GameCategory[], accounts: GameAccount[]): HomeGameCard[] => {
  const countByCategoryId = new Map<string, number>();
  accounts.forEach(account => {
    const current = countByCategoryId.get(account.categoryId) ?? 0;
    countByCategoryId.set(account.categoryId, current + 1);
  });

  return categories.slice(0, 4).map(category => ({
    name: category.name,
    count: countByCategoryId.get(category.id) ?? 0,
    image: category.icon || FALLBACK_GAME_IMAGE,
  }));
};

export function HomePage() {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadHomeData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [categoriesRes, accountsRes] = await Promise.all([
        gameCategoryService.getList({ page: 1, limit: 8, isActive: true }),
        gameAccountService.getList({ page: 1, limit: 12, status: GameAccountStatus.AVAILABLE }),
      ]);

      setCategories(categoriesRes.data || []);
      setAccounts(accountsRes.data || []);
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHomeData();
  }, [loadHomeData]);

  const categoryMap = useMemo(() => {
    return new Map(categories.map(category => [category.id, category]));
  }, [categories]);

  const featuredAccounts: HomeAccountCard[] = useMemo(() => {
    return mapFeaturedAccounts(accounts, categoryMap);
  }, [accounts, categoryMap]);

  const games = useMemo(() => {
    return mapGames(categories, accounts);
  }, [accounts, categories]);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0D4D8B] via-[#F5A65B] to-[#1EA7FD] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Mua Bán Tài Khoản Game Việt Nam</h1>
            <p className="text-xl text-gray-100 mb-8">Uy tín - An toàn - Giá tốt nhất thị trường</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-white text-[#F5A65B] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Khám phá ngay
              </Link>
              {!isLoggedIn ? (
                <Link
                  to="/register"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Đăng ký miễn phí
                </Link>
              ) : (
                <Link
                  to="/profile"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
                >
                  Trang cá nhân
                </Link>
              )}
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
            <p className="text-sm text-gray-600">Cam kết bảo mật thông tin 100%, giao dịch an toàn</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-[#1EA7FD]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Giao dịch nhanh</h3>
            <p className="text-sm text-gray-600">Nhận tài khoản ngay sau khi thanh toán thành công</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#0D4D8B]" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Đa dạng game</h3>
            <p className="text-sm text-gray-600">Hơn 1000+ tài khoản game hot nhất hiện nay</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gradient-to-r from-[#1EA7FD] to-[#F5A65B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOME_STATS.map((stat, index) => (
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
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Game phổ biến</h2>
        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 text-center">
            {errorMessage}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 rounded-xl bg-gray-200 animate-pulse" />
            ))}
          </div>
        )}

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
          <h2 className="text-3xl font-bold text-gray-800">Tài khoản nổi bật</h2>
          <Link to="/shop" className="text-[#F5A65B] hover:text-[#1EA7FD] font-semibold">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAccounts.map(account => (
            <GameAccountCard key={account.id} {...account} />
          ))}
        </div>
        {!isLoading && featuredAccounts.length === 0 && (
          <div className="mt-6 text-center text-gray-600">Chưa có tài khoản nổi bật để hiển thị.</div>
        )}
      </div>

      {/* CTA Section */}

      {!isLoggedIn ? (
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu ngay hôm nay!</h2>
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
      ) : (
        <></>
      )}
    </div>
  );
}
