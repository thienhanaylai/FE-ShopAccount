import { useState } from 'react';
import { ArrowLeftRight, User, Wallet, Shield, AlertCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

export function TransferMoneyPage() {
  const { user } = useAuth();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const currentBalance = 5420000; // Mock balance from user context

  const recentTransfers = [
    {
      id: '1',
      recipient: 'user2@gameaccount.vn',
      recipientName: 'Nguyễn Văn B',
      amount: 500000,
      status: 'success',
      date: '2024-02-03 14:30',
      note: 'Chuyển tiền mua tài khoản'
    },
    {
      id: '2',
      recipient: 'user3@gameaccount.vn',
      recipientName: 'Trần Thị C',
      amount: 1200000,
      status: 'success',
      date: '2024-02-02 09:15',
      note: 'Hoàn tiền'
    },
    {
      id: '3',
      recipient: 'user4@gameaccount.vn',
      recipientName: 'Lê Văn D',
      amount: 300000,
      status: 'failed',
      date: '2024-02-01 16:45',
      note: 'Thanh toán'
    }
  ];

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!recipientEmail) {
      setError('Vui lòng nhập email người nhận');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    if (parseFloat(amount) > currentBalance) {
      setError('Số dư không đủ để thực hiện giao dịch');
      return;
    }

    if (parseFloat(amount) < 10000) {
      setError('Số tiền chuyển tối thiểu là 10,000đ');
      return;
    }

    if (!password) {
      setError('Vui lòng nhập mật khẩu xác nhận');
      return;
    }

    if (recipientEmail === user?.email) {
      setError('Không thể chuyển tiền cho chính mình');
      return;
    }

    // Submit
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setRecipientEmail('');
      setAmount('');
      setNote('');
      setPassword('');

      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('vi-VN') + 'đ';
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-[#F5A65B] hover:text-[#1EA7FD] mb-6 transition"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Quay lại trang cá nhân</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chuyển tiền</h1>
          <p className="text-gray-600">Chuyển tiền nhanh chóng và an toàn cho người dùng khác</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-green-900 mb-1">Chuyển tiền thành công!</p>
              <p className="text-sm text-green-700">
                Giao dịch đã được xử lý. Vui lòng kiểm tra lại số dư của bạn.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transfer Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin chuyển tiền</h2>

              {/* Current Balance */}
              <div className="bg-gradient-to-r from-[#1EA7FD] to-[#F5A65B] rounded-xl p-6 mb-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm mb-1">Số dư hiện tại</p>
                    <p className="text-3xl font-bold">{formatCurrency(currentBalance)}</p>
                  </div>
                  <Wallet className="w-12 h-12 text-white/40" />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-6">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleTransfer} className="space-y-6">
                {/* Recipient Email */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Email người nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="Nhập email người nhận"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A65B] focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập email tài khoản người nhận đã đăng ký trên hệ thống
                  </p>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Số tiền chuyển <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={amount ? parseInt(amount).toLocaleString('vi-VN') : ''}
                      onChange={handleAmountChange}
                      placeholder="0"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A65B] focus:border-transparent text-lg font-semibold"
                      disabled={isSubmitting}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                      đ
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">Tối thiểu: 10,000đ</p>
                    <p className="text-xs text-gray-500">
                      Tối đa: {formatCurrency(currentBalance)}
                    </p>
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {[100000, 200000, 500000, 1000000].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => setAmount(quickAmount.toString())}
                        className="py-2 px-3 bg-gray-100 hover:bg-[#1EA7FD]/10 hover:text-[#1EA7FD] rounded-lg text-sm font-semibold transition"
                        disabled={isSubmitting}
                      >
                        {quickAmount >= 1000000
                          ? `${quickAmount / 1000000}M`
                          : `${quickAmount / 1000}K`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Nội dung chuyển tiền
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập nội dung chuyển tiền (không bắt buộc)"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A65B] focus:border-transparent resize-none"
                    disabled={isSubmitting}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {note.length}/200 ký tự
                  </p>
                </div>

                {/* Password Confirmation */}
                <div>
                  <label className="block text-gray-700 mb-2">
                    Mật khẩu xác nhận <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu để xác nhận"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5A65B] focus:border-transparent"
                      disabled={isSubmitting}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Nhập mật khẩu tài khoản của bạn để xác nhận giao dịch
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-3 rounded-lg font-semibold hover:from-[#0D4D8B] hover:to-[#E58B3D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang xử lý...
                    </span>
                  ) : (
                    'Xác nhận chuyển tiền'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-800 mb-4">Lưu ý quan trọng</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A65B] mt-1.5 flex-shrink-0" />
                  <span>Kiểm tra kỹ email người nhận trước khi chuyển</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A65B] mt-1.5 flex-shrink-0" />
                  <span>Giao dịch được xử lý ngay lập tức và không thể hoàn tác</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A65B] mt-1.5 flex-shrink-0" />
                  <span>Không chuyển tiền cho người lạ hoặc không tin tưởng</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A65B] mt-1.5 flex-shrink-0" />
                  <span>Mỗi giao dịch tối thiểu 10,000đ</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5A65B] mt-1.5 flex-shrink-0" />
                  <span>Liên hệ hỗ trợ nếu có vấn đề xảy ra</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-[#1EA7FD]" />
                    <span className="font-semibold text-gray-800">Bảo mật</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Giao dịch được mã hóa và bảo mật tuyệt đối. Chúng tôi cam kết không chia sẻ thông tin của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transfers */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Lịch sử chuyển tiền gần đây</h2>

            {recentTransfers.length === 0 ? (
              <div className="text-center py-8">
                <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Chưa có giao dịch nào</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transfer.status === 'success' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        <ArrowLeftRight className={`w-5 h-5 ${
                          transfer.status === 'success' ? 'text-green-600' : 'text-red-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{transfer.recipientName}</p>
                        <p className="text-sm text-gray-500">{transfer.recipient}</p>
                        {transfer.note && (
                          <p className="text-xs text-gray-400 mt-1">{transfer.note}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transfer.status === 'success' ? 'text-red-600' : 'text-gray-400'
                      }`}>
                        -{formatCurrency(transfer.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{transfer.date}</p>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${
                        transfer.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {transfer.status === 'success' ? 'Thành công' : 'Thất bại'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}