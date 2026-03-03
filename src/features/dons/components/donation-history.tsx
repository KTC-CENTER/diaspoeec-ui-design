'use client';

import { FileText } from 'lucide-react';
import { formatDate, formatMontant } from '@/lib/utils/format';
import { useToastStore } from '@/stores/toast.store';
import type { Don } from '@/types';

function printReceipt(don: Don) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Recu de don - ${don.id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; color: #1a2b22; background: #fff; padding: 40px; }
    .header { text-align: center; margin-bottom: 32px; border-bottom: 2px solid #1a2b22; padding-bottom: 24px; }
    .logo { font-size: 22px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #1a2b22; }
    .subtitle { font-size: 13px; color: #6b7280; margin-top: 4px; }
    .badge { display: inline-block; margin-top: 12px; background: #1a2b22; color: #fff; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; padding: 4px 16px; border-radius: 999px; }
    .body { max-width: 440px; margin: 0 auto; }
    .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
    .row:last-child { border-bottom: none; }
    .label { font-size: 13px; color: #6b7280; }
    .value { font-size: 13px; font-weight: 600; color: #1a2b22; text-align: right; max-width: 240px; word-break: break-all; }
    .amount-block { background: #f0f7f2; border: 1.5px solid #1a2b22; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
    .amount-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; }
    .amount-value { font-size: 36px; font-weight: bold; color: #1a2b22; margin-top: 4px; }
    .footer { margin-top: 32px; text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    .footer p { font-size: 12px; color: #9ca3af; line-height: 1.8; }
    .footer strong { color: #1a2b22; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="body">
    <div class="header">
      <div class="logo">Eglise Evangelique du Cameroun</div>
      <div class="subtitle">Diaspora EEC — Plateforme numerique</div>
      <div class="badge">Recu de don</div>
    </div>
    <div class="amount-block">
      <div class="amount-label">Montant du don</div>
      <div class="amount-value">${formatMontant(don.montant, don.devise)}</div>
    </div>
    <div class="row"><span class="label">Reference</span><span class="value">${don.id}</span></div>
    <div class="row"><span class="label">Date</span><span class="value">${formatDate(don.createdAt, 'dd MMMM yyyy')}</span></div>
    <div class="row"><span class="label">Campagne</span><span class="value">${don.campagneNom}</span></div>
    <div class="row"><span class="label">Frequence</span><span class="value">${don.frequence === 'mensuel' ? 'Don mensuel recurrent' : 'Don ponctuel'}</span></div>
    <div class="row"><span class="label">Methode</span><span class="value">${don.methodePaiement === 'stripe' ? 'Carte bancaire (Stripe)' : 'PayPal'}</span></div>
    <div class="row"><span class="label">Donateur</span><span class="value">${don.estAnonyme ? 'Anonyme' : (don.donateurNom || 'Non renseigne')}</span></div>
    <div class="footer">
      <p>
        <strong>Merci pour votre generosite !</strong><br />
        Ce recu certifie votre contribution a la campagne <strong>${don.campagneNom}</strong>.<br />
        Il peut etre utilise comme justificatif de don.<br /><br />
        Eglise Evangelique du Cameroun — Diaspora EEC
      </p>
    </div>
  </div>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank', 'width=600,height=800');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
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
              <tr key={don.id} className="hover:bg-cream-50/50 transition">
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
                  <button
                    className="inline-flex items-center gap-1 text-forest-900 hover:text-forest-700 transition text-xs font-medium"
                    onClick={() => {
                      printReceipt(don);
                      addToast('Recu ouvert pour impression', 'success');
                    }}
                  >
                    <FileText className="w-4 h-4" />
                    PDF
                  </button>
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
              <button
                className="text-forest-900 text-xs font-medium flex items-center gap-1"
                onClick={() => {
                  printReceipt(don);
                  addToast('Recu ouvert pour impression', 'success');
                }}
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </button>
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
