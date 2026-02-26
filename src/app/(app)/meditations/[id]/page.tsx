'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  UserPlus,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatRelativeTime, getInitials } from '@/lib/utils/format';
import {
  useMeditation,
  useComments,
} from '@/features/meditations/hooks/use-meditations';
import { MeditationContent } from '@/features/meditations/components/meditation-content';
import { useToastStore } from '@/stores/toast.store';
import type { Comment } from '@/types';

const categorieLabels: Record<string, string> = {
  foi: 'Foi',
  priere: 'Priere',
  famille: 'Famille',
  esperance: 'Esperance',
  grace: 'Grace',
  perseverance: 'Perseverance',
};

const commentAvatarColors = [
  'bg-terra-600',
  'bg-gold-600',
  'bg-forest-700',
  'bg-forest-900',
  'bg-sage-400',
];

function ReplyItem({ reply }: { reply: Comment }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reply.likes);

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 gradient-forest">
        {getInitials(reply.auteurNom)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-ink-900">{reply.auteurNom}</h4>
            {reply.auteurRole && (
              <span className="px-1.5 py-0.5 rounded-full bg-forest-900/10 text-forest-900 text-[10px] font-medium">
                Auteur
              </span>
            )}
          </div>
          <span className="text-xs text-ink-400">
            {formatRelativeTime(reply.createdAt)}
          </span>
        </div>
        <p className="text-sm text-ink-600 leading-relaxed mb-2">
          {reply.contenu}
        </p>
        <button
          onClick={() => {
            setLiked((prev) => !prev);
            setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
          }}
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

function CommentItem({ comment, index = 0 }: { comment: Comment; index?: number }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { addToast } = useToastStore();

  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleReply = () => {
    if (!replyText.trim()) return;
    addToast(`Reponse envoyee a ${comment.auteurNom}`, 'success');
    setReplyText('');
    setReplyOpen(false);
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
          </div>

          {/* Reply input */}
          {replyOpen && (
            <div className="mt-3 flex items-start gap-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(); } }}
                placeholder={`Repondre a ${comment.auteurNom}...`}
                className="flex-1 resize-none border border-forest-900/10 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 h-10 focus:h-20 transition-all"
                rows={1}
              />
              <button
                onClick={handleReply}
                className="mt-1 w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center hover:bg-forest-700 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Replies */}
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

function CommentSection({ meditationId }: { meditationId: string }) {
  const { data: comments, isLoading } = useComments(meditationId);
  const [newComment, setNewComment] = useState('');
  const { addToast } = useToastStore();

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newComment.trim()) return;
    addToast('Commentaire publie !', 'success');
    setNewComment('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-ink-900 mb-5">
        {comments?.length || 0} Commentaires
      </h2>

      {/* Add Comment */}
      <div className="bg-white rounded-2xl border border-forest-900/6 p-4 mb-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full gradient-forest flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            JP
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder="Ecrire un commentaire..."
              className="w-full resize-none border border-forest-900/10 rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900/30 transition-all h-12 focus:h-24"
              rows={1}
            />
            <button
              onClick={() => handleSubmit()}
              className="absolute right-3 bottom-3 w-8 h-8 rounded-lg bg-forest-900 text-white flex items-center justify-center hover:bg-forest-700 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
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
            <CommentItem key={comment.id} comment={comment} index={index} />
          ))}
          {comments?.length === 0 && (
            <p className="py-8 text-center text-sm text-ink-400">
              Soyez le premier a commenter cette meditation.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      <div className="mb-6 h-5 w-32 rounded shimmer-bg" />
      <div className="mb-8 h-56 rounded-2xl shimmer-bg" />
      <div className="mb-8 h-20 rounded-2xl shimmer-bg" />
      <div className="mb-6 h-64 rounded-2xl shimmer-bg" />
    </div>
  );
}

export default function MeditationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: meditation, isLoading, error } = useMeditation(id);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const { addToast } = useToastStore();

  const displayLikes = meditation
    ? liked
      ? meditation.likes + 1
      : likeCount > 0
        ? likeCount
        : meditation.likes
    : 0;

  const handleLike = () => {
    if (!meditation) return;
    setLiked((prev) => !prev);
    setLikeCount(liked ? meditation.likes : meditation.likes + 1);
  };

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !meditation) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-4 text-lg text-ink-500">
          Meditation introuvable
        </p>
        <Link
          href="/meditations"
          className="text-sm font-semibold text-forest-900 hover:text-forest-700"
        >
          Retour aux meditations
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      {/* Back Button */}
      <Link
        href="/meditations"
        className="group flex items-center gap-2 text-forest-900 font-medium text-sm mb-6 hover:text-forest-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Meditations
      </Link>

      {/* Hero */}
      <div className="rounded-2xl overflow-hidden mb-8">
        <div className="gradient-warm h-56 md:h-72 relative flex items-end">
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-forest-900 text-white text-xs font-semibold">
              {categorieLabels[meditation.categorie] || meditation.categorie}
            </span>
          </div>

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Title */}
          <div className="relative p-6 w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              {meditation.titre}
            </h1>
          </div>
        </div>
      </div>

      {/* Author Card */}
      <div className="bg-white rounded-2xl border border-forest-900/6 p-5 mb-8 flex items-center gap-4 shadow-sm">
        <div className="w-14 h-14 rounded-full gradient-forest flex items-center justify-center text-white font-bold text-lg shadow-md">
          {getInitials(meditation.auteurNom)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-ink-900 text-base">
            {meditation.auteurNom}
          </h3>
          <p className="text-sm text-ink-400">{meditation.auteurRole}</p>
          <p className="text-xs text-ink-400 mt-0.5">
            {formatDate(meditation.publishedAt, 'dd MMMM yyyy')} &middot; {meditation.tempsLecture} min de lecture
          </p>
        </div>
        <button
          onClick={() => {
            setFollowing((prev) => !prev);
            addToast(following ? `Vous ne suivez plus ${meditation.auteurNom}` : `Vous suivez ${meditation.auteurNom}`, 'success');
          }}
          className={cn(
            'px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5',
            following
              ? 'bg-forest-900 text-white'
              : 'hover:bg-cream-100 text-forest-900'
          )}
          title={following ? 'Ne plus suivre' : 'Suivre'}
        >
          <UserPlus className="w-4 h-4" />
          {following ? 'Suivi' : 'Suivre'}
        </button>
      </div>

      {/* Article Body */}
      <article className="bg-white rounded-2xl border border-forest-900/6 p-6 md:p-8 mb-6 shadow-sm">
        <style jsx global>{`
          .meditation-content p {
            font-family: var(--font-body);
            color: var(--color-ink-600);
            line-height: 1.75;
            margin-bottom: 1.5rem;
            font-size: 0.9375rem;
          }
          .meditation-content blockquote {
            border-left: 4px solid #D4A017;
            background: linear-gradient(135deg, #FEFAE0 0%, #FFFBF0 100%);
            padding: 1.25rem;
            margin: 2rem 0;
            border-radius: 0.75rem;
          }
          .meditation-content blockquote p {
            font-family: var(--font-heading);
            font-style: italic;
            color: var(--color-ink-900);
            font-size: 1.125rem;
            line-height: 1.6;
            margin-bottom: 0.5rem;
          }
          .meditation-content blockquote cite,
          .meditation-content blockquote footer {
            font-family: var(--font-body);
            font-style: normal;
            font-size: 0.875rem;
            font-weight: 600;
            color: #D4A017;
          }
        `}</style>
        <MeditationContent content={meditation.contenu} />

        {/* Afro divider within article */}
        <div className="afro-divider my-8" />

        <p className="text-ink-900 leading-relaxed text-[15px] font-medium">
          Que cette meditation vous accompagne tout au long de la semaine. Que votre foi grandisse et que la paix de Dieu remplisse votre coeur. Amen.
        </p>
      </article>

      {/* Action Bar */}
      <div className="bg-white rounded-2xl border border-forest-900/6 p-4 mb-8 shadow-sm">
        <div className="flex items-center justify-around">
          <button
            onClick={handleLike}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors',
              liked ? 'text-red-500' : 'text-ink-400 hover:text-red-500'
            )}
          >
            <Heart className={cn('w-5 h-5', liked && 'fill-current')} />
            <span className="text-xs">{displayLikes}</span>
          </button>

          <Link
            href="#commentaires"
            className="flex flex-col items-center gap-1 text-ink-400 hover:text-forest-900 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs">{meditation.commentCount}</span>
          </Link>

          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              addToast('Lien copie dans le presse-papier', 'success');
            }}
            className="flex flex-col items-center gap-1 text-ink-400 hover:text-forest-900 transition-colors"
            aria-label="Partager"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Partager</span>
          </button>

          <button
            onClick={() => setBookmarked((prev) => !prev)}
            className={cn(
              'flex flex-col items-center gap-1 transition-colors',
              bookmarked ? 'text-gold-600' : 'text-ink-400 hover:text-gold-600'
            )}
            aria-label={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Bookmark className={cn('w-5 h-5', bookmarked && 'fill-current')} />
            <span className="text-xs">Sauver</span>
          </button>
        </div>
      </div>

      {/* Afro Divider */}
      <div className="afro-divider-sm mb-8" />

      {/* Comments Section */}
      <section id="commentaires">
        <CommentSection meditationId={id} />
      </section>
    </div>
  );
}
