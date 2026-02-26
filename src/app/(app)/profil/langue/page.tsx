'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';

const langues = [
  { code: 'fr', label: 'Francais', native: 'Francais', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { code: 'en', label: 'Anglais', native: 'English', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { code: 'de', label: 'Allemand', native: 'Deutsch', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { code: 'es', label: 'Espagnol', native: 'Espanol', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
];

export default function LanguePage() {
  const [selected, setSelected] = useState('fr');
  const [saving, setSaving] = useState(false);
  const { addToast } = useToastStore();

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    addToast('Langue mise a jour', 'success');
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
          Langue
        </h1>
        <p className="text-ink-500">Choisissez la langue de l&apos;application</p>
      </div>

      <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Globe className="h-5 w-5 text-gold-600" />
          Langues disponibles
        </h2>
        <div className="space-y-2">
          {langues.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelected(lang.code)}
              className={cn(
                'flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all',
                selected === lang.code
                  ? 'border-2 border-forest-700 bg-forest-900/5'
                  : 'border-2 border-transparent hover:bg-cream-50/50'
              )}
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink-900">{lang.label}</p>
                <p className="text-xs text-ink-500">{lang.native}</p>
              </div>
              {selected === lang.code && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-700">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          'mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-10 py-3.5 font-semibold text-white shadow-lg shadow-forest-900/20 transition-all duration-300 hover:scale-[1.02] md:w-auto',
          'disabled:opacity-60'
        )}
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enregistrement...
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            Enregistrer
          </>
        )}
      </button>
    </div>
  );
}
