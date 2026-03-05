import type { Metadata, Viewport } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import { QueryProvider } from '@/providers/query-provider';
import { AuthProvider } from '@/providers/auth-provider';
import { CapacitorProvider } from '@/providers/capacitor-provider';
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

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
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'DiaspoEEC',
    description: "Plateforme communautaire de l'\u00c9glise \u00c9vang\u00e9lique du Cameroun",
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B4332" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DiaspoEEC" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body
        className="min-h-screen bg-background font-body text-text-primary antialiased"
        style={{ fontFamily: 'var(--font-sans), var(--font-body)' }}
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>
            <CapacitorProvider>{children}</CapacitorProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
