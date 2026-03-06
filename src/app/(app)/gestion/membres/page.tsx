'use client';

import { useState } from 'react';
import { Search, Eye, X, MapPin, Mail, Phone, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { getMembers } from '@/lib/api/members.api';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import type { User } from '@/types';

const statusColors: Record<string, string> = {
  actif: 'bg-green-50 text-green-700 border-green-200',
  inactif: 'bg-gray-50 text-gray-600 border-gray-200',
};

function GestionMembresContent() {
  const t = useTranslations('gestionMembres');
  const tc = useTranslations('common');
  const { data: membersData } = useQuery({ queryKey: ['gestion-members'], queryFn: () => getMembers({ role: 'fidele' }) });
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<User | null>(null);

  // Only show fideles (members of the zone)
  const members = membersData ?? [];

  const filtered = members.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.nomComplet.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.ville.toLowerCase().includes(q)
    );
  });

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
            placeholder={t('searchMember')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 flex flex-wrap gap-3">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {t('memberCount', { count: members.length })}
        </span>
        <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
          {t('activeCount', { count: members.filter((m) => m.statut === 'actif').length })}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-cream-50/50">
                <th className="px-4 py-3 text-left font-medium text-ink-500">{t('name')}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 sm:table-cell">{tc('email')}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 md:table-cell">{t('city')}</th>
                <th className="hidden px-4 py-3 text-left font-medium text-ink-500 lg:table-cell">{t('ministries')}</th>
                <th className="px-4 py-3 text-left font-medium text-ink-500">{tc('status')}</th>
                <th className="px-4 py-3 text-right font-medium text-ink-500">{tc('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((member, i) => (
                <tr
                  key={member.id}
                  className={`border-b border-gray-50 transition-colors hover:bg-sage-200/20 ${
                    i % 2 === 0 ? 'bg-cream-50/30' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{member.nomComplet}</p>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span className="text-ink-600">{member.email}</span>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <span className="flex items-center gap-1 text-ink-600">
                      <MapPin className="h-3 w-3" />
                      {member.ville}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {member.ministeres.slice(0, 2).map((m) => (
                        <span
                          key={m}
                          className="rounded-full bg-sage-200 px-2 py-0.5 text-xs font-medium capitalize text-forest-900"
                        >
                          {m}
                        </span>
                      ))}
                      {member.ministeres.length > 2 && (
                        <span className="rounded-full bg-ink-100 px-2 py-0.5 text-xs text-ink-500">
                          +{member.ministeres.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[member.statut] || 'bg-gray-50 text-gray-600'}`}>
                      {member.statut === 'actif' ? tc('active') : member.statut === 'inactif' ? tc('inactive') : member.statut}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setViewItem(member)}
                        className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setViewItem(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[500px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setViewItem(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            <h3
              className="mb-4 text-lg font-semibold text-ink-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {t('memberCard')}
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-900 text-lg font-semibold text-cream-100">
                  {viewItem.nomComplet
                    .split(' ')
                    .filter(Boolean)
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{viewItem.nomComplet}</p>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusColors[viewItem.statut]}`}>
                    {viewItem.statut === 'actif' ? tc('active') : viewItem.statut === 'inactif' ? tc('inactive') : viewItem.statut}
                  </span>
                </div>
              </div>

              <div className="h-px bg-ink-100" />

              <div>
                <p className="text-sm font-medium text-ink-500">{tc('email')}</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-900">
                  <Mail className="h-3.5 w-3.5 text-ink-400" />
                  {viewItem.email}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('phone')}</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-900">
                  <Phone className="h-3.5 w-3.5 text-ink-400" />
                  {viewItem.telephone}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('city')}</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-900">
                  <MapPin className="h-3.5 w-3.5 text-ink-400" />
                  {viewItem.ville}, {viewItem.paysResidence}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('originParish')}</p>
                <p className="text-sm text-ink-900">{viewItem.paroisseOrigine}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-ink-500">{t('ministries')}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {viewItem.ministeres.map((m) => (
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
              <div>
                <p className="text-sm font-medium text-ink-500">{t('baptized')}</p>
                <p className="text-sm text-ink-900">
                  {viewItem.baptise ? tc('yes') : tc('no')}
                  {viewItem.dateBapteme && ` (${new Date(viewItem.dateBapteme).toLocaleDateString('fr-FR')})`}
                </p>
              </div>
              <div className="flex gap-6">
                <div>
                  <p className="text-sm font-medium text-ink-500">{t('donations')}</p>
                  <p className="text-sm font-semibold text-forest-900">{viewItem.donsEffectues}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-500">{t('eventsAttended')}</p>
                  <p className="text-sm font-semibold text-forest-900">{viewItem.evenementsSuivis}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                {tc('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function GestionMembresPage() {
  return (
    <RoleGuard allowedRoles={['responsable_zone', 'admin']}>
      <GestionMembresContent />
    </RoleGuard>
  );
}
