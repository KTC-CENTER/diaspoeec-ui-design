import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'DiaspoEEC',
    template: '%s | DiaspoEEC',
  },
  description:
    "Plateforme communautaire de l'\u00c9glise \u00c9vang\u00e9lique du Cameroun",
  keywords: [
    'EEC',
    'diaspora',
    '\u00e9glise',
    'cameroun',
    'communaut\u00e9',
    'foi',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body
        className="min-h-screen bg-background font-body text-text-primary antialiased"
        style={{ fontFamily: 'var(--font-sans), var(--font-body)' }}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
