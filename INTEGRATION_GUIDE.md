// ============================================================================
// INTEGRATION GUIDE: Sử dụng API Services với React & TypeScript
// ============================================================================

/\*\*

- 1.  TRONG COMPONENTS (Functional Component + Hooks)
- ========================================================
  \*/

// Example: LoginPage.tsx
import { useState } from 'react';
import { authService, userService } from '@/services';
import ErrorHandler from '@/utils/errorHandler';
import TokenUtils from '@/utils/tokenUtils';

export function LoginPage() {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleLogin = async () => {
try {
setLoading(true);
setError('');

      const response = await authService.login({
        email,
        password,
      });

      // Token được tự động save ở authService.login()
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(ErrorHandler.getErrorMessage(err));
    } finally {
      setLoading(false);
    }

};

return (
<form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
{error && <div className="text-red-500">{error}</div>}
<input
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Email"
/>
<input
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Password"
type="password"
/>
<button type="submit" disabled={loading}>
{loading ? 'Logging in...' : 'Login'}
</button>
</form>
);
}

/\*\*

- 2.  TRONG CONTEXTS (AuthContext.tsx)
- ========================================================
  \*/

// Example: AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services';
import { User } from '@/services/types';
import TokenUtils from '@/utils/tokenUtils';

interface AuthContextType {
user: User | null;
isAuthenticated: boolean;
login: (email: string, password: string) => Promise<void>;
register: (data: any) => Promise<void>;
logout: () => void;
isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
const [user, setUser] = useState<User | null>(null);
const [isLoading, setIsLoading] = useState(true);

// Kiểm tra token khi mount
useEffect(() => {
const currentUser = TokenUtils.getUser();
setUser(currentUser);
setIsLoading(false);
}, []);

const login = async (email: string, password: string) => {
const response = await authService.login({ email, password });
setUser(response.user);
};

const register = async (data: any) => {
const response = await authService.register(data);
setUser(response.user);
};

const logout = () => {
authService.logout();
TokenUtils.clear();
setUser(null);
};

return (
<AuthContext.Provider
value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading
      }} >
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
const context = useContext(AuthContext);
if (!context) {
throw new Error('useAuth must be used within AuthProvider');
}
return context;
}

/\*\*

- 3.  DATA FETCHING WITH useEffect
- ========================================================
  \*/

// Example: UserListPage.tsx
import { useState, useEffect } from 'react';
import { userService, PaginationResponse, User } from '@/services';
import ErrorHandler from '@/utils/errorHandler';

export function UserListPage() {
const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [error, setError] = useState('');

useEffect(() => {
fetchUsers();
}, [page]);

const fetchUsers = async () => {
try {
setLoading(true);
const response = await userService.getList({
page,
limit: 20
});
setUsers(response.data);
setError('');
} catch (err) {
setError(ErrorHandler.getErrorMessage(err));
} finally {
setLoading(false);
}
};

if (loading) return <div>Loading...</div>;
if (error) return <div className="text-red-500">{error}</div>;

return (
<div>
{users.map(user => (
<div key={user.id}>{user.username}</div>
))}
<button onClick={() => setPage(page + 1)}>Next Page</button>
</div>
);
}

/\*\*

- 4.  FORM HANDLING & MUTATIONS
- ========================================================
  \*/

// Example: CreateUserForm.tsx
import { useState } from 'react';
import { userService } from '@/services';
import ErrorHandler from '@/utils/errorHandler';

export function CreateUserForm({ onSuccess }: { onSuccess: () => void }) {
const [formData, setFormData] = useState({
username: '',
email: '',
password: '',
phone: ''
});
const [loading, setLoading] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

    try {
      setLoading(true);
      setErrors({});

      await userService.create(formData);

      // Reset form & call callback
      setFormData({ username: '', email: '', password: '', phone: '' });
      onSuccess();
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);

      if (ErrorHandler.isValidationError(error)) {
        // Handle field-level validation errors
        setErrors({ general: message });
      } else if (ErrorHandler.isConflictError(error)) {
        // Handle duplicate errors
        setErrors({ email: 'Email already exists' });
      } else {
        setErrors({ general: message });
      }
    } finally {
      setLoading(false);
    }

};

return (
<form onSubmit={handleSubmit}>
{errors.general && <div className="text-red-500">{errors.general}</div>}

      <div>
        <input
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        {errors.username && <span className="text-red-500">{errors.username}</span>}
      </div>

      <div>
        <input
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        {errors.email && <span className="text-red-500">{errors.email}</span>}
      </div>

      <div>
        <input
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        {errors.password && <span className="text-red-500">{errors.password}</span>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>

);
}

/\*\*

- 5.  ADMIN-ONLY PAGES
- ========================================================
  \*/

