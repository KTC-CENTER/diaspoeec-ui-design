'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import {
  Users, Heart, Menu, X, LogIn, ChevronDown, BookOpen,
  Globe, Church, HandHeart, Video, BookHeart, CalendarHeart,
  ScrollText, Radio, UsersRound, Building2, ShieldCheck,
  Sparkles, MapPin, Star, Smartphone, Quote,
  Facebook, Youtube, Instagram, Twitter, Mail, Phone,
} from 'lucide-react';
import { CustomSelect } from '@/components/forms/custom-select';

/* ─────────────────────── HELPERS ─────────────────────── */

const LeafCrossLogo = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C12 2 4 7 4 13C4 17.4183 7.58172 21 12 21C16.4183 21 20 17.4183 20 13C20 7 12 2 12 2Z" fill="#95D5B2" opacity="0.6" />
    <path d="M12 6V18M8 12H16" stroke="#FFFBF0" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const GoldUnderlineSvg = () => (
  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
    <path d="M2 8C50 2 100 4 150 6C200 8 250 4 298 7" stroke="#D4A017" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
  </svg>
);

const PatternDivider = () => (
  <div className="max-w-xs mx-auto mb-16 rounded-full" style={{
    height: 4,
    background: 'repeating-linear-gradient(90deg, #D4A017 0px, #D4A017 8px, transparent 8px, transparent 16px, #1B4332 16px, #1B4332 24px, transparent 24px, transparent 32px)',
    opacity: 0.4,
  }} />
);

const heroPatternStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  opacity: 0.5,
  backgroundImage: `
    linear-gradient(45deg, transparent 48%, rgba(212,160,23,0.07) 48%, rgba(212,160,23,0.07) 52%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(212,160,23,0.07) 48%, rgba(212,160,23,0.07) 52%, transparent 52%),
    linear-gradient(45deg, transparent 48%, rgba(27,67,50,0.05) 48%, rgba(27,67,50,0.05) 52%, transparent 52%),
    linear-gradient(-45deg, transparent 48%, rgba(27,67,50,0.05) 48%, rgba(27,67,50,0.05) 52%, transparent 52%),
    radial-gradient(circle 2px at center, rgba(212,160,23,0.1) 0%, transparent 100%)
  `,
  backgroundSize: '80px 80px, 80px 80px, 40px 40px, 40px 40px, 40px 40px',
  backgroundPosition: '0 0, 0 0, 20px 20px, 20px 20px, 0 0',
  pointerEvents: 'none',
};

const ndopPatternStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  opacity: 0.5,
  backgroundImage: `
    linear-gradient(45deg, transparent 45%, rgba(27,67,50,0.06) 45%, rgba(27,67,50,0.06) 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, rgba(27,67,50,0.06) 45%, rgba(27,67,50,0.06) 55%, transparent 55%),
    linear-gradient(45deg, transparent 45%, rgba(212,160,23,0.04) 45%, rgba(212,160,23,0.04) 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, rgba(212,160,23,0.04) 45%, rgba(212,160,23,0.04) 55%, transparent 55%)
  `,
  backgroundSize: '60px 60px, 60px 60px, 30px 30px, 30px 30px',
  backgroundPosition: '0 0, 0 0, 15px 15px, 15px 15px',
  pointerEvents: 'none',
};

const kentePatternStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(212,160,23,0.08) 18px, rgba(212,160,23,0.08) 20px),
    repeating-linear-gradient(90deg, transparent, transparent 38px, rgba(27,67,50,0.05) 38px, rgba(27,67,50,0.05) 40px)
  `,
};

const waveStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: -1,
  left: 0,
  right: 0,
  height: 60,
  background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 60'%3E%3Cpath fill='%23FEFAE0' d='M0,30 C360,60 720,0 1080,30 C1260,45 1380,40 1440,30 L1440,60 L0,60 Z'/%3E%3C/svg%3E") no-repeat center bottom`,
  backgroundSize: 'cover',
};

/* ─────────────────────── REVEAL WRAPPER ─────────────────────── */

function Reveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });

  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0 } },
    scale: { hidden: { opacity: 0, scale: 0.88 }, visible: { opacity: 1, scale: 1 } },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────── FEATURES DATA ─────────────────────── */

