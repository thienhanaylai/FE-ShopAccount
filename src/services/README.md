# API Services Documentation

Đây là tài liệu sử dụng API Services layer cho BE-ShopAccount.

## Mục lục

- [Cài đặt](#cài-đặt)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Cách sử dụng](#cách-sử-dụng)
- [Services](#services)
- [Error Handling](#error-handling)
- [Token Management](#token-management)

## Cài đặt

### Environment Variables

Tạo file `.env.local` trong root project:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Cấu trúc thư mục

```
src/
├── config/
│   └── api.config.ts          # Cấu hình API endpoints & constants
├── services/
│   ├── types/
│   │   └── index.ts           # Tất cả TypeScript types & interfaces
│   ├── axios.ts               # Axios instance & interceptors
│   ├── auth.service.ts        # Authentication service
│   ├── user.service.ts        # User management service
│   ├── gameCategory.service.ts # Game categories service
│   ├── gameAccount.service.ts  # Game accounts service
│   ├── order.service.ts        # Orders service
│   ├── transaction.service.ts  # Transactions service
│   ├── wallet.service.ts       # Wallet/balance service
│   ├── media.service.ts        # Media upload service
│   ├── sellRequest.service.ts  # Sell requests service
│   ├── supportTicket.service.ts # Support tickets service
│   ├── accountTrade.service.ts  # Account trading service
│   ├── websiteSetting.service.ts # Website settings service
│   └── index.ts               # Export tất cả services
└── utils/
    ├── errorHandler.ts        # Error handling utility
    └── tokenUtils.ts          # Token & user management
```

## Cách sử dụng

### 1. Authentication (Đăng nhập / Đăng ký)

```typescript
import { authService } from "@/services";

// Đăng ký
const registerData = await authService.register({
  username: "user123",
  email: "user@example.com",
  password: "Pass@123",
  phone: "0901234567",
});

// Đăng nhập
const loginData = await authService.login({
  email: "user@example.com",
  password: "Pass@123",
});

// Check đăng nhập
const isAuth = authService.isAuthenticated();

// Lấy user hiện tại
const currentUser = authService.getCurrentUser();

// Đăng xuất
authService.logout();
```

### 2. User Management

```typescript
import { userService } from "@/services";

// Tạo user
const newUser = await userService.create({
  username: "newuser",
  email: "new@example.com",
  password: "Pass@123",
});

// Lấy danh sách users (có phân trang)
const userList = await userService.getList({
  page: 1,
  limit: 20,
  role: "CUSTOMER",
  status: "ACTIVE",
});

// Lấy user theo ID
const user = await userService.getById("usr_123");

// Update user
const updatedUser = await userService.update("usr_123", {
  phone: "0911111111",
  status: "ACTIVE",
});

// Update user (admin only)
const adminUpdated = await userService.adminUpdate("usr_123", {
  phone: "0922222222",
  role: "ADMIN",
});

// Xóa user
await userService.delete("usr_123");
```

### 3. Game Categories

```typescript
import { gameCategoryService } from "@/services";

// Tạo category
const category = await gameCategoryService.create({
  name: "Valorant",
  slug: "valorant",
  description: "Valorant game accounts",
  isActive: true,
  icon: "https://example.com/icon.png",
  // Hoặc upload icon file:
  // iconFile: File object
});

// Lấy danh sách categories
const categories = await gameCategoryService.getList({
  page: 1,
  limit: 20,
  isActive: true,
});

// Lấy category theo ID
const cat = await gameCategoryService.getById("cat_123");

// Update category
const updated = await gameCategoryService.update("cat_123", {
  description: "Updated description",
});

// Xóa category
await gameCategoryService.delete("cat_123");
```

### 4. Game Accounts

```typescript
import { gameAccountService } from "@/services";

// Tạo game account (with images)
const account = await gameAccountService.create({
  categoryId: "cat_123",
  username: "account_login",
  email: "acc@game.com",
  password: "secret123",
  price: 120000,
  level: 20,
  rank: "Gold",
  description: "High rank account",
  images: ["https://example.com/img1.jpg"],
  imageFiles: [File1, File2], // Optional: upload images
});

// Lấy danh sách accounts
const accounts = await gameAccountService.getList({
  page: 1,
  limit: 20,
  categoryId: "cat_123",
  status: "AVAILABLE",
  minPrice: 50000,
  maxPrice: 500000,
});

// Lấy account theo ID
const acc = await gameAccountService.getById("ga_123");

// Update account
const updated = await gameAccountService.update("ga_123", {
  price: 150000,
  status: "RESERVED",
});

// Xóa account
await gameAccountService.delete("ga_123");
```

### 5. Orders

```typescript
import { orderService } from "@/services";

// Tạo order
const order = await orderService.create({
  userId: "usr_123",
  gameAccountId: "ga_123",
  price: 120000,
  status: "PENDING",
});

// Lấy danh sách orders
const orders = await orderService.getList({
  page: 1,
  limit: 20,
  userId: "usr_123",
  status: "PAID",
});

// Lấy order theo ID
const ord = await orderService.getById("ord_123");

// Update order
const updated = await orderService.update("ord_123", {
  status: "COMPLETED",
});

// Xóa order
await orderService.delete("ord_123");
```

### 6. Transactions

```typescript
import { transactionService, TransactionMethod } from "@/services";

// Tạo transaction
const txn = await transactionService.create({
  userId: "usr_123",
  orderId: "ord_123",
  method: TransactionMethod.PAYMENT,
  price: 120000,
  status: "SUCCESS",
});

// Transfer (transferring money)
const transfer = await transactionService.create({
  userId: "usr_123",
  method: TransactionMethod.TRANSFER,
  recipientUserId: "usr_456",
  price: 50000,
});

// List transactions
const txns = await transactionService.getList({
  page: 1,
  limit: 20,
  userId: "usr_123",
  method: TransactionMethod.PAYMENT,
  status: "SUCCESS",
});

// Get transaction
const transaction = await transactionService.getById("txn_123");

// Update transaction
const updated = await transactionService.update("txn_123", {
  status: "REFUNDED",
});

// Delete transaction
await transactionService.delete("txn_123");
```

### 7. Wallets (Ví tiền)

```typescript
import { walletService } from "@/services";

// Nạp tiền (top up)
const topup = await walletService.topUp({
  amount: 200000,
  channel: "BANK_TRANSFER",
  referenceId: "ref_123",
  note: "Nạp tiền",
});

// Rút tiền (withdraw)
const withdraw = await walletService.withdraw({
  amount: 100000,
  provider: "VIETCOMBANK",
  accountNumber: "1234567890",
  accountName: "Nguyen Van A",
  note: "Rút tiền",
});

// Chuyển tiền
const transfer = await walletService.transfer({
  toUserId: "usr_456",
  amount: 50000,
  message: "Chuyển tiền",
});

// Lấy số dư
const balance = await walletService.getBalance();
// Response: { userId: 'usr_123', balance: 500000, balanceUpdatedAt: '...' }

// Lấy lịch sử giao dịch
const history = await walletService.getHistory({
  page: 1,
  limit: 20,
  type: "TRANSFER",
  status: "SUCCESS",
});

// Admin: Điều chỉnh số dư
const adjusted = await walletService.adminAdjust({
  userId: "usr_123",
  amount: 100000,
  direction: "CREDIT", // CREDIT or DEBIT
  reason: "Manual adjustment",
});
```

### 8. Media (Upload ảnh)

```typescript
import { mediaService } from "@/services";

// Upload ảnh
const uploaded = await mediaService.upload(
  imageFile, // File object
  "game-accounts", // Optional folder
);
// Response: { publicId, url, width, height, format, bytes, folder }

// Lấy chi tiết ảnh
const details = await mediaService.getDetails("public_id_123");

// Lấy URL ảnh
const urlInfo = await mediaService.getUrl("public_id_123");
// Response: { url: '...' }
```

### 9. Sell Requests

```typescript
import { sellRequestService } from "@/services";

// Tạo yêu cầu bán account
const request = await sellRequestService.create({
  userId: "usr_123",
  price: 150000,
  accountUsername: "my_account",
  accountPassword: "secret",
  description: "Rank Diamond account",
});

// Lấy danh sách
const requests = await sellRequestService.getList({
  page: 1,
  limit: 20,
  status: "PENDING",
});

// Lấy theo ID
const req = await sellRequestService.getById("sr_123");

// Update
const updated = await sellRequestService.update("sr_123", {
  status: "APPROVED",
});

// Xóa
await sellRequestService.delete("sr_123");
```

### 10. Support Tickets

```typescript
import { supportTicketService } from "@/services";

// Tạo ticket
const ticket = await supportTicketService.create({
  title: "Cannot login to account",
  description: "I cannot login with provided credentials",
  category: "account",
});

// Lấy danh sách
const tickets = await supportTicketService.getList({
  page: 1,
  limit: 20,
  category: "account",
  status: "PENDING",
});

// Lấy theo ID
const tkt = await supportTicketService.getById("st_123");

// Update ticket (user only)
const updated = await supportTicketService.update("st_123", {
  description: "Updated description",
});

// Admin: Start processing
const processing = await supportTicketService.startProcessing("st_123");

// Admin: Reply to ticket
const replied = await supportTicketService.reply("st_123", {
  message: "We are checking your account...",
  status: "IN_PROGRESS",
});

// Xóa ticket
await supportTicketService.delete("st_123");
```

### 11. Account Trades

```typescript
import { accountTradeService } from "@/services";

// Lấy lịch sử mua accounts
const purchases = await accountTradeService.getPurchaseHistory({
  page: 1,
  limit: 20,
});

// Mua account
const buyResult = await accountTradeService.buy("ga_123", {
  expectedPrice: 120000, // Optional: prevent race condition
});
// Response includes: buyer info, order, transaction, purchased account

// Admin: Approve sell request
const approved = await accountTradeService.approveSellRequest("sr_123");

// Admin: Reject sell request
const rejected = await accountTradeService.rejectSellRequest("sr_123", {
  reason: "Invalid account information",
});
```

### 12. Website Settings (Admin only)

```typescript
import { websiteSettingService } from "@/services";

// Lấy cấu hình website
const settings = await websiteSettingService.get();

// Update cấu hình
const updated = await websiteSettingService.update({
  siteName: "ShopAccount Pro",
  contactEmail: "admin@shopaccount.vn",
  commissionRate: 7,
  maintenanceMode: false,
});
```

## 🛡️ Error Handling

```typescript
import { ErrorHandler } from "@/utils/errorHandler";
import { userService } from "@/services";

try {
  const user = await userService.getById("usr_123");
} catch (error) {
  // Lấy error message
  const message = ErrorHandler.getErrorMessage(error);
  console.error(message);

  // Check error type
  if (ErrorHandler.isAuthError(error)) {
    // Handle 401 - redirect to login
    window.location.href = "/login";
  } else if (ErrorHandler.isNotFoundError(error)) {
    // Handle 404
  } else if (ErrorHandler.isValidationError(error)) {
    // Handle 400 validation
  } else if (ErrorHandler.isConflictError(error)) {
    // Handle 409 conflict
  } else if (ErrorHandler.isForbiddenError(error)) {
    // Handle 403 forbidden
  }
}
```

## 🔐 Token Management

```typescript
import TokenUtils from "@/utils/tokenUtils";

// Lấy token
const token = TokenUtils.getToken();

// Set token
TokenUtils.setToken("new_token");

// Check authenticated
if (TokenUtils.isAuthenticated()) {
  // User is logged in
}

// Get current user
const user = TokenUtils.getUser();

// Check role
if (TokenUtils.isAdmin()) {
  // User is admin
}

if (TokenUtils.isCustomer()) {
  // User is customer
}

// Clear all (logout)
TokenUtils.clear();
```

## 📡 Axios Configuration

Axios instance đã konfigurasi với:

- **Base URL**: Từ `VITE_API_BASE_URL` environment variable
- **Timeout**: 30 giây
- **Request Interceptor**: Tự động append JWT token vào header Authorization
- **Response Interceptor**: Xử lý token rotation tự động
- **Error Handling**: Xử lý 401 errors (redirect to login)

## 🔄 Token Rotation

Server có thể gửi token mới qua headers:

- `x-token-rotated: true`
- `x-access-token: <new_token>`

Axios interceptor sẽ tự động lưu token mới vào localStorage.

## 💡 Tips & Best Practices

1. **Import từ index để dễ dàng:**

   ```typescript
   import { userService, authService } from "@/services";
   ```

2. **Sử dụng TypeScript types:**

   ```typescript
   import { User, Order, TransactionMethod } from "@/services";
   ```

3. **Luôn handle errors:**

   ```typescript
   try {
     await userService.update(id, data);
   } catch (error) {
     ErrorHandler.getErrorMessage(error);
   }
   ```

4. **Check authentication before making requests:**

   ```typescript
   if (TokenUtils.isAuthenticated()) {
     // Make API call
   }
   ```

5. **Logout khi nhận 401:**
   ```typescript
   if (ErrorHandler.isAuthError(error)) {
     TokenUtils.clear();
     window.location.href = "/login";
   }
   ```
