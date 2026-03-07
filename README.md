# 🛒 FE-ShopAccount — Quy tắc dự án

---

## Mục lục

1. [Cài đặt & Khởi chạy](#1-cài-đặt--khởi-chạy)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Quy tắc đặt tên](#3-quy-tắc-đặt-tên)
4. [Quy tắc viết React & JSX](#4-quy-tắc-viết-react--jsx)
5. [Quy tắc CSS & Styling](#5-quy-tắc-css--styling)
6. [Quy tắc gọi API](#6-quy-tắc-gọi-api)
7. [Quy trình Git](#7-quy-trình-git)
8. [Quy tắc Commit](#8-quy-tắc-commit)
9. [Xử lý Conflict](#9-xử-lý-conflict)
10. [Những điều TUYỆT ĐỐI không làm](#10-những-điều-tuyệt-đối-không-làm)

---

## 1. Cài đặt & Khởi chạy

```bash
git clone <url-du-an>
cd FE-ShopAccount
npm install
npm run dev
```

> **Lưu ý:** Mỗi khi `git pull` về, hãy chạy `npm install` nếu file `package.json` có thay đổi.

Các lệnh thường dùng:

| Lệnh              | Mục đích                     |
| ----------------- | ---------------------------- |
| `npm run dev`     | Khởi chạy server development |
| `npm run build`   | Build production             |
| `npm run lint`    | Kiểm tra lỗi ESLint          |
| `npm run preview` | Xem trước bản build          |

---

## 2. Cấu trúc thư mục

```
src/
├── api/            # Cấu hình axios, interceptors
├── assets/         # Ảnh, icon, font tĩnh
├── components/     # Component tái sử dụng (Button, Modal, Input…)
├── features/       # Module theo tính năng (auth, cart, product…)
│   └── auth/
│       ├── components/   # Component riêng của feature này
│       ├── hooks/        # Custom hooks riêng của feature
│       └── index.js      # Export public API của feature
├── pages/          # Các trang tương ứng với route (HomePage, LoginPage…)
├── services/       # Hàm gọi API (authService.js, productService.js…)
├── App.jsx
└── main.jsx
```

### Nguyên tắc đặt file vào đúng chỗ

| Loại file                          | Đặt ở đâu                                |
| ---------------------------------- | ---------------------------------------- |
| Component dùng lại ở nhiều nơi     | `src/components/`                        |
| Component chỉ dùng trong 1 feature | `src/features/<ten-feature>/components/` |
| Trang gắn với một route            | `src/pages/`                             |
| Hàm gọi API                        | `src/services/`                          |
| Cấu hình axios                     | `src/api/`                               |

---

## 3. Quy tắc đặt tên

### File & Thư mục

| Loại              | Quy tắc                   | Ví dụ                             |
| ----------------- | ------------------------- | --------------------------------- |
| Component React   | `PascalCase`              | `ProductCard.jsx`                 |
| Hook tùy chỉnh    | `camelCase`, prefix `use` | `useCart.js`                      |
| Service / Utility | `camelCase`               | `authService.js`, `formatDate.js` |
| Thư mục feature   | `kebab-case`              | `product-detail/`                 |
| File CSS module   | Trùng tên component       | `ProductCard.module.css`          |

### Biến & Hàm trong code

```jsx
// ✅ Đúng
const [isLoading, setIsLoading] = useState(false);
const [productList, setProductList] = useState([]);
const handleSubmit = () => { ... };
const fetchProducts = async () => { ... };

// ❌ Sai
const [loading, setloading] = useState(false);  // không nhất quán
const [data, setData] = useState([]);            // tên quá chung chung
const submit = () => { ... };                    // thiếu prefix "handle"
const getProducts = async () => { ... };         // dùng get thay vì fetch cho async API
```

### Quy tắc đặt tên biến

- **Boolean:** Luôn dùng prefix `is`, `has`, `can`, `should`
  - `isOpen`, `hasError`, `canSubmit`, `shouldRefetch`
- **Handler sự kiện:** Luôn dùng prefix `handle`
  - `handleClick`, `handleSubmit`, `handleInputChange`
- **Hàm gọi API:** Dùng prefix `fetch` hoặc động từ mô tả hành động
  - `fetchProducts`, `createOrder`, `updateProfile`, `deleteItem`
- **Không dùng tên quá chung:** Tránh `data`, `item`, `temp`, `obj`, `val`

---

## 4. Quy tắc viết React & JSX

### Cấu trúc một file Component

```jsx
// 1. Import thư viện ngoài
import { useState, useEffect } from "react";

// 2. Import component nội bộ
import ProductCard from "../components/ProductCard";

// 3. Import service / helper
import { fetchProducts } from "../services/productService";

// 4. Import styles
import styles from "./ProductList.module.css";

// --- Component ---
function ProductList() {
  // 5. State
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 6. useEffect
  useEffect(() => {
    loadProducts();
  }, []);

  // 7. Handler & helper functions
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 8. Render
  if (isLoading) return <p>Đang tải...</p>;

  return (
    <div className={styles.container}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductList;
```

### Các quy tắc cụ thể

- **Mỗi file chỉ chứa 1 component** — không viết nhiều component trong 1 file (trừ component con nhỏ nội bộ).
- **Luôn có `key` khi render danh sách**, không dùng `index` làm key nếu danh sách có thể thay đổi.
- **Không viết logic phức tạp trong JSX** — tách ra thành biến hoặc hàm trước khi `return`.
- **Props:** Destructure ngay trong tham số hàm.

```jsx
// ✅ Đúng
function ProductCard({ name, price, imageUrl }) {
  return <div>{name}</div>;
}

// ❌ Sai
function ProductCard(props) {
  return <div>{props.name}</div>;
}
```

- **Conditional rendering:** Dùng toán tử `&&` hoặc ternary `? :`, tránh `if/else` lồng nhiều tầng trong JSX.

```jsx
// ✅ Đúng
{
  isLoggedIn && <UserMenu />;
}
{
  isError ? <ErrorMessage /> : <Content />;
}

// ❌ Sai — quá phức tạp trong JSX
{
  (() => {
    if (isLoggedIn) return <UserMenu />;
    else return <GuestMenu />;
  })();
}
```

- **Early return** để xử lý trạng thái loading/error trước khi render nội dung chính.

---

## 5. Quy tắc CSS & Styling

Dự án sử dụng **Tailwind CSS**. Toàn bộ styling phải viết bằng utility class của Tailwind, không tự viết CSS thủ công.

### Nguyên tắc cơ bản

- **Dùng Tailwind utility class** trực tiếp trên JSX — không tạo file `.css` riêng cho từng component.
- **Không dùng inline style** trừ khi giá trị hoàn toàn động và không thể biểu diễn bằng Tailwind.
- **Không viết CSS thuần** vào `App.css` hay `index.css` trừ khi là global reset/base style có sự đồng ý của team.

```jsx
// ✅ Đúng — dùng Tailwind class
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
  Thêm vào giỏ
</button>

// ❌ Sai — viết inline style cứng
<button style={{ backgroundColor: '#2563eb', color: 'white', padding: '8px 16px' }}>
  Thêm vào giỏ
</button>
```

### Xử lý class động

Dùng template literal hoặc thư viện `clsx` / `cn` để ghép class có điều kiện. **Không** dùng string nối thủ công vì Tailwind CSS purge sẽ không nhận diện được.

```jsx
// ✅ Đúng — dùng clsx hoặc template literal rõ ràng
import clsx from 'clsx';

<div className={clsx('px-4 py-2 rounded', isActive && 'bg-blue-600 text-white', !isActive && 'bg-gray-100 text-gray-700')}>

// ✅ Đúng — ternary rõ ràng
<div className={`px-4 py-2 ${isActive ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>

// ❌ Sai — Tailwind không nhận diện được class bị cắt chuỗi
const color = 'blue';
<div className={`bg-${color}-600`}>   {/* Purge sẽ xóa class này */}
```

### Responsive & Breakpoint

Tailwind dùng mobile-first. Luôn thiết kế cho mobile trước, sau đó thêm breakpoint lớn hơn.

```jsx
// ✅ Mobile trước, sau đó mở rộng
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

| Prefix       | Breakpoint        |
| ------------ | ----------------- |
| _(không có)_ | Mobile (mặc định) |
| `sm:`        | ≥ 640px           |
| `md:`        | ≥ 768px           |
| `lg:`        | ≥ 1024px          |
| `xl:`        | ≥ 1280px          |

### Tách class dài thành biến

Khi className quá dài (> 5–6 class), tách ra biến để dễ đọc:

```jsx
// ✅ Dễ đọc, dễ bảo trì
const btnPrimary =
  "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium px-4 py-2 rounded-lg transition-colors";

<button className={btnPrimary}>Đặt hàng</button>;
```

### Không dùng `!important`

Tailwind có modifier `!` để force override — dùng hết sức hạn chế và phải có comment giải thích lý do.

```jsx
// ⚠️ Chỉ dùng khi thực sự bắt buộc, phải comment lý do
<div className="!mt-0"> {/* Override margin từ thư viện bên thứ ba */}
```

---

## 6. Quy tắc gọi API

Tất cả logic gọi API phải đặt trong `src/services/`, **không** gọi `axiosInstance` trực tiếp trong component.

```
src/
├── api/
│   └── axiosInstance.js   ← Cấu hình axios (chỉ config, không viết gì thêm vào đây)
└── services/
    ├── authService.js      ← Các hàm liên quan đến auth
    └── productService.js   ← Các hàm liên quan đến sản phẩm
```

**Cấu trúc một service file:**

```js
// src/services/productService.js
import axiosInstance from "../api/axiosInstance";

export const fetchProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

export const fetchProductById = async id => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async payload => {
  const response = await axiosInstance.post("/products", payload);
  return response.data;
};
```

**Trong component, luôn wrap gọi API bằng `try/catch/finally`:**

```jsx
const loadProducts = async () => {
  setIsLoading(true);
  try {
    const data = await fetchProducts();
    setProducts(data);
  } catch (error) {
    console.error("fetchProducts:", error);
    // Hiển thị thông báo lỗi cho người dùng
  } finally {
    setIsLoading(false);
  }
};
```

---

## 7. Quy trình Git

Dự án dùng mô hình **Feature Branching**. **TUYỆT ĐỐI KHÔNG** push thẳng lên `main`.

### Bước 1 — Cập nhật code mới nhất

```bash
git checkout main
git pull origin main
```

### Bước 2 — Tạo nhánh mới

Cú pháp: `feature/<ten-tinh-nang>` hoặc `fix/<ten-loi>`

```bash
git checkout -b feature/login-page
git checkout -b fix/cart-quantity-bug
```

### Bước 3 — Code, commit thường xuyên

```bash
git add .
git commit -m "feat: xây dựng giao diện trang đăng nhập"
```

> Commit nhỏ, thường xuyên. Đừng để tích lũy quá nhiều thay đổi trong 1 commit.

### Bước 4 — Đẩy code lên

```bash
git push origin feature/login-page
```

### Bước 5 — Tạo Pull Request (PR)

1. Vào GitHub → **New Pull Request**.
2. Chọn nhánh của bạn merge vào `main`.
3. Mô tả rõ PR làm gì, có screenshot nếu thay đổi UI.
4. Gán **Reviewer** là leader hoặc thành viên khác.
5. Sau khi được duyệt: **Merge** và xóa nhánh trên GitHub.

---

## 8. Quy tắc Commit

Dùng định dạng **Conventional Commits**: `<type>: <mô tả ngắn gọn>`

| Type       | Dùng khi                                            |
| ---------- | --------------------------------------------------- |
| `feat`     | Thêm tính năng mới                                  |
| `fix`      | Sửa bug                                             |
| `style`    | Thay đổi CSS/UI, không ảnh hưởng logic              |
| `refactor` | Tái cấu trúc code, không thêm tính năng hay sửa bug |
| `docs`     | Thay đổi tài liệu, README                           |
| `chore`    | Cài thêm thư viện, cấu hình build, resolve conflict |
| `test`     | Thêm hoặc sửa test                                  |

**Ví dụ đúng:**

```
feat: thêm trang giỏ hàng
fix: sửa lỗi không load được ảnh sản phẩm
style: cập nhật màu nút primary theo thiết kế mới
refactor: tách ProductCard ra component riêng
chore: cài thêm react-router-dom
```

**Ví dụ sai:**

```
update code          ← quá chung chung
fix bug              ← bug gì?
ABCXYZ               ← vô nghĩa
đã xong trang login  ← không đúng format
```

---

## 9. Xử lý Conflict

Khi `git pull` hoặc merge bị báo conflict:

1. Mở VS Code, tìm các file được đánh dấu đỏ.
2. Với mỗi đoạn conflict, chọn:
   - **Accept Current Change** — giữ code của mình
   - **Accept Incoming Change** — lấy code từ nhánh kia
   - **Accept Both Changes** — giữ cả hai (xem lại cho chắc)
3. Kiểm tra kỹ kết quả sau khi accept, đảm bảo code chạy đúng.
4. Commit:

```bash
git add .
git commit -m "chore: resolve merge conflict"
git push
```

---

## 10. Những điều TUYỆT ĐỐI không làm

| ❌ Không được                                | ✅ Thay bằng                                  |
| -------------------------------------------- | --------------------------------------------- |
| Push thẳng lên `main`                        | Tạo nhánh feature, tạo PR                     |
| Commit toàn bộ `node_modules/`               | File đã có trong `.gitignore`, không đụng vào |
| Để `console.log` debug trong code khi tạo PR | Xóa hết trước khi push                        |
| Dùng tên biến `a`, `b`, `x`, `temp`, `data`  | Đặt tên có nghĩa, mô tả đúng nội dung         |
| Viết tất cả mọi thứ vào 1 component          | Tách thành nhiều component nhỏ                |
| Gọi API trực tiếp trong JSX                  | Đặt trong `useEffect` hoặc handler            |
| Copy code mà không hiểu                      | Đọc hiểu, hỏi team nếu không rõ               |
| Comment out code cũ rồi để lại               | Xóa đi, Git đã lưu lịch sử rồi                |
