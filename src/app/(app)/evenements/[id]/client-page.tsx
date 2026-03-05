'use client';

import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useDynamicId } from '@/hooks/use-dynamic-id';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  CalendarPlus,
  Send,
  Heart,
  Loader2,
  Link as LinkIcon,
  Video,
  Flag,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/format';
import { useEvenement, useEventComments, useCreateEventComment, useLikeComment } from '@/features/evenements/hooks/use-evenements';
import { ProgrammeList } from '@/features/evenements/components/programme-list';
import { RSVPForm } from '@/features/evenements/components/rsvp-form';
import { EmojiPicker } from '@/components/shared/emoji-picker';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { useReportComment } from '@/hooks/use-report-comment';
import type { Comment } from '@/types';

const typeGradients: Record<string, string> = {
  culte: 'from-forest-900 via-forest-700 to-sage-400',
  conference: 'from-gold-600 via-terra-600 to-forest-900',
  retraite: 'from-sage-400 to-forest-700',
  formation: 'from-terra-600 to-gold-500',
  jeunesse: 'from-forest-700 via-sage-400 to-forest-900',
};

const typeLabels: Record<string, string> = {
  culte: 'Culte',
  conference: 'Conference',
  retraite: 'Retraite',
  formation: 'Formation',
  jeunesse: 'Jeunesse',
};

/* Brand SVG icons for share buttons */
const WhatsAppIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const commentAvatarColors = [
  'bg-terra-600',
  'bg-gold-600',
  'bg-forest-700',
  'bg-forest-900',
  'bg-sage-400',
];

const REPORT_REASONS = [
  'Contenu inapproprie',
  'Spam ou publicite',
  'Langage offensant',
  'Harcelement',
  'Fausse information',
];

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
          <h3 className="text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
            Signaler ce commentaire
          </h3>
          <button onClick={onClose} className="rounded-lg p-1 text-ink-400 transition hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mb-4 text-sm text-ink-500">Pourquoi signalez-vous ce commentaire ?</p>
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
          <button onClick={onClose} className="flex-1 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50">
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

function ReplyItem({ reply }: { reply: Comment & { userLiked?: boolean } }) {
  const [liked, setLiked] = useState(reply.userLiked ?? false);
  const [likeCount, setLikeCount] = useState(reply.likes);
  const likeComment = useLikeComment();

  const handleLike = () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    likeComment.mutate(reply.id, {
      onSuccess: (result) => {
        setLiked(result.liked);
        setLikeCount(result.likes);
      },
      onError: () => {
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      },
    });
  };

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 gradient-forest">
        {getInitials(reply.auteurNom)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-ink-900">{reply.auteurNom}</h4>
          </div>
          <span className="text-xs text-ink-400">
            {formatRelativeTime(reply.createdAt)}
          </span>
        </div>
        <p className="text-sm text-ink-600 leading-relaxed mb-2">
          {reply.contenu}
        </p>
        <button
          onClick={handleLike}
          className={cn(
            'flex items-center gap-1 text-xs transition-colors',
            liked ? 'text-red-500' : 'text-ink-400 hover:text-red-500'
          )}
        >
          <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
          <span>{likeCount}</span>
        </button>
      </div>
    </div>
  );
}

