import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Users, Gamepad2, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Clock, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  gameAccountService,
  gameCategoryService,
  orderService,
  userService,
  type GameAccount,
  GameAccountStatus,
  type GameCategory,
  type Order,
  OrderStatus,
  type User,
} from "../../services";
import ErrorHandler from "../../utils/errorHandler";

type TrendDirection = "up" | "down";

type NormalizedList<T> = {
  items: T[];
  total: number;
  totalPages: number;
};

type TrendData = {
  change: string;
  trend: TrendDirection;
};

type StatCard = {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: typeof Users;
  color: string;
};

type DateRange = {
  start: Date;
  end: Date;
};

const CHART_COLORS = ["#FF2E63", "#08D9D6", "#10B981", "#F59E0B", "#6366F1"];
const LIST_LIMIT = 100;
const MAX_PAGES = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeListPayload<T>(payload: unknown): NormalizedList<T> {
  if (Array.isArray(payload)) {
    return {
      items: payload as T[],
      total: payload.length,
      totalPages: 1,
    };
  }

  if (isRecord(payload)) {
    const rawData = payload.data;
    const rawPagination = payload.pagination;

    const items = Array.isArray(rawData) ? (rawData as T[]) : [];
    const total = isRecord(rawPagination) ? toNumber(rawPagination.total, items.length) : items.length;
    const totalPages = isRecord(rawPagination) ? Math.max(1, toNumber(rawPagination.totalPages, 1)) : 1;

    return {
      items,
      total,
      totalPages,
    };
  }

  return {
    items: [],
    total: 0,
    totalPages: 1,
  };
}

async function fetchAllPages<T>(
  loader: (page: number, limit: number) => Promise<unknown>,
  limit = LIST_LIMIT,
  maxPages = MAX_PAGES,
): Promise<NormalizedList<T>> {
  const firstPayload = await loader(1, limit);
  const firstPage = normalizeListPayload<T>(firstPayload);

  let items = [...firstPage.items];
  const totalPages = Math.min(firstPage.totalPages, maxPages);

  if (totalPages > 1) {
    const restPagesPayload = await Promise.all(Array.from({ length: totalPages - 1 }, (_, index) => loader(index + 2, limit)));

    for (const payload of restPagesPayload) {
      items = items.concat(normalizeListPayload<T>(payload).items);
    }
  }

  return {
    items,
    total: firstPage.total || items.length,
    totalPages,
  };
}

