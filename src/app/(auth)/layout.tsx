'use client';

import Link from 'next/link';

const decoPatternSvg = `url("data:image/svg+xml,%3Csvg width='120' height='120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M60 0L120 60L60 120L0 60Z' fill='none' stroke='%23F4D35E' stroke-width='1.5'/%3E%3Ccircle cx='60' cy='60' r='20' fill='none' stroke='%23FEFAE0' stroke-width='1'/%3E%3Ccircle cx='60' cy='60' r='35' fill='none' stroke='%23F4D35E' stroke-width='.6'/%3E%3Cpath d='M60 25v70M25 60h70' stroke='%23FEFAE0' stroke-width='.5'/%3E%3Cpath d='M35 35l50 50M85 35L35 85' stroke='%23F4D35E' stroke-width='.4'/%3E%3C/svg%3E")`;

const africanPatternSvg = `url("data:image/svg+xml,%3Csvg width='80' height='80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0zM40 40h40v40H40z' fill='none' stroke='%231B4332' stroke-width='.8'/%3E%3Cpath d='M20 0v40M60 40v40M0 20h40M40 60h40' stroke='%231B4332' stroke-width='.5'/%3E%3Ccircle cx='20' cy='20' r='6' fill='none' stroke='%23D4A017' stroke-width='.6'/%3E%3Ccircle cx='60' cy='60' r='6' fill='none' stroke='%23D4A017' stroke-width='.6'/%3E%3Cpath d='M10 10l20 20M50 50l20 20' stroke='%231B4332' stroke-width='.3'/%3E%3Cpath d='M30 10L10 30M70 50L50 70' stroke='%231B4332' stroke-width='.3'/%3E%3C/svg%3E")`;

const CrossLeafLogo = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <circle cx="24" cy="24" r="23" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    <path d="M24 10v28M16 24h16" stroke="#F4D35E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M30 14c4 3 5 8 3 12" stroke="#95D5B2" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M33 16c-1-1-3 0-3 2s2 3 3 2 1-3-1-4z" fill="#95D5B2" opacity="0.7" />
    <circle cx="24" cy="24" r="4" fill="none" stroke="#F4D35E" strokeWidth="1" opacity="0.5" />
  </svg>
);

const MobileLogo = () => (
  <svg width="56" height="56" viewBox="0 0 56 56">
    <circle cx="28" cy="28" r="27" fill="#1B4332" />
    <path d="M28 12v32M18 28h20" stroke="#F4D35E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M34 16c5 4 6 10 3 15" stroke="#95D5B2" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M37 18c-1-1-3.5 0-3.5 2.5s2.5 3.5 3.5 2.5 1.2-3.5-1-5z" fill="#95D5B2" opacity="0.8" />
    <circle cx="28" cy="28" r="5" fill="none" stroke="#F4D35E" strokeWidth="1" opacity="0.4" />
  </svg>
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left decorative panel (desktop only) ── */}
      <div
        className="relative hidden md:flex md:w-[42%] flex-col justify-between p-8 text-white overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #1B4332 0%, #2D6A4F 60%, #095028 100%)',
        }}
      >
        {/* Diamond SVG pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.12,
            backgroundImage: decoPatternSvg,
            backgroundSize: '120px 120px',
          }}
        />

        {/* Gold radial glow bottom-right */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,211,94,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Top content */}
        <div className="relative z-10">
          <div className="mb-6">
            <CrossLeafLogo />
          </div>
          <p
            className="text-[1.6rem] leading-[1.4] italic max-w-[280px]"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            &ldquo;Ensemble, grandissons dans la foi, au-delà des frontières.&rdquo;
          </p>
        </div>

        {/* Bottom info */}
        <div className="relative z-10 text-sm opacity-60 mt-auto pt-8">
          <p>Communauté EEC de la Diaspora</p>
          <p className="mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
            <span>2,847 membres actifs</span>
          </p>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#095028]/60 to-transparent pointer-events-none" />
      </div>

      {/* ── Right side (form area) ── */}
      <div
        className="relative flex flex-1 flex-col items-center justify-center px-6 py-12"
        style={{
          backgroundColor: '#FFFBF0',
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(27,67,50,0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(212,160,23,0.04) 0%, transparent 40%),
            radial-gradient(circle at 60% 80%, rgba(193,120,23,0.03) 0%, transparent 45%)
          `,
        }}
      >
        {/* African geometric SVG pattern */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            opacity: 0.035,
            backgroundImage: africanPatternSvg,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Mobile logo */}
        <div className="relative z-10 flex flex-col items-center mb-8 md:hidden">
          <div className="mb-4">
            <MobileLogo />
          </div>
          <Link href="/" className="flex items-center gap-2">
            <h1 className="font-[var(--font-heading)] text-2xl md:text-3xl font-bold text-forest-900">
              Diaspo<span className="text-gold-600">EEC</span>
            </h1>
          </Link>
          <p className="text-ink-600 text-sm mt-1.5">Connexion à votre espace communautaire</p>
        </div>

        {/* Auth card */}
        <div
          className="relative z-10 w-full max-w-[440px] p-8 md:p-10 rounded-2xl"
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(216,243,220,0.5)',
            boxShadow: '0 4px 24px rgba(27,67,50,0.06), 0 1px 4px rgba(0,0,0,0.04)',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