function EventCommentItem({ comment, index = 0, evenementId, onReport }: { comment: Comment & { userLiked?: boolean }; index?: number; evenementId: string; onReport: (id: string) => void }) {
  const [liked, setLiked] = useState(comment.userLiked ?? false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { addToast } = useToastStore();
  const createReply = useCreateEventComment();
  const likeComment = useLikeComment();

  const handleLike = () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    likeComment.mutate(comment.id, {
      onSuccess: (result) => {
        setLiked(result.liked);
        setLikeCount(result.likes);
      },
      onError: () => {
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      },
    });
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    createReply.mutate(
      { targetType: 'evenement', targetId: evenementId, contenu: replyText.trim(), parentId: comment.id },
      {
        onSuccess: () => {
          addToast(`Reponse envoyee a ${comment.auteurNom}`, 'success');
          setReplyText('');
          setReplyOpen(false);
        },
        onError: () => {
          addToast('Erreur lors de l\'envoi', 'error');
        },
      }
    );
  };

  const avatarColor = commentAvatarColors[index % commentAvatarColors.length];

  return (
    <div className="bg-white rounded-2xl border border-forest-900/6 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className={cn(
          'w-9 h-9 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0',
          avatarColor
        )}>
          {getInitials(comment.auteurNom)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-ink-900">{comment.auteurNom}</h4>
              {comment.auteurRole && (
                <span className="px-1.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 text-[10px] font-medium">
                  {comment.auteurRole}
                </span>
              )}
            </div>
            <span className="text-xs text-ink-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-ink-600 leading-relaxed mb-2">
            {comment.contenu}
          </p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={cn(
                'flex items-center gap-1 text-xs transition-colors',
                liked ? 'text-red-500' : 'text-ink-400 hover:text-red-500'
              )}
            >
              <Heart className={cn('w-3.5 h-3.5', liked && 'fill-current')} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => setReplyOpen((prev) => !prev)}
              className={cn(
                'text-xs transition-colors',
                replyOpen ? 'text-forest-900 font-medium' : 'text-ink-400 hover:text-forest-900'
              )}
            >
              Repondre
            </button>
            <button
              onClick={() => onReport(comment.id)}
              className="inline-flex items-center gap-1 text-xs text-ink-300 transition-colors hover:text-orange-500 active:text-orange-500"
              title="Signaler"
            >
              <Flag className="h-3 w-3" />
            </button>
          </div>

          {replyOpen && (
            <div className="mt-3">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder={`Repondre a ${comment.auteurNom}...`}
                className="w-full resize-none border border-forest-900/10 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 h-10 focus:h-20 transition-all"
                rows={1}
              />
              <div className="mt-1.5 flex items-center justify-between">
                <EmojiPicker onSelect={(emoji) => setReplyText((prev) => prev + emoji)} />
                <button
                  onClick={handleReply}
                  className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center hover:bg-forest-700 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 border-l-2 border-sage-400 pl-4 space-y-3">
              {comment.replies.map((reply) => (
                <ReplyItem key={reply.id} reply={reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EventCommentSection({ evenementId }: { evenementId: string }) {
  const { data: comments, isLoading } = useEventComments(evenementId);
  const [newComment, setNewComment] = useState('');
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const { addToast } = useToastStore();
  const user = useAuthStore((s) => s.user);
  const createComment = useCreateEventComment();
  const reportMutation = useReportComment();

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

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newComment.trim()) return;
    createComment.mutate(
      { targetType: 'evenement', targetId: evenementId, contenu: newComment.trim() },
      {
        onSuccess: () => {
          addToast('Commentaire publie !', 'success');
          setNewComment('');
        },
        onError: () => {
          addToast('Erreur lors de la publication', 'error');
        },
      }
    );
  };

  return (
    <div>
      <h2 className="font-heading text-xl font-bold text-forest-900 mb-5">
        {comments?.length || 0} Commentaires
      </h2>

      {/* Add Comment */}
      <div className="bg-white rounded-2xl border border-forest-900/6 p-4 mb-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-forest flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {user ? getInitials(user.nomComplet) : 'U'}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Ecrire un commentaire..."
              className="w-full resize-none border border-forest-900/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900/30 transition-all h-12 focus:h-24"
              rows={1}
            />
            <div className="mt-2 flex items-center justify-between">
              <EmojiPicker onSelect={(emoji) => setNewComment((prev) => prev + emoji)} />
              <button
                onClick={() => handleSubmit()}
                className="w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center hover:bg-forest-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-forest-900/6 p-4 shadow-sm">
              <div className="flex gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full shimmer-bg" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded shimmer-bg" />
                  <div className="h-3 w-full rounded shimmer-bg" />
                  <div className="h-3 w-2/3 rounded shimmer-bg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {comments?.map((comment, index) => (
            <EventCommentItem key={comment.id} comment={comment} index={index} evenementId={evenementId} onReport={setReportTarget} />
          ))}
          {comments?.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-400">
              Soyez le premier a commenter cet evenement.
            </p>
          )}
        </div>
      )}
      <ReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        onSubmit={handleReport}
        isPending={reportMutation.isPending}
      />
    </div>
  );
}

