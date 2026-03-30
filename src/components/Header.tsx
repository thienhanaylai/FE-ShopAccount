import { User, Menu, Wallet, LogOut, Upload, HeadphonesIcon, Shield } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

interface HeaderProps {
  isLoggedIn?: boolean;
  username?: string;
  balance?: number;
  onLogout?: () => void;
  isAdmin?: boolean;
}

export function Header({ isLoggedIn = false, username, balance = 0, onLogout, isAdmin = false }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition">
            <div className="bg-white px-2 py-1.5 rounded-xl shadow-md flex items-center justify-center">
              <img
                src="/logoShopaccount.png"
                alt="ShopAccount logo"
                className="h-10 md:h-12 w-auto max-w-[160px] md:max-w-[210px] object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">Shopaccgiare</h1>
              <p className="text-xs text-[#1EA7FD]">Mua bán tài khoản game uy tín</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/shop" className="hover:text-[#1EA7FD] transition">
              Cửa hàng
            </Link>
            <Link to="/deposit" className="hover:text-[#1EA7FD] transition">
              Nạp tiền
            </Link>
            <Link to="/support" className="flex items-center gap-2 hover:text-[#1EA7FD] transition">
              <HeadphonesIcon className="w-4 h-4" />
              Hỗ trợ
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/deposit"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1EA7FD] hover:bg-[#158DD8] text-[#0D4D8B] rounded-lg transition font-semibold"
                >
                  <Wallet className="w-5 h-5" />
                  <span>{balance.toLocaleString("vi-VN")}đ</span>
                </Link>
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:block">
                      {username}
                      {isAdmin && <span className="ml-1">👑</span>}
                    </span>
                  </button>
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 text-gray-800">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Thông tin tài khoản</span>
                      </Link>
                      <Link
                        to="/deposit"
                        className="md:hidden flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Số dư: {balance.toLocaleString("vi-VN")}đ</span>
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="border-t border-gray-200 my-2" />
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-[#F5A65B] font-semibold"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Shield className="w-4 h-4" />
                            <span>Trang quản trị</span>
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-200 my-2" />
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout?.();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
                >
                  <User className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </Link>
                <Link
                  to="/register"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#1EA7FD] hover:bg-[#158DD8] text-[#0D4D8B] rounded-lg transition font-semibold"
                >
                  <span>Đăng ký</span>
                </Link>
              </>
            )}
            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20 pt-4">
            <nav className="flex flex-col gap-3">
              <Link to="/shop" className="hover:text-[#1EA7FD] transition">
                Cửa hàng
              </Link>
              <Link to="/sell-account" className="flex items-center gap-2 hover:text-[#1EA7FD] transition">
                <Upload className="w-4 h-4" />
                Đăng bán
              </Link>
              <Link to="/card-topup" className="hover:text-[#1EA7FD] transition">
                Nạp thẻ
              </Link>
              <Link to="/support" className="flex items-center gap-2 hover:text-[#1EA7FD] transition">
                <HeadphonesIcon className="w-4 h-4" />
                Hỗ trợ
              </Link>
              {!isLoggedIn && (
                <>
                  <Link to="/login" className="hover:text-[#1EA7FD] transition">
                    Đăng nhập
                  </Link>
                  <Link to="/register" className="hover:text-[#1EA7FD] transition">
                    Đăng ký
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
