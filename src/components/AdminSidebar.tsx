import { Link, useLocation } from 'react-router';
import { 
  LayoutDashboard, 
  Users, 
  Gamepad2, 
  ShoppingCart, 
  Wallet,
  CreditCard,
  HeadphonesIcon,
  Upload,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FolderOpen
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
  onLogout?: () => void;
}

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/categories', icon: FolderOpen, label: 'Danh mục Game' },
    { path: '/admin/users', icon: Users, label: 'Người dùng' },
    { path: '/admin/accounts', icon: Gamepad2, label: 'Tài khoản game' },
    { path: '/admin/orders', icon: ShoppingCart, label: 'Đơn hàng' },
    { path: '/admin/deposits', icon: Wallet, label: 'Nạp tiền' },
    { path: '/admin/card-topup', icon: CreditCard, label: 'Nạp thẻ' },
    { path: '/admin/support', icon: HeadphonesIcon, label: 'Hỗ trợ' },
    { path: '/admin/sell-requests', icon: Upload, label: 'Yêu cầu bán' },
    { path: '/admin/settings', icon: Settings, label: 'Cài đặt' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`bg-gray-900 text-white h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-[#08D9D6] to-[#FF2E63] bg-clip-text text-transparent">Admin Panel</h2>
            <p className="text-xs text-gray-400">GameAccount.vn</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-800 rounded-lg transition"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path, item.exact)
                    ? 'bg-[#FF2E63] text-white shadow-lg shadow-pink-500/20'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={collapsed ? item.label : ''}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <Link
          to="/"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition mb-2`}
          title={collapsed ? 'Về trang chủ' : ''}
        >
          <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Về trang chủ</span>}
        </Link>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 hover:text-red-300 transition`}
          title={collapsed ? 'Đăng xuất' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
}