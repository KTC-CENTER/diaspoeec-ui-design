'use client';

import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatMontant } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import type { Don } from '@/types';

function generateReceipt(don: Don) {
  const lines = [
    '═══════════════════════════════════════',
    '        EGLISE EVANGELIQUE DU CAMEROUN',
    '           RECU DE DON',
    '═══════════════════════════════════════',
    '',
    `Date:       ${formatDate(don.createdAt, 'dd/MM/yyyy')}`,
    `Reference:  ${don.id}`,
    `Campagne:   ${don.campagneNom}`,
    `Montant:    ${formatMontant(don.montant, don.devise)}`,
    `Methode:    ${don.methodePaiement}`,
    '',
    '───────────────────────────────────────',
    'Merci pour votre generosite !',
    'Ce recu fait foi de votre contribution.',
    '═══════════════════════════════════════',
  ].join('\n');

  const blob = new Blob(['\uFEFF' + lines], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `recu-don-${don.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

interface DonationHistoryProps {
  dons: Don[];
}

export function DonationHistory({ dons }: DonationHistoryProps) {
  const { addToast } = useToastStore();

  if (!dons || dons.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-cream-50 py-12 text-center">
        <p className="text-sm text-ink-400">Aucun don enregistre.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-sage-200/40 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-sage-200/30">
            <tr>
              <th className="text-left py-3 px-5 font-semibold text-forest-900">Date</th>
              <th className="text-left py-3 px-5 font-semibold text-forest-900">Campagne</th>
              <th className="text-right py-3 px-5 font-semibold text-forest-900">Montant</th>
              <th className="text-center py-3 px-5 font-semibold text-forest-900">Recu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100/50">
            {dons.map((don) => (
              <tr
                key={don.id}
                className="hover:bg-cream-50/50 transition"
              >
                <td className="py-3.5 px-5 text-ink-600">
                  {formatDate(don.createdAt, 'dd/MM/yyyy')}
                </td>
                <td className="py-3.5 px-5 font-medium text-ink-900">
                  {don.campagneNom}
                </td>
                <td className="py-3.5 px-5 text-right font-semibold text-forest-900">
                  {formatMontant(don.montant, don.devise)}
                </td>
                <td className="py-3.5 px-5 text-center">
                  {don.recuDisponible ? (
                    <button
                      className="inline-flex items-center gap-1 text-forest-900 hover:text-forest-700 transition text-xs font-medium"
                      onClick={() => {
                        generateReceipt(don);
                        addToast('Recu telecharge', 'success');
                      }}
                    >
                      <FileText className="w-4 h-4" />
                      PDF
                    </button>
                  ) : (
                    <span className="text-xs text-ink-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {dons.map((don) => (
          <div
            key={don.id}
            className="bg-white rounded-2xl shadow-sm border border-sage-200/40 p-4"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs text-ink-600">
                {formatDate(don.createdAt, 'dd/MM/yyyy')}
              </span>
              {don.recuDisponible && (
                <button
                  className="text-forest-900 text-xs font-medium flex items-center gap-1"
                  onClick={() => {
                    alert(`Telechargement du recu pour le don ${don.id}`);
                  }}
                >
                  <FileText className="w-3.5 h-3.5" />
                  PDF
                </button>
              )}
            </div>
            <p className="font-medium text-ink-900 text-sm">{don.campagneNom}</p>
            <p className="font-heading font-bold text-forest-900 text-lg">
              {formatMontant(don.montant, don.devise)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
