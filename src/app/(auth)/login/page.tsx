'use client';

import Link from 'next/link';
import { Shield, User } from 'lucide-react';
import { LoginForm } from '@/features/auth/components/login-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';
import { QuickLoginButtons } from '@/features/auth/components/quick-login-buttons';

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2
          className="text-2xl font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Heureux de vous revoir
        </h2>
        <p className="text-sm text-ink-600 mt-2">
          Connectez-vous pour retrouver votre communauté
        </p>
      </div>

      {/* Quick Login (Dev mode) */}
      <QuickLoginButtons />

      {/* Login Form */}
      <LoginForm />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-ink-600">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton />

      {/* Register link */}
      <p className="text-center text-sm text-ink-600 mt-8">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="font-semibold text-forest-900 hover:underline ml-1"
        >
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
