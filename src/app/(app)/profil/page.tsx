'use client';

import { useState } from 'react';
import { BookOpen, Globe, Church, Loader2, PenLine } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatParoisse } from '@/lib/utils/format';
import { useProfile, useProfileStats } from '@/features/profil/hooks/use-profil';
import { ProfileHeader } from '@/features/profil/components/profile-header';
import { ProfileStats } from '@/features/profil/components/profile-stats';
import { ProfileInfoSection } from '@/features/profil/components/profile-info-section';
import { ProfileEditModal } from '@/features/profil/components/profile-edit-modal';
import { SettingsList } from '@/features/profil/components/settings-list';
import { PAYS_LIST } from '@/lib/utils/constants';

function getPaysLabel(code: string): string {
  return PAYS_LIST.find((p) => p.value === code)?.label || code;
}

const ministereColors: Record<string, string> = {
  chorale: 'bg-forest-900/10 text-forest-900',
  jeunesse: 'bg-gold-600/10 text-gold-600 border border-gold-600/20',
  evangelisation: 'bg-terra-600/10 text-terra-600 border border-terra-600/20',
  diaconie: 'bg-forest-900/10 text-forest-900',
  enseignement: 'bg-gold-600/10 text-gold-600 border border-gold-600/20',
  priere: 'bg-terra-600/10 text-terra-600 border border-terra-600/20',
};

const ministereLabels: Record<string, string> = {
  chorale: 'Chorale',
  jeunesse: 'Jeunesse',
  diaconie: 'Diaconie',
  enseignement: 'Enseignement',
  priere: 'Priere',
  evangelisation: 'Evangelisation',
};

type EditTab = 'personnel' | 'diaspora' | 'paroisse';

