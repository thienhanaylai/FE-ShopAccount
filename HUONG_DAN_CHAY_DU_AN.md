# Hướng dẫn chạy dự án FE-ShopAccount (Senior Developer Edition)

Chào bạn! Đây là hướng dẫn chi tiết để bạn có thể chạy dự án và thực hiện các bài kiểm tra tự động một cách dễ dàng nhất theo đúng tiêu chuẩn Senior.

## 1. Yêu cầu hệ thống
- **Node.js**: Phiên bản 18 trở lên.
- **npm** hoặc **yarn**.
- **Backend**: Đảm bảo Backend đang chạy tại `http://localhost:3000` (hoặc cấu hình trong `.env`).

## 2. Cấu hình môi trường (.env)
Tạo file `.env` ở thư mục gốc (nếu chưa có) và thêm cấu hình sau:
```env
VITE_API_BASE_URL=http://localhost:3000
```

## 3. Cài đặt và Chạy dự án
Mở terminal tại thư mục `FE-ShopAccount` và chạy các lệnh sau:

### Cài đặt thư viện:
```powershell
npm install
```

### Chạy dự án ở chế độ phát triển (Development):
```powershell
npm run dev
```
Sau khi chạy, bạn có thể truy cập vào `http://localhost:5173` để xem ứng dụng.

## 4. Kiểm tra mã nguồn (Linting)
Để đảm bảo mã nguồn sạch và không có lỗi (Senior Style):
```powershell
npm run lint
```

## 5. Chạy Test tự động
Dự án sử dụng **Vitest** để chạy các bài test. Để chạy toàn bộ test:
```powershell
npm run test
```

Nếu bạn muốn xem giao diện test trực quan hơn:
```powershell
npm run test:ui
```

## 6. Các tính năng đã được tối ưu (Senior Fixes)
- **Giao diện Admin**: Đã được thiết kế lại hoàn toàn với tông màu **Pink/Cyan** cực kỳ hiện đại và premium.
- **Type Safety**: Loại bỏ hầu hết các thẻ `any` dư thừa, nâng cao tính bảo mật và dễ bảo trì của code.
- **Error Handling**: Xử lý lỗi từ API một cách chuyên nghiệp hơn trên các trang Đăng nhập/Đăng ký.
- **Consistency**: Đồng nhất gradient và hiệu ứng hover trên toàn bộ hệ thống quản trị.

---
Chúc bạn trải nghiệm dự án một cách tốt nhất! Nếu có vấn đề gì, hãy liên hệ ngay với tôi.
