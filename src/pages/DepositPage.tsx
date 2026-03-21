import { useState } from 'react';
import { Link } from 'react-router';
import { Wallet, CheckCircle, ArrowLeft } from 'lucide-react';

export function DepositPage() {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');

  const quickAmounts = [50000, 100000, 200000, 500000, 1000000, 2000000];

  const paymentMethods = [
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '📱',
      description: 'Thanh toán qua ví điện tử MoMo',
      fee: '0%'
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Chuyển khoản qua tài khoản ngân hàng',
      fee: '0%'
    },
    {
      id: 'card',
      name: 'Thẻ ATM/Credit',
      icon: '💳',
      description: 'Thanh toán bằng thẻ ATM hoặc Credit',
      fee: '1.5%'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: '💰',
      description: 'Thanh toán qua ví ZaloPay',
      fee: '0%'
    }
  ];

  const handleAmountSelect = (value: number) => {
    setAmount(value.toString());
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount('');
  };

  const getFinalAmount = () => {
    const baseAmount = parseFloat(customAmount || amount || '0');
    if (selectedMethod === 'card') {
      return baseAmount * 1.015; // Add 1.5% fee
    }
    return baseAmount;
  };

  const handleDeposit = () => {
    if (!selectedMethod) {
      alert('Vui lòng chọn phương thức thanh toán!');
      return;
    }

    const finalAmount = getFinalAmount();
    if (finalAmount < 10000) {
      alert('Số tiền nạp tối thiểu là 10,000đ');
      return;
    }

    alert(`Đang xử lý nạp ${finalAmount.toLocaleString('vi-VN')}đ qua ${paymentMethods.find(m => m.id === selectedMethod)?.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#0D4D8B] hover:text-[#0B4275] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Nạp tiền vào tài khoản</h1>
          </div>
          <p className="text-blue-100">
            Nạp tiền nhanh chóng và an toàn để mua tài khoản game yêu thích
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Amount Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Chọn số tiền nạp
              </h2>

              {/* Quick Amounts */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAmountSelect(value)}
                    className={`p-4 rounded-lg border-2 transition ${
                      amount === value.toString()
                        ? 'border-[#0D4D8B] bg-blue-50 text-[#0D4D8B]'
                        : 'border-gray-300 hover:border-[#1EA7FD]'
                    }`}
                  >
                    <p className="font-semibold">
                      {value.toLocaleString('vi-VN')}đ
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hoặc nhập số tiền khác
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Nhập số tiền (tối thiểu 10,000đ)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] focus:border-transparent"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    đ
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Phương thức thanh toán
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition ${
                      selectedMethod === method.id
                        ? 'border-[#0D4D8B] bg-blue-50'
                        : 'border-gray-300 hover:border-[#1EA7FD]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{method.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-800">
                            {method.name}
                          </h3>
                          <span className="text-sm text-green-600 font-medium">
                            Phí: {method.fee}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-6 h-6 text-[#0D4D8B] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Terms */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Lưu ý:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Số tiền nạp tối thiểu là 10,000đ</li>
                <li>• Tiền sẽ được cập nhật vào tài khoản trong vòng 1-5 phút</li>
                <li>• Mọi giao dịch đều được bảo mật và mã hóa</li>
                <li>• Liên hệ CSKH nếu có vấn đề trong quá trình nạp tiền</li>
              </ul>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Thông tin nạp tiền
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Số tiền:</span>
                  <span className="font-semibold">
                    {(parseFloat(customAmount || amount || '0')).toLocaleString('vi-VN')}đ
                  </span>
                </div>

                {selectedMethod === 'card' && (
                  <div className="flex justify-between text-gray-600">
                    <span>Phí giao dịch (1.5%):</span>
                    <span className="font-semibold">
                      {(parseFloat(customAmount || amount || '0') * 0.015).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">Tổng thanh toán:</span>
                    <span className="text-xl font-bold text-[#0D4D8B]">
                      {getFinalAmount().toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                className="w-full bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedMethod || getFinalAmount() < 10000}
              >
                Nạp tiền ngay
              </button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  Bằng việc nạp tiền, bạn đồng ý với điều khoản sử dụng của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}