export default function ProfilPage() {
  const { user } = useProfile();
  const { data: readingStats, isLoading: readingLoading } = useProfileStats();
  const [editOpen, setEditOpen] = useState(false);
  const [editTab, setEditTab] = useState<EditTab>('personnel');

  const openEdit = (tab: EditTab = 'personnel') => {
    setEditTab(tab);
    setEditOpen(true);
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
      </div>
    );
  }

  // Build info sections
  const personalInfo = [
    { label: 'Email', value: user.email, badge: user.emailVerified ? 'Verifie' : undefined, icon: 'mail' },
    { label: 'Telephone', value: user.telephone || 'Non renseigne', icon: 'phone' },
    { label: 'Date de naissance', value: formatDate(user.dateNaissance, 'dd MMMM yyyy'), icon: 'calendar' },
    { label: 'Sexe', value: user.sexe === 'homme' ? 'Homme' : 'Femme', icon: 'user-circle' },
  ];

  const diasporaInfo = [
    {
      label: 'Type',
      value:
        user.typeDiaspora === 'etudiante'
          ? 'Etudiante'
          : user.typeDiaspora === 'professionnelle'
            ? 'Professionnelle'
            : user.typeDiaspora === 'familiale'
              ? 'Familiale'
              : 'Missionnaire',
    },
    { label: 'Pays', value: getPaysLabel(user.paysResidence) },
    { label: 'Ville', value: user.ville },
    { label: 'Depuis', value: '2018' },
  ];

  return (
    <div>
      {/* Profile header */}
      <ProfileHeader user={user} onEdit={() => openEdit('personnel')} />

      {/* Stats Row */}
      <div className="mt-6">
        <ProfileStats user={user} />
      </div>

      {/* Personal info */}
      <div className="mt-5">
        <ProfileInfoSection
          title="Informations personnelles"
          items={personalInfo}
          sectionIcon="user"
          onEdit={() => openEdit('personnel')}
        />
      </div>

      {/* Diaspora info */}
      <div className="mt-5">
        <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="flex items-center gap-2 text-lg font-bold text-forest-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Globe className="h-5 w-5 text-gold-600" />
              Informations Diaspora
            </h2>
            <button
              onClick={() => openEdit('diaspora')}
              className="flex items-center gap-1 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
            >
              <PenLine className="h-3.5 w-3.5" />
              Modifier
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {diasporaInfo.map((item, i) => (
              <div key={i} className="rounded-xl bg-cream-50/50 p-3">
                <p className="mb-0.5 text-xs text-ink-500">{item.label}</p>
                <p className="text-sm font-semibold text-ink-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Church info */}
      <div className="mt-5">
        <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2
              className="flex items-center gap-2 text-lg font-bold text-forest-900"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <Church className="h-5 w-5 text-gold-600" />
              Informations Paroisse
            </h2>
            <button
              onClick={() => openEdit('paroisse')}
              className="flex items-center gap-1 text-sm font-medium text-forest-700 transition-colors hover:text-forest-900"
            >
              <PenLine className="h-3.5 w-3.5" />
              Modifier
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
              <svg className="h-4 w-4 flex-shrink-0 text-ink-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <div>
                <p className="text-xs text-ink-500">Paroisse d&apos;origine</p>
                <p className="text-sm font-semibold text-ink-900">{formatParoisse(user.paroisseOrigine)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-cream-50/50 p-3">
              <svg className="h-4 w-4 flex-shrink-0 text-ink-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 14.69c1.47 0 2.67-1.22 2.67-2.7 0-.77-.38-1.51-1.15-2.13S12.79 8.4 12.56 7.5c-.23 0.89-.76 1.84-1.52 2.46S10 11.22 10 12c0 1.48 1.15 2.7 2.56 2.7z"/><path d="M17 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S15.29 6.75 15 5.3c-.29 1.45-1.14 2.84-2.29 3.76S11 11.1 11 12.25c0 2.22 1.8 4.05 4 4.05z"/></svg>
              <div>
                <p className="text-xs text-ink-500">Baptise</p>
                <p className="text-sm font-semibold text-ink-900">
                  {user.baptise ? 'Oui' : 'Non'}
                  {user.baptise && user.dateBapteme && (
                    <span className="font-normal text-ink-500"> ({formatDate(user.dateBapteme, 'dd MMMM yyyy')})</span>
                  )}
                </p>
              </div>
            </div>
            {/* Ministry chips */}
            {user.ministeres && user.ministeres.length > 0 && (
              <div>
                <p className="mb-2 pl-1 text-xs text-ink-500">Ministeres</p>
                <div className="flex flex-wrap gap-2">
                  {user.ministeres.map((m) => (
                    <span
                      key={m}
                      className={cn(
                        'rounded-full px-4 py-1.5 text-sm font-medium',
                        ministereColors[m] || 'bg-forest-900/10 text-forest-900'
                      )}
                    >
                      {ministereLabels[m] || m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reading Stats */}
      <div className="mt-5">
        <div className="rounded-2xl border border-sage-400/10 bg-white p-5 shadow-sm md:p-6">
          <h2
            className="mb-4 flex items-center gap-2 text-lg font-bold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <BookOpen className="h-5 w-5 text-gold-600" />
            Guide Biblique
          </h2>
          {readingLoading ? (
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 rounded-xl shimmer-bg" />
              ))}
            </div>
          ) : readingStats ? (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-gradient-to-b from-forest-900/5 to-transparent p-3 text-center">
                <p
                  className="text-2xl font-bold text-forest-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {readingStats.plansCompletes}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">Plans completes</p>
              </div>
              <div className="rounded-xl bg-gradient-to-b from-terra-600/5 to-transparent p-3 text-center">
                <p
                  className="flex items-center justify-center gap-1 text-2xl font-bold text-terra-600"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {readingStats.joursConsecutifs}
                  {readingStats.joursConsecutifs > 2 && (
                    <span className="animate-[flicker_0.8s_ease-in-out_infinite] text-base">&#128293;</span>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">Jours consecutifs</p>
              </div>
              <div className="rounded-xl bg-gradient-to-b from-gold-600/5 to-transparent p-3 text-center">
                <p
                  className="text-2xl font-bold text-gold-600"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {readingStats.versetsAnnotes}
                </p>
                <p className="mt-0.5 text-xs text-ink-500">Versets annotes</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Settings */}
      <div className="mt-5">
        <SettingsList />
      </div>

      {/* Edit Profile Modal */}
      <ProfileEditModal
        open={editOpen}
        user={user}
        initialTab={editTab}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
