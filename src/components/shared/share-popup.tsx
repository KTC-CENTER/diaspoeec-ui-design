'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Copy, Check, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SharePopupProps {
  url: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  getUrl: (url: string, title: string) => string;
}

const shareOptions: ShareOption[] = [
  {
    name: 'WhatsApp',
    icon: <MessageCircle className="h-5 w-5" />,
    color: 'bg-[#25D366] hover:bg-[#20BD5A]',
    getUrl: (url, title) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
  {
    name: 'Facebook',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    color: 'bg-[#1877F2] hover:bg-[#166FE5]',
    getUrl: (url) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    name: 'X',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    color: 'bg-[#0F1419] hover:bg-[#272C30]',
    getUrl: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: 'Telegram',
    icon: (
      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: 'bg-[#0088CC] hover:bg-[#0077B3]',
    getUrl: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
];

export function SharePopup({ url, title, isOpen, onClose }: SharePopupProps) {
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
    }
  };

  const handleShare = (option: ShareOption) => {
    window.open(option.getUrl(url, title), '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className={cn(
        'absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-30 w-72 max-w-[calc(100vw-2rem)] rounded-2xl bg-white p-4 shadow-xl border border-ink-100',
        'animate-fade-up'
      )}
      role="dialog"
      aria-label="Partager"
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-ink-900">Partager</h4>
        <button
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Share Buttons */}
      <div className="flex gap-2">
        {shareOptions.map((option) => (
          <button
            key={option.name}
            onClick={() => handleShare(option)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all',
              option.color
            )}
            aria-label={`Partager sur ${option.name}`}
            title={option.name}
          >
            {option.icon}
          </button>
        ))}
      </div>

      {/* Copy Link */}
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-ink-100 bg-cream-50 p-2">
        <input
          type="text"
          readOnly
          value={url}
          className="min-w-0 flex-1 truncate bg-transparent text-xs text-ink-600 outline-none"
        />
        <button
          onClick={handleCopy}
          className={cn(
            'flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-all',
            copied
              ? 'bg-success/10 text-success'
              : 'bg-forest-900 text-white hover:bg-forest-700'
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copie!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copier
            </>
          )}
        </button>
      </div>
    </div>
  );
}
