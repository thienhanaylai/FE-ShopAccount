import { X, Send, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export interface TicketData {
  id: string;
  user: string;
  userId: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  messages: number;
  createdDate: string;
  lastUpdate: string;
}

interface SupportDetailModalProps {
  ticket: TicketData;
  onClose: () => void;
  onResolve?: () => void;
  onReply?: (message: string) => void;
}

export function SupportDetailModal({ ticket, onClose, onResolve, onReply }: SupportDetailModalProps) {
  const [replyMessage, setReplyMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'user',
      name: ticket.user,
      message: ticket.subject + '. Tôi đã thanh toán nhưng chưa nhận được tài khoản. Vui lòng hỗ trợ kiểm tra giúp tôi.',
      time: ticket.createdDate,
      avatar: ticket.user.charAt(0).toUpperCase()
    },
    {
      id: 2,
      sender: 'admin',
      name: 'Admin Support',
      message: 'Chào bạn! Cảm ơn bạn đã liên hệ. Chúng tôi đang kiểm tra giao dịch của bạn. Vui lòng cung cấp thêm mã đơn hàng để chúng tôi hỗ trợ nhanh hơn.',
      time: '03/02/2024 14:45',
      avatar: 'A'
    },
    {
      id: 3,
      sender: 'user',
      name: ticket.user,
      message: 'Mã đơn hàng của tôi là #ORD12345. Tôi đã thanh toán 2,500,000đ qua MoMo.',
      time: '03/02/2024 15:00',
      avatar: ticket.user.charAt(0).toUpperCase()
    },
  ];

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    onReply?.(replyMessage);
    setReplyMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6" />
              <h2 className="text-xl font-bold">{ticket.subject}</h2>
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span>{ticket.id}</span>
              <span>•</span>
              <span>{ticket.user}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${
                ticket.priority === 'high' ? 'bg-[#FF2E63]' :
                ticket.priority === 'medium' ? 'bg-orange-500' :
                'bg-[#08D9D6]'
              }`}>
                Ưu tiên {ticket.priority === 'high' ? 'cao' : ticket.priority === 'medium' ? 'trung bình' : 'thấp'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.sender === 'admin' ? 'bg-[#FF2E63] text-white' : 'bg-gray-300 text-gray-700'
              }`}>
                {msg.avatar}
              </div>
              <div className={`flex-1 ${msg.sender === 'admin' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`max-w-[70%] ${msg.sender === 'admin' ? 'bg-[#FF2E63] text-white' : 'bg-white'} rounded-2xl p-4 shadow-sm border border-gray-100`}>
                  <p className={`font-semibold text-sm mb-1 ${msg.sender === 'admin' ? 'text-blue-100' : 'text-gray-600'}`}>
                    {msg.name}
                  </p>
                  <p className={msg.sender === 'admin' ? 'text-white' : 'text-gray-800'}>
                    {msg.message}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Nhập tin nhắn trả lời..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD]"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyMessage.trim()}
              className="px-6 py-3 bg-[#FF2E63] text-white rounded-lg font-semibold hover:bg-[#d9254f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Gửi
            </button>
          </div>
          
          {ticket.status !== 'resolved' && (
            <div className="flex gap-3">
              <button
                onClick={onResolve}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Đánh dấu đã giải quyết
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Đóng
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
