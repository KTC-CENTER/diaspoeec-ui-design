'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Users,
  ExternalLink,
  CalendarPlus,
  Send,
  Loader2,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useEvenement } from '@/features/evenements/hooks/use-evenements';
import { ProgrammeList } from '@/features/evenements/components/programme-list';
import { RSVPForm } from '@/features/evenements/components/rsvp-form';
import { useToastStore } from '@/stores/toast.store';

const typeGradients: Record<string, string> = {
  culte: 'from-forest-900 via-forest-700 to-sage-400',
  conference: 'from-gold-600 via-terra-600 to-forest-900',
  retraite: 'from-sage-400 to-forest-700',
  formation: 'from-terra-600 to-gold-500',
  jeunesse: 'from-forest-700 via-sage-400 to-forest-900',
};

const typeLabels: Record<string, string> = {
  culte: 'Culte',
  conference: 'Conference',
  retraite: 'Retraite',
  formation: 'Formation',
  jeunesse: 'Jeunesse',
};

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

const initialComments = [
  { initials: 'MF', nom: 'Marie', texte: "Hate d'y etre !", gradient: 'from-gold-600 to-gold-400' },
  { initials: 'SB', nom: 'Samuel', texte: 'Je viens avec ma famille', gradient: 'from-forest-900 to-sage-400' },
  { initials: 'PE', nom: 'Paul', texte: "Quelqu'un propose du covoiturage depuis le 13e ?", gradient: 'from-terra-600 to-gold-600' },
];

