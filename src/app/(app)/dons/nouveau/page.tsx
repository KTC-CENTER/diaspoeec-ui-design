'use client';

import { DonationForm } from '@/features/dons/components/donation-form';

export default function NouveauDonPage() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-4xl">
      {/* Header */}
      <div className="animate-[fade-up_0.5s_ease-out_both] mb-6">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-forest-900 mb-2">
          Faire un don
        </h1>
        <p className="text-ink-600 text-lg">
          Soutenez l&apos;oeuvre de l&apos;Eglise
        </p>
      </div>

      {/* Donation form */}
      <DonationForm />
    </div>
  );
}
