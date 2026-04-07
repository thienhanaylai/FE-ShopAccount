import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { FilterSidebar } from "../components/FilterSidebar";
import { GameAccountCard } from "../components/GameAccountCard";
import { Banner } from "../components/Banner";
import { gameAccountService, gameCategoryService } from "../services";
import { GameAccountStatus, type GameAccount, type GameAccountImage } from "../services/types";
import ErrorHandler from "../utils/errorHandler";

const PRICE_RANGES: Record<string, { min?: number; max?: number }> = {
  "under-100k": { max: 100_000 },
  "100k-500k": { min: 100_000, max: 500_000 },
  "500k-1m": { min: 500_000, max: 1_000_000 },
  "1m-5m": { min: 1_000_000, max: 5_000_000 },
  "over-5m": { min: 5_000_000 },
};

function inPriceRange(price: number, rangeId: string): boolean {
  const range = PRICE_RANGES[rangeId];
  if (!range) return true;

  const meetsMin = range.min === undefined || price >= range.min;
  const meetsMax = range.max === undefined || price < range.max;
  return meetsMin && meetsMax;
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryId = searchParams.get("categoryId") || "all";
  const initialPriceRanges = (searchParams.get("priceRanges") || "")
    .split(",")
    .map(item => item.trim())
    .filter(item => !!item && item in PRICE_RANGES);

  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategoryId);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(initialPriceRanges);
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchShopData() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [accountsRes, categoriesRes] = await Promise.all([
          gameAccountService.getList({ page: 1, limit: 100 }),
          gameCategoryService.getList({ page: 1, limit: 100, isActive: true }),
        ]);

        const mappedCategories = categoriesRes.data.reduce<Record<string, string>>((acc, category) => {
          acc[category.id] = category.name;
          return acc;
        }, {});

        const categoryOptions = categoriesRes.data.map(category => ({
          id: category.id,
          name: category.name,
        }));

        setCategoryMap(mappedCategories);
        setCategories(categoryOptions);
        setAccounts(accountsRes.data);
      } catch (error: unknown) {
        setErrorMessage(ErrorHandler.getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId === "all") return;
    if (Object.keys(categoryMap).length === 0) return;
    if (!categoryMap[selectedCategoryId]) {
      setSelectedCategoryId("all");
    }
  }, [selectedCategoryId, categoryMap]);

  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategoryId === "all") {
      params.delete("categoryId");
    } else {
      params.set("categoryId", selectedCategoryId);
    }

    if (selectedPriceRanges.length === 0) {
      params.delete("priceRanges");
    } else {
      params.set("priceRanges", selectedPriceRanges.join(","));
    }

    setSearchParams(params, { replace: true });
  }, [selectedCategoryId, selectedPriceRanges, setSearchParams]);

  const filteredAccounts = useMemo(() => {
    let result = accounts.filter(account => account.status === GameAccountStatus.AVAILABLE);

    if (selectedCategoryId !== "all") {
      result = result.filter(account => account.categoryId === selectedCategoryId);
    }

    if (selectedPriceRanges.length > 0) {
      result = result.filter(account => selectedPriceRanges.some(rangeId => inPriceRange(account.price, rangeId)));
    }

    return result;
  }, [accounts, selectedCategoryId, selectedPriceRanges]);

  const selectedCategoryName =
    selectedCategoryId === "all" ? "Tất cả tài khoản" : (categoryMap[selectedCategoryId] ?? "Danh mục");

  const handlePriceRangeToggle = (rangeId: string) => {
    setSelectedPriceRanges(prev => {
      if (prev.includes(rangeId)) {
        return prev.filter(item => item !== rangeId);
      }
      return [...prev, rangeId];
    });
  };

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
            <FilterSidebar
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryChange={setSelectedCategoryId}
              selectedPriceRanges={selectedPriceRanges}
              onPriceRangeToggle={handlePriceRangeToggle}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{selectedCategoryName}</h2>
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
