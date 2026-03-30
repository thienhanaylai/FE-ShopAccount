// Global API configuration
const VITE_ENV = (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env;

export const API_CONFIG = {
  BASE_URL: "http://localhost:3000/",
  TIMEOUT: 30000,
  ENDPOINTS: {
    // Auth
    AUTH_REGISTER: "/auth/register",
    AUTH_LOGIN: "/auth/login",

    // Users
    USERS: "/users",
    USER_BY_ID: (id: string) => `/users/${id}`,
    USER_ADMIN_UPDATE: (id: string) => `/users/${id}/admin-update`,

    // Game Categories
    GAME_CATEGORIES: "/game-categories",
    GAME_CATEGORY_BY_ID: (id: string) => `/game-categories/${id}`,

    // Game Accounts
    GAME_ACCOUNTS: "/game-accounts",
    GAME_ACCOUNT_BY_ID: (id: string) => `/game-accounts/${id}`,

    // Orders
    ORDERS: "/orders",
    ORDER_BY_ID: (id: string) => `/orders/${id}`,

    // Transactions
    TRANSACTIONS: "/transactions",
    TRANSACTION_BY_ID: (id: string) => `/transactions/${id}`,

    // Wallets
    WALLET_TOP_UP: "/wallets/top-up",
    WALLET_WITHDRAW: "/wallets/withdraw",
    WALLET_TRANSFER: "/wallets/transfer",
    WALLET_BALANCE: "/wallets/me/balance",
    WALLET_HISTORY: "/wallets/me/history",
    WALLET_ADMIN_ADJUST: "/wallets/admin/adjust",

    // Media
    MEDIA_UPLOAD: "/media/upload",
    MEDIA_DETAILS: "/media/details",
    MEDIA_URL: "/media/url",

    // Sell Requests
    SELL_REQUESTS: "/sell-requests",
    SELL_REQUEST_BY_ID: (id: string) => `/sell-requests/${id}`,

    // Support Tickets
    SUPPORT_TICKETS: "/support-tickets",
    SUPPORT_TICKET_BY_ID: (id: string) => `/support-tickets/${id}`,
    SUPPORT_TICKET_START_PROCESSING: (id: string) => `/support-tickets/${id}/start-processing`,
    SUPPORT_TICKET_REPLY: (id: string) => `/support-tickets/${id}/reply`,

    // Account Trades
    ACCOUNT_TRADES_PURCHASES: "/account-trades/me/purchases",
    ACCOUNT_TRADES_BUY: (id: string) => `/account-trades/buy/${id}`,
    ACCOUNT_TRADES_APPROVE_SELL: (id: string) => `/account-trades/sell-requests/${id}/approve`,
    ACCOUNT_TRADES_REJECT_SELL: (id: string) => `/account-trades/sell-requests/${id}/reject`,

    // Website Settings
    WEBSITE_SETTINGS: "/website-settings",
  },
} as const;

// Token storage keys
export const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER: "user",
  TOKEN_ROTATION_HEADER: "x-token-rotated",
  NEW_TOKEN_HEADER: "x-access-token",
} as const;

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  SERVER_ERROR: 500,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 20,
  MAX_LIMIT: 100,
} as const;
