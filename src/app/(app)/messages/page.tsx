'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  Loader2,
  CheckCheck,
  Trash2,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/stores/auth.store';
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useDeleteMessage,
} from '@/features/messages/hooks/use-messages';
import { EmojiPicker } from '@/features/messages/components/emoji-picker';
import { useSocket } from '@/features/messages/hooks/use-socket';
import type { ConversationSummary, ChatMessage } from '@/lib/api/messages.api';
import { getConversations } from '@/lib/api/messages.api';

// ── Helpers ──

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'a l\'instant';
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatMessageTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ── Conversation List ──

function ConversationList({
  conversations,
  activeId,
  onSelect,
  search,
  onSearchChange,
}: {
  conversations: ConversationSummary[];
  activeId: string | null;
  onSelect: (c: ConversationSummary) => void;
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const filtered = conversations.filter((c) => {
    if (!search) return true;
    return c.recipient?.nomComplet.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-full flex-col">
      {/* Search */}
      <div className="border-b border-forest-900/5 p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <MessageCircle className="mb-3 h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-400 text-center">Aucune conversation</p>
          </div>
        ) : (
          filtered.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv)}
              className={cn(
                'flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-50',
                activeId === conv.id
                  ? 'bg-forest-900/5'
                  : 'hover:bg-cream-50/50',
              )}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-cream-100">
                  {conv.recipient ? initials(conv.recipient.nomComplet) : '??'}
                </div>
                {conv.recipient?.online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'truncate text-sm',
                    conv.unreadCount > 0 ? 'font-bold text-ink-900' : 'font-medium text-ink-800'
                  )}>
                    {conv.recipient?.nomComplet ?? 'Inconnu'}
                  </p>
                  {conv.lastMessageAt && (
                    <span className="ml-2 text-[11px] text-ink-400 whitespace-nowrap">
                      {timeAgo(conv.lastMessageAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'truncate text-xs',
                    conv.unreadCount > 0 ? 'font-medium text-ink-700' : 'text-ink-400'
                  )}>
                    {conv.lastMessagePreview || 'Nouvelle conversation'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-forest-900 px-1.5 text-[10px] font-bold text-white">
                      {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ── Chat View ──

function ChatView({
  conversation,
  onBack,
}: {
  conversation: ConversationSummary;
  onBack: () => void;
}) {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useMessages(conversation.id);
  const sendMutation = useSendMessage();
  const markReadMutation = useMarkAsRead();
  const deleteMutation = useDeleteMessage();
  const { on, emit, connected } = useSocket();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [menuMessageId, setMenuMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const menuRef = useRef<HTMLDivElement>(null);

  // Sync messages from query on conversation change
  const loadedConvRef = useRef<string | null>(null);
  useEffect(() => {
    if (data?.messages && loadedConvRef.current !== conversation.id) {
      setMessages(data.messages);
      loadedConvRef.current = conversation.id;
    }
  }, [data, conversation.id]);

  // Join conversation room (also re-join on reconnect)
  useEffect(() => {
    if (!connected) return;
    emit('conversation:join', { conversationId: conversation.id });
    return () => {
      emit('conversation:leave', { conversationId: conversation.id });
    };
  }, [conversation.id, emit, connected]);

  // Mark as read
  useEffect(() => {
    if (conversation.unreadCount > 0) {
      markReadMutation.mutate(conversation.id);
    }
  }, [conversation.id, conversation.unreadCount]);

  // Refs to avoid stale closures in socket listeners
  const conversationIdRef = useRef(conversation.id);
  const userIdRef = useRef(user?.id);
  useEffect(() => { conversationIdRef.current = conversation.id; }, [conversation.id]);
  useEffect(() => { userIdRef.current = user?.id; }, [user?.id]);

  // Helper to add an incoming message (deduplication)
  const addIncomingMessage = useCallback((message: ChatMessage) => {
    if (message.senderId === userIdRef.current) return; // skip own
    if (message.conversationId !== conversationIdRef.current) return;
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) return prev;
      return [...prev, message];
    });
    markReadMutation.mutate(conversationIdRef.current);
  }, [markReadMutation]);

  // Listen for new messages via socket — conversation room
  useEffect(() => {
    const unsub = on('message:new', (msg: unknown) => {
      addIncomingMessage(msg as ChatMessage);
    });
    return unsub;
  }, [on, addIncomingMessage]);

  // Listen for message:notification — personal user room (fallback)
  useEffect(() => {
    const unsub = on('message:notification', (payload: unknown) => {
      const { message } = payload as { conversationId: string; message: ChatMessage };
      addIncomingMessage(message);
    });
    return unsub;
  }, [on, addIncomingMessage]);

  // Listen for typing
  useEffect(() => {
    const unsubStart = on('typing:start', (d: unknown) => {
      const data = d as { conversationId: string; userId: string };
      if (data.conversationId === conversation.id && data.userId !== user?.id) {
        setIsTyping(true);
      }
    });
    const unsubStop = on('typing:stop', (d: unknown) => {
      const data = d as { conversationId: string; userId: string };
      if (data.conversationId === conversation.id && data.userId !== user?.id) {
        setIsTyping(false);
      }
    });
    return () => { unsubStart?.(); unsubStop?.(); };
  }, [conversation.id, on, user?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || !user) return;

    // Optimistic: add immediately
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: conversation.id,
      senderId: user.id,
      senderName: user.nomComplet,
      content: text,
      type: 'text',
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput('');

    // Send via REST only (socket listener handles incoming messages from others)
    sendMutation.mutate({
      conversationId: conversation.id,
      content: text,
    }, {
      onSuccess: (msg) => {
        // Replace optimistic with real message
        setMessages((prev) => prev.map((m) => m.id === optimistic.id ? msg : m));
      },
    });

    emit('typing:stop', { conversationId: conversation.id });
  }, [input, user, conversation.id, emit, sendMutation]);

  const handleInputChange = (val: string) => {
    setInput(val);
    emit('typing:start', { conversationId: conversation.id });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emit('typing:stop', { conversationId: conversation.id });
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMenuMessageId(null);
    deleteMutation.mutate(messageId, {
      onSuccess: () => {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
      },
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setInput((prev) => prev + emoji);
  };

  // Close context menu on outside click
  useEffect(() => {
    if (!menuMessageId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuMessageId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuMessageId]);

  // Group messages by date
  const groupedMessages = messages.reduce<{ date: string; items: ChatMessage[] }[]>((acc, msg) => {
    const date = new Date(msg.createdAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const last = acc[acc.length - 1];
    if (last?.date === date) {
      last.items.push(msg);
    } else {
      acc.push({ date, items: [msg] });
    }
    return acc;
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-forest-900/5 px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-100 md:hidden"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="relative">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-cream-100">
            {conversation.recipient ? initials(conversation.recipient.nomComplet) : '??'}
          </div>
          {conversation.recipient?.online && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-ink-900">
            {conversation.recipient?.nomComplet ?? 'Inconnu'}
          </p>
          <p className="text-xs text-ink-400">
            {isTyping
              ? 'ecrit...'
              : conversation.recipient?.online
              ? 'En ligne'
              : 'Hors ligne'}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-forest-700" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <MessageCircle className="mb-3 h-10 w-10 text-ink-200" />
            <p className="text-sm text-ink-400">Commencez la conversation</p>
          </div>
        ) : (
          groupedMessages.map((group) => (
            <div key={group.date}>
              <div className="my-4 flex items-center gap-3">
                <div className="h-px flex-1 bg-ink-100" />
                <span className="text-[11px] font-medium text-ink-400 capitalize">{group.date}</span>
                <div className="h-px flex-1 bg-ink-100" />
              </div>
              {group.items.map((msg, i) => {
                const isMine = msg.senderId === user?.id;
                const isTemp = msg.id.startsWith('temp-');
                const showAvatar =
                  !isMine &&
                  (i === 0 || group.items[i - 1]?.senderId !== msg.senderId);
                return (
                  <div
                    key={msg.id}
                    className={cn('group/msg flex mb-1', isMine ? 'justify-end' : 'justify-start')}
                  >
                    <div className={cn('flex items-end gap-2 max-w-[75%]', isMine && 'flex-row-reverse')}>
                      {!isMine && (
                        <div className={cn('w-7 flex-shrink-0', !showAvatar && 'invisible')}>
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-900 text-[10px] font-semibold text-cream-100">
                            {initials(msg.senderName || '')}
                          </div>
                        </div>
                      )}
                      <div className="relative">
                        <div
                          className={cn(
                            'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                            isMine
                              ? 'bg-forest-900 text-white rounded-br-md'
                              : 'bg-cream-100 text-ink-900 rounded-bl-md',
                          )}
                        >
                          {msg.type === 'image' && msg.mediaUrl && (
                            <img
                              src={msg.mediaUrl}
                              alt="Image"
                              className="mb-1 max-h-48 rounded-xl object-cover"
                            />
                          )}
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                          <div className={cn(
                            'mt-0.5 flex items-center gap-1 text-[10px]',
                            isMine ? 'text-white/60 justify-end' : 'text-ink-400',
                          )}>
                            <span>{formatMessageTime(msg.createdAt)}</span>
                            {isMine && (
                              <CheckCheck className="h-3 w-3" />
                            )}
                          </div>
                        </div>

                        {/* Context menu trigger (only for own non-temp messages) */}
                        {isMine && !isTemp && (
                          <button
                            onClick={() => setMenuMessageId(menuMessageId === msg.id ? null : msg.id)}
                            className="absolute -left-7 top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 flex h-6 w-6 items-center justify-center rounded-full text-ink-300 transition hover:bg-ink-100 hover:text-ink-500"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        )}

                        {/* Delete menu */}
                        {menuMessageId === msg.id && (
                          <div
                            ref={menuRef}
                            className={cn(
                              'absolute top-0 z-10 rounded-xl border border-ink-100 bg-white py-1 shadow-lg',
                              isMine ? 'right-full mr-2' : 'left-full ml-2',
                            )}
                          >
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 whitespace-nowrap"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Supprimer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex items-center gap-2 py-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forest-900 text-[10px] font-semibold text-cream-100">
              {conversation.recipient ? initials(conversation.recipient.nomComplet) : '??'}
            </div>
            <div className="rounded-2xl bg-cream-100 px-4 py-2.5">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400 [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400 [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-ink-400 [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-forest-900/5 p-3">
        <div className="flex items-end gap-2">
          <EmojiPicker onSelect={handleEmojiSelect} />
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ecrire un message..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-forest-900/10 bg-cream-50 px-4 py-2.5 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 120) + 'px';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-forest-900 text-white transition hover:bg-forest-700 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const conversationParam = searchParams.get('conversation');
  const [activeConversation, setActiveConversation] = useState<ConversationSummary | null>(null);
  const [search, setSearch] = useState('');
  const { data: conversations, isLoading } = useConversations();

  // Auto-select conversation from query param
  const [paramHandled, setParamHandled] = useState(false);
  useEffect(() => {
    if (!conversationParam || paramHandled) return;

    // Try to find in already-loaded conversations
    if (conversations?.length) {
      const found = conversations.find((c) => c.id === conversationParam);
      if (found) {
        setActiveConversation(found);
        setParamHandled(true);
        return;
      }
    }

    // If conversations loaded but not found, refetch to pick up newly created conversation
    if (conversations && !isLoading) {
      getConversations().then((fresh) => {
        const found = fresh.find((c) => c.id === conversationParam);
        if (found) setActiveConversation(found);
        setParamHandled(true);
      });
    }
  }, [conversationParam, conversations, isLoading, paramHandled]);

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Messages
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Communiquez avec les membres de votre paroisse
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm" style={{ height: 'calc(100vh - 220px)', minHeight: '500px' }}>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
          </div>
        ) : (
          <div className="flex h-full">
            {/* Conversation List - hidden on mobile when chat is open */}
            <div
              className={cn(
                'w-full border-r border-forest-900/5 md:w-[340px] md:block',
                activeConversation ? 'hidden' : 'block',
              )}
            >
              <ConversationList
                conversations={conversations ?? []}
                activeId={activeConversation?.id ?? null}
                onSelect={setActiveConversation}
                search={search}
                onSearchChange={setSearch}
              />
            </div>

            {/* Chat View */}
            <div
              className={cn(
                'flex-1 md:block',
                activeConversation ? 'block' : 'hidden',
              )}
            >
              {activeConversation ? (
                <ChatView
                  conversation={activeConversation}
                  onBack={() => setActiveConversation(null)}
                />
              ) : (
                <div className="hidden md:flex h-full items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="mx-auto mb-3 h-12 w-12 text-ink-200" />
                    <p className="text-sm text-ink-400">
                      Selectionnez une conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
