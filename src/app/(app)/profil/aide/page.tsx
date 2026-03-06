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
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';

interface FAQItem {
  question: string;
  answer: string;
  icon: typeof BookOpen;
  iconColor: string;
}

export default function AidePage() {
  const t = useTranslations('aide');
  const tp = useTranslations('profil');

  const faqItems: FAQItem[] = [
    {
      question: t('faq1q'),
      answer: t('faq1a'),
      icon: BookOpen,
      iconColor: 'text-forest-900',
    },
    {
      question: t('faq2q'),
      answer: t('faq2a'),
      icon: Heart,
      iconColor: 'text-terra-600',
    },
    {
      question: t('faq3q'),
      answer: t('faq3a'),
      icon: Church,
      iconColor: 'text-gold-600',
    },
    {
      question: t('faq4q'),
      answer: t('faq4a'),
      icon: Bell,
      iconColor: 'text-forest-700',
    },
    {
      question: t('faq5q'),
      answer: t('faq5a'),
      icon: User,
      iconColor: 'text-forest-900',
    },
    {
      question: t('faq6q'),
      answer: t('faq6a'),
      icon: CreditCard,
      iconColor: 'text-gold-600',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { addToast } = useToastStore();
  const [contactMessage, setContactMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!contactMessage.trim()) {
      addToast(t('enterMessage'), 'error');
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setContactMessage('');
    addToast(t('messageSent'), 'success');
  };

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/profil"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {tp('backToProfile')}
        </Link>
        <h1
          className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('title')}
        </h1>
        <p className="text-ink-500">{t('subtitle')}</p>
      </div>

      {/* FAQ */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <CircleHelp className="h-5 w-5 text-gold-600" />
          {t('faq')}
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
          {t('contactUs')}
        </h2>

        <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
              <Mail className="h-4 w-4 text-forest-900" />
            </div>
            <div>
              <p className="text-xs text-ink-500">{t('emailLabel')}</p>
              <p className="text-sm font-medium text-ink-900">support@diaspoeec.org</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
              <MessageCircle className="h-4 w-4 text-forest-900" />
            </div>
            <div>
              <p className="text-xs text-ink-500">{t('responseTime')}</p>
              <p className="text-sm font-medium text-ink-900">{t('responseDelay')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            value={contactMessage}
            onChange={(e) => setContactMessage(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-all focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10 resize-none"
            placeholder={t('messagePlaceholder')}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending}
            className={cn(
              'flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02]',
              'disabled:opacity-60'
            )}
          >
            {sending ? t('sending') : t('sendMessage')}
          </button>
        </div>
      </div>
    </div>
  );
}
