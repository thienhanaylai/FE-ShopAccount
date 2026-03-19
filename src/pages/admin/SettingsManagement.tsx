import { Save, Bell, DollarSign, Shield, Mail, Globe } from 'lucide-react';
import { useState } from 'react';

export function SettingsManagement() {
  const [settings, setSettings] = useState({
    // General
    siteName: 'GameAccount.vn',
    siteDescription: 'Mua bán tài khoản game uy tín #1 Việt Nam',
    contactEmail: 'support@gameaccount.vn',
    contactPhone: '1900 xxxx',
    
    // Commission
    commissionRate: 5,
    minWithdraw: 100000,
    withdrawFee: 5000,
    
    // Card Topup Discounts
    viettelDiscount: 20,
    vinaphoneDiscount: 20,
    mobifoneDiscount: 20,
    vietnamobileDiscount: 25,
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    depositNotifications: true,
    
    // Security
    requireEmailVerification: true,
    requirePhoneVerification: false,
    twoFactorAuth: false,
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'Hệ thống đang bảo trì, vui lòng quay lại sau'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSave = () => {
    alert('Đã lưu cài đặt thành công!');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cài đặt hệ thống</h1>
          <p className="text-gray-600">Quản lý cấu hình website</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition"
        >
          <Save className="w-5 h-5" />
          Lưu cài đặt
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-[#0D4D8B]" />
            <h2 className="text-xl font-bold text-gray-800">Cài đặt chung</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên website
              </label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email liên hệ
              </label>
              <input
                type="email"
                name="contactEmail"
                value={settings.contactEmail}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả website
              </label>
              <textarea
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hotline
              </label>
              <input
                type="text"
                name="contactPhone"
                value={settings.contactPhone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
        </div>

        {/* Commission Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-bold text-gray-800">Cài đặt hoa hồng & rút tiền</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tỷ lệ hoa hồng (%)
              </label>
              <input
                type="number"
                name="commissionRate"
                value={settings.commissionRate}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số tiền rút tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                name="minWithdraw"
                value={settings.minWithdraw}
                onChange={handleChange}
                min="0"
                step="10000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phí rút tiền (VNĐ)
              </label>
              <input
                type="number"
                name="withdrawFee"
                value={settings.withdrawFee}
                onChange={handleChange}
                min="0"
                step="1000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
        </div>

        {/* Card Topup Discounts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">Chiết khấu nạp thẻ (%)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Viettel
              </label>
              <input
                type="number"
                name="viettelDiscount"
                value={settings.viettelDiscount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vinaphone
              </label>
              <input
                type="number"
                name="vinaphoneDiscount"
                value={settings.vinaphoneDiscount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobifone
              </label>
              <input
                type="number"
                name="mobifoneDiscount"
                value={settings.mobifoneDiscount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vietnamobile
              </label>
              <input
                type="number"
                name="vietnamobileDiscount"
                value={settings.vietnamobileDiscount}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Thông báo</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.emailNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Email thông báo</p>
                <p className="text-sm text-gray-600">Gửi email cho các sự kiện quan trọng</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="smsNotifications"
                checked={settings.smsNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">SMS thông báo</p>
                <p className="text-sm text-gray-600">Gửi SMS cho các giao dịch quan trọng</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="orderNotifications"
                checked={settings.orderNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Thông báo đơn hàng</p>
                <p className="text-sm text-gray-600">Thông báo khi có đơn hàng mới</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="depositNotifications"
                checked={settings.depositNotifications}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Thông báo nạp tiền</p>
                <p className="text-sm text-gray-600">Thông báo khi có yêu cầu nạp tiền</p>
              </div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Bảo mật</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requireEmailVerification"
                checked={settings.requireEmailVerification}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Bắt buộc xác thực email</p>
                <p className="text-sm text-gray-600">Người dùng phải xác thực email khi đăng ký</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="requirePhoneVerification"
                checked={settings.requirePhoneVerification}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Bắt buộc xác thực SĐT</p>
                <p className="text-sm text-gray-600">Người dùng phải xác thực số điện thoại</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Xác thực 2 yếu tố</p>
                <p className="text-sm text-gray-600">Bật xác thực 2 bước cho tài khoản admin</p>
              </div>
            </label>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-bold text-gray-800">Bảo trì</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD]"
              />
              <div>
                <p className="font-medium text-gray-800">Chế độ bảo trì</p>
                <p className="text-sm text-gray-600">Tạm khóa website cho người dùng</p>
              </div>
            </label>

            {settings.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông báo bảo trì
                </label>
                <textarea
                  name="maintenanceMessage"
                  value={settings.maintenanceMessage}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] resize-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