const features = [
  {
    icon: BookHeart,
    title: 'Méditations quotidiennes',
    desc: "Commencez chaque journée avec une méditation inspirée de la Parole. Lectures bibliques, prières guidées et réflexions spirituelles.",
    bgClass: 'bg-sage-200',
    bgStyle: undefined as React.CSSProperties | undefined,
    iconColor: 'text-forest-900',
  },
  {
    icon: CalendarHeart,
    title: 'Événements & Cultes',
    desc: "Retrouvez tous les événements de votre paroisse et de la communauté mondiale. Inscriptions, rappels et partage en un clic.",
    bgClass: 'bg-gold-200',
    bgStyle: undefined as React.CSSProperties | undefined,
    iconColor: 'text-gold-600',
  },
  {
    icon: HandHeart,
    title: 'Dons en ligne',
    desc: "Soutenez les projets de l'église par des dons sécurisés. Dîme, offrandes et contributions aux campagnes spéciales.",
    bgClass: '',
    bgStyle: { background: 'rgba(193,120,23,0.12)' } as React.CSSProperties,
    iconColor: 'text-terra-600',
  },
  {
    icon: ScrollText,
    title: 'Guide Biblique',
    desc: "Explorez la Bible avec des plans de lecture personnalisés, des commentaires pastoraux et des groupes d'étude.",
    bgClass: 'bg-sage-200',
    bgStyle: undefined as React.CSSProperties | undefined,
    iconColor: 'text-forest-900',
  },
  {
    icon: Radio,
    title: 'Cultes en Direct',
    desc: "Suivez les cultes en direct depuis n'importe où dans le monde. Replays disponibles et notifications avant chaque diffusion.",
    bgClass: 'bg-gold-200',
    bgStyle: undefined as React.CSSProperties | undefined,
    iconColor: 'text-gold-600',
  },
  {
    icon: UsersRound,
    title: 'Communauté',
    desc: "Échangez avec des fidèles du monde entier. Groupes de prière, forums de discussion et entraide entre frères et sœurs.",
    bgClass: '',
    bgStyle: { background: 'rgba(193,120,23,0.12)' } as React.CSSProperties,
    iconColor: 'text-terra-600',
  },
];

const donors = [
  { initials: 'MN', name: 'Marie Ngo Nyemb', location: 'Paris, France', time: 'il y a 2h', amount: '50 €', gradient: 'from-forest-900 to-forest-700' },
  { initials: 'JT', name: 'Jean Tagne', location: 'Montréal, Canada', time: 'il y a 5h', amount: '100 €', gradient: 'from-gold-600 to-gold-400' },
  { initials: 'AF', name: 'Amélie Fotso', location: 'Berlin, Allemagne', time: 'il y a 8h', amount: '25 €', gradient: 'from-terra-600 to-gold-600' },
  { initials: 'PE', name: 'Paul Essomba', location: 'Bruxelles, Belgique', time: 'il y a 12h', amount: '75 €', gradient: 'from-forest-900 to-forest-700' },
];

