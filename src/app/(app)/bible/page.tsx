'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, Plus } from 'lucide-react';
import {
  useLectureJour,
  usePlansLecture,
  usePlansDecouverte,
  useNotesBible,
  useStartPlan,
} from '@/features/bible/hooks/use-bible';
import { DailyReading } from '@/features/bible/components/daily-reading';
import { ReadingPlanCard } from '@/features/bible/components/reading-plan-card';
import { BibleNotes } from '@/features/bible/components/bible-notes';
import { useToastStore } from '@/stores/toast.store';

function SectionSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-forest-900/6 p-5 shadow-sm">
          <div className="mb-3 h-4 w-2/3 rounded shimmer-bg" />
          <div className="mb-2 h-3 w-full rounded-full shimmer-bg" />
          <div className="mb-4 h-3 w-1/3 rounded shimmer-bg" />
          <div className="h-10 w-full rounded-xl shimmer-bg" />
        </div>
      ))}
    </div>
  );
}

export default function BiblePage() {
  const { data: lectureJour, isLoading: loadingLecture } = useLectureJour();
  const { data: plans, isLoading: loadingPlans } = usePlansLecture();
  const { data: plansDecouverte, isLoading: loadingDecouverte } = usePlansDecouverte();
  const { data: notes, isLoading: loadingNotes } = useNotesBible();
  const { addToast } = useToastStore();
  const startPlanMutation = useStartPlan();
  const [showAllPlans, setShowAllPlans] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 md:px-8 md:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900 mb-1">
          Guide Biblique
        </h1>
        <p className="text-ink-400">
          Nourrissez votre foi chaque jour
        </p>
      </div>

      {/* Daily Reading */}
      <section className="mb-8">
        {loadingLecture ? (
          <div className="rounded-2xl bg-white border border-forest-900/6 shadow-sm">
            <div className="h-28 rounded-t-2xl shimmer-bg" />
            <div className="space-y-3 p-6">
              <div className="h-3 w-24 rounded shimmer-bg" />
              <div className="h-6 w-48 rounded shimmer-bg" />
              <div className="h-32 rounded-xl shimmer-bg" />
              <div className="flex gap-3">
                <div className="h-10 w-48 rounded-xl shimmer-bg" />
                <div className="h-10 w-24 rounded-xl shimmer-bg" />
              </div>
            </div>
          </div>
        ) : (
          lectureJour && <DailyReading lecture={lectureJour} />
        )}
      </section>

      {/* Afro Divider */}
      <div className="afro-divider mb-8" />

      {/* My Plans */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-ink-900 mb-5">
          Mes plans en cours
        </h2>

        {loadingPlans ? (
          <SectionSkeleton count={2} />
        ) : plans && plans.length > 0 ? (
          <div className="space-y-4">
            {plans.map((plan) => (
              <ReadingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-forest-900/6 p-8 text-center shadow-sm">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-400">
              Vous n&apos;avez pas de plan en cours. Decouvrez nos plans de lecture ci-dessous.
            </p>
          </div>
        )}
      </section>

      {/* Afro Divider */}
      <div className="afro-divider-sm mb-8" />

      {/* Discover Plans */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-900">
            Decouvrir des plans
          </h2>
          <button
            onClick={() => setShowAllPlans(!showAllPlans)}
            className="text-sm text-forest-900 font-medium hover:text-forest-700 transition-colors flex items-center gap-1"
          >
            {showAllPlans ? 'Reduire' : 'Voir tout'} <ChevronRight className={`w-4 h-4 transition-transform ${showAllPlans ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {loadingDecouverte ? (
          <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-[200px] shrink-0 rounded-2xl bg-white border border-forest-900/6 shadow-sm overflow-hidden"
              >
                <div className="h-24 shimmer-bg" />
                <div className="p-4 space-y-2">
                  <div className="h-4 w-full rounded shimmer-bg" />
                  <div className="h-3 w-2/3 rounded shimmer-bg" />
                  <div className="h-8 w-full rounded-lg shimmer-bg" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          (() => {
            // Set of plan IDs the user has already started (joursCompletes may be 0)
            const startedIds = new Set(plans?.map((p) => p.id) ?? []);
            const gradients = ['gradient-gold', 'gradient-terra', 'gradient-forest', 'gradient-sunset'];
            return (
              <div className={`flex gap-4 pb-2 hide-scrollbar ${showAllPlans ? 'flex-wrap' : 'overflow-x-auto'}`}>
                {plansDecouverte?.map((plan, index) => {
                  const isStarted = startedIds.has(plan.id);
                  const gradientClass = gradients[index % gradients.length];
                  return (
                    <div
                      key={plan.id}
                      className="flex-shrink-0 w-[200px] bg-white rounded-2xl border border-forest-900/6 overflow-hidden card-hover shadow-sm"
                    >
                      <div className={`${gradientClass} h-24 flex items-center justify-center`}>
                        <span className="text-4xl">{plan.icone ?? '📖'}</span>
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-bold text-ink-900 mb-1">
                          {plan.titre}
                        </h3>
                        <p className="text-xs text-ink-400 mb-3">
                          {plan.dureeJours} jours
                        </p>
                        <button
                          disabled={startPlanMutation.isPending || isStarted}
                          onClick={() => {
                            startPlanMutation.mutate(plan.id, {
                              onSuccess: () => addToast(`Plan "${plan.titre}" demarre ! Bonne lecture.`, 'success'),
                              onError: () => addToast('Erreur lors du demarrage', 'error'),
                            });
                          }}
                          className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors ${
                            isStarted
                              ? 'bg-forest-900 text-white cursor-default'
                              : 'bg-cream-100 border border-forest-900/10 text-forest-900 hover:bg-sage-200'
                          } disabled:opacity-60`}
                        >
                          {isStarted ? 'En cours ✓' : 'Commencer'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()
        )}
      </section>

      {/* Afro Divider */}
      <div className="afro-divider mb-8" />

      {/* Notes */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-ink-900">
            Mes notes
          </h2>
          <button
            onClick={() => addToast('Selectionnez un verset puis cliquez "Note" pour annoter', 'info')}
            className="text-sm text-forest-900 font-medium hover:text-forest-700 transition-colors flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Nouvelle note
          </button>
        </div>

        {loadingNotes ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-forest-900/6 p-5 shadow-sm"
              >
                <div className="mb-2 flex justify-between">
                  <div className="h-4 w-24 rounded shimmer-bg" />
                  <div className="h-3 w-20 rounded shimmer-bg" />
                </div>
                <div className="h-3 w-full rounded shimmer-bg" />
              </div>
            ))}
          </div>
        ) : (
          <BibleNotes notes={notes || []} />
        )}
      </section>
    </div>
  );
}
