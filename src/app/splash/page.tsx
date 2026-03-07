'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTenantStore } from '@/stores/tenant.store';

export default function SplashPage() {
  const router = useRouter();
  const paroisse = useTenantStore((s) => s.paroisse);
  const [phase, setPhase] = useState<'logo' | 'name' | 'welcome' | 'done'>('logo');

  useEffect(() => {
    if (!paroisse) {
      router.replace('/paroisse-setup');
      return;
    }

    const t1 = setTimeout(() => setPhase('name'), 800);
    const t2 = setTimeout(() => setPhase('welcome'), 1800);
    const t3 = setTimeout(() => setPhase('done'), 3000);
    const t4 = setTimeout(() => router.replace('/login'), 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [paroisse, router]);

  if (!paroisse) return null;

  const primary = paroisse.couleurPrimaire;
  const secondary = paroisse.couleurSecondaire;
  const accent = paroisse.couleurAccent;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000"
      style={{ backgroundColor: primary }}
    >
      {/* Animated background circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[2000ms] ease-out"
          style={{
            backgroundColor: secondary + '08',
            width: phase === 'logo' ? '0px' : '800px',
            height: phase === 'logo' ? '0px' : '800px',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-[2500ms] ease-out delay-300"
          style={{
            backgroundColor: accent + '06',
            width: phase === 'logo' ? '0px' : '1200px',
            height: phase === 'logo' ? '0px' : '1200px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8">
        {/* Church icon / logo */}
        <div
          className={`transition-all duration-700 ease-out ${
            phase === 'logo' ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        >
          {paroisse.logoUrl ? (
            <img
              src={paroisse.logoUrl}
              alt={paroisse.label}
              className="w-24 h-24 rounded-full object-cover border-4 shadow-2xl"
              style={{ borderColor: secondary }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-2xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                borderColor: secondary,
              }}
            >
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
              </svg>
            </div>
          )}
        </div>

        {/* Parish name */}
        <h1
          className={`mt-8 text-3xl md:text-4xl font-display font-bold text-white transition-all duration-700 ease-out ${
            ['name', 'welcome', 'done'].includes(phase) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {paroisse.label}
        </h1>

        {/* City & Synode */}
        <p
          className={`mt-3 text-lg transition-all duration-700 ease-out delay-200 ${
            ['name', 'welcome', 'done'].includes(phase) ? 'translate-y-0 opacity-70' : 'translate-y-8 opacity-0'
          }`}
          style={{ color: secondary }}
        >
          {paroisse.ville}{paroisse.synode ? ` - ${paroisse.synode}` : ''}
        </p>

        {/* Welcome message */}
        {paroisse.messageAccueil && (
          <p
            className={`mt-8 text-base max-w-sm text-white/80 italic transition-all duration-700 ease-out ${
              ['welcome', 'done'].includes(phase) ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            &ldquo;{paroisse.messageAccueil}&rdquo;
          </p>
        )}

        {/* Pastor name */}
        {paroisse.pasteurNom && (
          <p
            className={`mt-3 text-sm transition-all duration-700 ease-out delay-100 ${
              ['welcome', 'done'].includes(phase) ? 'translate-y-0 opacity-60' : 'translate-y-8 opacity-0'
            }`}
            style={{ color: secondary }}
          >
            {paroisse.pasteurNom}
          </p>
        )}

        {/* Loading dots */}
        <div className="mt-12 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-pulse"
              style={{
                backgroundColor: secondary,
                animationDelay: `${i * 300}ms`,
                opacity: phase === 'done' ? 0 : 0.6,
                transition: 'opacity 500ms',
              }}
            />
          ))}
        </div>
      </div>

      {/* Fade out overlay */}
      <div
        className={`absolute inset-0 bg-white transition-opacity duration-500 pointer-events-none ${
          phase === 'done' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