const testimonials = [
  {
    text: "Depuis que j'utilise DiaspoEEC, je me sens connectée à ma paroisse de Douala comme si j'y étais encore. Les cultes en direct et les méditations quotidiennes nourrissent ma foi chaque jour.",
    name: 'Grace Ekambi',
    city: 'Lyon, France',
    initials: 'GE',
    gradient: 'from-forest-900 to-forest-700',
  },
  {
    text: "La fonctionnalité de dons en ligne a transformé notre façon de contribuer. Je peux soutenir les projets de mon église au Cameroun directement depuis mon téléphone, en toute sécurité.",
    name: 'Samuel Mbarga',
    city: 'Toronto, Canada',
    initials: 'SM',
    gradient: 'from-gold-600 to-gold-400',
  },
  {
    text: "Les groupes de prière en ligne ont été une bénédiction extraordinaire. Malgré la distance, je prie chaque semaine avec mes frères et sœurs du Cameroun, d'Europe et d'Amérique.",
    name: 'Ruth Nkondock',
    city: 'Zurich, Suisse',
    initials: 'RN',
    gradient: 'from-terra-600 to-gold-600',
  },
];

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [donationType, setDonationType] = useState<'ponctuel' | 'mensuel'>('ponctuel');
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [currency, setCurrency] = useState('EUR');
  const [customAmount, setCustomAmount] = useState('');
  const progressRef = useRef<HTMLDivElement>(null);
  const progressInView = useInView(progressRef, { once: true, margin: '0px' });

  const amounts = [10, 25, 50, 100];
  const rates: Record<string, number> = { EUR: 1, USD: 1.1, XAF: 656 };
  const symbols: Record<string, string> = { EUR: '€', USD: '$', XAF: 'FCFA' };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '#accueil', label: 'Accueil' },
    { href: '#apropos', label: 'À propos' },
    { href: '#fonctionnalites', label: 'Fonctionnalités' },
    { href: '#dons', label: 'Dons' },
    { href: '#contact', label: 'Contact' },
  ];

  const getConvertedAmount = (base: number) => Math.round(base * rates[currency]);
  const displayAmount = customAmount ? parseInt(customAmount) || 0 : getConvertedAmount(selectedAmount);
  const displaySymbol = symbols[currency];

  return (
    <div className="overflow-x-hidden">

      {/* ═══════════ NAVIGATION ═══════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={scrolled ? {
          background: 'rgba(255, 251, 240, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 4px 30px rgba(27, 67, 50, 0.08)',
        } : { background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="#" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-forest-900 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-110" style={{ boxShadow: '0 4px 14px rgba(27,67,50,0.2)' }}>
                <LeafCrossLogo />
              </div>
              <span className="font-[var(--font-heading)] text-2xl font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                Diaspo<span className="text-gold-600">EEC</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className="relative text-ink-600 font-medium hover:text-forest-900 transition-colors group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-600 rounded-full transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            <div className="hidden lg:block">
              <Link href="/login" className="inline-flex items-center gap-2 bg-forest-900 text-white px-6 py-3 rounded-2xl font-semibold text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 4px 14px rgba(27,67,50,0.2)' }}>
                <LogIn className="w-4 h-4" />
                Rejoindre la communauté
              </Link>
            </div>

            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl hover:bg-sage-200 transition-colors" aria-label="Menu">
              <Menu className="w-6 h-6 text-forest-900" />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/30" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setMobileMenuOpen(false)} />
        )}
        <div
          className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-cream-50 shadow-2xl z-50 p-8 transition-transform duration-400 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="flex justify-end mb-10">
            <button onClick={() => setMobileMenuOpen(false)} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-sage-200 transition-colors" aria-label="Fermer">
              <X className="w-6 h-6 text-forest-900" />
            </button>
          </div>
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-lg font-medium text-ink-900 hover:text-forest-900 transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <hr className="border-sage-400/50 my-2" />
            <Link href="/login" className="inline-flex items-center justify-center gap-2 bg-forest-900 text-white px-6 py-3.5 rounded-2xl font-semibold shadow-lg" onClick={() => setMobileMenuOpen(false)}>
              <LogIn className="w-4 h-4" />
              Rejoindre la communauté
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFFBF0 0%, #FEFAE0 50%, #D8F3DC 100%)' }}>
        <div style={heroPatternStyle} />

        <div className="absolute w-96 h-96 rounded-full -top-20 -right-20 pointer-events-none" style={{ background: 'rgba(212,160,23,0.05)', animation: 'pulse 6s ease-in-out infinite' }} />
        <motion.div className="absolute w-64 h-64 rounded-full bottom-20 -left-16 pointer-events-none" style={{ background: 'rgba(27,67,50,0.05)' }} animate={{ y: [0, -12, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute w-40 h-40 rounded-full top-1/3 right-1/4 hidden lg:block pointer-events-none" style={{ background: 'rgba(212,160,23,0.08)' }} animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />

        <div style={waveStyle} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full mb-8 shadow-sm">
              <span className="w-2 h-2 bg-gold-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-ink-600">Église Évangélique du Cameroun — Diaspora</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-[var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-forest-900 leading-tight mb-6">
              Ensemble, où que{' '}
              <span className="relative inline-block">
                <span className="relative z-10">nous soyons</span>
                <GoldUnderlineSvg />
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-lg sm:text-xl text-ink-600 leading-relaxed max-w-2xl mx-auto mb-10">
              Rejoignez la première plateforme qui connecte les fidèles de l&apos;EEC à travers le monde.
              Prières, cultes en direct, dons et entraide — vivez votre foi en communauté, sans frontières.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-forest-900 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300" style={{ boxShadow: '0 8px 30px rgba(27,67,50,0.2)' }}>
                <Users className="w-5 h-5" />
                Rejoindre la communauté
              </Link>
              <a href="#dons" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gold-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300" style={{ boxShadow: '0 8px 30px rgba(212,160,23,0.25)' }}>
                <Heart className="w-5 h-5" />
                Faire un don
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
              <div className="text-center">
                <div className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-forest-900 mb-1">100 000+</div>
                <div className="text-sm text-ink-600 font-medium">Fidèles</div>
              </div>
              <div className="text-center border-x border-sage-400/50">
                <div className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-forest-900 mb-1">45+</div>
                <div className="text-sm text-ink-600 font-medium">Pays</div>
              </div>
              <div className="text-center">
                <div className="font-[var(--font-heading)] text-3xl sm:text-4xl font-bold text-forest-900 mb-1">500+</div>
                <div className="text-sm text-ink-600 font-medium">Événements</div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
          <span className="text-xs font-medium text-ink-600 tracking-widest uppercase">Découvrir</span>
          <ChevronDown className="w-5 h-5 text-forest-900" />
        </motion.div>
      </section>

      {/* ═══════════ ABOUT SECTION ═══════════ */}
      <section id="apropos" className="py-24 lg:py-32 bg-cream-100 relative">
        <PatternDivider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal direction="left">
              <span className="inline-block text-sm font-semibold text-gold-600 uppercase tracking-widest mb-4">Notre Mission</span>
              <h2 className="font-[var(--font-heading)] text-4xl lg:text-5xl font-bold text-forest-900 leading-tight mb-6">
                Une foi vivante,<br />une communauté unie
              </h2>
              <p className="text-lg text-ink-600 leading-relaxed mb-6">
                L&apos;Église Évangélique du Cameroun rassemble des fidèles sur tous les continents.
                DiaspoEEC est née d&apos;un rêve simple : que chaque membre, peu importe où il se trouve,
                puisse vivre sa foi, contribuer et rester connecté à sa communauté d&apos;origine.
              </p>
              <p className="text-lg text-ink-600 leading-relaxed mb-8">
                De Douala à Paris, de Yaoundé à Montréal, de Bafoussam à Berlin —
                nous sommes une seule famille dans le Christ.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-forest-900" />
                </div>
                <p className="italic text-ink-600 font-[var(--font-heading)] text-lg">
                  « Car là où deux ou trois sont assemblés en mon nom, je suis au milieu d&apos;eux. »
                  <span className="block text-sm not-italic text-ink-400 mt-1">Matthieu 18:20</span>
                </p>
              </div>
            </Reveal>

            <Reveal direction="right">
              <div className="relative">
                <div className="bg-white rounded-[2rem] p-8 shadow-xl" style={{ ...kentePatternStyle, boxShadow: '0 20px 60px rgba(27,67,50,0.05)' }}>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Globe, value: '45+', label: 'Pays représentés', bg: 'bg-sage-200', iconBg: 'bg-forest-900' },
                      { icon: Church, value: '120+', label: 'Paroisses connectées', bg: 'bg-gold-200', iconBg: 'bg-gold-600' },
                      { icon: HandHeart, value: '2M+', label: 'Euros collectés', bg: 'bg-gold-200', iconBg: 'bg-terra-600' },
                      { icon: Video, value: '800+', label: 'Cultes diffusés', bg: 'bg-sage-200', iconBg: 'bg-forest-700' },
                    ].map((stat) => (
                      <div key={stat.label} className={`${stat.bg} rounded-3xl p-6 text-center`}>
                        <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                          <stat.icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="font-[var(--font-heading)] text-2xl font-bold text-forest-900">{stat.value}</div>
                        <div className="text-sm text-ink-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <motion.div className="absolute -top-4 -right-4 w-20 h-20 bg-gold-600/10 rounded-full pointer-events-none" animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
                <motion.div className="absolute -bottom-4 -left-4 w-16 h-16 bg-forest-900/10 rounded-full pointer-events-none" animate={{ y: [0, -12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section id="fonctionnalites" className="py-24 lg:py-32 bg-cream-50 relative">
        <PatternDivider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 uppercase tracking-widest mb-4">Fonctionnalités</span>
            <h2 className="font-[var(--font-heading)] text-4xl lg:text-5xl font-bold text-forest-900 leading-tight mb-6">
              Tout pour vivre votre foi<br />au quotidien
            </h2>
            <p className="text-lg text-ink-600">
              Une plateforme complète, conçue avec amour pour les besoins de notre communauté.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 0.1}>
                <div
                  className="bg-white rounded-[2rem] p-8 shadow-md border border-sage-200/50 group cursor-default"
                  style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 4px 6px rgba(27,67,50,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(27,67,50,0.12), 0 8px 20px rgba(27,67,50,0.06)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 6px rgba(27,67,50,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div
                    className={`w-16 h-16 ${feature.bgClass} rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500`}
                    style={feature.bgStyle}
                  >
                    <feature.icon className={`w-8 h-8 ${feature.iconColor} transition-colors duration-500`} />
                  </div>
                  <h3 className="font-[var(--font-heading)] text-xl font-bold text-forest-900 mb-3">{feature.title}</h3>
                  <p className="text-ink-600 leading-relaxed">{feature.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ DONATION SECTION ═══════════ */}
      <section id="dons" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #FEFAE0 0%, #FFFBF0 100%)' }}>
        <PatternDivider />
        <div style={ndopPatternStyle} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 uppercase tracking-widest mb-4">Soutenir l&apos;œuvre</span>
            <h2 className="font-[var(--font-heading)] text-4xl lg:text-5xl font-bold text-forest-900 leading-tight mb-6">
              Votre générosité<br />construit l&apos;avenir
            </h2>
            <p className="text-lg text-ink-600">
              Chaque don, petit ou grand, contribue à bâtir une communauté plus forte et plus unie.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <Reveal direction="left" className="lg:col-span-3">
              <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-sage-200/30" style={{ boxShadow: '0 20px 60px rgba(27,67,50,0.08)' }}>
                <div className="bg-forest-900 p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={heroPatternStyle} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sage-400 text-sm font-semibold uppercase tracking-wider">Campagne en cours</span>
                    </div>
                    <h3 className="font-[var(--font-heading)] text-2xl sm:text-3xl font-bold text-white mb-2">
                      Construction du Centre Communautaire
                    </h3>
                    <p className="text-sage-400/80 text-sm">
                      Un lieu de rassemblement pour toute la diaspora EEC en région parisienne.
                    </p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="mb-8">
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <span className="font-[var(--font-heading)] text-3xl font-bold text-forest-900">72 000 €</span>
                        <span className="text-ink-600 text-lg"> / 100 000 €</span>
                      </div>
                      <span className="text-sm font-bold text-gold-600 bg-gold-200 px-3 py-1 rounded-full">72%</span>
                    </div>
                    <div ref={progressRef} className="w-full h-4 bg-sage-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full rounded-full relative"
                        style={{
                          width: progressInView ? '72%' : '0%',
                          background: 'linear-gradient(90deg, #1B4332, #2D6A4F, #95D5B2)',
                          backgroundSize: '200% 100%',
                          transition: 'width 2s cubic-bezier(0.16, 1, 0.3, 1)',
                        }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs text-ink-400">342 donateurs</span>
                      <span className="text-xs text-ink-400">28 000 € restants</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-8">
                    <button onClick={() => setDonationType('ponctuel')} className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${donationType === 'ponctuel' ? 'bg-forest-900 text-white shadow-md' : 'bg-sage-200 text-forest-900 hover:bg-sage-300'}`}>
                      Don ponctuel
                    </button>
                    <button onClick={() => setDonationType('mensuel')} className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${donationType === 'mensuel' ? 'bg-forest-900 text-white shadow-md' : 'bg-sage-200 text-forest-900 hover:bg-sage-300'}`}>
                      Don mensuel
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {amounts.map((amt) => {
                      const converted = getConvertedAmount(amt);
                      const isActive = selectedAmount === amt && !customAmount;
                      return (
                        <button
                          key={amt}
                          onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                          className={`border-2 rounded-2xl py-3.5 font-bold transition-all duration-300 ${isActive ? 'bg-forest-900 text-white border-forest-900 scale-105' : 'border-sage-400 text-forest-900 hover:border-forest-900 hover:scale-105'}`}
                          style={isActive ? { boxShadow: '0 4px 15px rgba(27,67,50,0.3)' } : {}}
                        >
                          {currency === 'XAF' ? `${converted.toLocaleString('fr-FR')} F` : `${converted} ${displaySymbol}`}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 mb-8">
                    <div className="flex-1">
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Autre montant"
                        className="w-full border-2 border-sage-400 rounded-2xl px-5 py-3.5 text-forest-900 font-semibold placeholder:text-ink-400 focus:border-forest-900 focus:ring-4 focus:ring-forest-900/10 outline-none transition-all"
                      />
                    </div>
                    <CustomSelect
                      value={currency}
                      onChange={setCurrency}
                      options={[
                        { value: 'EUR', label: 'EUR €' },
                        { value: 'USD', label: 'USD $' },
                        { value: 'XAF', label: 'XAF FCFA' },
                      ]}
                      className="min-w-[130px]"
                    />
                  </div>

                  <button className="w-full bg-gold-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 hover:-translate-y-0.5 transition-all duration-300" style={{ boxShadow: '0 8px 30px rgba(212,160,23,0.25)' }}>
                    <Heart className="w-5 h-5" />
                    {currency === 'XAF'
                      ? `Faire un don de ${displayAmount.toLocaleString('fr-FR')} FCFA`
                      : `Faire un don de ${displayAmount} ${displaySymbol}`}
                  </button>

                  <p className="text-center text-xs text-ink-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Paiement 100% sécurisé • Reçu fiscal disponible
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] shadow-lg p-8 border border-sage-200/30 mb-6" style={{ boxShadow: '0 10px 40px rgba(27,67,50,0.05)' }}>
                <h4 className="font-[var(--font-heading)] text-lg font-bold text-forest-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-gold-600" />
                  Derniers donateurs
                </h4>
                <div className="space-y-5">
                  {donors.map((donor) => (
                    <div key={donor.initials} className="flex items-center gap-4">
                      <div className={`bg-gradient-to-br ${donor.gradient} w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {donor.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink-900 text-sm">{donor.name}</div>
                        <div className="text-xs text-ink-400">{donor.location} • {donor.time}</div>
                      </div>
                      <span className="font-bold text-forest-900 text-sm bg-sage-200 px-3 py-1 rounded-full">{donor.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-forest-900 to-forest-700 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={heroPatternStyle} />
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                    <Quote className="w-6 h-6 text-gold-400" />
                  </div>
                  <p className="font-[var(--font-heading)] text-lg italic leading-relaxed mb-4 text-white/90">
                    « Celui qui sème abondamment moissonnera aussi abondamment. »
                  </p>
                  <p className="text-sm text-sage-400">2 Corinthiens 9:6</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS SECTION ═══════════ */}
      <section id="temoignages" className="py-24 lg:py-32 bg-cream-100 relative">
        <PatternDivider />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-sm font-semibold text-gold-600 uppercase tracking-widest mb-4">Témoignages</span>
            <h2 className="font-[var(--font-heading)] text-4xl lg:text-5xl font-bold text-forest-900 leading-tight mb-6">
              Ils vivent leur foi<br />avec DiaspoEEC
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.1}>
                <div
                  className="bg-white rounded-[2rem] p-8 shadow-lg border border-sage-200/30 relative cursor-default"
                  style={{ transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 10px 40px rgba(27,67,50,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 20px 60px rgba(27,67,50,0.12)'; e.currentTarget.style.transform = 'translateY(-6px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 10px 40px rgba(27,67,50,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <div className="absolute top-4 right-6 font-[var(--font-heading)] text-[5rem] leading-none text-gold-600 opacity-30">&ldquo;</div>
                  <p className="text-ink-600 leading-relaxed mb-8 relative z-10">{t.text}</p>
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${t.gradient} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                      {t.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-ink-900">{t.name}</div>
                      <div className="text-sm text-ink-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {t.city}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ APP DOWNLOAD / CTA SECTION ═══════════ */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-900 via-forest-700 to-forest-900" />
        <div className="absolute inset-0 opacity-30" style={heroPatternStyle} />

        <div className="absolute w-72 h-72 rounded-full border-2 border-white/10 -top-12 -right-12 hidden lg:block pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full border-2 border-white/10 bottom-8 -left-8 hidden lg:block pointer-events-none" />
        <motion.div className="absolute w-24 h-24 rounded-full top-1/3 left-1/4 hidden lg:block pointer-events-none" style={{ background: 'rgba(212,160,23,0.1)' }} animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <motion.div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 mx-auto" animate={{ y: [0, -12, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <Smartphone className="w-10 h-10 text-gold-400" />
            </motion.div>

            <h2 className="font-[var(--font-heading)] text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-6">
              Téléchargez l&apos;application<br />
              <span className="text-gold-400">DiaspoEEC</span>
            </h2>
            <p className="text-xl text-sage-400/90 max-w-2xl mx-auto mb-12 leading-relaxed">
              Emportez votre communauté partout avec vous. Méditations, cultes en direct,
              dons et bien plus — le tout dans votre poche.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a href="#" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-white/70">Télécharger sur</div>
                  <div className="text-white font-semibold text-lg leading-tight">App Store</div>
                </div>
              </a>
              <a href="#" className="inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.77c-.25-.07-.47-.2-.65-.38a1.13 1.13 0 01-.33-.57c-.04-.2-.04-.55-.04-3.5V3.55c0-3.17 0-3.44.05-3.6.06-.21.18-.42.35-.57.14-.13.32-.23.52-.3L3.18 0l8.53 5.35c4.7 2.94 8.56 5.37 8.58 5.4.03.04-1.06.73-2.42 1.56l-2.46 1.5-6.12 3.84L3.18 23.77zm10.24-8.34l2.19-1.36-2.19-1.37-5.32-3.34-2.38-1.49v12.12l2.38-1.49 5.32-3.07zm3.48-2.18l2.15-1.32-2.15-1.35-1.51-.95-2.2 1.37 2.2 1.37 1.51.88z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-white/70">Disponible sur</div>
                  <div className="text-white font-semibold text-lg leading-tight">Google Play</div>
                </div>
              </a>
            </div>

            <div className="flex items-center justify-center gap-6 text-white/60 text-sm flex-wrap">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                4.8/5 étoiles
              </span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>10 000+ téléchargements</span>
              <span className="w-1 h-1 rounded-full bg-white/30" />
              <span>Gratuit</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer id="contact" className="bg-ink-900 pt-20 pb-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="lg:col-span-1">
              <Link href="#" className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 bg-forest-900 rounded-2xl flex items-center justify-center">
                  <LeafCrossLogo />
                </div>
                <span className="font-[var(--font-heading)] text-2xl font-bold text-white">
                  Diaspo<span className="text-gold-600">EEC</span>
                </span>
              </Link>
              <p className="text-white/50 leading-relaxed mb-6 text-sm">
                La plateforme numérique de l&apos;Église Évangélique du Cameroun pour
                la diaspora. Unis dans la foi, connectés par la technologie.
              </p>
              <div className="flex gap-3">
                {[Facebook, Youtube, Instagram, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-10 h-10 bg-white/10 hover:bg-forest-900 rounded-xl flex items-center justify-center transition-all duration-300 group">
                    <Icon className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-[var(--font-heading)] text-white font-bold mb-6">Navigation</h4>
              <ul className="space-y-3">
                {['Accueil', 'À propos', 'Fonctionnalités', 'Faire un don', 'Témoignages'].map((item) => (
                  <li key={item}><a href="#" className="text-white/50 hover:text-gold-600 transition-colors text-sm">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-[var(--font-heading)] text-white font-bold mb-6">Ressources</h4>
              <ul className="space-y-3">
                {['Guide Biblique', 'Méditations', 'Cultes en direct', 'Annuaire des paroisses', 'Aide & Support'].map((item) => (
                  <li key={item}><a href="#" className="text-white/50 hover:text-gold-600 transition-colors text-sm">{item}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-[var(--font-heading)] text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                  <a href="mailto:contact@diaspoeec.org" className="text-white/50 hover:text-gold-600 transition-colors text-sm">contact@diaspoeec.org</a>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-sm">+33 1 23 45 67 89</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
                  <span className="text-white/50 text-sm">Siège : Douala, Cameroun<br />Bureau Europe : Paris, France</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2026 Église Évangélique du Cameroun. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/40 hover:text-gold-600 transition-colors text-sm">Politique de confidentialité</a>
              <a href="#" className="text-white/40 hover:text-gold-600 transition-colors text-sm">Mentions légales</a>
              <a href="#" className="text-white/40 hover:text-gold-600 transition-colors text-sm">CGU</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
