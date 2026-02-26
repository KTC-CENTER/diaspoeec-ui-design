'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, KeyRound, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';

export default function SecuritePage() {
  const user = useAuthStore((s) => s.user);
  const { addToast } = useToastStore();

  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPwd) {
      addToast('Veuillez saisir votre mot de passe actuel', 'error');
      return;
    }
    if (newPwd.length < 8) {
      addToast('Le nouveau mot de passe doit contenir au moins 8 caracteres', 'error');
      return;
    }
    if (newPwd !== confirmPwd) {
      addToast('Les mots de passe ne correspondent pas', 'error');
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    addToast('Mot de passe modifie avec succes', 'success');
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/profil"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour au profil
        </Link>
        <h1
          className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Securite du compte
        </h1>
        <p className="text-ink-500">Gerez la securite de votre compte</p>
      </div>

      {/* Account info */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-4 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Shield className="h-5 w-5 text-gold-600" />
          Informations du compte
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
            <div>
              <p className="text-xs text-ink-500">Email</p>
              <p className="text-sm font-medium text-ink-900">{user?.email}</p>
            </div>
            {user?.emailVerified && (
              <span className="flex items-center gap-1 rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-bold text-forest-900">
                <Check className="h-3 w-3" />
                Verifie
              </span>
            )}
          </div>
          <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
            <div>
              <p className="text-xs text-ink-500">Authentification</p>
              <p className="text-sm font-medium text-ink-900">Keycloak SSO</p>
            </div>
            <span className="rounded-full bg-sage-100/50 px-2 py-0.5 text-[10px] font-medium text-ink-500">
              Fournisseur externe
            </span>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Lock className="h-5 w-5 text-gold-600" />
          Changer le mot de passe
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Mot de passe actuel</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-11 text-sm text-ink-900 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
                placeholder="Votre mot de passe actuel"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Nouveau mot de passe</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-11 text-sm text-ink-900 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
                placeholder="Minimum 8 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Confirmer le mot de passe</label>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              placeholder="Retapez le nouveau mot de passe"
            />
          </div>
          <button
            onClick={handleChangePassword}
            disabled={saving}
            className={cn(
              'flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]',
              'disabled:opacity-60'
            )}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {saving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-4 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <KeyRound className="h-5 w-5 text-gold-600" />
          Authentification a deux facteurs
        </h2>
        <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-4">
          <div>
            <p className="text-sm font-semibold text-ink-900">Activer la 2FA</p>
            <p className="text-xs text-ink-500">Ajouter une couche de securite supplementaire</p>
          </div>
          <button
            onClick={() => {
              setTwoFA(!twoFA);
              addToast(
                twoFA ? 'Authentification 2FA desactivee' : 'Authentification 2FA activee',
                twoFA ? 'info' : 'success'
              );
            }}
            className={cn(
              'relative h-6 w-[44px] cursor-pointer rounded-xl transition-colors duration-300',
              twoFA ? 'bg-forest-700' : 'bg-gray-300'
            )}
          >
            <span
              className={cn(
                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
                twoFA && 'translate-x-5'
              )}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
