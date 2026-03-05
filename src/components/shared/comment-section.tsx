'use client';

import { useState } from 'react';
import { Send, Heart, CornerDownRight, Flag, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { AvatarCircle } from './avatar-circle';
import { useReportComment } from '@/hooks/use-report-comment';
import { useToastStore } from '@/stores/toast.store';
import type { Comment } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CommentSectionProps {
  comments: Comment[];
  onSubmit: (text: string) => void;
  currentUserName?: string;
}

function getRoleBadge(name: string): string | null {
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

const REPORT_REASONS = [
  'Contenu inapproprie',
  'Spam ou publicite',
  'Langage offensant',
  'Harcelement',
  'Fausse information',
];

interface SingleCommentProps {
  comment: Comment;
  isReply?: boolean;
  onReport: (commentId: string) => void;
}

function SingleComment({ comment, isReply = false, onReport }: SingleCommentProps) {
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
    <div className={cn('group flex gap-3', isReply && 'ml-10 mt-3')}>
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
        <div className="mt-1 flex items-center gap-3">
          <button
            onClick={handleLike}
            className={cn(
              'inline-flex items-center gap-1 text-xs transition-colors',
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
          <button
            onClick={() => onReport(comment.id)}
            className="inline-flex items-center gap-1 text-xs text-ink-300 transition-colors hover:text-orange-500 active:text-orange-500"
            title="Signaler"
          >
            <Flag className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReportModal({
  open,
  onClose,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (raison: string) => void;
  isPending: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3
            className="text-lg font-semibold text-ink-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Signaler ce commentaire
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-500">
          Pourquoi signalez-vous ce commentaire ?
        </p>
        <div className="space-y-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelected(reason)}
              className={cn(
                'w-full rounded-xl border px-4 py-2.5 text-left text-sm transition-all',
                selected === reason
                  ? 'border-forest-700 bg-forest-900/5 font-medium text-forest-900'
                  : 'border-ink-200 text-ink-600 hover:border-ink-300 hover:bg-ink-50'
              )}
            >
              {reason}
            </button>
          ))}
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
          >
            Annuler
          </button>
          <button
            onClick={() => selected && onSubmit(selected)}
            disabled={!selected || isPending}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
            Signaler
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommentSection({ comments, onSubmit, currentUserName = 'Moi' }: CommentSectionProps) {
  const [text, setText] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const reportMutation = useReportComment();
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setText('');
  };

  const handleReport = async (raison: string) => {
    if (!reportTarget) return;
    try {
      await reportMutation.mutateAsync({ commentId: reportTarget, raison });
      addToast('Commentaire signale. Merci pour votre vigilance.', 'success');
    } catch {
      addToast('Vous avez deja signale ce commentaire', 'error');
    }
    setReportTarget(null);
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
            <SingleComment comment={comment} onReport={setReportTarget} />
            {comment.replies?.map((reply: Comment) => (
              <SingleComment key={reply.id} comment={reply} isReply onReport={setReportTarget} />
            ))}
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="py-6 text-center text-sm text-ink-400">
          Aucun commentaire pour le moment. Soyez le premier !
        </p>
      )}

      {/* Report Modal */}
      <ReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={handleReport}
        isPending={reportMutation.isPending}
      />
    </div>
  );
}
