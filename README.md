# 🛒 FE-ShopAccount - Hướng dẫn làm việc nhóm với Git

Chào mừng mọi người đã tham gia dự án! Để đảm bảo code không bị ghi đè và quy trình phát triển mượt mà, tất cả thành viên vui lòng tuân thủ các quy tắc dưới đây.

---

🛠️ Quy trình làm việc (Workflow)
Chúng ta sẽ sử dụng mô hình Feature Branching. Mọi người KHÔNG push code trực tiếp lên nhánh main.

Bước 1: Cập nhật code mới nhất
Trước khi bắt đầu làm bất cứ thứ gì, hãy về nhánh main và kéo code mới nhất về:

Bash
git checkout main
git pull origin main
Bước 2: Tạo nhánh mới để làm tính năng
Đặt tên nhánh theo cú pháp: feature/ten-tinh-nang hoặc fix/ten-loi.

Bash
git checkout -b feature/login-page
Bước 3: Code và Commit
Lưu ý: Luôn chạy npm install nếu có thành viên khác vừa thêm thư viện mới.

Bash
git add .
git commit -m "feat: giao diện trang đăng nhập"
Bước 4: Đẩy code lên GitHub
Bash
git push origin feature/login-page
Bước 5: Tạo Pull Request (PR)
Lên giao diện GitHub, chọn New Pull Request.

Chọn nhánh của bạn merge vào main.

Gán (Assign) leader hoặc bạn cùng team vào review.

Sau khi được duyệt, tiến hành Merge và xóa nhánh tính năng trên GitHub.

📌 Quy tắc đặt tên Commit (Conventional Commits)
Để lịch sử dự án sạch sẽ, hãy dùng các tiền tố sau:

feat: Một tính năng mới (ví dụ: feat: thêm giỏ hàng).

fix: Sửa một lỗi (ví dụ: fix: lỗi không hiển thị avatar).

docs: Thay đổi tài liệu, README.

style: Thay đổi định dạng code (UI/CSS), không thay đổi logic.

refactor: Tối ưu hóa code cũ nhưng không đổi tính năng.

⚠️ Cách xử lý xung đột (Conflict)
Nếu khi git pull hoặc merge bị báo Conflict:

Mở VS Code lên, tìm các file bị đỏ.

Chọn Accept Current Change (giữ code của mình), Accept Incoming Change (lấy code người khác) hoặc Accept Both.

Lưu file, sau đó thực hiện:

Bash
git add .
git commit -m "chore: resolve merge conflict"
git push
📦 Cài đặt dự án cho thành viên mới
git clone <url-du-an>

npm install

npm run dev

---
