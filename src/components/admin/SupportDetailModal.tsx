import { X, Send, MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";
import { SupportTicket, SupportTicketStatus } from "../../services/types";

interface SupportDetailModalProps {
  ticket: SupportTicket;
  onClose: () => void;
  onResolve?: () => Promise<void> | void;
  onReply?: (message: string) => Promise<void> | void;
  onReject?: (message: string) => Promise<void> | void;
  isActionLoading?: boolean;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("vi-VN");
}

function getStatusText(status: SupportTicketStatus): string {
  switch (status) {
    case SupportTicketStatus.PENDING:
      return "Mới";
    case SupportTicketStatus.IN_PROGRESS:
      return "Đang xử lý";
    case SupportTicketStatus.RESOLVED:
      return "Đã giải quyết";
    case SupportTicketStatus.REJECTED:
      return "Từ chối";
    default:
      return status;
  }
}

function getStatusColor(status: SupportTicketStatus): string {
  switch (status) {
    case SupportTicketStatus.PENDING:
      return "bg-yellow-100 text-yellow-700";
    case SupportTicketStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-700";
    case SupportTicketStatus.RESOLVED:
      return "bg-green-100 text-green-700";
    case SupportTicketStatus.REJECTED:
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export function SupportDetailModal({
  ticket,
  onClose,
  onResolve,
  onReply,
  onReject,
  isActionLoading = false,
}: SupportDetailModalProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const userDisplayName = ticket.user?.username || ticket.userId;
  const userAvatar = userDisplayName.charAt(0).toUpperCase();

  const messages = useMemo(() => {
    const rootMessage = {
      id: `${ticket.id}-root`,
      sender: "user" as const,
      name: userDisplayName,
      message: ticket.description,
      time: ticket.createdAt,
      avatar: userAvatar,
    };

    const replyMessages = (ticket.replies ?? []).map(reply => {
      const adminName = reply.admin?.username || reply.handledBy || "Admin Support";
      return {
        id: reply.id,
        sender: "admin" as const,
        name: adminName,
        message: reply.message,
        time: reply.createdAt,
        avatar: adminName.charAt(0).toUpperCase(),
      };
    });

    return [rootMessage, ...replyMessages];
  }, [ticket.createdAt, ticket.description, ticket.id, ticket.replies, userAvatar, userDisplayName]);

  const handleSendReply = async () => {
    const content = replyMessage.trim();
    if (!content || !onReply) return;

    setIsReplying(true);
    try {
      await onReply(content);
      setReplyMessage("");
    } finally {
      setIsReplying(false);
    }
  };

  const handleReject = async () => {
    if (!onReject) return;

    const reason = replyMessage.trim() || "Yeu cau da bi tu choi boi admin.";

    setIsReplying(true);
    try {
      await onReject(reason);
      setReplyMessage("");
    } finally {
      setIsReplying(false);
    }
  };

  const canResolve = ticket.status !== SupportTicketStatus.RESOLVED && ticket.status !== SupportTicketStatus.REJECTED;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="bg-gradient-to-r from-[#252A34] to-[#FF2E63] text-white p-6 flex items-center justify-between rounded-t-2xl shadow-lg">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-6 h-6" />
              <h2 className="text-xl font-bold">{ticket.title}</h2>
            </div>
            <div className="flex items-center gap-3 text-sm text-blue-100 flex-wrap">
              <span>{ticket.id}</span>
              <span>•</span>
              <span>{userDisplayName}</span>
              <span>•</span>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                {getStatusText(ticket.status)}
              </span>
              <span className="px-2 py-1 rounded text-xs font-semibold bg-white/15">{ticket.category}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.sender === "admin" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  msg.sender === "admin" ? "bg-[#FF2E63] text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                {msg.avatar}
              </div>
              <div className={`flex-1 ${msg.sender === "admin" ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`max-w-[70%] ${msg.sender === "admin" ? "bg-[#FF2E63] text-white" : "bg-white"} rounded-2xl p-4 shadow-sm border border-gray-100`}
                >
                  <p className={`font-semibold text-sm mb-1 ${msg.sender === "admin" ? "text-blue-100" : "text-gray-600"}`}>
                    {msg.name}
                  </p>
                  <p className={msg.sender === "admin" ? "text-white" : "text-gray-800"}>{msg.message}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">{formatDateTime(msg.time)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void handleSendReply();
                }
              }}
              placeholder="Nhập tin nhắn trả lời..."
              disabled={isActionLoading || isReplying}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1EA7FD] disabled:bg-gray-100"
            />
            <button
              onClick={() => void handleSendReply()}
              disabled={!replyMessage.trim() || isActionLoading || isReplying}
              className="px-6 py-3 bg-[#FF2E63] text-white rounded-lg font-semibold hover:bg-[#d9254f] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {isReplying ? "Đang gửi..." : "Gửi"}
            </button>
          </div>

          {canResolve && (
            <div className="flex gap-3">
              <button
                onClick={() => void onResolve?.()}
                disabled={isActionLoading || isReplying}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading ? "Đang cập nhật..." : "Đánh dấu đã giải quyết"}
              </button>
              <button
                onClick={() => void handleReject()}
                disabled={isActionLoading || isReplying}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isActionLoading || isReplying ? "Đang cập nhật..." : "Từ chối"}
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
