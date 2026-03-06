'use client';

import { useState, useEffect } from 'react';
import {
  Globe,
  Bell,
  Shield,
  Moon,
  Sun,
  Database,
  Key,
  ChevronDown,
  Check,
  Save,
  RotateCcw,
  Pencil,
  X,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useUIStore } from '@/stores/ui.store';
import { useSettings, useUpdateSettings } from '@/features/admin/hooks/use-admin';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { useTranslations } from 'next-intl';
import type { AppSettingsData } from '@/lib/api/admin.api';

/* ── Options for select items (keyed by apiKey) ── */
const selectOptionsByApiKey: Record<string, string[]> = {
  fuseauHoraire: [
    'Europe/Paris (UTC+1)',
    'Europe/London (UTC+0)',
    'Europe/Berlin (UTC+1)',
    'Africa/Douala (UTC+1)',
    'America/New_York (UTC-5)',
  ],
  deviseDefaut: ['EUR', 'USD', 'GBP', 'XAF', 'CHF'],
};

/* ── Section definitions ── */
interface SettingItem {
  labelKey: string;
  apiKey: keyof AppSettingsData;
  type: 'text' | 'select' | 'toggle' | 'status';
  descriptionKey?: string;
}

interface SettingSection {
  titleKey: string;
  icon: typeof Globe;
  iconBg: string;
  iconColor: string;
  items: SettingItem[];
}

const settingSections: SettingSection[] = [
  {
    titleKey: 'general',
    icon: Globe,
    iconBg: 'bg-sage-200',
    iconColor: 'text-forest-900',
    items: [
      { labelKey: 'communityName', apiKey: 'nomCommunaute', type: 'text' },
      { labelKey: 'defaultLanguage', apiKey: 'langueDefaut', type: 'select' },
      { labelKey: 'timezone', apiKey: 'fuseauHoraire', type: 'select' },
      { labelKey: 'maintenanceMode', apiKey: 'modeMaintenance', type: 'toggle', descriptionKey: 'maintenanceDesc' },
    ],
  },
  {
    titleKey: 'notifications',
    icon: Bell,
    iconBg: 'bg-gold-200/50',
    iconColor: 'text-gold-600',
    items: [
      { labelKey: 'pushNotifications', apiKey: 'notificationsPush', type: 'toggle' },
      { labelKey: 'welcomeEmail', apiKey: 'emailBienvenue', type: 'toggle' },
      { labelKey: 'eventReminders', apiKey: 'rappelsEvenements', type: 'toggle' },
      { labelKey: 'weeklySummary', apiKey: 'resumeHebdomadaire', type: 'toggle' },
    ],
  },
  {
    titleKey: 'security',
    icon: Shield,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    items: [
      { labelKey: 'twoFactorAuth', apiKey: 'doubleAuthentification', type: 'toggle' },
      { labelKey: 'sessionDuration', apiKey: 'dureeSession', type: 'select' },
      { labelKey: 'openRegistration', apiKey: 'inscriptionsOuvertes', type: 'toggle' },
    ],
  },
  {
    titleKey: 'donationsPayments',
    icon: Key,
    iconBg: 'bg-terra-500/10',
    iconColor: 'text-terra-600',
    items: [
      { labelKey: 'defaultCurrency', apiKey: 'deviseDefaut', type: 'select' },
      { labelKey: 'autoReceipts', apiKey: 'recusAutomatiques', type: 'toggle' },
    ],
  },
];

