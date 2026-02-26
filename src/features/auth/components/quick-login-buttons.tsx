'use client';

import { useState } from 'react';
import { Shield, User, Loader2, Zap, BookOpen, Users } from 'lucide-react';
import { useLogin, DEMO_ACCOUNTS } from '@/features/auth/hooks/use-auth';
import type { LucideIcon } from 'lucide-react';

type AccountKey = keyof typeof DEMO_ACCOUNTS;

interface QuickButton {
  key: AccountKey;
  icon: LucideIcon;
  iconColor: string;
  labelColor: string;
  subColor: string;
  gradient: string;
}

const buttons: QuickButton[] = [
  {
    key: 'admin',
    icon: Shield,
    iconColor: 'text-gold-200',
    labelColor: 'text-white',
    subColor: 'text-white/60',
    gradient: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)',
  },
  {
    key: 'pasteur',
    icon: BookOpen,
    iconColor: 'text-white',
    labelColor: 'text-white',
    subColor: 'text-white/60',
    gradient: 'linear-gradient(135deg, #9C4221 0%, #C2704E 100%)',
  },
  {
    key: 'responsable',
    icon: Users,
    iconColor: 'text-white',
    labelColor: 'text-white',
    subColor: 'text-white/60',
    gradient: 'linear-gradient(135deg, #52796F 0%, #84A98C 100%)',
  },
  {
    key: 'user',
    icon: User,
    iconColor: 'text-forest-900',
    labelColor: 'text-forest-900',
    subColor: 'text-forest-900/60',
    gradient: 'linear-gradient(135deg, #D4A017 0%, #F4D35E 100%)',
  },
];

export function QuickLoginButtons() {
  const { mutate: login, isPending } = useLogin();
  const [loadingAccount, setLoadingAccount] = useState<AccountKey | null>(null);

  const handleQuickLogin = (accountKey: AccountKey) => {
    setLoadingAccount(accountKey);
    const account = DEMO_ACCOUNTS[accountKey];
    login(
      { email: account.email, password: account.password },
      { onSettled: () => setLoadingAccount(null) }
    );
  };

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: 'linear-gradient(135deg, rgba(27,67,50,0.04) 0%, rgba(212,160,23,0.06) 100%)',
        border: '1px dashed rgba(27,67,50,0.2)',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-gold-600" />
        <span className="text-xs font-semibold text-ink-600 uppercase tracking-wider">
          Connexion rapide
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {buttons.map((btn) => {
          const Icon = btn.icon;
          const account = DEMO_ACCOUNTS[btn.key];
          return (
            <button
              key={btn.key}
              type="button"
              disabled={isPending}
              onClick={() => handleQuickLogin(btn.key)}
              className="flex flex-col items-center gap-2 py-3 px-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: btn.gradient,
                borderColor: 'transparent',
              }}
            >
              {loadingAccount === btn.key ? (
                <Loader2 className={`w-5 h-5 ${btn.labelColor} animate-spin`} />
              ) : (
                <Icon className={`w-5 h-5 ${btn.iconColor}`} />
              )}
              <div className="text-center">
                <p className={`text-sm font-semibold ${btn.labelColor}`}>{account.label}</p>
                <p className={`text-[10px] ${btn.subColor} mt-0.5`}>{account.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