export default function EvenementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: evenement, isLoading } = useEvenement(id);
  const { addToast } = useToastStore();
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(initialComments);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  if (!evenement) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="font-heading text-2xl font-bold text-ink-900">
          Evenement introuvable
        </h2>
        <p className="mt-2 text-ink-500">
          Cet evenement n&apos;existe pas ou a ete supprime.
        </p>
        <Link
          href="/evenements"
          className="mt-4 inline-flex items-center gap-2 text-forest-700 hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux evenements
        </Link>
      </div>
    );
  }

  const gradient = typeGradients[evenement.type] || typeGradients.culte;
  const dateFormatted = formatDate(evenement.date, 'EEEE dd MMMM yyyy');
  const timeStart = formatDate(evenement.date, 'HH:mm');
  const timeEnd = evenement.heureFin
    ? formatDate(evenement.heureFin, 'HH:mm')
    : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleShareWhatsApp = () => {
    const text = `${evenement.titre} - ${dateFormatted}\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  const handleShareX = () => {
    const text = `${evenement.titre} - ${dateFormatted}`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,
      '_blank'
    );
  };

  // Participant avatars for display
  const avatarData = [
    { initials: 'MC', gradient: 'from-forest-900 to-sage-400' },
    { initials: 'SB', gradient: 'from-gold-600 to-gold-400' },
    { initials: 'PE', gradient: 'from-terra-600 to-gold-600' },
    { initials: 'JA', gradient: 'from-forest-700 to-forest-900' },
    { initials: 'EN', gradient: 'from-sage-400 to-forest-900' },
    { initials: 'DN', gradient: 'from-gold-400 to-terra-600' },
    { initials: 'RM', gradient: 'from-forest-900 to-forest-700' },
    { initials: 'AB', gradient: 'from-terra-600 to-gold-600' },
  ];

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments((prev) => [
      ...prev,
      {
        initials: 'JP',
        nom: 'Jean-Paul',
        texte: commentText.trim(),
        gradient: 'from-forest-700 to-forest-900',
      },
    ]);
    setCommentText('');
    addToast('Commentaire ajoute', 'success');
  };

  const handleAddToCalendar = () => {
    const start = new Date(evenement.date);
    const end = evenement.heureFin ? new Date(evenement.heureFin) : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:${evenement.titre}`,
      `LOCATION:${evenement.lieu}`,
      `DESCRIPTION:${evenement.description?.slice(0, 200) || ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${evenement.titre.replace(/\s+/g, '-')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Evenement ajoute a votre calendrier', 'success');
  };

  return (
    <div className="max-w-5xl">
      {/* Back button */}
      <div className="px-4 md:px-8 pt-4">
        <Link
          href="/evenements"
          className="flex items-center gap-2 text-forest-900 font-medium hover:text-forest-700 transition text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Evenements
        </Link>
      </div>

      {/* Hero with african pattern */}
      <div
        className={cn(
          'mx-4 md:mx-8 rounded-2xl overflow-hidden relative bg-gradient-to-br p-8 md:p-12 mb-6',
          'animate-[fade-up_0.5s_ease-out_both]',
          gradient
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 20L20 40L0 20Z' fill='none' stroke='%2395D5B2' stroke-width='0.5' opacity='0.2'/%3E%3C/svg%3E")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 to-transparent" />
        <div className="relative z-10">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full border border-white/20">
            {typeLabels[evenement.type]}
          </span>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mt-4 leading-tight">
            {evenement.titre}
          </h1>
        </div>
        {/* Decorative element */}
        <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
          <svg viewBox="0 0 80 80"><path d="M40 0L50 30L80 40L50 50L40 80L30 50L0 40L30 30Z" fill="white"/></svg>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8">
        {/* Info cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 animate-[fade-up_0.5s_ease-out_0.1s_both]">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <CalendarDays className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {formatDate(evenement.date, 'EEEE')}
            </p>
            <p className="text-xs text-ink-600">
              {formatDate(evenement.date, 'dd MMMM yyyy')}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <Clock className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {timeStart}{timeEnd ? ` - ${timeEnd}` : ''}
            </p>
            <p className="text-xs text-ink-600">
              {timeEnd ? 'Duree du culte' : 'Heure de debut'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <MapPin className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {evenement.lieu.split(',')[0]}
            </p>
            <p className="text-xs text-ink-600">
              {evenement.lieu.split(',').slice(1).join(',').trim() || 'Voir adresse'}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-sage-200/30 text-center">
            <Users className="w-6 h-6 text-forest-900 mx-auto mb-2" />
            <p className="text-sm font-semibold text-ink-900">
              {evenement.participantsInscrits} inscrits
            </p>
            <p className="text-xs text-ink-600">
              {evenement.maxParticipants
                ? `${evenement.maxParticipants - evenement.participantsInscrits} places restantes`
                : 'Places illimitees'}
            </p>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 overflow-hidden mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <div className="h-48 bg-gradient-to-br from-sage-200 via-sage-400/30 to-cream-100 relative flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-forest-900/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-forest-900" />
              </div>
              <p className="text-sm text-ink-600">{evenement.lieu}</p>
            </div>
            {/* Decorative map lines */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/4 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute top-1/2 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute top-3/4 left-0 right-0 h-px bg-forest-900" />
              <div className="absolute left-1/4 top-0 bottom-0 w-px bg-forest-900" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-forest-900" />
              <div className="absolute left-3/4 top-0 bottom-0 w-px bg-forest-900" />
            </div>
          </div>
          <div className="p-4 flex justify-center">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(evenement.lieu)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-forest-900 font-medium text-sm hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Voir sur Google Maps
            </a>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.2s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            A propos de cet evenement
          </h2>
          <p className="text-ink-600 leading-relaxed mb-4 whitespace-pre-line">
            {evenement.description}
          </p>

          {/* Programme inline */}
          {evenement.programme && evenement.programme.length > 0 && (
            <>
              <h3 className="font-heading font-bold text-ink-900 mb-3">Programme</h3>
              <div className="space-y-3">
                {evenement.programme.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-sm font-semibold text-forest-900 bg-sage-200 px-2 py-0.5 rounded-md whitespace-nowrap">
                      {item.heure}
                    </span>
                    <span className="text-ink-600 text-sm">{item.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* RSVP */}
        <div className="mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
          <RSVPForm eventId={evenement.id} />
        </div>

        {/* Attendees */}
        {evenement.participantsInscrits > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
            <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
              Participants ({evenement.participantsInscrits})
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {avatarData.slice(0, Math.min(8, evenement.participantsInscrits)).map((avatar, i) => (
                <div key={i} className="flex flex-col items-center flex-shrink-0">
                  <div className={cn(
                    'w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold',
                    avatar.gradient
                  )}>
                    {avatar.initials}
                  </div>
                  <span className="text-[10px] text-ink-600 mt-1">
                    {avatar.initials.charAt(0)}.
                  </span>
                </div>
              ))}
              {evenement.participantsInscrits > 8 && (
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-ink-200 flex items-center justify-center text-ink-600 text-xs font-bold">
                    +{evenement.participantsInscrits - 8}
                  </div>
                  <span className="text-[10px] text-ink-600 mt-1">autres</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.3s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            Partager
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

        {/* Comments */}
        <div className="bg-white rounded-2xl shadow-sm border border-sage-200/30 p-6 mb-8 animate-[fade-up_0.5s_ease-out_0.4s_both]">
          <h2 className="font-heading text-xl font-bold text-forest-900 mb-4">
            Commentaires ({evenement.commentCount})
          </h2>
          {evenement.commentCount === 0 ? (
            <p className="text-sm text-ink-500 text-center py-4">
              Aucun commentaire pour le moment. Soyez le premier !
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <div className={cn(
                    'w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold flex-shrink-0',
                    comment.gradient
                  )}>
                    {comment.initials}
                  </div>
                  <div className="flex-1 bg-cream-50 rounded-xl p-3">
                    <p className="text-sm font-semibold text-ink-900 mb-0.5">{comment.nom}</p>
                    <p className="text-sm text-ink-600">{comment.texte}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              placeholder="Ajouter un commentaire..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-ink-200 text-sm focus:border-forest-900 focus:ring-2 focus:ring-sage-200 outline-none"
            />
            <button
              onClick={handleAddComment}
              className="px-4 py-2.5 bg-forest-900 text-white rounded-xl text-sm font-medium hover:bg-forest-700 transition hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Add to calendar */}
        <button
          onClick={handleAddToCalendar}
          className="w-full md:w-auto px-6 py-3.5 bg-white border-2 border-forest-900 text-forest-900 font-semibold rounded-xl hover:bg-forest-900 hover:text-white transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 animate-[fade-up_0.5s_ease-out_0.4s_both]"
        >
          <CalendarPlus className="w-5 h-5" />
          Ajouter au calendrier
        </button>
      </div>
    </div>
  );
}
