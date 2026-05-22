'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNotification } from '@/components/Notification';

interface Reply {
  id: string;
  content: string;
  senderType: string;
  createdAt: string;
  user: { name: string | null };
}

interface Message {
  id: string;
  content: string;
  senderType: string;
  isReadByAdmin: boolean;
  createdAt: string;
  replies: Reply[];
}

interface UserChat {
  userId: string;
  userName: string;
  userEmail: string;
  messages: Message[];
  unreadCount: number;
}

export default function AdminMessagesPage() {
  const { theme } = useTheme();
  const { showNotification } = useNotification();
  const [chats, setChats] = useState<UserChat[]>([]);
  const [selectedChat, setSelectedChat] = useState<UserChat | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sendingBroadcast, setSendingBroadcast] = useState(false);

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 5000);
    return () => clearInterval(interval);
  }, [filter]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/admin/messages?filter=${filter}`);
      const data = await res.json();
      if (data.success) {
        setChats(data.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChat = async (chat: UserChat) => {
    setSelectedChat(chat);
    if (chat.unreadCount > 0) {
      try {
        await fetch('/api/admin/messages', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: chat.userId }),
        });
        fetchChats();
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const handleSendBroadcast = async () => {
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    
    setSendingBroadcast(true);
    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: broadcastTitle, message: broadcastMessage }),
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`Broadcast sent to ${data.recipientCount} users`);
        setShowBroadcast(false);
        setBroadcastTitle('');
        setBroadcastMessage('');
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      showNotification('Failed to send broadcast', 'error');
    } finally {
      setSendingBroadcast(false);
    }
  };

  const handleReply = async () => {
    if (!selectedChat || !replyContent) return;

    const firstMessageId = selectedChat.messages[0].id;
    try {
      const res = await fetch(`/api/admin/messages/${firstMessageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent }),
      });
      const data = await res.json();
      if (data.success) {
        fetchChats();
        setSelectedChat(prev => prev ? {
          ...prev,
          messages: [...prev.messages, {
            ...data.data,
            replies: [],
          }],
          unreadCount: 0,
        } : null);
        setReplyContent('');
        showNotification('Reply sent successfully');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      showNotification('Failed to send reply', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
          Messages
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
            {chats.reduce((sum, c) => sum + c.unreadCount, 0)} unread
          </span>
          <button
            onClick={() => setShowBroadcast(true)}
            className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Broadcast
          </button>
          <button
            onClick={() => fetch('/api/admin/messages', { method: 'PATCH' }).then(fetchChats)}
            className="px-3 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Mark all read
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--theme-bg-secondary)] text-[var(--theme-text)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'unread'
                  ? 'bg-amber-500 text-white'
                  : 'bg-[var(--theme-bg-secondary)] text-[var(--theme-text)]'
              }`}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[var(--theme-bg-secondary)] rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
            Conversations ({chats.length})
          </h2>
          {chats.length === 0 ? (
            <p style={{ color: 'var(--theme-text-secondary)' }}>No conversations</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {chats.map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => handleSelectChat(chat)}
                  className={`w-full p-4 rounded-lg text-left transition-colors ${
                    selectedChat?.userId === chat.userId
                      ? 'bg-amber-500/20 border border-amber-500/50'
                      : chat.unreadCount > 0
                        ? 'bg-amber-500/10 border border-amber-500/30'
                        : 'bg-[var(--theme-bg)]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate" style={{ color: 'var(--theme-text)' }}>
                        {chat.userName}
                      </h3>
                      <p className="text-xs truncate" style={{ color: 'var(--theme-text-secondary)' }}>
                        {chat.userEmail}
                      </p>
                      <p className="text-xs mt-1 truncate" style={{ color: 'var(--theme-text-muted)' }}>
                        {chat.messages[0]?.content.substring(0, 40)}...
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {chat.unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                      <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                        {new Date(chat.messages[0]?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 bg-[var(--theme-bg-secondary)] rounded-lg p-4 flex flex-col min-h-[500px]">
          {selectedChat ? (
            <>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-[var(--theme-border)]">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {selectedChat.userName}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                    {selectedChat.userEmail}
                  </p>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {selectedChat.messages
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((msg) => (
                  <div key={msg.id} className="space-y-2">
                    <div className={`p-3 rounded-lg ${
                      msg.senderType === 'USER'
                        ? 'bg-[var(--theme-bg)]'
                        : 'bg-amber-500/10 ml-8'
                    }`}>
                      <p style={{ color: 'var(--theme-text)' }}>{msg.content}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                        {msg.senderType === 'USER' ? 'User' : 'You'} • {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {msg.replies
                      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                      .map((reply) => (
                      <div
                        key={reply.id}
                        className={`p-3 rounded-lg ${
                          reply.senderType === 'ADMIN'
                            ? 'bg-amber-500/10 ml-8'
                            : 'bg-[var(--theme-bg)] mr-8'
                        }`}
                      >
                        <p style={{ color: 'var(--theme-text)' }}>{reply.content}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                          {reply.senderType === 'ADMIN' ? 'You' : reply.user?.name || 'User'} • {new Date(reply.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]"
                  style={{ color: 'var(--theme-text)' }}
                  placeholder="Type your reply..."
                />
                <button
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p style={{ color: 'var(--theme-text-secondary)' }}>
                Select a conversation to view messages
              </p>
            </div>
          )}
        </div>
      </div>

      {showBroadcast && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--theme-bg-secondary)] rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>
                Send Broadcast Message
              </h2>
              <button
                onClick={() => setShowBroadcast(false)}
                className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-text)]"
              >
                ✕
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--theme-text-secondary)' }}>
              This message will be sent to all users as a notification.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-text)' }}>
                  Title
                </label>
                <input
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]"
                  style={{ color: 'var(--theme-text)' }}
                  placeholder="Enter title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: 'var(--theme-text)' }}>
                  Message
                </label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)] resize-none"
                  style={{ color: 'var(--theme-text)' }}
                  placeholder="Enter your message..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowBroadcast(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border)]"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendBroadcast}
                  disabled={!broadcastTitle.trim() || !broadcastMessage.trim() || sendingBroadcast}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {sendingBroadcast ? 'Sending...' : 'Send to All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}