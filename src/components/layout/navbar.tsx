'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: 'A propos', href: '#about' },
  { label: 'Fonctionnalites', href: '#features' },
  { label: 'Dons', href: '#dons' },
  { label: 'Contact', href: '#contact' },
];

function EECLogoSmall() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="20" fill="#1B4332" />
      <circle cx="20" cy="20" r="17" fill="none" stroke="#D8F3DC" strokeWidth="1" />
      <line x1="20" y1="8" x2="20" y2="28" stroke="#FEFAE0" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="13" y1="15" x2="27" y2="15" stroke="#FEFAE0" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M26 24 C28 20 30 16 28 12 C24 14 22 18 24 22 Z"
        fill="#95D5B2"
        stroke="#95D5B2"
        strokeWidth="0.5"
      />
      <line x1="26" y1="18" x2="27" y2="23" stroke="#1B4332" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 shadow-md backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <EECLogoSmall />
            <span
              className={cn(
                'font-heading text-xl font-semibold tracking-tight transition-colors',
                scrolled ? 'text-forest-900' : 'text-white'
              )}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              DiaspoEEC
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:opacity-80',
                  scrolled ? 'text-ink-700 hover:text-forest-700' : 'text-white/90 hover:text-white'
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className={cn(
                'rounded-xl border px-5 py-2 text-sm font-medium transition-all',
                scrolled
                  ? 'border-forest-700 text-forest-700 hover:bg-forest-700/5'
                  : 'border-white/60 text-white hover:border-white hover:bg-white/10'
              )}
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-forest-900 px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-forest-700 hover:shadow-lg"
            >
              Rejoindre
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden',
              scrolled
                ? 'text-ink-700 hover:bg-ink-100'
                : 'text-white hover:bg-white/10'
            )}
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={cn(
            'overflow-hidden transition-all duration-300 md:hidden',
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="border-t border-ink-100/10 bg-white px-4 pb-6 pt-4 shadow-lg">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-forest-900/5 hover:text-forest-700"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3 border-t border-ink-100 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl border border-forest-700 px-5 py-2.5 text-center text-sm font-medium text-forest-700 transition-colors hover:bg-forest-700/5"
              >
                Se connecter
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl bg-forest-900 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-md transition-colors hover:bg-forest-700"
              >
                Rejoindre
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
