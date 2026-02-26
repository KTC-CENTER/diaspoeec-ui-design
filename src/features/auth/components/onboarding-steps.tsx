'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface OnboardingStepsProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { number: 1, label: 'Identit\u00e9' },
  { number: 2, label: 'Diaspora' },
  { number: 3, label: '\u00c9glise' },
] as const;

export function OnboardingSteps({ currentStep }: OnboardingStepsProps) {
  return (
    <div className="flex items-center justify-center">
      {STEPS.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isCurrent = step.number === currentStep;
        const isPending = step.number > currentStep;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all',
                  isCompleted &&
                    'bg-forest-700 text-white',
                  isCurrent &&
                    'bg-gold-600 text-white shadow-md shadow-gold-600/30',
                  isPending &&
                    'bg-ink-100 text-ink-400'
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs font-medium',
                  isCompleted && 'text-forest-700',
                  isCurrent && 'text-gold-700',
                  isPending && 'text-ink-400'
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-3 mb-6 h-0.5 w-16 rounded-full transition-colors sm:w-24',
                  step.number < currentStep
                    ? 'bg-forest-500'
                    : 'bg-ink-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
