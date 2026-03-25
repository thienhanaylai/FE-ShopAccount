import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-gray-400 text-sm">GameAccount.vn là nền tảng mua bán tài khoản game uy tín hàng đầu Việt Nam</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <p className="text-gray-400 text-sm">Email: support@gameaccount.vn</p>
            <p className="text-gray-400 text-sm">Hotline: 1900 xxxx</p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Chính sách</h3>
            <Link to="#" className="block text-gray-400 text-sm hover:text-white">
              Điều khoản sử dụng
            </Link>
            <Link to="#" className="block text-gray-400 text-sm hover:text-white">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm">
          © 2026 GameAccount.vn - All rights reserved
        </div>
      </div>
    </footer>
  );
}
