'use client';

import { useState } from 'react';
import { BookOpen, Heart, PenLine, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useChapter, useCreateNote, useLectureLike } from '@/features/bible/hooks/use-bible';
import { parseReference } from '@/lib/utils/parse-bible-reference';
import type { LectureJour } from '@/types';

interface DailyReadingProps {
  lecture: LectureJour;
}

export function DailyReading({ lecture }: DailyReadingProps) {
  const [liked, setLiked] = useState(lecture.userLiked ?? false);
  const [likeCount, setLikeCount] = useState(lecture.likeCount ?? 0);
  const [showFull, setShowFull] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const { addToast } = useToastStore();
  const createNote = useCreateNote();
  const lectureLike = useLectureLike();

  // Extraire le livre et chapitre depuis la référence pour charger le chapitre complet
  const parsed = parseReference(lecture.reference);
  const { data: chapter, isLoading: loadingChapter } = useChapter(
    parsed?.livre ?? '',
    parsed?.chapitre ?? 0,
  );

  const handleLike = () => {
    if (!lecture.id) return;
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((prev) => (wasLiked ? prev - 1 : prev + 1));
    lectureLike.mutate(lecture.id, {
      onSuccess: (result) => {
        setLiked(result.liked);
        setLikeCount(result.likeCount);
      },
      onError: () => {
        setLiked(wasLiked);
        setLikeCount((prev) => (wasLiked ? prev + 1 : prev - 1));
      },
    });
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    createNote.mutate(
      { reference: lecture.reference, contenu: noteText.trim() },
      {
        onSuccess: () => {
          addToast('Note enregistree', 'success');
          setNoteText('');
          setNoteOpen(false);
        },
        onError: () => addToast('Erreur lors de l\'enregistrement', 'error'),
      },
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-forest-900/6 overflow-hidden shadow-sm">
      {/* Gradient Header */}
      <div className="gradient-forest p-6 pb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white/5 translate-y-8 -translate-x-8" />

        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold mb-4">
          {'\u{1F4D6}'} Lecture du jour
        </span>
        <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-1">
          {lecture.reference}
        </p>
        <h2 className="text-2xl font-bold text-white mb-4">
          {lecture.titre}
        </h2>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Bible Quote */}
        <blockquote className="bible-quote rounded-xl p-5 mb-5">
          <p
            className="text-base md:text-lg italic text-ink-900 leading-relaxed"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {lecture.texte}
          </p>
          <p className="text-sm font-semibold text-gold-600 mt-3">
            &mdash; {lecture.reference}
          </p>
        </blockquote>

        {/* Chapitre complet (expandable) */}
        {showFull && (
          <div className="mb-5 rounded-xl bg-cream-50 p-5 border border-forest-900/6">
            {loadingChapter ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-forest-700" />
              </div>
            ) : chapter && chapter.versets.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-forest-700 uppercase tracking-wider mb-3">
                  {chapter.livre} {chapter.chapitre}
                </p>
                {chapter.versets.map((v) => (
                  <p key={v.numero} className="text-sm leading-relaxed text-ink-700">
                    <span className="text-xs font-bold text-gold-600 mr-2">{v.numero}</span>
                    {v.texte}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-ink-500 text-center py-4">
                Le texte complet sera disponible après l&apos;import de la Bible.
                Lancez <code className="bg-sage-200 px-1 rounded">npm run import:bible</code> dans le dossier api/.
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setShowFull(!showFull)}
            className="flex-1 py-3 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            {showFull ? 'Reduire' : 'Lire le chapitre complet'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className={cn(
                'flex-1 sm:flex-none py-3 px-4 border text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2',
                liked
                  ? 'bg-red-50 border-red-200 text-red-500'
                  : 'bg-cream-100 border-forest-900/10 text-ink-400 hover:bg-sage-200 hover:text-forest-900'
              )}
            >
              <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
              <span>{likeCount}</span>
            </button>
            <button
              onClick={() => setNoteOpen(!noteOpen)}
              className={cn(
                'flex-1 sm:flex-none py-3 px-4 border text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2',
                noteOpen
                  ? 'bg-gold-600/10 border-gold-600/30 text-gold-600'
                  : 'bg-cream-100 border-forest-900/10 text-ink-400 hover:bg-sage-200 hover:text-forest-900'
              )}
            >
              <PenLine className="w-4 h-4" />
              Note
            </button>
          </div>
        </div>

        {/* Note input */}
        {noteOpen && (
          <div className="mt-4 space-y-2">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 resize-none"
              placeholder={`Note sur ${lecture.reference}...`}
            />
            <button
              disabled={createNote.isPending || !noteText.trim()}
              onClick={handleSaveNote}
              className="px-5 py-2 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors disabled:opacity-60"
            >
              {createNote.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
