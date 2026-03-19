// Base types
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}

// ============ ENUMS ============
export enum UserRole {
  CUSTOMER = "CUSTOMER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum GameAccountStatus {
  AVAILABLE = "AVAILABLE",
  RESERVED = "RESERVED",
  SOLD = "SOLD",
  HIDDEN = "HIDDEN",
}

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum TransactionMethod {
  TOP_UP = "TOP_UP",
  WITHDRAW = "WITHDRAW",
  TRANSFER = "TRANSFER",
  PAYMENT = "PAYMENT",
}

export enum SellRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum SupportTicketStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
  REJECTED = "REJECTED",
}

export enum BalanceAdjustDirection {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}

// ============ AUTH ============
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  balance?: number;
  balanceUpdatedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  passwordHash?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// ============ USERS ============
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface AdminUpdateUserRequest {
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

// ============ GAME CATEGORIES ============
export interface GameCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  isActive?: boolean;
  icon?: string; // URL
  iconFile?: File; // Form file upload
}

export interface UpdateGameCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  isActive?: boolean;
  icon?: string;
  iconFile?: File;
}

// ============ GAME ACCOUNTS ============
export interface GameAccountImage {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
}

export interface GameAccount {
  id: string;
  categoryId: string;
  username: string;
  email: string;
  password: string;
  price: number;
  status: GameAccountStatus;
  level?: number;
  rank?: string;
  images?: string[] | GameAccountImage[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameAccountRequest {
  categoryId: string;
  username: string;
  email: string;
  password: string;
  price: number;
  status?: GameAccountStatus;
  level?: number;
  rank?: string;
  description?: string;
  images?: string[]; // URLs
  imageFiles?: File[]; // Form file upload
}

export interface UpdateGameAccountRequest {
  username?: string;
  email?: string;
  password?: string;
  price?: number;
  status?: GameAccountStatus;
  level?: number;
  rank?: string;
  description?: string;
  images?: string[];
  imageFiles?: File[];
}

// ============ ORDERS ============
export interface Order {
  id: string;
  userId: string;
  gameAccountId: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  gameAccount?: GameAccount;
  user?: Partial<User>;
}

export interface CreateOrderRequest {
  userId: string;
  gameAccountId: string;
  price: number;
  status?: OrderStatus;
}

export interface UpdateOrderRequest {
  userId?: string;
  gameAccountId?: string;
  price?: number;
  status?: OrderStatus;
}

// ============ TRANSACTIONS ============
export interface Transaction {
  id: string;
  userId: string;
  orderId?: string;
  method: TransactionMethod;
  recipientUserId?: string;
  price: number;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  userId: string;
  orderId?: string;
  method: TransactionMethod;
  recipientUserId?: string; // Required if method = TRANSFER
  price: number;
  status?: TransactionStatus;
}

export interface UpdateTransactionRequest {
  status?: TransactionStatus;
}

// ============ WALLETS ============
export interface WalletBalance {
  userId: string;
  balance: number;
  balanceUpdatedAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: TransactionMethod;
  amount: number;
  status: TransactionStatus;
  referenceId?: string;
  note?: string;
  createdAt: string;
  updateAt: string;
}

export interface TopUpRequest {
  amount: number;
  channel: string;
  referenceId?: string;
  note?: string;
}

export interface WithdrawRequest {
  amount: number;
  provider: string;
  accountNumber: string;
  accountName: string;
  note?: string;
}

export interface TransferRequest {
  toUserId: string;
  amount: number;
  message?: string;
}

export interface BalanceAdjustRequest {
  userId: string;
  amount: number;
  direction: BalanceAdjustDirection;
  reason: string;
}

export interface WalletHistoryFilters {
  page?: number;
  limit?: number;
  type?: TransactionMethod;
  status?: TransactionStatus;
  fromDate?: string;
  toDate?: string;
}

// ============ MEDIA ============
export interface MediaUploadResponse {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  folder?: string;
}

export interface MediaDetails extends MediaUploadResponse {
  createdAt: string;
}

// ============ SELL REQUESTS ============
export interface SellRequest {
  id: string;
  userId: string;
  price: number;
  accountUsername: string;
  accountPassword: string;
  status: SellRequestStatus;
  description?: string;
  rejectReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellRequestRequest {
  userId: string;
  price: number;
  accountUsername: string;
  accountPassword: string;
  status?: SellRequestStatus;
  description?: string;
}

export interface UpdateSellRequestRequest {
  price?: number;
  accountUsername?: string;
  accountPassword?: string;
  status?: SellRequestStatus;
  description?: string;
  rejectReason?: string | null;
}

// ============ SUPPORT TICKETS ============
export interface SupportTicketReply {
  id: string;
  message: string;
  handledBy: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  status: SupportTicketStatus;
  handledBy?: string | null;
  replies?: SupportTicketReply[];
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupportTicketRequest {
  title: string;
  description: string;
  category: string;
}

export interface UpdateSupportTicketRequest {
  title?: string;
  description?: string;
  category?: string;
  status?: SupportTicketStatus;
}

export interface StartProcessingSupportTicketRequest {
  // Empty body, just endpoint
}

export interface ReplySupportTicketRequest {
  message: string;
  status?: SupportTicketStatus;
}

export interface SupportTicketFilters {
  page?: number;
  limit?: number;
  userId?: string;
  category?: string;
  status?: SupportTicketStatus;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

// ============ ACCOUNT TRADES ============
export interface AccountTradeHistory {
  id: string;
  userId: string;
  gameAccountId: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  gameAccount: GameAccount;
  transactions?: Transaction[];
}

export interface BuyAccountRequest {
  expectedPrice?: number;
}

export interface BuyAccountResponse {
  message: string;
  buyer: {
    userId: string;
    balanceBefore: number;
    balanceAfter: number;
    balanceUpdatedAt: string;
  };
  order: Order;
  transaction: Transaction;
  purchasedAccount: GameAccount & {
    soldPrice: number;
  };
}

export interface ApproveSellRequestResponse {
  id: string;
  userId: string;
  status: SellRequestStatus;
  updatedAt: string;
}

export interface RejectSellRequestRequest {
  reason: string;
}

export interface RejectSellRequestResponse {
  id: string;
  userId: string;
  status: SellRequestStatus;
  rejectReason: string;
  updatedAt: string;
}

// ============ WEBSITE SETTINGS ============
export interface WebsiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  commissionRate: number;
  minWithdraw: number;
  withdrawFee: number;
  viettelDiscount: number;
  vinaphoneDiscount: number;
  mobifoneDiscount: number;
  vietnamobileDiscount: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  depositNotifications: boolean;
  requireEmailVerification: boolean;
  requirePhoneVerification: boolean;
  twoFactorAuth: boolean;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateWebsiteSettingsRequest {
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  commissionRate?: number;
  minWithdraw?: number;
  withdrawFee?: number;
  viettelDiscount?: number;
  vinaphoneDiscount?: number;
  mobifoneDiscount?: number;
  vietnamobileDiscount?: number;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  orderNotifications?: boolean;
  depositNotifications?: boolean;
  requireEmailVerification?: boolean;
  requirePhoneVerification?: boolean;
  twoFactorAuth?: boolean;
  maintenanceMode?: boolean;
  maintenanceMessage?: string;
}

// ============ LIST FILTERS ============
export interface UserListFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface GameCategoryListFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface GameAccountListFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: GameAccountStatus;
  minPrice?: number;
  maxPrice?: number;
}

export interface OrderListFilters {
  page?: number;
  limit?: number;
  userId?: string;
  gameAccountId?: string;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
}

export interface TransactionListFilters {
  page?: number;
  limit?: number;
  userId?: string;
  orderId?: string;
  recipientUserId?: string;
  method?: TransactionMethod;
  status?: TransactionStatus;
  fromDate?: string;
  toDate?: string;
}

export interface SellRequestListFilters {
  page?: number;
  limit?: number;
  userId?: string;
  status?: SellRequestStatus;
  minPrice?: number;
  maxPrice?: number;
  fromDate?: string;
  toDate?: string;
}

export interface AccountTradeListFilters {
  page?: number;
  limit?: number;
}
