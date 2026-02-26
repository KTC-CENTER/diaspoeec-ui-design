'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2, Users, Globe, Church } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

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

  const stats = [
    { icon: Users, value: '1 250+', label: 'membres' },
    { icon: Globe, value: '45+', label: 'pays' },
    { icon: Church, value: '120+', label: 'paroisses' },
  ];

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
            className={cn(
              'flex h-20 w-20 items-center justify-center rounded-full',
              'bg-forest-500/10'
            )}
            style={{ animation: 'var(--animate-confetti)' }}
          >
            <CheckCircle2 className="h-10 w-10 text-forest-700" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="font-heading text-2xl font-bold text-ink-900">
            Bienvenue dans la famille DiaspoEEC !
          </h2>
          <p className="text-ink-500">Votre compte est pr&ecirc;t.</p>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon className="h-5 w-5 text-forest-600" />
              <span className="text-lg font-bold text-ink-900">
                {stat.value}
              </span>
              <span className="text-xs text-ink-400">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push('/accueil')}
          className={cn(
            'inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all',
            'bg-gold-600 shadow-lg shadow-gold-600/25 hover:bg-gold-700 active:scale-[0.98]'
          )}
        >
          Explorer DiaspoEEC
        </button>
      </div>
    </>
  );
}
