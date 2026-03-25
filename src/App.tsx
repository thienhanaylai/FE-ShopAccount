import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ShopPage } from "./pages/ShopPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { DepositPage } from "./pages/DepositPage";
import { SellAccountPage } from "./pages/SellAccountPage";
import { SupportPage } from "./pages/SupportPage";
import { UserProfilePage } from "./pages/UserProfilePage";

// Admin Pages
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { CategoriesManagement } from "./pages/admin/CategoriesManagement";
import { UsersManagement } from "./pages/admin/UsersManagement";
import { AccountsManagement } from "./pages/admin/AccountsManagement";
import { OrdersManagement } from "./pages/admin/OrdersManagement";
import { DepositsManagement } from "./pages/admin/DepositsManagement";
import { SupportManagement } from "./pages/admin/SupportManagement";
import { SellRequestsManagement } from "./pages/admin/SellRequestsManagement";
import { SettingsManagement } from "./pages/admin/SettingsManagement";
import { useEffect, useState } from "react";
import { walletService } from "./services";

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { user, logout, isAdmin } = useAuth();
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    try {
      async function getBalance() {
        const res = await walletService.getBalance();
        console.log(res);
        setBalance(res.balance);
      }
      getBalance();
    } catch (error) {
      return;
    }
  });
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout onLogout={logout} />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<CategoriesManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="accounts" element={<AccountsManagement />} />
          <Route path="orders" element={<OrdersManagement />} />
          <Route path="deposits" element={<DepositsManagement />} />
          <Route path="support" element={<SupportManagement />} />
          <Route path="sell-requests" element={<SellRequestsManagement />} />
          <Route path="settings" element={<SettingsManagement />} />
        </Route>

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header isLoggedIn={!!user} username={user?.username} balance={balance} onLogout={logout} isAdmin={isAdmin} />

              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/users" element={<Navigate to="/admin/users" replace />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/deposit" element={<DepositPage />} />
                  <Route path="/sell-account" element={<SellAccountPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>

              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