// Example: AdminPanel.tsx
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export function AdminPanel() {
const { user, isLoading } = useAuth();

useEffect(() => {
// Redirect if not admin
if (!isLoading && (!user || user.role !== 'ADMIN')) {
window.location.href = '/';
}
}, [user, isLoading]);

if (isLoading) return <div>Loading...</div>;
if (!user || user.role !== 'ADMIN') return <div>Access Denied</div>;

return (
<div>
<h1>Admin Panel</h1>
{/_ Admin content _/}
</div>
);
}

/\*\*

- 6.  PROTECTED ROUTE COMPONENT
- ========================================================
  \*/

// Example: ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import TokenUtils from '@/utils/tokenUtils';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
if (!TokenUtils.isAuthenticated()) {
return <Navigate to="/login" />;
}
return <>{children}</>;
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
if (!TokenUtils.isAdmin()) {
return <Navigate to="/" />;
}
return <>{children}</>;
}

// Usage in Router:
// <Route path="/dashboard" element={
// <ProtectedRoute>
// <Dashboard />
// </ProtectedRoute>
// } />

/\*\*

- 7.  CUSTOM HOOKS FOR API CALLS
- ========================================================
  \*/

// Example: useUser.ts
import { useState, useEffect, useCallback } from 'react';
import { userService, User } from '@/services';
import ErrorHandler from '@/utils/errorHandler';

export function useUser(userId: string | null) {
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string>('');

const fetchUser = useCallback(async () => {
if (!userId) return;

    try {
      setLoading(true);
      const userData = await userService.getById(userId);
      setUser(userData);
      setError('');
    } catch (err) {
      setError(ErrorHandler.getErrorMessage(err));
    } finally {
      setLoading(false);
    }

}, [userId]);

useEffect(() => {
fetchUser();
}, [fetchUser]);

return { user, loading, error, refetch: fetchUser };
}

// Usage:
// const { user, loading, error } = useUser('usr_123');

/\*\*

- 8.  FILE UPLOAD
- ========================================================
  \*/

// Example: ImageUploadComponent.tsx
import { useState } from 'react';
import { mediaService } from '@/services';
import ErrorHandler from '@/utils/errorHandler';

export function ImageUpload({ onUpload }: { onUpload: (url: string) => void }) {
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
const file = e.target.files?.[0];
if (!file) return;

    try {
      setLoading(true);
      const result = await mediaService.upload(file, 'game-accounts');
      onUpload(result.url);
      setError('');
    } catch (err) {
      setError(ErrorHandler.getErrorMessage(err));
    } finally {
      setLoading(false);
    }

};

return (
<div>
{error && <div className="text-red-500">{error}</div>}
<input 
        type="file" 
        accept="image/*" 
        onChange={handleFileChange}
        disabled={loading}
      />
{loading && <span>Uploading...</span>}
</div>
);
}

/\*\*

- 9.  WALLET OPERATIONS
- ========================================================
  \*/

// Example: WalletPage.tsx
import { useState, useEffect } from 'react';
import { walletService, WalletBalance } from '@/services';
import ErrorHandler from '@/utils/errorHandler';

export function WalletPage() {
const [balance, setBalance] = useState<WalletBalance | null>(null);
const [topupAmount, setTopupAmount] = useState(0);
const [loading, setLoading] = useState(false);

useEffect(() => {
fetchBalance();
}, []);

const fetchBalance = async () => {
try {
const data = await walletService.getBalance();
setBalance(data);
} catch (err) {
console.error(ErrorHandler.getErrorMessage(err));
}
};

const handleTopup = async () => {
try {
setLoading(true);
await walletService.topUp({
amount: topupAmount,
channel: 'BANK_TRANSFER',
note: 'Top up'
});
await fetchBalance();
setTopupAmount(0);
} catch (err) {
console.error(ErrorHandler.getErrorMessage(err));
} finally {
setLoading(false);
}
};

return (
<div>
<h2>Wallet Balance: {balance?.balance.toLocaleString()} VND</h2>
<input
type="number"
value={topupAmount}
onChange={(e) => setTopupAmount(Number(e.target.value))}
/>
<button onClick={handleTopup} disabled={loading}>
{loading ? 'Processing...' : 'Top Up'}
</button>
</div>
);
}

/\*\*

- 10. ENVIRONMENTAL VARIABLES (.env.local)
- ========================================================
  \*/

// .env.local
// VITE_API_BASE_URL=http://localhost:3000

// .env.production
// VITE_API_BASE_URL=https://api.shopaccount.vn

/\*\*

- 11. LOGOUT ON TOKEN EXPIRATION
- ========================================================
  \*/

// Example: App.tsx (Setup interceptor global redirect)
// Interceptor đã config trong axios.ts, tự động redirect to login khi 401
