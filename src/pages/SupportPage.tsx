import { useMemo, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, Mail, Phone, Clock, Send, Search, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { supportTicketService } from "../services/supportTicket.service";
import ErrorHandler from "../utils/errorHandler";
import { useAuth } from "../hooks/useAuth";

export function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const categories = [
    { id: "all", name: "Tất cả" },
    { id: "account", name: "Tài khoản" },
    { id: "payment", name: "Thanh toán" },
    { id: "security", name: "Bảo mật" },
    { id: "other", name: "Khác" },
  ];

  const faqs = [
    {
      id: 1,
      category: "account",
      question: "Làm sao để mua tài khoản game?",
      answer:
        'Để mua tài khoản game, bạn cần: 1) Đăng ký tài khoản trên website, 2) Nạp tiền vào tài khoản, 3) Chọn tài khoản game muốn mua và nhấn "Mua ngay", 4) Xác nhận thanh toán. Thông tin tài khoản sẽ được gửi qua email ngay sau khi thanh toán thành công.',
    },
    {
      id: 2,
      category: "account",
      question: "Tôi có thể đổi trả tài khoản không?",
      answer:
        "Chúng tôi có chính sách bảo hành 30 ngày cho tất cả tài khoản. Nếu tài khoản có vấn đề về đăng nhập hoặc không đúng như mô tả, vui lòng liên hệ CSKH trong vòng 30 ngày để được hỗ trợ đổi tài khoản hoặc hoàn tiền.",
    },
    {
      id: 3,
      category: "payment",
      question: "Những phương thức thanh toán nào được hỗ trợ?",
      answer:
        "Chúng tôi hỗ trợ nhiều phương thức thanh toán: Ví điện tử (MoMo, ZaloPay), Chuyển khoản ngân hàng, Thẻ ATM/Credit Card, và Nạp thẻ cào điện thoại.",
    },
    {
      id: 4,
      category: "payment",
      question: "Mất bao lâu để tiền được cập nhật vào tài khoản?",
      answer:
        "Thời gian cập nhật tiền phụ thuộc vào phương thức thanh toán: Ví điện tử (1-5 phút), Chuyển khoản ngân hàng (5-15 phút), Thẻ cào (15-30 phút). Nếu sau thời gian trên tiền chưa được cập nhật, vui lòng liên hệ CSKH.",
    },
    {
      id: 5,
      category: "security",
      question: "Thông tin cá nhân của tôi có an toàn không?",
      answer:
        "Chúng tôi cam kết bảo mật 100% thông tin cá nhân của bạn. Mọi dữ liệu đều được mã hóa SSL và không chia sẻ cho bên thứ ba. Chúng tôi tuân thủ nghiêm ngặt các quy định về bảo vệ dữ liệu cá nhân.",
    },
    {
      id: 6,
      category: "security",
      question: "Làm sao để bảo vệ tài khoản sau khi mua?",
      answer:
        "Sau khi mua tài khoản, bạn nên: 1) Đổi mật khẩu ngay lập tức, 2) Liên kết email/số điện thoại của bạn, 3) Bật xác thực 2 yếu tố nếu có, 4) Không chia sẻ thông tin tài khoản với người khác, 5) Không vi phạm điều khoản của game.",
    },
    {
      id: 7,
      category: "account",
      question: "Tôi muốn bán tài khoản game, phải làm sao?",
      answer:
        'Để bán tài khoản game, vào mục "Đăng bán tài khoản", điền đầy đủ thông tin và tải lên ảnh chụp màn hình. Tài khoản sẽ được kiểm duyệt trong 24h. Phí hoa hồng là 5% giá trị giao dịch.',
    },
    {
      id: 8,
      category: "payment",
      question: "Có thể rút tiền về tài khoản ngân hàng không?",
      answer:
        "Có, bạn có thể yêu cầu rút tiền về tài khoản ngân hàng. Số tiền tối thiểu để rút là 100,000đ. Thời gian xử lý là 1-3 ngày làm việc. Phí rút tiền là 5,000đ/giao dịch.",
    },
  ];

  const contactMethods = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Trò chuyện trực tiếp với CSKH",
      value: "Trực tuyến 24/7",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Mail,
      title: "Email",
      description: "Gửi email hỗ trợ",
      value: "support@gameaccount.vn",
      color: "bg-blue-100 text-[#0D4D8B]",
    },
    {
      icon: Phone,
      title: "Hotline",
      description: "Gọi điện hỗ trợ",
      value: "1900 xxxx",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Clock,
      title: "Giờ làm việc",
      description: "Thời gian hỗ trợ",
      value: "24/7",
      color: "bg-orange-100 text-orange-600",
    },
  ];

  const filteredFaqs = useMemo(() => {
    const keyword = faqSearchQuery.trim().toLowerCase();
    return faqs.filter(faq => {
      const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
      const matchesSearch =
        keyword.length === 0 || faq.question.toLowerCase().includes(keyword) || faq.answer.toLowerCase().includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, faqs, faqSearchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("Vui lòng đăng nhập trước khi gửi yêu cầu hỗ trợ.");
      return;
    }

    const title = formData.subject.trim();
    const description = formData.message.trim();

    if (!title || !description) {
      setErrorMessage("Vui lòng nhập đầy đủ tiêu đề và nội dung yêu cầu.");
      return;
    }

    setIsSubmitting(true);
    try {
      await supportTicketService.create({
        title,
        description,
        category: formData.category,
      });

      setSuccessMessage("Đã gửi yêu cầu hỗ trợ thành công. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.");
      setExpandedFaq(null);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "general",
      });
    } catch (error) {
      setErrorMessage(ErrorHandler.getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (errorMessage) setErrorMessage(null);
    if (successMessage) setSuccessMessage(null);
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#0D4D8B] hover:text-[#0B4275] mb-6">
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Trung tâm hỗ trợ</h1>
          <p className="text-lg text-gray-600">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className={`w-12 h-12 ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                <method.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{method.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{method.description}</p>
              <p className="font-semibold text-[#0D4D8B]">{method.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Câu hỏi thường gặp</h2>

              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onChange={e => setFaqSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm câu hỏi..."
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg transition ${
                      activeCategory === cat.id ? "bg-[#0D4D8B] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <span className="font-semibold text-gray-800 text-left">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Gửi yêu cầu hỗ trợ</h2>

              {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                  >
                    <option value="general">Chung</option>
                    <option value="account">Tài khoản</option>
                    <option value="payment">Thanh toán</option>
                    <option value="security">Bảo mật</option>
                    <option value="technical">Kỹ thuật</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white py-3 rounded-lg font-semibold hover:from-[#0B4275] hover:to-[#E58B3D] transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="bg-gradient-to-r from-[#0D4D8B] to-[#F5A65B] text-white rounded-2xl p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Vẫn cần hỗ trợ thêm?</h2>
          <p className="text-blue-100 mb-6">Đội ngũ CSKH của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#0D4D8B] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Mở Live Chat
            </button>
            <a
              href="mailto:support@shopaccgiare.tech"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition"
            >
              Gửi Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
