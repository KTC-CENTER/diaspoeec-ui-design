'use client';

import { useState } from 'react';
import { Send, Heart, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AvatarCircle } from './avatar-circle';
import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (text: string) => void;
  currentUserName?: string;
}

function getRoleBadge(name: string): string | null {
  // Simple convention: names starting with "Pasteur" get a badge
  if (name.toLowerCase().startsWith('pasteur')) return 'Pasteur';
  return null;
}

function formatTime(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: fr });
  } catch {
    return dateStr;
  }
}

interface SingleCommentProps {
  comment: Comment;
  isReply?: boolean;
}

function SingleComment({ comment, isReply = false }: SingleCommentProps) {
  const [localLiked, setLocalLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes);
  const roleBadge = getRoleBadge(comment.auteurNom);

  const handleLike = () => {
    if (localLiked) {
      setLocalLikes((l) => l - 1);
    } else {
      setLocalLikes((l) => l + 1);
    }
    setLocalLiked(!localLiked);
  };

  return (
    <div className={cn('flex gap-3', isReply && 'ml-10 mt-3')}>
      {isReply && (
        <CornerDownRight className="mt-1 h-4 w-4 shrink-0 text-ink-300" />
      )}
      <AvatarCircle name={comment.auteurNom} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink-900">
            {comment.auteurNom}
          </span>
          {roleBadge && (
            <span className="rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-semibold text-forest-700">
              {roleBadge}
            </span>
          )}
          <span className="text-xs text-ink-400">
            {formatTime(comment.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm leading-relaxed text-ink-700">
          {comment.contenu}
        </p>
        <button
          onClick={handleLike}
          className={cn(
            'mt-1 inline-flex items-center gap-1 text-xs transition-colors',
            localLiked ? 'text-red-500' : 'text-ink-400 hover:text-red-400'
          )}
        >
          <Heart
            className={cn(
              'h-3 w-3',
              localLiked && 'fill-red-500'
            )}
          />
          {localLikes > 0 && <span>{localLikes}</span>}
        </button>
      </div>
    </div>
  );
}

export function CommentSection({ comments, onSubmit, currentUserName = 'Moi' }: CommentSectionProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  };

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-start gap-3">
        <AvatarCircle name={currentUserName} size="sm" />
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-ink-100 bg-white px-3 py-2 focus-within:border-forest-500 focus-within:ring-1 focus-within:ring-forest-500/20 transition-all">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ecrire un commentaire..."
            className="min-w-0 flex-1 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all',
              text.trim()
                ? 'bg-forest-900 text-white hover:bg-forest-700'
                : 'bg-ink-100 text-ink-300 cursor-not-allowed'
            )}
            aria-label="Envoyer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id}>
            <SingleComment comment={comment} />
            {/* Nested Replies (1 level) */}
            {comment.replies?.map((reply: Comment) => (
              <SingleComment key={reply.id} comment={reply} isReply />
            ))}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="py-6 text-center text-sm text-ink-400">
          Aucun commentaire pour le moment. Soyez le premier !
        </p>
      )}
    </div>
  );
}
