'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CircleHelp,
  ChevronDown,
  Mail,
  MessageCircle,
  BookOpen,
  Heart,
  Church,
  Bell,
  User,
  CreditCard,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';

interface FAQItem {
  question: string;
  answer: string;
  icon: typeof BookOpen;
  iconColor: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Comment acceder aux meditations quotidiennes ?',
    answer:
      "Rendez-vous dans l'onglet Meditations depuis le menu principal. Vous y trouverez les meditations du jour classees par categorie (Foi, Priere, Famille, etc.). Vous pouvez lire, ecouter et partager chaque meditation.",
    icon: BookOpen,
    iconColor: 'text-forest-900',
  },
  {
    question: "Comment faire un don a l'eglise ?",
    answer:
      "Allez dans l'onglet Dons > Nouveau don. Choisissez une campagne, un montant et une methode de paiement (carte bancaire, mobile money, virement). Vous recevrez un recu par email apres votre don.",
    icon: Heart,
    iconColor: 'text-terra-600',
  },
  {
    question: 'Comment suivre les cultes en direct ?',
    answer:
      "L'onglet Cultes affiche les prochains cultes et retransmissions en direct. Cliquez sur un culte pour rejoindre le live, voir le programme ou acceder aux replays des cultes passes.",
    icon: Church,
    iconColor: 'text-gold-600',
  },
  {
    question: 'Comment gerer mes notifications ?',
    answer:
      "Depuis votre Profil > Preferences de notification, vous pouvez activer/desactiver les notifications par canal (email, push, SMS) et par type (meditations, evenements, anniversaires, etc.).",
    icon: Bell,
    iconColor: 'text-forest-700',
  },
  {
    question: 'Comment modifier mes informations personnelles ?',
    answer:
      "Sur votre page Profil, cliquez sur \"Modifier le profil\" ou sur le bouton \"Modifier\" dans chaque section (Personnel, Diaspora, Paroisse). Vos modifications sont enregistrees immediatement.",
    icon: User,
    iconColor: 'text-forest-900',
  },
  {
    question: 'Quels moyens de paiement sont acceptes ?',
    answer:
      'Nous acceptons les cartes bancaires (Visa, Mastercard), le Mobile Money (MTN, Orange), les virements bancaires et PayPal. Les dons sont securises et vous recevez un recu fiscal.',
    icon: CreditCard,
    iconColor: 'text-gold-600',
  },
];

export default function AidePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { addToast } = useToastStore();
  const [contactMessage, setContactMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      addToast('Veuillez saisir votre message', 'error');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setContactMessage('');
    addToast('Message envoye ! Nous vous repondrons sous 48h.', 'success');
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
          Aide & Support
        </h1>
        <p className="text-ink-500">Trouvez des reponses a vos questions</p>
      </div>

      {/* FAQ */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <CircleHelp className="h-5 w-5 text-gold-600" />
          Questions frequentes
        </h2>
        <div className="space-y-2">
          {faqItems.map((item, i) => {
            const Icon = item.icon;
            const isOpen = openIndex === i;
            return (
              <div key={i} className="rounded-xl border border-sage-400/10 overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-cream-50/30"
                >
                  <Icon className={cn('h-4 w-4 flex-shrink-0', item.iconColor)} />
                  <span className="flex-1 text-sm font-medium text-ink-900">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 flex-shrink-0 text-ink-400 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-sage-400/10 bg-cream-50/30 px-4 py-3">
                    <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <MessageCircle className="h-5 w-5 text-gold-600" />
          Nous contacter
        </h2>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
              <Mail className="h-4 w-4 text-forest-900" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Email</p>
              <p className="text-sm font-medium text-ink-900">support@diaspoeec.org</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
              <MessageCircle className="h-4 w-4 text-forest-900" />
            </div>
            <div>
              <p className="text-xs text-ink-500">Reponse sous</p>
              <p className="text-sm font-medium text-ink-900">48 heures</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 resize-none"
            placeholder="Decrivez votre probleme ou posez votre question..."
          />
          <button
            onClick={handleSendMessage}
            disabled={sending}
            className={cn(
              'flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]',
              'disabled:opacity-60'
            )}
          >
            {sending ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </div>
      </div>
    </div>
  );
}
