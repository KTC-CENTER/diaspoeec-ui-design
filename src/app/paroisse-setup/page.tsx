'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient, ApiError } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { useTenantStore } from '@/stores/tenant.store';
import type { Paroisse } from '@/types';

export default function ParoisseSetupPage() {
  const router = useRouter();
  const setParoisse = useTenantStore((s) => s.setParoisse);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState<Paroisse | null>(null);

  const handleVerify = async () => {
    if (!code.trim()) {
      setError('Veuillez entrer un code paroisse');
      return;
    }

    setLoading(true);
    setError('');
    setFound(null);

    try {
      const paroisse = await apiClient.get<Paroisse>(
        ENDPOINTS.PAROISSE_BY_CODE(code.trim().toUpperCase()),
      );
      setFound(paroisse);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setError('Code paroisse invalide. Verifiez aupres de votre pasteur.');
      } else {
        setError('Erreur de connexion. Reessayez.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!found) return;
    setParoisse(found);
    router.push('/splash');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-900 via-forest-700 to-forest-900 p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sage-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo EEC */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
            <svg className="w-10 h-10 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-white">DiaspoEEC</h1>
          <p className="text-sage-400 mt-2 text-sm">
            Entrez le code fourni par votre paroisse
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          {!found ? (
            <>
              <label className="block text-sm font-medium text-ink-700 mb-2">
                Code paroisse
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase());
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                placeholder="Ex: AKWA-2026"
                className="w-full px-4 py-3 rounded-xl border-2 border-sage-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none text-center text-lg font-mono tracking-widest uppercase transition-all"
                autoFocus
                disabled={loading}
              />

              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
              )}

              <button
                onClick={handleVerify}
                disabled={loading || !code.trim()}
                className="w-full mt-6 py-3 px-4 bg-forest-700 hover:bg-forest-800 disabled:bg-forest-700/50 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    Verifier
                  </>
                )}
              </button>

              <p className="mt-6 text-xs text-ink-500 text-center leading-relaxed">
                Ce code vous est communique par votre pasteur ou responsable de paroisse.
                Il identifie votre communaute au sein de DiaspoEEC.
              </p>
            </>
          ) : (
            /* Parish found — confirmation screen */
            <div className="text-center">
              <div
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: found.couleurPrimaire + '15' }}
              >
                <svg className="w-8 h-8" style={{ color: found.couleurPrimaire }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h2 className="text-xl font-display font-bold text-ink-900">
                {found.label}
              </h2>

              {found.ville && (
                <p className="text-ink-500 mt-1">{found.ville}{found.synode ? ` - ${found.synode}` : ''}</p>
              )}

              {found.pasteurNom && (
                <p className="text-sm text-ink-500 mt-2">{found.pasteurNom}</p>
              )}

              {found.messageAccueil && (
                <p className="mt-4 text-sm text-forest-700 italic bg-forest-50 rounded-lg p-3">
                  &ldquo;{found.messageAccueil}&rdquo;
                </p>
              )}

              <div className="flex items-center gap-2 justify-center mt-4">
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: found.couleurPrimaire }} />
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: found.couleurSecondaire }} />
                <div className="w-6 h-6 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: found.couleurAccent }} />
              </div>

              <button
                onClick={handleConfirm}
                className="w-full mt-6 py-3 px-4 text-white font-semibold rounded-xl transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: found.couleurPrimaire }}
              >
                Rejoindre cette paroisse
              </button>

              <button
                onClick={() => { setFound(null); setCode(''); }}
                className="w-full mt-3 py-2 px-4 text-ink-500 hover:text-ink-700 text-sm transition-colors"
              >
                Ce n&apos;est pas ma paroisse
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