export default function AdminParametresPage() {
  const t = useTranslations('adminSettings');
  const tc = useTranslations('common');
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  const [localSettings, setLocalSettings] = useState<Partial<AppSettingsData>>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { addToast } = useToastStore();
  const { theme, setTheme } = useUIStore();
  const isDark = theme === 'dark';

  // Build translated select options
  const languageOptions = (t.raw('languageOptions') as string[]) ?? [];
  const sessionOptions = (t.raw('sessionOptions') as string[]) ?? [];

  const getSelectOptions = (apiKey: string): string[] => {
    if (apiKey === 'langueDefaut') return languageOptions;
    if (apiKey === 'dureeSession') return sessionOptions;
    return selectOptionsByApiKey[apiKey] ?? [];
  };

  // Sync local state from API data
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  /* ── Handlers ── */
  const getVal = (apiKey: keyof AppSettingsData) => {
    return localSettings[apiKey] ?? (settings ? settings[apiKey] : undefined);
  };

  const handleToggle = (apiKey: keyof AppSettingsData) => {
    setLocalSettings((prev) => ({ ...prev, [apiKey]: !prev[apiKey] }));
  };

  const startEditing = (apiKey: keyof AppSettingsData) => {
    setEditingKey(apiKey);
    setEditValue((getVal(apiKey) as string) ?? '');
  };

  const confirmEdit = () => {
    if (editingKey && editValue.trim()) {
      setLocalSettings((prev) => ({ ...prev, [editingKey]: editValue.trim() }));
    }
    setEditingKey(null);
  };

  const cancelEdit = () => setEditingKey(null);

  const handleSelectOption = (apiKey: keyof AppSettingsData, option: string) => {
    setLocalSettings((prev) => ({ ...prev, [apiKey]: option }));
    setOpenSelect(null);
  };

  const handleSave = async () => {
    try {
      await updateSettingsMutation.mutateAsync(localSettings);
      addToast(t('saveSuccess'), 'success');
    } catch {
      addToast(t('saveError'), 'error');
    }
  };

  const handleReset = () => {
    if (settings) setLocalSettings(settings);
    addToast(t('resetSuccess'), 'success');
  };

  const handleExport = () => addToast(t('exportInProgress'), 'info');

  const handleDangerResetConfirm = () => {
    setShowResetConfirm(false);
    addToast(t('databaseReset'), 'warning');
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1000px] p-4 md:p-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-[1000px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-1 text-sm text-ink-500">{t('subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-forest-900/20 bg-white px-4 py-2.5 text-sm font-medium text-forest-900 transition-all hover:bg-sage-200"
          >
            <RotateCcw className="h-4 w-4" />
            {t('reset')}
          </button>
          <button
            onClick={handleSave}
            disabled={updateSettingsMutation.isPending}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {tc('save')}
          </button>
        </div>
      </div>

      {/* ── Apparence (dark mode) ── */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-50 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-900/5">
            {isDark ? (
              <Moon className="h-[18px] w-[18px] text-ink-900" />
            ) : (
              <Sun className="h-[18px] w-[18px] text-gold-600" />
            )}
          </div>
          <h3 className="text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('appearance')}
          </h3>
        </div>
        <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-cream-50/50">
          <div>
            <p className="text-sm font-medium text-ink-900">{t('darkMode')}</p>
            <p className="text-xs text-ink-500">
              {isDark ? t('darkModeActive') : t('darkModeInactive')}
            </p>
          </div>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
              'relative h-6 w-[44px] flex-shrink-0 rounded-xl transition-colors duration-300',
              isDark ? 'bg-forest-700' : 'bg-ink-200'
            )}
          >
            <span
              className={cn(
                'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
                isDark && 'translate-x-[20px]'
              )}
            />
          </button>
        </div>
      </div>

      {/* ── Setting sections ── */}
      <div className="space-y-6">
        {settingSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.titleKey} className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
              {/* Section header */}
              <div className="flex items-center gap-3 border-b border-gray-50 px-6 py-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.iconBg}`}>
                  <Icon className={`h-[18px] w-[18px] ${section.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {t(section.titleKey)}
                </h3>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {section.items.map((item) => {
                  const isEditing = editingKey === item.apiKey;
                  const isSelectOpen = openSelect === item.apiKey;
                  const currentValue = getVal(item.apiKey);

                  return (
                    <div
                      key={item.labelKey}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-cream-50/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900">{t(item.labelKey)}</p>
                        {item.descriptionKey && <p className="text-xs text-ink-500">{t(item.descriptionKey)}</p>}
                      </div>

                      {/* Toggle */}
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => handleToggle(item.apiKey)}
                          className={cn(
                            'relative h-6 w-[44px] flex-shrink-0 rounded-xl transition-colors duration-300',
                            currentValue ? 'bg-forest-700' : 'bg-ink-200'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-300',
                              currentValue && 'translate-x-[20px]'
                            )}
                          />
                        </button>
                      )}

                      {/* Text (inline edit) */}
                      {item.type === 'text' && (
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                autoFocus
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') confirmEdit();
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                className="w-40 rounded-lg border border-forest-900/20 px-2.5 py-1 text-sm text-ink-900 outline-none focus:border-forest-700 focus:ring-1 focus:ring-forest-700/30"
                              />
                              <button
                                onClick={confirmEdit}
                                className="rounded-lg p-1 text-forest-700 transition hover:bg-forest-900/10"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="rounded-lg p-1 text-ink-400 transition hover:bg-ink-100"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(item.apiKey)}
                              className="group flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-ink-600 transition hover:bg-sage-100/50 hover:text-forest-900"
                            >
                              <span>{currentValue as string}</span>
                              <Pencil className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Select (dropdown) */}
                      {item.type === 'select' && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenSelect(isSelectOpen ? null : item.apiKey)}
                            className="flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-sm text-ink-600 transition hover:border-forest-900/20 hover:bg-sage-100/50 hover:text-forest-900"
                          >
                            <span>{currentValue as string}</span>
                            <ChevronDown
                              className={cn(
                                'h-3.5 w-3.5 text-ink-400 transition-transform',
                                isSelectOpen && 'rotate-180'
                              )}
                            />
                          </button>
                          {isSelectOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenSelect(null)} />
                              <div className="absolute left-0 sm:left-auto sm:right-0 z-20 mt-1 min-w-[180px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-forest-900/10 bg-white py-1 shadow-lg">
                                {getSelectOptions(item.apiKey).map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => handleSelectOption(item.apiKey, opt)}
                                    className={cn(
                                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-cream-50',
                                      currentValue === opt ? 'font-medium text-forest-900' : 'text-ink-600'
                                    )}
                                  >
                                    {currentValue === opt && <Check className="h-3.5 w-3.5 text-forest-700" />}
                                    <span className={currentValue === opt ? '' : 'pl-[22px]'}>{opt}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Danger zone ── */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-red-100 bg-red-50/50 px-6 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
            <Database className="h-[18px] w-[18px] text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-700" style={{ fontFamily: 'var(--font-heading)' }}>
            {t('dangerZone')}
          </h3>
        </div>
        <div className="divide-y divide-red-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-ink-900">{t('exportAllData')}</p>
              <p className="text-xs text-ink-500">{t('exportAllDataDesc')}</p>
            </div>
            <button
              onClick={handleExport}
              className="rounded-xl border-2 border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 transition-all hover:bg-ink-50"
            >
              {t('export')}
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-red-700">{t('resetDatabase')}</p>
              <p className="text-xs text-ink-500">{t('resetDatabaseDesc')}</p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
            >
              {t('reset')}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title={t('resetDatabaseConfirmTitle')}
        message={t('resetDatabaseConfirmMessage')}
        confirmLabel={t('reset')}
        cancelLabel={tc('cancel')}
        variant="danger"
        onConfirm={handleDangerResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />
    </section>
  );
}
