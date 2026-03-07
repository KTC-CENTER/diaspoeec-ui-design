'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, MapPin, Church } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useTenantStore } from '@/stores/tenant.store';
import { useAuthStore } from '@/stores/auth.store';

// ============================================================================
// Confetti Particle Component
// ============================================================================

const CONFETTI_COLORS = [
  'bg-gold-400',
  'bg-gold-600',
  'bg-forest-500',
  'bg-forest-700',
  'bg-sage-400',
  'bg-terra-500',
  'bg-gold-300',
  'bg-forest-400',
];

function ConfettiParticle({
  index,
  color,
}: {
  index: number;
  color: string;
}) {
  const size = Math.random() > 0.5 ? 'h-2 w-2' : 'h-3 w-3';
  const shape = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';
  const left = `${5 + (index * 17) % 90}%`;
  const delay = `${index * 0.15}s`;
  const duration = `${2 + Math.random() * 2}s`;

  return (
    <div
      className={cn('absolute opacity-0', size, shape, color)}
      style={{
        left,
        top: '-10px',
        animation: `confetti-fall ${duration} ${delay} ease-out forwards`,
      }}
    />
  );
}

// ============================================================================
// Welcome Page
// ============================================================================

export default function OnboardingWelcomePage() {
  const router = useRouter();
  const t = useTranslations('onboarding');
  const paroisse = useTenantStore((s) => s.paroisse);
  const user = useAuthStore((s) => s.user);

  const firstName = user?.nomComplet?.split(' ')[0] ?? '';

  return (
    <>
      {/* Confetti animation styles */}
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(400px) rotate(720deg);
          }
        }
      `}</style>

      <div className="relative space-y-8 text-center">
        {/* Confetti particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {CONFETTI_COLORS.map((color, i) => (
            <ConfettiParticle key={i} index={i} color={color} />
          ))}
          {CONFETTI_COLORS.map((color, i) => (
            <ConfettiParticle
              key={i + CONFETTI_COLORS.length}
              index={i + CONFETTI_COLORS.length}
              color={color}
            />
          ))}
        </div>

        {/* Checkmark */}
        <div className="flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              backgroundColor: paroisse
                ? `${paroisse.couleurPrimaire}15`
                : 'rgba(27, 67, 50, 0.1)',
            }}
          >
            <CheckCircle2
              className="h-10 w-10"
              style={{ color: paroisse?.couleurPrimaire ?? '#1B4332' }}
            />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-bold text-ink-900">
            {firstName
              ? `${firstName}, bienvenue !`
              : t('welcome')}
          </h2>
          <p className="text-ink-500">
            {paroisse?.messageAccueil ?? t('accountReady')}
          </p>
        </div>

        {/* Parish info */}
        {paroisse && (
          <div className="mx-auto max-w-xs space-y-3">
            <div
              className="rounded-2xl border p-4"
              style={{
                borderColor: `${paroisse.couleurPrimaire}30`,
                backgroundColor: `${paroisse.couleurPrimaire}08`,
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <Church
                  className="h-5 w-5"
                  style={{ color: paroisse.couleurPrimaire }}
                />
                <span className="text-sm font-semibold text-ink-900">
                  {paroisse.label}
                </span>
              </div>
              {(paroisse.ville || paroisse.synode) && (
                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-ink-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {[paroisse.ville, paroisse.synode].filter(Boolean).join(' — ')}
                  </span>
                </div>
              )}
              {paroisse.pasteurNom && (
                <p className="mt-2 text-xs text-ink-400">
                  {paroisse.pasteurNom}
                </p>
              )}
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => router.push('/accueil')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all',
            'shadow-lg active:scale-[0.98]'
          )}
          style={{
            backgroundColor: paroisse?.couleurSecondaire ?? '#D4A017',
          }}
        >
          {t('exploreDiaspoEEC')}
        </button>
      </div>
    </>
  );
}
