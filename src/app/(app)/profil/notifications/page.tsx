'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Mail,
  Bell,
  Smartphone,
  BookHeart,
  CalendarDays,
  BookOpen,
  Cake,
  HeartHandshake,
  Radio,
  MessageCircle,
  BarChart3,
  Send,
  ListChecks,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative h-6 w-[44px] cursor-pointer rounded-xl transition-colors duration-300',
        enabled ? 'bg-forest-700' : 'bg-gray-300'
      )}
    >
      <span
        className={cn(
          'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
          enabled && 'translate-x-5'
        )}
      />
    </button>
  );
}

export default function NotificationPrefsPage() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Channel prefs
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  // Type prefs
  const [types, setTypes] = useState({
    nouvelleMeditation: true,
    rappelEvenement: true,
    rappelLecture: true,
    anniversaire: true,
    confirmationDon: false,
    culteEnDirect: true,
    reponseCommentaire: true,
    resumeHebdo: true,
  });

  const toggleType = (key: keyof typeof types) => {
    setTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const typeItems: { key: keyof typeof types; label: string; icon: typeof BookHeart; iconColor: string }[] = [
    {
      key: 'nouvelleMeditation',
      label: 'Nouvelles meditations',
      icon: BookHeart,
      iconColor: 'text-forest-900',
    },
    {
      key: 'rappelEvenement',
      label: "Rappels d'evenements",
      icon: CalendarDays,
      iconColor: 'text-gold-600',
    },
    {
      key: 'rappelLecture',
      label: 'Rappels de lecture biblique',
      icon: BookOpen,
      iconColor: 'text-forest-900',
    },
    {
      key: 'anniversaire',
      label: 'Anniversaires',
      icon: Cake,
      iconColor: 'text-gold-600',
    },
    {
      key: 'confirmationDon',
      label: 'Dons et campagnes',
      icon: HeartHandshake,
      iconColor: 'text-terra-600',
    },
    {
      key: 'culteEnDirect',
      label: 'Cultes en direct',
      icon: Radio,
      iconColor: 'text-red-500',
    },
    {
      key: 'reponseCommentaire',
      label: 'Commentaires et reponses',
      icon: MessageCircle,
      iconColor: 'text-forest-700',
    },
    {
      key: 'resumeHebdo',
      label: 'Resume hebdomadaire',
      icon: BarChart3,
      iconColor: 'text-gold-600',
    },
  ];

  return (
    <div>
      {/* Header with back */}
      <div className="mb-8">
        <Link
          href="/notifications"
          className="group mb-4 inline-flex items-center gap-2 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Retour aux notifications
        </Link>
        <h1
          className="mb-1 text-3xl font-bold text-forest-900 md:text-4xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Preferences de notification
        </h1>
        <p className="text-ink-500">Choisissez comment vous souhaitez etre notifie</p>
      </div>

      {/* Notification Channels */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <Send className="h-5 w-5 text-gold-600" />
          Canaux de notification
        </h2>
        <div className="space-y-4">
          {/* Email */}
          <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
                <Mail className="h-4 w-4 text-forest-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">Emails</p>
                <p className="text-xs text-ink-500">Recevez les notifications par email</p>
              </div>
            </div>
            <Toggle enabled={emailEnabled} onChange={setEmailEnabled} />
          </div>
          {/* Push */}
          <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
                <Bell className="h-4 w-4 text-forest-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">Notifications push</p>
                <p className="text-xs text-ink-500">Notifications sur votre appareil</p>
              </div>
            </div>
            <Toggle enabled={pushEnabled} onChange={setPushEnabled} />
          </div>
          {/* SMS */}
          <div className="flex items-center justify-between rounded-xl bg-cream-50/50 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-900/10">
                <Smartphone className="h-4 w-4 text-forest-900" />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900">SMS</p>
                <p className="text-xs text-ink-500">Notifications par message texte</p>
              </div>
            </div>
            <Toggle enabled={smsEnabled} onChange={setSmsEnabled} />
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="mb-6 rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
        <h2
          className="mb-5 flex items-center gap-2 text-lg font-bold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          <ListChecks className="h-5 w-5 text-gold-600" />
          Types de notification
        </h2>
        <div className="space-y-1">
          {typeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between rounded-xl px-2 py-3 transition-colors hover:bg-cream-50/30"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn('h-4 w-4', item.iconColor)} />
                  <span className="text-sm font-medium text-ink-900">{item.label}</span>
                </div>
                <Toggle
                  enabled={types[item.key]}
                  onChange={() => toggleType(item.key)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-10 py-3.5 font-semibold text-white shadow-lg shadow-forest-900/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-forest-900/30 md:w-auto',
          'disabled:opacity-60'
        )}
      >
        {saving ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Enregistrement...
          </>
        ) : saved ? (
          <>
            <Check className="h-5 w-5" />
            Preferences enregistrees !
          </>
        ) : (
          <>
            <Check className="h-5 w-5" />
            Enregistrer les preferences
          </>
        )}
      </button>
    </div>
  );
}
