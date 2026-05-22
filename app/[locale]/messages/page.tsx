'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Message {
  id: string;
  content: string;
  senderType: string;
  isRead: boolean;
  createdAt: string;
  isNew?: boolean;
  isBroadcast?: boolean;
  subject?: string;
}

export default function MessagesPage(props: { params: Promise<{ locale: string }> }) {
  const params = use(props.params);
  const locale = params.locale;
  const { data: session, status } = useSession();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const t = {
    title: locale === 'ru' ? 'Чат с поддержкой' : 'Support Chat',
    placeholder: locale === 'ru' ? 'Введите сообщение...' : 'Type a message...',
    send: locale === 'ru' ? 'Отправить' : 'Send',
    noMessages: locale === 'ru' ? 'Начните разговор...' : 'Start a conversation...',
    admin: locale === 'ru' ? 'Поддержка' : 'Support',
  };

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) {
        const allMessages: Message[] = [];
        const seenIds = new Set<string>();
        
        data.data.forEach((thread: any) => {
          if (thread.isBroadcast) {
            const broadcastId = `broadcast-${thread.id}`;
            if (!seenIds.has(broadcastId)) {
              seenIds.add(broadcastId);
              allMessages.push({
                id: broadcastId,
                content: thread.content,
                senderType: 'ADMIN',
                isRead: thread.isRead,
                createdAt: thread.createdAt,
                isBroadcast: true,
                subject: thread.subject || 'Announcement',
              });
            }
            return;
          }

          const threadId = `msg-${thread.id}`;
          if (!seenIds.has(threadId)) {
            seenIds.add(threadId);
            allMessages.push({
              id: threadId,
              content: thread.content,
              senderType: thread.senderType,
              isRead: thread.isRead,
              createdAt: thread.createdAt,
            });
          }
          thread.replies?.forEach((reply: any) => {
            const replyId = `reply-${reply.id}`;
            if (!seenIds.has(replyId)) {
              seenIds.add(replyId);
              allMessages.push({
                id: replyId,
                content: reply.content,
                senderType: reply.senderType,
                isRead: true,
                createdAt: reply.createdAt,
              });
            }
          });
        });
        allMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        setMessages(allMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`);
    }
  }, [status, router, locale]);

  useEffect(() => {
    if (session?.user) {
      fetchMessages();
      fetch('/api/messages', { method: 'PATCH' }).catch(console.error);
    }
  }, [session]);

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const tempId = `temp-${Date.now()}`;
    const tempMessage: Message = {
      id: tempId,
      content: newMessage,
      senderType: 'USER',
      isRead: true,
      createdAt: new Date().toISOString(),
      isNew: true,
    };
    
    setMessages(prev => [...prev, tempMessage]);
    setSending(true);
    setNewMessage('');
    
    scrollToBottom();
    
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => prev.map(m => 
          m.id === tempId 
            ? { ...data.data, isNew: false } 
            : m
        ));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] flex flex-col pt-16">
      <div className="bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border)] px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl font-bold text-[var(--theme-text)]">{t.title}</h1>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0 p-4 md:p-6">
        <div 
          ref={containerRef}
          className="max-w-4xl mx-auto w-full h-full flex flex-col rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-bg)] shadow-lg overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <p className="text-[var(--theme-text-secondary)]">{t.noMessages}</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderType === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm transition-all duration-300 ${
                      msg.isBroadcast
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 text-[var(--theme-text)] rounded-bl-sm'
                        : msg.senderType === 'USER'
                          ? msg.isNew
                            ? 'bg-amber-500/80 text-white rounded-br-sm animate-slide-in-right'
                            : 'bg-amber-500/80 text-white rounded-br-sm'
                          : msg.isNew
                            ? 'bg-[var(--theme-bg-secondary)]/80 text-[var(--theme-text)] border border-[var(--theme-border)] rounded-bl-sm animate-slide-in-left'
                            : 'bg-[var(--theme-bg-secondary)]/80 text-[var(--theme-text)] border border-[var(--theme-border)] rounded-bl-sm'
                    }`}
                    style={msg.isNew && !msg.isBroadcast ? {
                      animation: msg.senderType === 'USER' 
                        ? 'slideInRight 0.3s ease-out' 
                        : 'slideInLeft 0.3s ease-out'
                    } : undefined}
                  >
                    {msg.isBroadcast && msg.subject && (
                      <p className="text-xs font-semibold text-amber-400 mb-1">
                        📢 {msg.subject}
                      </p>
                    )}
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${
                      msg.senderType === 'USER' ? 'text-white/70' : 'text-[var(--theme-text-muted)]'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-[var(--theme-border)] p-4 bg-[var(--theme-bg-secondary)]/50">
            <div className="flex gap-3 items-end">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
                className="flex-1 px-4 py-3 rounded-2xl bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-text)] focus:outline-none focus:border-amber-500 resize-none"
                placeholder={t.placeholder}
                style={{ maxHeight: '120px', minHeight: '48px' }}
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim() || sending}
                className="p-3 bg-amber-500 text-white rounded-2xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {sending ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}