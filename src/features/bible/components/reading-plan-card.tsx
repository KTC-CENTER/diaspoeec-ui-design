'use client';

import { useToastStore } from '@/stores/toast.store';
import type { PlanLecture } from '@/types';

interface ReadingPlanCardProps {
  plan: PlanLecture;
}

export function ReadingPlanCard({ plan }: ReadingPlanCardProps) {
  const { addToast } = useToastStore();
  const percentage = Math.round(
    (plan.joursCompletes / plan.dureeJours) * 100
  );
  const streak = plan.joursCompletes > 0 ? Math.min(plan.joursCompletes, 7) : 0;

  return (
    <div className="bg-white rounded-2xl border border-forest-900/6 p-5 shadow-sm card-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-ink-900 mb-0.5">
            {plan.titre}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-400">
              Jour {plan.joursCompletes}/{plan.dureeJours}
            </span>
            {streak > 2 && (
              <span className="streak-badge inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm">
                {'\u{1F525}'} {streak} jours consecutifs
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full h-3 bg-sage-200 rounded-full overflow-hidden">
          <div
            className="progress-fill h-full rounded-full gradient-green"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-xs text-ink-400 mt-1.5 text-right">
          {percentage}%
        </p>
      </div>

      {/* Action */}
      <button
        onClick={() => addToast(`Reprise du plan "${plan.titre}" - Jour ${plan.joursCompletes + 1}`, 'success')}
        className="w-full py-2.5 bg-forest-900 text-white text-sm font-semibold rounded-xl hover:bg-forest-700 transition-colors shadow-sm"
      >
        Continuer
      </button>
    </div>
  );
}
