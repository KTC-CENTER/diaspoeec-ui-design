import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition-colors hover:text-forest-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour &agrave; la connexion
      </Link>

      {/* Header */}
      <div className="space-y-2">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Mot de passe oubli&eacute;
        </h2>
        <p className="text-sm text-ink-500">
          Pas de panique, nous allons vous envoyer un lien de
          r&eacute;initialisation.
        </p>
      </div>

      {/* Form */}
      <ForgotPasswordForm />
    </div>
  );
}
