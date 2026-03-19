import { useState } from 'react';
import { Link } from 'react-router';
import { CreditCard, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

export function CardTopupPage() {
  const [formData, setFormData] = useState({
    cardType: '',
    cardSerial: '',
    cardCode: '',
    agreeTerms: false
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const cardProviders = [
    { id: 'viettel', name: 'Viettel', discount: 20, logo: '📱' },
    { id: 'vinaphone', name: 'Vinaphone', discount: 20, logo: '📞' },
    { id: 'mobifone', name: 'Mobifone', discount: 20, logo: '📲' },
    { id: 'vietnamobile', name: 'Vietnamobile', discount: 25, logo: '📳' },
    { id: 'zing', name: 'Zing Card', discount: 15, logo: '🎮' },
    { id: 'gate', name: 'Gate Card', discount: 15, logo: '🎯' }
  ];

  const denominations = [10000, 20000, 30000, 50000, 100000, 200000, 300000, 500000, 1000000];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản!');
      return;
    }

    setIsProcessing(true);

    // Mock processing
    setTimeout(() => {
      setIsProcessing(false);
      alert('Nạp thẻ thành công! Số tiền đã được cộng vào tài khoản của bạn.');
      setFormData({
        cardType: '',
        cardSerial: '',
        cardCode: '',
        agreeTerms: false
      });
    }, 2000);
  };

  const selectedProvider = cardProviders.find(p => p.id === formData.cardType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link
          to="/deposit"
          className="inline-flex items-center gap-2 text-[#0D4D8B] hover:text-[#0B4275] mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Nạp thẻ cào</h1>
          </div>
          <p className="text-blue-100">
            Nạp tiền nhanh chóng qua thẻ cào điện thoại
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Provider Selection */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Chọn loại thẻ
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cardProviders.map(provider => (
                    <label
                      key={provider.id}
                      className={`cursor-pointer p-4 border-2 rounded-lg transition ${
                        formData.cardType === provider.id
                          ? 'border-[#0D4D8B] bg-blue-50'
                          : 'border-gray-300 hover:border-[#1EA7FD]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="cardType"
                        value={provider.id}
                        checked={formData.cardType === provider.id}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="text-center">
                        <div className="text-4xl mb-2">{provider.logo}</div>
                        <p className="font-semibold text-gray-800 mb-1">
                          {provider.name}
                        </p>
                        <p className="text-xs text-red-600">
                          Chiết khấu {provider.discount}%
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Card Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Thông tin thẻ
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số Serial <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardSerial"
                      value={formData.cardSerial}
                      onChange={handleChange}
                      required
                      placeholder="Nhập số serial của thẻ"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Số serial nằm ở mặt sau thẻ cào
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mã thẻ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardCode"
                      value={formData.cardCode}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mã thẻ (cào lớp tráng bạc)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Cào nhẹ nhàng để không làm hỏng mã thẻ
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD] mt-1"
                  />
                  <span className="text-sm text-gray-600">
                    Tôi đồng ý với{' '}
                    <Link to="#" className="text-[#0D4D8B] hover:underline">
                      Điều khoản nạp thẻ
                    </Link>{' '}
                    và xác nhận thông tin thẻ là chính xác
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !formData.cardType || !formData.cardSerial || !formData.cardCode || !formData.agreeTerms}
                className="w-full bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-4 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Nạp thẻ ngay</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Info Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Discount Info */}
            {selectedProvider && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Thông tin chiết khấu
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Nhà mạng:</span>
                    <span className="font-semibold">{selectedProvider.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Chiết khấu:</span>
                    <span className="font-semibold text-red-600">
                      {selectedProvider.discount}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Ví dụ:</span> Thẻ 100,000đ sẽ nhận được{' '}
                    <span className="font-semibold text-[#0D4D8B]">
                      {(100000 * (1 - selectedProvider.discount / 100)).toLocaleString('vi-VN')}đ
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Denominations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Mệnh giá hỗ trợ
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {denominations.map(denom => (
                  <div
                    key={denom}
                    className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-xs text-gray-600">
                      {(denom / 1000).toLocaleString('vi-VN')}K
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-yellow-900">Lưu ý quan trọng</h3>
              </div>
              <ul className="text-sm text-yellow-800 space-y-2">
                <li>• Cào nhẹ nhàng để không làm hỏng mã thẻ</li>
                <li>• Nhập chính xác số serial và mã thẻ</li>
                <li>• Thẻ sai/đã sử dụng sẽ không được hoàn tiền</li>
                <li>• Thời gian xử lý: 15-30 phút</li>
                <li>• Liên hệ CSKH nếu sau 30 phút chưa nhận tiền</li>
              </ul>
            </div>

            {/* Success Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-green-900">Mẹo nạp thẻ</h3>
              </div>
              <ul className="text-sm text-green-800 space-y-2">
                <li>✓ Kiểm tra kỹ mã thẻ trước khi gửi</li>
                <li>✓ Chọn đúng loại thẻ</li>
                <li>✓ Lưu lại thông tin thẻ để đối chiếu</li>
                <li>✓ Nạp thẻ trong giờ hành chính để được hỗ trợ nhanh</li>
              </ul>
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Lịch sử nạp thẻ
          </h2>
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Chưa có lịch sử nạp thẻ</p>
          </div>
        </div>
      </div>
    </div>
  );
}