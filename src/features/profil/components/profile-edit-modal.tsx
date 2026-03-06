'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Check, User, Globe, Church } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { InputField } from '@/components/forms/input-field';
import { SelectField } from '@/components/forms/select-field';
import { PAYS_LIST, DIASPORA_TYPES, MINISTERES_OPTIONS } from '@/lib/utils/constants';
import { useParoisses } from '@/hooks/use-paroisses';
import { useUpdateProfile } from '@/features/profil/hooks/use-profil';
import { useToastStore } from '@/stores/toast.store';
import type { User as UserType, Ministere } from '@/types';

type TabKey = 'personnel' | 'diaspora' | 'paroisse';

const tabs: { key: TabKey; labelKey: string; icon: typeof User }[] = [
  { key: 'personnel', labelKey: 'personalTab', icon: User },
  { key: 'diaspora', labelKey: 'diasporaTab', icon: Globe },
  { key: 'paroisse', labelKey: 'parishTab', icon: Church },
];

interface ProfileEditModalProps {
  open: boolean;
  user: UserType;
  initialTab?: TabKey;
  onClose: () => void;
}

export function ProfileEditModal({ open, user, initialTab = 'personnel', onClose }: ProfileEditModalProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { data: paroissesData } = useParoisses();
  const { addToast } = useToastStore();
  const t = useTranslations('profil');
  const tc = useTranslations('common');
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  // Form state
  const [nomComplet, setNomComplet] = useState(user.nomComplet ?? '');
  const [email, setEmail] = useState(user.email ?? '');
  const [telephone, setTelephone] = useState(user.telephone ?? '');
  const [dateNaissance, setDateNaissance] = useState(user.dateNaissance ?? '');
  const [sexe, setSexe] = useState(user.sexe ?? '');
  const [typeDiaspora, setTypeDiaspora] = useState(user.typeDiaspora ?? '');
  const [paysResidence, setPaysResidence] = useState(user.paysResidence ?? '');
  const [ville, setVille] = useState(user.ville ?? '');
  const [paroisseOrigine, setParoisseOrigine] = useState(user.paroisseOrigine ?? '');
  const [ministeres, setMinisteres] = useState<Ministere[]>([...(user.ministeres ?? [])]);

  // Reset form when user changes or modal reopens
  useEffect(() => {
    if (open) {
      setNomComplet(user.nomComplet ?? '');
      setEmail(user.email ?? '');
      setTelephone(user.telephone ?? '');
      setDateNaissance(user.dateNaissance ?? '');
      setSexe(user.sexe ?? '');
      setTypeDiaspora(user.typeDiaspora ?? '');
      setPaysResidence(user.paysResidence ?? '');
      setVille(user.ville ?? '');
      setParoisseOrigine(user.paroisseOrigine ?? '');
      setMinisteres([...(user.ministeres ?? [])]);
      setActiveTab(initialTab);
    }
  }, [open, user, initialTab]);

  const toggleMinistere = (m: Ministere) => {
    setMinisteres((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleSave = () => {
    if (!nomComplet.trim()) {
      addToast(t('nameRequired'), 'error');
      return;
    }
    if (!email.trim()) {
      addToast(t('emailRequired'), 'error');
      return;
    }

    updateProfile(
      {
        nomComplet: nomComplet.trim(),
        email: email.trim(),
        telephone: telephone.trim() || undefined,
        dateNaissance: dateNaissance || undefined,
        sexe: sexe || undefined,
        typeDiaspora: typeDiaspora || undefined,
        paysResidence: paysResidence || undefined,
        ville: ville.trim() || undefined,
        paroisseOrigine: paroisseOrigine || undefined,
        ministeres,
      },
      {
        onSuccess: () => {
          addToast(t('profileUpdated'), 'success');
          onClose();
        },
        onError: () => {
          addToast(t('profileUpdateError'), 'error');
        },
      }
    );
  };

  if (!open) return null;

  const paysOptions = PAYS_LIST.map((p) => ({ value: p.value, label: `${p.flag} ${p.label}` }));
  const paroisseOptions = (paroissesData ?? []).map((p) => ({ value: p.slug, label: p.label }));
  const diasporaOptions = DIASPORA_TYPES.map((d) => ({ value: d.value, label: d.label }));
  const sexeOptions = [
    { value: 'homme', label: t('maleLabel') },
    { value: 'femme', label: t('femaleLabel') },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-[540px] flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-sage-400/10 px-6 py-4">
          <h2
            className="text-lg font-bold text-forest-900"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('editProfile')}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-50 hover:text-ink-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-sage-400/10 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'flex items-center gap-1.5 border-b-2 px-3 py-3 text-sm font-medium transition-colors',
                  activeTab === tab.key
                    ? 'border-forest-700 text-forest-900'
                    : 'border-transparent text-ink-400 hover:text-ink-600'
                )}
              >
                <Icon className="h-4 w-4" />
                {t(tab.labelKey)}
              </button>
            );
          })}
        </div>

        {/* Body - scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Tab: Personnel */}
          {activeTab === 'personnel' && (
            <div className="space-y-4">
              <InputField
                label={t('fullName')}
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
                placeholder="Jean-Paul Mbarga"
              />
              <InputField
                label={t('emailAddress')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@exemple.com"
              />
              <InputField
                label={t('phoneLabel')}
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
              <InputField
                label={t('birthDate')}
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
              />
              <SelectField
                label={t('genderLabel')}
                value={sexe}
                onChange={(value) => setSexe(value as 'homme' | 'femme')}
                options={sexeOptions}
              />
            </div>
          )}

          {/* Tab: Diaspora */}
          {activeTab === 'diaspora' && (
            <div className="space-y-4">
              <SelectField
                label={t('diasporaTypeLabel')}
                value={typeDiaspora}
                onChange={(value) => setTypeDiaspora(value as UserType['typeDiaspora'])}
                options={diasporaOptions}
              />
              <SelectField
                label={t('residenceCountryLabel')}
                value={paysResidence}
                onChange={(value) => setPaysResidence(value)}
                options={paysOptions}
              />
              <InputField
                label={t('cityInputLabel')}
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Paris"
              />
            </div>
          )}

          {/* Tab: Paroisse */}
          {activeTab === 'paroisse' && (
            <div className="space-y-5">
              <SelectField
                label={t('originParishLabel')}
                value={paroisseOrigine}
                onChange={(value) => setParoisseOrigine(value)}
                options={paroisseOptions}
              />
              <div>
                <p className="mb-2 text-sm font-medium text-ink-700">{t('ministriesLabel')}</p>
                <div className="flex flex-wrap gap-2">
                  {MINISTERES_OPTIONS.map((m) => {
                    const selected = ministeres.includes(m.value as Ministere);
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => toggleMinistere(m.value as Ministere)}
                        className={cn(
                          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all',
                          selected
                            ? 'border-forest-700 bg-forest-900/10 text-forest-900'
                            : 'border-ink-200 text-ink-500 hover:border-ink-300 hover:text-ink-700'
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {m.label}
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-sage-400/10 px-6 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
          >
            {tc('cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-lg',
              'disabled:opacity-60'
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {tc('saving')}
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                {tc('save')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
