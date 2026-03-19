import { Outlet } from 'react-router';
import { AdminSidebar } from '../../components/AdminSidebar';

interface AdminLayoutProps {
  onLogout?: () => void;
}

export function AdminLayout({ onLogout }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar onLogout={onLogout} />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}