export default function EvenementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = use(params);
  const id = useDynamicId(rawId);
  const { data: evenement, isLoading } = useEvenement(id);
  const searchParams = useSearchParams();
  const backTo = searchParams.get('from') === 'cultes' ? '/cultes' : '/evenements';
  const backLabel = searchParams.get('from') === 'cultes' ? 'Cultes' : 'Evenements';
  const { addToast } = useToastStore();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Evenement introuvable
        </h2>
        <p className="mt-2 text-ink-500">
          Cet evenement n&apos;existe pas ou a ete supprime.
        </p>
        <Link
          href="/evenements"
          className="mt-4 inline-flex items-center gap-2 text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux evenements
        </Link>
      </div>
    );
  }

  const gradient = typeGradients[evenement.type] || typeGradients.culte;
  const dateFormatted = formatDate(evenement.date, 'EEEE dd MMMM yyyy');
  const timeStart = formatDate(evenement.date, 'HH:mm');
  const timeEnd = evenement.heureFin
    ? formatDate(evenement.heureFin, 'HH:mm')
    : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShareWhatsApp = () => {
    const text = `${evenement.titre} - ${dateFormatted}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareX = () => {
    const text = `${evenement.titre} - ${dateFormatted}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const participantGradients = [
    'from-forest-900 to-sage-400',
    'from-gold-600 to-gold-400',
    'from-terra-600 to-gold-600',
    'from-forest-700 to-forest-900',
    'from-sage-400 to-forest-900',
    'from-gold-400 to-terra-600',
    'from-forest-900 to-forest-700',
    'from-terra-600 to-gold-600',
  ];

  const handleAddToCalendar = () => {
    const start = new Date(evenement.date);
    const end = evenement.heureFin ? new Date(evenement.heureFin) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${evenement.titre}`,
      `LOCATION:${evenement.lieu}`,
      `DESCRIPTION:${evenement.description?.slice(0, 200) || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evenement.titre.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Evenement ajoute a votre calendrier', 'success');
  };

  return (
    <div className="max-w-5xl">
      {/* Back button */}
      <div className="px-4 md:px-8 pt-4">
        <Link
          href={backTo}
          className="flex items-center gap-2 text-forest-900 font-medium hover:text-forest-700 transition text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {backLabel}
        </Link>
      </div>

      {/* Hero with african pattern */}
      <div
        className={cn(
          'mx-4 md:mx-8 rounded-2xl overflow-hidden relative bg-gradient-to-br p-8 md:p-12 mb-6',
          'animate-[fade-up_0.5s_ease-out_both]',
          gradient
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%2395D5B2' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
            {typeLabels[evenement.type]}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mt-4 leading-tight">
            {evenement.titre}
          </h1>
        </div>
        {/* Decorative element */}
        <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
          <svg viewBox="0 0 80 80"><path d="M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z" fill="white"/></svg>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8">
        {/* Info cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-[fade-up_0.5s_ease-out_0.1s_both]">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <CalendarDays className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {formatDate(evenement.date, 'EEEE')}
            </p>
            <p className="text-xs text-ink-600">
              {formatDate(evenement.date, 'dd MMMM yyyy')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <Clock className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {timeStart}{timeEnd ? ` - ${timeEnd}` : ''}
            </p>
            <p className="text-xs text-ink-600">
              {timeEnd ? 'Duree du culte' : 'Heure de debut'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <MapPin className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {evenement.lieu.split(',')[0]}
            </p>
            <p className="text-xs text-ink-600">
              {evenement.lieu.split(',').slice(1).join(',').trim() || 'Voir adresse'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <Users className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {evenement.participantsInscrits} inscrits
            </p>
            <p className="text-xs text-ink-600">
              {evenement.maxParticipants
                ? `${evenement.maxParticipants - evenement.participantsInscrits} places restantes`
                : 'Places illimitees'}
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 overflow-hidden mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <div className="h-48 bg-gradient-to-br from-sage-200 via-sage-400/30 to-cream-100 relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-forest-900/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-forest-900" />
              </div>
              <p className="text-sm text-ink-600">{evenement.lieu}</p>
            </div>
            {/* Decorative map lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-forest-900" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-forest-900" />
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-forest-900" />
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(evenement.lieu)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-forest-900 font-medium text-sm hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Voir sur Google Maps
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            A propos de cet evenement
          </h2>
          <p className="text-ink-600 leading-relaxed mb-4 whitespace-pre-line">
            {evenement.description}
          </p>

          {/* Programme inline */}
          {evenement.programme && evenement.programme.length > 0 && (
            <>
              <h3 className="font-heading font-bold text-ink-900 mb-3">Programme</h3>
              <div className="space-y-3">
                {evenement.programme.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-forest-900 bg-sage-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {item.heure}
                    </span>
                    <span className="text-ink-600 text-sm">{item.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Lien en ligne (culte YouTube/Zoom) */}
        {evenement.lienZoom && (
          <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-forest-900 to-forest-700 p-6 shadow-lg animate-[fade-up_0.5s_ease-out_0.25s_both]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-1">
                  Culte en ligne
                </p>
                <p className="text-white font-semibold">
                  Rejoignez ce culte depuis chez vous
                </p>
              </div>
              <a
                href={evenement.lienZoom}
                target="_blank"
                rel="noopener noreferrer"
                className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-forest-900 shadow-md transition-opacity hover:opacity-90"
              >
                <Video className="h-4 w-4" />
                Rejoindre en ligne
              </a>
            </div>
          </div>
        )}

        {/* RSVP */}
        <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
          <RSVPForm eventId={evenement.id} userParticipe={evenement.userParticipe} />
        </div>

        {/* Attendees */}
        {evenement.participantsInscrits > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
            <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
              Participants ({evenement.participantsInscrits})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2 items-center">
              <div className="flex [&>*:not(:first-child)]:-ml-3">
                {Array.from({ length: Math.min(8, evenement.participantsInscrits) }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-11 h-11 rounded-full bg-gradient-to-br border-2 border-white flex items-center justify-center',
                      participantGradients[i % participantGradients.length]
                    )}
                  >
                    <svg className="w-5 h-5 text-white opacity-80" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                ))}
                {evenement.participantsInscrits > 8 && (
                  <div className="w-11 h-11 rounded-full bg-ink-200 border-2 border-white flex items-center justify-center text-ink-700 text-xs font-bold">
                    +{evenement.participantsInscrits - 8}
                  </div>
                )}
              </div>
              <span className="text-sm text-ink-500 ml-2 whitespace-nowrap">
                {evenement.participantsInscrits} participant{evenement.participantsInscrits > 1 ? 's' : ''} inscrit{evenement.participantsInscrits > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            Partager
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <FacebookIcon />
              Facebook
            </button>
            <button
              onClick={handleShareX}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <XIcon />
              X
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-ink-100 text-ink-900 rounded-xl text-sm font-medium hover:bg-ink-200 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <LinkIcon className="w-4 h-4" />
              Copier le lien
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.4s_both]">
          <EventCommentSection evenementId={id} />
        </div>

        {/* Add to calendar */}
        <button
          onClick={handleAddToCalendar}
          className="w-full md:w-auto px-6 py-3.5 bg-white border-2 border-forest-900 text-forest-900 font-semibold rounded-xl hover:bg-forest-900 hover:text-white transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-[fade-up_0.5s_ease-out_0.4s_both]"
        >
          <CalendarPlus className="w-5 h-5" />
          Ajouter au calendrier
        </button>
      </div>
    </div>
  );
}
