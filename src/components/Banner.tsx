import { Gamepad2, Shield, Zap } from 'lucide-react';

export function Banner() {
  return (
    <div className="bg-gradient-to-r from-[#1EA7FD] via-[#F5A65B] to-[#0D4D8B] text-white py-12 mb-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Mua Bán Tài Khoản Game #1 Việt Nam
          </h2>
          <p className="text-blue-100 text-lg">
            Uy tín - An toàn - Giá tốt nhất thị trường
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Bảo mật cao</h3>
            <p className="text-sm text-blue-100">
              Cam kết bảo mật thông tin 100%
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Giao dịch nhanh</h3>
            <p className="text-sm text-blue-100">
              Nhận tài khoản ngay sau khi thanh toán
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8" />
            </div>
            <h3 className="font-semibold mb-2">Đa dạng game</h3>
            <p className="text-sm text-blue-100">
              Hơn 1000+ tài khoản game phổ biến
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}