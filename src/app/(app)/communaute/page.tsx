'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Users,
  MapPin,
  MessageCircle,
  X,
  Mail,
  Phone,
  Award,
  Loader2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getMembers } from '@/lib/api/members.api';
import { useAuthStore } from '@/stores/auth.store';
import { useCreateConversation } from '@/features/messages/hooks/use-messages';
import type { User } from '@/types';

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function CommunautePage() {
  const t = useTranslations('communaute');
  const tc = useTranslations('common');
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.user);
  const createConversation = useCreateConversation();

  const { data: members, isLoading } = useQuery({
    queryKey: ['communaute-members'],
    queryFn: () => getMembers({ statut: 'actif' }),
  });

  const [search, setSearch] = useState('');
  const [viewMember, setViewMember] = useState<User | null>(null);

  // Exclude current user from list
  const allMembers = (members ?? []).filter((m) => m.id !== currentUser?.id);

  const filtered = allMembers.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.nomComplet.toLowerCase().includes(q) ||
      m.ville.toLowerCase().includes(q) ||
      m.ministeres.some((min) => min.toLowerCase().includes(q))
    );
  });

  function handleSendMessage(member: User) {
    createConversation.mutate(member.id, {
      onSuccess: (conv) => {
        setViewMember(null);
        router.push(`/messages?conversation=${conv.id}`);
      },
    });
  }

  return (
    <section className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('pageTitle')}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          {t('pageSubtitle')}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          <Users className="mr-1 inline-block h-3 w-3" />
          {t('memberCount', { count: allMembers.length })}
        </span>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <Users className="mx-auto mb-3 h-12 w-12 text-ink-200" />
          <p className="text-sm text-ink-400">
            {search ? t('noResults') : t('noMembers')}
          </p>
        </div>
      ) : (
        /* Members Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="group cursor-pointer rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-forest-900/10"
              onClick={() => setViewMember(member)}
            >
              <div className="flex items-center gap-4">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.nomComplet}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest-900 text-sm font-semibold text-cream-100">
                    {getInitials(member.nomComplet)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink-900">
                    {member.nomComplet}
                  </p>
                  <p className="flex items-center gap-1 truncate text-xs text-ink-500">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {member.ville}{member.paysResidence ? `, ${member.paysResidence}` : ''}
                  </p>
                </div>
              </div>

              {/* Ministries */}
              {member.ministeres.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {member.ministeres.slice(0, 3).map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-sage-200 px-2 py-0.5 text-[11px] font-medium capitalize text-forest-900"
                    >
                      {m}
                    </span>
                  ))}
                  {member.ministeres.length > 3 && (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] text-ink-500">
                      +{member.ministeres.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Quick message button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendMessage(member);
                }}
                disabled={createConversation.isPending}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-forest-900/10 bg-cream-50 py-2 text-xs font-medium text-forest-900 transition hover:bg-forest-900 hover:text-white disabled:opacity-50"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                {t('sendMessage')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Member Profile Modal */}
      {viewMember && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewMember(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[440px] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Header with avatar */}
            <div className="relative bg-forest-900 px-6 pb-12 pt-6 text-center">
              <button
                onClick={() => setViewMember(null)}
                className="absolute right-3 top-3 rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-2xl font-bold text-white">
                {viewMember.avatarUrl ? (
                  <img
                    src={viewMember.avatarUrl}
                    alt={viewMember.nomComplet}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  getInitials(viewMember.nomComplet)
                )}
              </div>
              <p className="mt-3 text-lg font-semibold text-white">
                {viewMember.nomComplet}
              </p>
              <p className="text-sm text-white/60">
                {viewMember.ville}{viewMember.paysResidence ? `, ${viewMember.paysResidence}` : ''}
              </p>
            </div>

            {/* Info */}
            <div className="space-y-4 p-6">
              {viewMember.paroisseOrigine && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t('originParish')}</p>
                  <p className="mt-0.5 text-sm text-ink-900">{viewMember.paroisseOrigine}</p>
                </div>
              )}

              {viewMember.ministeres.length > 0 && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t('ministries')}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {viewMember.ministeres.map((m) => (
                      <span
                        key={m}
                        className="flex items-center gap-1 rounded-full bg-sage-200 px-2.5 py-0.5 text-xs font-medium capitalize text-forest-900"
                      >
                        <Award className="h-3 w-3" />
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t('donations')}</p>
                  <p className="mt-0.5 text-sm font-semibold text-forest-900">{viewMember.donsEffectues}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-400">{t('events')}</p>
                  <p className="mt-0.5 text-sm font-semibold text-forest-900">{viewMember.evenementsSuivis}</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setViewMember(null)}
                  className="flex-1 rounded-xl border border-ink-200 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
                >
                  {tc('close')}
                </button>
                <button
                  onClick={() => handleSendMessage(viewMember)}
                  disabled={createConversation.isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-forest-900 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800 disabled:opacity-50"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t('sendMessage')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
