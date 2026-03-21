import { useState } from 'react';
import { Link } from 'react-router';
import { Upload, ArrowLeft, CheckCircle } from 'lucide-react';

export function SellAccountPage() {
  const [formData, setFormData] = useState({
    gameName: '',
    rank: '',
    server: 'Việt Nam',
    price: '',
    description: '',
    champions: '',
    skins: '',
    level: '',
    additionalInfo: '',
    email: '',
    phone: '',
    agreeTerms: false
  });

  const [images, setImages] = useState<string[]>([]);

  const games = [
    'Liên Minh Huyền Thoại',
    'PUBG Mobile',
    'Minecraft',
    'Genshin Impact',
    'FIFA Online 4',
    'Free Fire',
    'Valorant',
    'Liên Quân Mobile',
    'Khác'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - in real app, upload to server
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('Vui lòng đồng ý với điều khoản!');
      return;
    }

    if (images.length === 0) {
      alert('Vui lòng tải lên ít nhất 1 ảnh!');
      return;
    }

    alert('Đăng bán tài khoản thành công! Tài khoản của bạn sẽ được duyệt trong 24h.');
    // Reset form
    setFormData({
      gameName: '',
      rank: '',
      server: 'Việt Nam',
      price: '',
      description: '',
      champions: '',
      skins: '',
      level: '',
      additionalInfo: '',
      email: '',
      phone: '',
      agreeTerms: false
    });
    setImages([]);
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
          <h1 className="text-3xl font-bold mb-3">Đăng bán tài khoản</h1>
          <p className="text-blue-100">
            Đăng bán tài khoản game của bạn một cách nhanh chóng và an toàn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Game Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên game <span className="text-red-500">*</span>
                </label>
                <select
                  name="gameName"
                  value={formData.gameName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                >
                  <option value="">Chọn game</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                </select>
              </div>

              {/* Rank */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rank/Cấp độ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="rank"
                  value={formData.rank}
                  onChange={handleChange}
                  required
                  placeholder="VD: Kim Cương, Chinh Phục..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Server */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máy chủ
                </label>
                <select
                  name="server"
                  value={formData.server}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                >
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Global">Global</option>
                  <option value="Đông Nam Á">Đông Nam Á</option>
                  <option value="Châu Á">Châu Á</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá bán (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="10000"
                  placeholder="Nhập giá bán"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="VD: 150, AR 58..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Champions/Characters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tướng/Nhân vật
                </label>
                <input
                  type="text"
                  name="champions"
                  value={formData.champions}
                  onChange={handleChange}
                  placeholder="VD: 145/165 tướng, 23 nhân vật 5⭐"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Skins */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trang phục/Skin
                </label>
                <input
                  type="text"
                  name="skins"
                  value={formData.skins}
                  onChange={handleChange}
                  placeholder="VD: 89 trang phục, 12 vũ khí 5⭐"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Additional Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thông tin khác
                </label>
                <input
                  type="text"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="VD: UC: 18,500, BP: 850M+"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Mô tả chi tiết về tài khoản của bạn..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] resize-none"
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Hình ảnh tài khoản <span className="text-red-500">*</span>
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Tải lên tối đa 5 ảnh (ảnh đầu tiên sẽ là ảnh đại diện)
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Uploaded Images */}
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-[#0D4D8B] text-white text-xs px-2 py-1 rounded">
                      Ảnh đại diện
                    </div>
                  )}
                </div>
              ))}

              {/* Upload Button */}
              {images.length < 5 && (
                <label className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:border-[#1EA7FD] transition">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Tải ảnh lên</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông tin liên hệ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="0123456789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-5 h-5 text-[#0D4D8B] rounded focus:ring-[#1EA7FD] mt-1"
              />
              <label className="text-sm text-gray-600">
                Tôi cam kết thông tin tài khoản là chính xác và đồng ý với{' '}
                <Link to="#" className="text-[#0D4D8B] hover:underline">
                  Điều khoản đăng bán
                </Link>
                . Tôi hiểu rằng:
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Tài khoản sẽ được kiểm duyệt trong 24h</li>
                  <li>Phí hoa hồng là 5% giá trị giao dịch</li>
                  <li>Không được đăng tài khoản giả mạo hoặc gian lận</li>
                </ul>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-4 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Đăng bán tài khoản
            </button>
          </div>
        </form>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-3">💡 Mẹo đăng bán hiệu quả:</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>✓ Chụp ảnh rõ nét, đầy đủ thông tin tài khoản</li>
            <li>✓ Mô tả chi tiết, trung thực về tài khoản</li>
            <li>✓ Đặt giá hợp lý so với thị trường</li>
            <li>✓ Cung cấp thông tin liên hệ chính xác</li>
            <li>✓ Phản hồi nhanh chóng với người mua</li>
          </ul>
        </div>
      </div>
    </div>
  );
}