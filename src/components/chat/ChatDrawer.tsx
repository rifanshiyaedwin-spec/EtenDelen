import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Send, X, Shield, User, Bot, Clock } from 'lucide-react';

export const ChatDrawer: React.FC = () => {
  const {
    isChatOpen,
    setIsChatOpen,
    chatMessages,
    sendChatMessage,
    currentUser,
    users,
    donations,
    activeChatConversationId,
    setActiveChatConversationId,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>(
    users.find((u) => u.id !== currentUser.id)?.id || ''
  );

  if (!isChatOpen) return null;

  const targetUser = users.find((u) => u.id === selectedRecipientId);

  // Filter messages for active channel or participants
  const activeMessages = chatMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.receiverId === selectedRecipientId) ||
      (m.senderId === selectedRecipientId && m.receiverId === currentUser.id)
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedRecipientId) return;

    const recipient = users.find((u) => u.id === selectedRecipientId);
    sendChatMessage({
      text: inputMessage.trim(),
      receiverId: selectedRecipientId,
      receiverName: recipient?.organizationName || recipient?.name || 'User',
      conversationId: `conv-${[currentUser.id, selectedRecipientId].sort().join('-')}`,
    });

    setInputMessage('');
  };

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={() => setIsChatOpen(false)} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Secure In-App Coordination</h3>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> End-to-End Privacy Protected
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contact Bar Selector */}
          <div className="p-3 bg-slate-100 border-b border-slate-200">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Select Stakeholder Channel
            </label>
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
            >
              {otherUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.organizationName || u.role.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
            {activeMessages.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium text-slate-600">No previous messages in this channel</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Coordinate pickup times, gate instructions, and temperature verifications privately.
                </p>
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMine = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                  >
                    <span className="text-[10px] text-slate-400 px-1 mb-0.5">
                      {isMine ? 'You' : msg.senderName} ({msg.senderRole})
                    </span>
                    <div
                      className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMine
                          ? 'bg-emerald-600 text-white rounded-br-xs'
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.message}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Message Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Message ${targetUser?.name || 'recipient'}...`}
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition cursor-pointer disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
