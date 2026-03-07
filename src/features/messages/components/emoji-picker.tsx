'use client';

import { useState, useRef, useEffect } from 'react';
import { Smile, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const EMOJI_CATEGORIES = [
  {
    name: '😊 Smileys',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫',
      '🤔', '🫡', '🤐', '🤨', '😐', '😑', '😶', '🫥', '😏', '😒',
      '🙄', '😬', '😮‍💨', '🤥', '🫠', '😌', '😔', '😪', '🤤', '😴',
      '😷', '🤒', '🤕', '🤢', '🤮', '🥵', '🥶', '🥴', '😵', '🤯',
      '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '🫤', '😟', '🙁',
      '😮', '😯', '😲', '😳', '🥺', '🥹', '😦', '😧', '😨', '😰',
      '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫',
      '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩',
    ],
  },
  {
    name: '👋 Gestes',
    emojis: [
      '👋', '🤚', '🖐️', '✋', '🖖', '🫱', '🫲', '🫳', '🫴', '👌',
      '🤌', '🤏', '✌️', '🤞', '🫰', '🤟', '🤘', '🤙', '👈', '👉',
      '👆', '🖕', '👇', '☝️', '🫵', '👍', '👎', '✊', '👊', '🤛',
      '🤜', '👏', '🙌', '🫶', '👐', '🤲', '🤝', '🙏', '✍️', '💅',
      '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠',
    ],
  },
  {
    name: '❤️ Coeurs',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❤️‍🔥', '❤️‍🩹', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝',
      '💟', '♥️', '🫶', '💑', '💏', '👨‍❤️‍👨', '👩‍❤️‍👩', '💐', '🌹', '🌺',
    ],
  },
  {
    name: '🙏 Foi',
    emojis: [
      '🙏', '✝️', '⛪', '📖', '🕊️', '👼', '😇', '🌟', '✨', '💫',
      '🕯️', '🔔', '📿', '🫂', '🤲', '💒', '⭐', '🌅', '🌄', '🎵',
      '🎶', '🎼', '🎤', '🎹', '🥁', '🎺', '🎻', '🪕', '🎸', '🎭',
    ],
  },
  {
    name: '🎉 Objets',
    emojis: [
      '🎉', '🎊', '🎈', '🎁', '🎂', '🎄', '🎀', '🏆', '🏅', '🥇',
      '⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '🪀', '🏓',
      '📱', '💻', '⌨️', '🖥️', '📸', '📷', '🎥', '📹', '📺', '📻',
      '🚗', '🚕', '🚌', '🚎', '🚓', '🚑', '🚒', '✈️', '🚀', '🛸',
      '🌍', '🌎', '🌏', '🗺️', '🧭', '🏔️', '🌋', '🏖️', '🏝️', '🏞️',
    ],
  },
  {
    name: '🍕 Nourriture',
    emojis: [
      '🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧈',
      '🥞', '🧇', '🥯', '🍞', '🥖', '🥨', '🧀', '🥗', '🥙', '🥪',
      '🌮', '🌯', '🫔', '🥘', '🍲', '🫕', '🥣', '🥩', '🍗', '🍖',
      '☕', '🍵', '🫖', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷',
      '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑',
    ],
  },
];

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-ink-400 transition hover:bg-ink-100 hover:text-ink-600"
      >
        <Smile className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute bottom-12 left-0 z-50 w-[320px] rounded-2xl border border-forest-900/10 bg-white shadow-xl">
          {/* Category tabs */}
          <div className="flex gap-1 overflow-x-auto border-b border-ink-100 px-2 py-1.5">
            {EMOJI_CATEGORIES.map((cat, i) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(i)}
                className={cn(
                  'shrink-0 rounded-lg px-2 py-1 text-xs font-medium transition',
                  activeCategory === i
                    ? 'bg-forest-900 text-white'
                    : 'text-ink-500 hover:bg-ink-100',
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Emojis grid */}
          <div className="h-[200px] overflow-y-auto p-2">
            <div className="grid grid-cols-8 gap-0.5">
              {EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    onSelect(emoji);
                    setOpen(false);
                  }}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-cream-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