function buildDayRange(baseDate: Date): DateRange {
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(baseDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function buildMonthRange(baseDate: Date): DateRange {
  const start = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

function buildWeekRange(baseDate: Date): DateRange {
  const start = new Date(baseDate);
  const day = start.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  start.setDate(start.getDate() + diffToMonday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

function addMonths(baseDate: Date, amount: number): Date {
  return new Date(baseDate.getFullYear(), baseDate.getMonth() + amount, 1, 0, 0, 0, 0);
}

function addDays(baseDate: Date, amount: number): Date {
  const next = new Date(baseDate);
  next.setDate(next.getDate() + amount);
  return next;
}

function isWithinRange(dateValue: string | undefined, range: DateRange): boolean {
  if (!dateValue) return false;
  const time = new Date(dateValue).getTime();
  if (Number.isNaN(time)) return false;

  return time >= range.start.getTime() && time <= range.end.getTime();
}

function calculateTrend(current: number, previous: number): TrendData {
  if (previous === 0 && current === 0) {
    return { change: "0.0%", trend: "up" };
  }

  if (previous === 0) {
    return { change: "+100.0%", trend: "up" };
  }

  const percent = ((current - previous) / Math.abs(previous)) * 100;
  const trend: TrendDirection = percent >= 0 ? "up" : "down";
  const sign = percent > 0 ? "+" : "";

  return {
    change: `${sign}${percent.toFixed(1)}%`,
    trend,
  };
}

function formatCurrency(value: number): string {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.round(value));
}

function formatRelativeTime(value: string): string {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "--";

  const diff = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Vừa xong";
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))} phút trước`;
  if (diff < day) return `${Math.max(1, Math.floor(diff / hour))} giờ trước`;

  return `${Math.max(1, Math.floor(diff / day))} ngày trước`;
}

function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PAID:
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-700";
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-700";
    case OrderStatus.CANCELLED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case OrderStatus.PAID:
      return "Đã thanh toán";
    case OrderStatus.COMPLETED:
      return "Hoàn thành";
    case OrderStatus.PENDING:
      return "Chờ xử lý";
    case OrderStatus.CANCELLED:
      return "Đã hủy";
    default:
      return status;
  }
}

export function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [accounts, setAccounts] = useState<GameAccount[]>([]);
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [totalUsers, setTotalUsers] = useState(0);
  const [availableAccountsTotal, setAvailableAccountsTotal] = useState(0);
  const [todayOrdersTotal, setTodayOrdersTotal] = useState(0);

  const loadDashboard = useCallback(async () => {
    setErrorMessage(null);

    try {
      const now = new Date();
      const todayRange = buildDayRange(now);
      const sixMonthsAgo = addMonths(now, -5);
      const sixMonthsRange: DateRange = {
        start: new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1, 0, 0, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };

      const [userResult, accountResult, categoryPayload, orderResult, availablePayload, todayOrdersPayload] = await Promise.all([
        fetchAllPages<User>((page, limit) => userService.getList({ page, limit }) as Promise<unknown>),
        fetchAllPages<GameAccount>((page, limit) => gameAccountService.getList({ page, limit }) as Promise<unknown>),
        gameCategoryService.getList({ page: 1, limit: 100 }) as Promise<unknown>,
        fetchAllPages<Order>(
          (page, limit) =>
            orderService.getList({
              page,
              limit,
              fromDate: sixMonthsRange.start.toISOString(),
              toDate: sixMonthsRange.end.toISOString(),
            }) as Promise<unknown>,
        ),
        gameAccountService.getList({ page: 1, limit: 1, status: GameAccountStatus.AVAILABLE }) as Promise<unknown>,
        orderService.getList({
          page: 1,
          limit: 1,
          fromDate: todayRange.start.toISOString(),
          toDate: todayRange.end.toISOString(),
        }) as Promise<unknown>,
      ]);

      const normalizedCategories = normalizeListPayload<GameCategory>(categoryPayload);
      const normalizedAvailable = normalizeListPayload<GameAccount>(availablePayload);
      const normalizedTodayOrders = normalizeListPayload<Order>(todayOrdersPayload);

      setUsers(userResult.items);
      setAccounts(accountResult.items);
      setCategories(normalizedCategories.items);
      setOrders(orderResult.items);

      setTotalUsers(userResult.total);
      setAvailableAccountsTotal(normalizedAvailable.total);

      const fallbackTodayCount = orderResult.items.filter(order => isWithinRange(order.createdAt, todayRange)).length;
      setTodayOrdersTotal(normalizedTodayOrders.total || fallbackTodayCount);
    } catch (error) {
      setUsers([]);
      setAccounts([]);
      setCategories([]);
      setOrders([]);
      setTotalUsers(0);
      setAvailableAccountsTotal(0);
      setTodayOrdersTotal(0);
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      await loadDashboard();
      setIsLoading(false);
    };

    void run();
  }, [loadDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboard();
    setIsRefreshing(false);
  };

  const categoryNameById = useMemo(() => {
    return categories.reduce<Record<string, string>>((acc, category) => {
      acc[category.id] = category.name;
      return acc;
    }, {});
  }, [categories]);

  const userNameById = useMemo(() => {
    return users.reduce<Record<string, string>>((acc, user) => {
      acc[user.id] = user.username || user.email || user.id;
      return acc;
    }, {});
  }, [users]);

  const accountById = useMemo(() => {
    return accounts.reduce<Record<string, GameAccount>>((acc, account) => {
      acc[account.id] = account;
      return acc;
    }, {});
  }, [accounts]);

  const revenueData = useMemo(() => {
    const now = new Date();
    const weeks = Array.from({ length: 4 }, (_, index) => addDays(now, (index - 3) * 7));

    return weeks.map(date => {
      const range = buildWeekRange(date);
      const weekOrders = orders.filter(order => isWithinRange(order.createdAt, range));
      const revenue = weekOrders
        .filter(order => order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED)
        .reduce((sum, order) => sum + toNumber(order.price), 0);

      const startLabel = `${String(range.start.getDate()).padStart(2, "0")}/${String(range.start.getMonth() + 1).padStart(2, "0")}`;
      const endLabel = `${String(range.end.getDate()).padStart(2, "0")}/${String(range.end.getMonth() + 1).padStart(2, "0")}`;

      return {
        period: `${startLabel} - ${endLabel}`,
        revenue: Number((revenue / 1_000_000).toFixed(2)),
        orders: weekOrders.length,
      };
    });
  }, [orders]);

  const gameDistribution = useMemo(() => {
    const countByCategory = new Map<string, number>();

    for (const account of accounts) {
      const key = account.categoryId || "unknown";
      countByCategory.set(key, (countByCategory.get(key) || 0) + 1);
    }

    const sorted = Array.from(countByCategory.entries())
      .map(([categoryId, value]) => ({
        name: categoryNameById[categoryId] || "Khác",
        value,
      }))
      .sort((a, b) => b.value - a.value);

    if (sorted.length <= 5) return sorted;

    const top = sorted.slice(0, 4);
    const otherValue = sorted.slice(4).reduce((sum, item) => sum + item.value, 0);
    return [...top, { name: "Khác", value: otherValue }];
  }, [accounts, categoryNameById]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6)
      .map(order => {
        const userName = order.user?.username || order.user?.email || userNameById[order.userId] || order.userId;
        const account = order.gameAccount || accountById[order.gameAccountId];
        const gameName = account?.categoryId ? categoryNameById[account.categoryId] || account.categoryId : order.gameAccountId;

        return {
          id: order.id,
          user: userName,
          game: gameName,
          price: toNumber(order.price),
          status: order.status,
          time: formatRelativeTime(order.createdAt),
        };
      });
  }, [orders, userNameById, accountById, categoryNameById]);

  const stats = useMemo<StatCard[]>(() => {
    const now = new Date();
    const currentMonth = buildMonthRange(now);
    const previousMonth = buildMonthRange(addMonths(now, -1));
    const yesterday = buildDayRange(new Date(now.getTime() - 24 * 60 * 60 * 1000));

    const usersThisMonth = users.filter(user => isWithinRange(user.createdAt, currentMonth)).length;
    const usersLastMonth = users.filter(user => isWithinRange(user.createdAt, previousMonth)).length;

    const availableThisMonth = accounts.filter(
      account => account.status === GameAccountStatus.AVAILABLE && isWithinRange(account.createdAt, currentMonth),
    ).length;
    const availableLastMonth = accounts.filter(
      account => account.status === GameAccountStatus.AVAILABLE && isWithinRange(account.createdAt, previousMonth),
    ).length;

    const yesterdayOrders = orders.filter(order => isWithinRange(order.createdAt, yesterday)).length;

    const revenueThisMonth = orders
      .filter(
        order =>
          isWithinRange(order.createdAt, currentMonth) &&
          (order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED),
      )
      .reduce((sum, order) => sum + toNumber(order.price), 0);

    const revenueLastMonth = orders
      .filter(
        order =>
          isWithinRange(order.createdAt, previousMonth) &&
          (order.status === OrderStatus.PAID || order.status === OrderStatus.COMPLETED),
      )
      .reduce((sum, order) => sum + toNumber(order.price), 0);

    const usersTrend = calculateTrend(usersThisMonth, usersLastMonth);
    const availableTrend = calculateTrend(availableThisMonth, availableLastMonth);
    const ordersTrend = calculateTrend(todayOrdersTotal, yesterdayOrders);
    const revenueTrend = calculateTrend(revenueThisMonth, revenueLastMonth);

    return [
      {
        label: "Tổng người dùng",
        value: totalUsers.toLocaleString("vi-VN"),
        change: usersTrend.change,
        trend: usersTrend.trend,
        icon: Users,
        color: "bg-[#FF2E63]",
      },
      {
        label: "Tài khoản đang bán",
        value: availableAccountsTotal.toLocaleString("vi-VN"),
        change: availableTrend.change,
        trend: availableTrend.trend,
        icon: Gamepad2,
        color: "bg-[#08D9D6]",
      },
      {
        label: "Đơn hàng hôm nay",
        value: todayOrdersTotal.toLocaleString("vi-VN"),
        change: ordersTrend.change,
        trend: ordersTrend.trend,
        icon: ShoppingCart,
        color: "bg-green-500",
      },
      {
        label: "Doanh thu tháng này",
        value: formatCompactCurrency(revenueThisMonth),
        change: revenueTrend.change,
        trend: revenueTrend.trend,
        icon: DollarSign,
        color: "bg-yellow-500",
      },
    ];
  }, [users, accounts, orders, totalUsers, availableAccountsTotal, todayOrdersTotal]);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Tổng quan hệ thống Shopaccgiare.tech theo dữ liệu API thời gian thực</p>
        </div>
        <button
          onClick={() => void handleRefresh()}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isRefreshing || isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">{errorMessage}</div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className={`${stat.color} flex h-12 w-12 items-center justify-center rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="mb-1 text-2xl font-bold text-gray-800">{isLoading ? "..." : stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Doanh thu và đơn hàng 4 tuần gần nhất</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#FF2E63"
                name="Doanh thu (triệu)"
                strokeWidth={3}
                dot={{ fill: "#FF2E63" }}
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#08D9D6"
                name="Đơn hàng"
                strokeWidth={3}
                dot={{ fill: "#08D9D6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-800">Phân bố tài khoản theo game</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gameDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${typeof percent === "number" ? (percent * 100).toFixed(0) : 0}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {gameDistribution.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
          <Link to="/admin/orders" className="font-semibold text-[#FF2E63] transition-colors hover:text-[#d9254f]">
            Xem tất cả →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã đơn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Khách hàng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Game</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Giá trị</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Đang tải dữ liệu dashboard...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    Chưa có đơn hàng nào trong dữ liệu hiện tại.
                  </td>
                </tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-[#FF2E63]">{order.id}</td>
                    <td className="px-4 py-3">{order.user}</td>
                    <td className="px-4 py-3">{order.game}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(order.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="flex items-center gap-1 px-4 py-3 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      {order.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
