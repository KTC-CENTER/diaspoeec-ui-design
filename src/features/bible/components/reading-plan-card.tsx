'use client';

import { useState } from 'react';
import { X, BookOpen, CheckCircle, Loader2, Clock } from 'lucide-react';
import { useToastStore } from '@/stores/toast.store';
import { useCompleteLectureJour, useLectureCourante } from '@/features/bible/hooks/use-bible';
import type { PlanLecture } from '@/types';

interface ReadingPlanCardProps {
  plan: PlanLecture;
}

function formatProchaineLecture(isoStr: string | null): string {
  if (!isoStr) return 'demain';
  const d = new Date(isoStr);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ── Reading Modal ─────────────────────────────────────────────────────────────

function ReadingModal({ planId, onClose, onComplete }: {
  planId: string;
  onClose: () => void;
  onComplete: () => void;
}) {
  const { data, isLoading } = useLectureCourante(planId, true);
  const [hasScrolled, setHasScrolled] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (!hasScrolled && el.scrollTop + el.clientHeight >= el.scrollHeight * 0.6) {
      setHasScrolled(true);
    }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex w-full max-w-lg flex-col rounded-t-3xl sm:rounded-2xl bg-white shadow-2xl max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-forest-900" />
            <span className="font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Lecture du jour
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-50 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-forest-900" />
            <p className="mt-3 text-sm text-ink-400">Chargement de la lecture...</p>
          </div>
        ) : data?.termine ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-ink-900 mb-2">Plan termine !</h3>
            <p className="text-sm text-center text-ink-500">
              Felicitations ! Vous avez complete ce plan de lecture.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-forest-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-800"
            >
              Fermer
            </button>
          </div>
        ) : data?.disponible === false ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-ink-900 mb-2">A demain !</h3>
            <p className="text-sm text-center text-ink-500 leading-relaxed">
              Vous avez deja lu votre passage du jour.{' '}
              <br />
              Le jour {data.jourNumero} sera disponible{' '}
              <span className="font-semibold text-ink-700">
                {formatProchaineLecture(data.prochaineLecture)}
              </span>.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-xl bg-forest-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-800"
            >
              Fermer
            </button>
          </div>
        ) : !data?.lecture ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <BookOpen className="h-10 w-10 text-ink-200 mb-4" />
            <h3 className="text-base font-semibold text-ink-700 mb-2">Lecture non configuree</h3>
            <p className="text-sm text-center text-ink-500">
              Le contenu pour le jour {data?.jourNumero} n&apos;a pas encore ete ajoute par le pasteur.
            </p>
            <button
              onClick={onComplete}
              className="mt-6 rounded-xl bg-forest-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-forest-800"
            >
              Valider quand meme
            </button>
          </div>
        ) : (
          <>
            {/* Day badge */}
            <div className="shrink-0 px-5 pt-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-forest-900/10 px-3 py-1">
                <span className="text-xs font-semibold text-forest-900">
                  Jour {data.lecture.jourNumero}
                </span>
                <span className="h-1 w-1 rounded-full bg-forest-900/30" />
                <span className="text-xs font-medium text-forest-700">{data.lecture.reference}</span>
              </div>
            </div>

            {/* Title */}
            <div className="shrink-0 px-5 pt-3">
              <h2
                className="text-xl font-bold text-ink-900 leading-snug"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {data.lecture.titre}
              </h2>
            </div>

            {/* Text — scrollable */}
            <div
              className="flex-1 overflow-y-auto px-5 py-4"
              onScroll={handleScroll}
            >
              {data.lecture.texte ? (
                <p className="text-sm leading-7 text-ink-700 whitespace-pre-wrap">
                  {data.lecture.texte}
                </p>
              ) : (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                  <p className="text-sm text-amber-700">
                    Le texte de ce passage n&apos;a pas ete renseigne. Retrouvez{' '}
                    <strong>{data.lecture.reference}</strong> dans votre Bible.
                  </p>
                </div>
              )}

              {!hasScrolled && data.lecture.texte && data.lecture.texte.length > 400 && (
                <div className="mt-3 text-center text-xs text-ink-400 animate-pulse">
                  ↓ Faites defiler pour lire
                </div>
              )}
            </div>

            {/* Action */}
            <div className="shrink-0 border-t border-gray-100 px-5 py-4">
              <button
                onClick={onComplete}
                className="w-full rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg active:scale-[0.98]"
              >
                ✓ J&apos;ai lu ce passage
              </button>
              {!hasScrolled && data.lecture.texte && data.lecture.texte.length > 400 && (
                <p className="mt-2 text-center text-xs text-ink-400">
                  Lisez le passage avant de valider
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Plan Card ─────────────────────────────────────────────────────────────────

export function ReadingPlanCard({ plan }: ReadingPlanCardProps) {
  const { addToast } = useToastStore();
  const completeMutation = useCompleteLectureJour();
  const [showReading, setShowReading] = useState(false);

  const percentage = Math.round((plan.joursCompletes / plan.dureeJours) * 100);
  const streak = Math.min(plan.joursCompletes, 7);
  const isTermine = plan.joursCompletes >= plan.dureeJours;
  const isLocked = !plan.lectureDisponible && !isTermine;

  const handleComplete = () => {
    completeMutation.mutate(plan.id, {
      onSuccess: (updated) => {
        setShowReading(false);
        if (updated.joursCompletes >= updated.dureeJours) {
          addToast(`Bravo ! Plan "${plan.titre}" termine !`, 'success');
        } else {
          addToast(`Jour ${updated.joursCompletes} complete !`, 'success');
        }
      },
      onError: () => addToast('Erreur lors de la mise a jour', 'error'),
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-forest-900/6 p-5 shadow-sm card-hover">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <span className="text-2xl mt-0.5">{plan.icone ?? '📖'}</span>
            <div>
              <h3 className="text-base font-bold text-ink-900 mb-0.5">{plan.titre}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-400">
                  Jour {plan.joursCompletes} / {plan.dureeJours}
                </span>
                {streak > 2 && (
                  <span className="streak-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm">
                    {'\u{1F525}'} {streak} jours
                  </span>
                )}
              </div>
            </div>
          </div>
          {isTermine && (
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full h-2.5 bg-sage-200 rounded-full overflow-hidden">
            <div
              className="progress-fill h-full rounded-full gradient-green transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-ink-400 mt-1 text-right">{percentage}%</p>
        </div>

        {/* Action */}
        <button
          disabled={completeMutation.isPending || isTermine || isLocked}
          onClick={() => setShowReading(true)}
          className="w-full py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {completeMutation.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Validation...</>
          ) : isTermine ? (
            'Termine !'
          ) : isLocked ? (
            <><Clock className="h-4 w-4" /> Revenir demain</>
          ) : (
            <><BookOpen className="h-4 w-4" /> Lire le jour {plan.joursCompletes + 1}</>
          )}
        </button>
      </div>

      {showReading && (
        <ReadingModal
          planId={plan.id}
          onClose={() => setShowReading(false)}
          onComplete={handleComplete}
        />
      )}
    </>
  );
}
