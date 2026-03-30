import { useEffect, useMemo, useState } from "react";
import { FilterSidebar } from "../components/FilterSidebar";
import { GameAccountCard } from "../components/GameAccountCard";
import { Banner } from "../components/Banner";
import { gameAccountService, gameCategoryService } from "../services";
import type { GameAccount, GameAccountImage } from "../services/types";
import ErrorHandler from "../utils/errorHandler";

export function ShopPage() {
  const [selectedGame, setSelectedGame] = useState("Tất cả");
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchShopData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          gameAccountService.getList({ page: 1, limit: 100 }),
          gameCategoryService.getList({ page: 1, limit: 100 }),
        ]);

        const mappedCategories = categoriesRes.data.reduce<Record<string, string>>((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        setCategoryMap(mappedCategories);
        setAccounts(accountsRes.data);
      } catch (error: unknown) {
        setErrorMessage(ErrorHandler.getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopData();
  }, []);

  const filteredAccounts = useMemo(() => {
    const availableAccounts = accounts.filter(account => account.status === "AVAILABLE");

    if (selectedGame === "Tất cả") {
      return availableAccounts;
    }

    return availableAccounts.filter(account => categoryMap[account.categoryId] === selectedGame);
  }, [accounts, categoryMap, selectedGame]);

  const cardData = useMemo(
    () =>
      filteredAccounts.map(account => {
        const firstImage = account.images?.[0];
        const imageUrl =
          typeof firstImage === "string"
            ? firstImage
            : (firstImage as GameAccountImage | undefined)?.url ||
              "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80";

        return {
          id: account.id,
          gameName: categoryMap[account.categoryId] || "Game Account",
          rank: account.rank || "Chưa có rank",
          price: account.price,
          image: imageUrl,
          verified: account.status === "AVAILABLE",
          champions: account.level ? `Level ${account.level}` : undefined,
          skins: account.description || undefined,
        };
      }),
    [categoryMap, filteredAccounts],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Banner />

      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar selectedGame={selectedGame} onGameChange={setSelectedGame} />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {selectedGame === "Tất cả" ? "Tất cả tài khoản" : selectedGame}
              </h2>
              <p className="text-gray-600">{cardData.length} tài khoản</p>
            </div>

            {isLoading && <p className="text-gray-600 mb-4">Đang tải danh sách tài khoản...</p>}
            {errorMessage && !isLoading && <p className="text-red-600 mb-4">{errorMessage}</p>}

            {/* Account Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {cardData.map(account => (
                <GameAccountCard key={account.id} {...account} />
              ))}
            </div>

            {!isLoading && !errorMessage && cardData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Không tìm thấy tài khoản phù hợp</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
