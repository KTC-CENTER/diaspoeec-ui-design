'use client';

import { use } from 'react';
import Link from 'next/link';
import { useDynamicId } from '@/hooks/use-dynamic-id';
import {
  ArrowLeft,
  CheckCircle,
  Heart,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatMontant } from '@/lib/utils/format';
import { useCampagne, useDons } from '@/features/dons/hooks/use-dons';
import { CampaignProgress } from '@/features/dons/components/campaign-progress';
import { DonorList } from '@/features/dons/components/donor-list';

/* Brand SVG icons for share buttons */
const WhatsAppIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export default function CampagneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = use(params);
  const id = useDynamicId(rawId);
  const { data: campagne, isLoading } = useCampagne(id);
  const { data: allDons } = useDons();

  // Dons for this campaign
  const campaignDons = allDons?.filter((d) => d.campagneId === id) || [];

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!campagne) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Campagne introuvable
        </h2>
        <p className="mt-2 text-ink-500">
          Cette campagne n&apos;existe pas ou a ete supprimee.
        </p>
        <Link
          href="/dons/nouveau"
          className="mt-4 inline-flex items-center gap-2 text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux dons
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShareWhatsApp = () => {
    const text = `Soutenez la campagne "${campagne.titre}" - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareX = () => {
    const text = `Soutenez la campagne "${campagne.titre}"`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  return (
    <div className="max-w-5xl">
      {/* Back */}
      <div className="px-4 md:px-8 pt-4">
        <Link
          href="/dons/nouveau"
          className="flex items-center gap-2 text-forest-900 font-medium hover:text-forest-700 transition text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Dons
        </Link>
      </div>

      {/* Hero with african pattern */}
      <div
        className="mx-4 md:mx-8 rounded-2xl overflow-hidden relative bg-gradient-to-br from-gold-600 via-terra-600 to-forest-900 p-8 md:p-12 mb-6 animate-[fade-up_0.5s_ease-out_both]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%2395D5B2' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="relative z-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
            {campagne.titre}
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            {campagne.description?.split('.')[0]}.
          </p>
        </div>
        {/* Decorative element */}
        <div className="absolute top-4 right-4 w-24 h-24 opacity-10">
          <svg viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M40 10L50 35L75 40L50 45L40 70L30 45L5 40L30 35Z" fill="white"/>
          </svg>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8">
        {/* Campaign progress */}
        <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.1s_both]">
          <CampaignProgress campagne={campagne} />
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            A propos de cette campagne
          </h2>
          <p className="text-ink-600 leading-relaxed mb-4 whitespace-pre-line">
            {campagne.description}
          </p>

          {/* Affectation des fonds */}
          {campagne.affectationFonds && campagne.affectationFonds.length > 0 && (
            <>
              <h3 className="font-heading font-bold text-ink-900 mb-3">
                Les fonds couvriront :
              </h3>
              <ul className="space-y-2 text-ink-600 text-sm">
                {campagne.affectationFonds.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-forest-900 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Recent donors */}
        {campaignDons.length > 0 && (
          <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
            <DonorList dons={campaignDons} />
          </div>
        )}

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 animate-[fade-up_0.5s_ease-out_0.4s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            Partagez cette campagne
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <button
              onClick={handleShareFacebook}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <FacebookIcon />
              Facebook
            </button>
            <button
              onClick={handleShareX}
              className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <XIcon />
              X
            </button>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-ink-100 text-ink-900 rounded-xl text-sm font-medium hover:bg-ink-200 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <LinkIcon className="w-4 h-4" />
              Copier le lien
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
