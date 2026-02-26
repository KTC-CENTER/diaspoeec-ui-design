import Link from 'next/link';
import { RegisterForm } from '@/features/auth/components/register-form';
import { GoogleOAuthButton } from '@/features/auth/components/google-oauth-button';

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Cr&eacute;er votre compte
        </h2>
        <p className="text-sm text-ink-500">
          Rejoignez la communaut&eacute; DiaspoEEC
        </p>
      </div>

      {/* Register Form */}
      <RegisterForm />

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-ink-200" />
        <span className="text-xs font-medium text-ink-400">ou</span>
        <div className="h-px flex-1 bg-ink-200" />
      </div>

      {/* Google OAuth */}
      <GoogleOAuthButton />

      {/* Login link */}
      <p className="text-center text-sm text-ink-500">
        D&eacute;j&agrave; un compte ?{' '}
        <Link
          href="/login"
          className="font-semibold text-forest-700 transition-colors hover:text-forest-500"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
