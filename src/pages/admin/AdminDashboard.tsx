import { Users, Gamepad2, ShoppingCart, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function AdminDashboard() {
  const stats = [
    { 
      label: 'Tổng người dùng', 
      value: '12,543', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      label: 'Tài khoản đang bán', 
      value: '1,234', 
      change: '+8.2%', 
      trend: 'up',
      icon: Gamepad2,
      color: 'bg-blue-500'
    },
    { 
      label: 'Đơn hàng hôm nay', 
      value: '89', 
      change: '-3.1%', 
      trend: 'down',
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    { 
      label: 'Doanh thu tháng này', 
      value: '₫245M', 
      change: '+18.7%', 
      trend: 'up',
      icon: DollarSign,
      color: 'bg-yellow-500'
    },
  ];

  const revenueData = [
    { month: 'T1', revenue: 45, orders: 120 },
    { month: 'T2', revenue: 52, orders: 145 },
    { month: 'T3', revenue: 61, orders: 168 },
    { month: 'T4', revenue: 58, orders: 152 },
    { month: 'T5', revenue: 72, orders: 189 },
    { month: 'T6', revenue: 85, orders: 223 },
  ];

  const gameDistribution = [
    { name: 'Liên Minh', value: 35 },
    { name: 'PUBG', value: 25 },
    { name: 'Genshin', value: 20 },
    { name: 'FIFA', value: 12 },
    { name: 'Khác', value: 8 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const recentOrders = [
    { id: '#12345', user: 'Nguyễn Văn A', game: 'Liên Minh Huyền Thoại', price: 2500000, status: 'completed', time: '5 phút trước' },
    { id: '#12344', user: 'Trần Thị B', game: 'PUBG Mobile', price: 1800000, status: 'pending', time: '12 phút trước' },
    { id: '#12343', user: 'Lê Văn C', game: 'Genshin Impact', price: 3200000, status: 'completed', time: '25 phút trước' },
    { id: '#12342', user: 'Phạm Thị D', game: 'FIFA Online 4', price: 1500000, status: 'processing', time: '1 giờ trước' },
    { id: '#12341', user: 'Hoàng Văn E', game: 'Minecraft', price: 450000, status: 'completed', time: '2 giờ trước' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Hoàn thành';
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      default: return status;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Tổng quan hệ thống GameAccount.vn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Doanh thu & Đơn hàng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#8b5cf6" name="Doanh thu (Triệu)" strokeWidth={2} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#3b82f6" name="Đơn hàng" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Game Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Phân bố game</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={gameDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {gameDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Đơn hàng gần đây</h2>
          <button className="text-[#0D4D8B] hover:text-[#0B4275] font-semibold">
            Xem tất cả →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Mã đơn</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Khách hàng</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Game</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Giá trị</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-[#0D4D8B]">{order.id}</td>
                  <td className="py-3 px-4">{order.user}</td>
                  <td className="py-3 px-4">{order.game}</td>
                  <td className="py-3 px-4 font-semibold">{order.price.toLocaleString('vi-VN')}đ</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {order.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
