'use client';

import { useState } from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useUIStore } from '@/stores/ui.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';

/* ── Options for select items ── */
const selectOptions: Record<string, string[]> = {
  'Langue par defaut': ['Francais', 'English', 'Deutsch', 'Espanol'],
  'Fuseau horaire': [
    'Europe/Paris (UTC+1)',
    'Europe/London (UTC+0)',
    'Europe/Berlin (UTC+1)',
    'Africa/Douala (UTC+1)',
    'America/New_York (UTC-5)',
  ],
  'Duree de session': ['1 heure', '4 heures', '12 heures', '24 heures', '7 jours'],
  'Devise par defaut': ['EUR', 'USD', 'GBP', 'XAF', 'CHF'],
};

/* ── Section definitions ── */
interface SettingItem {
  label: string;
  value: string | boolean;
  type: 'text' | 'select' | 'toggle' | 'status';
  description?: string;
}

interface SettingSection {
  title: string;
  icon: typeof Globe;
  iconBg: string;
  iconColor: string;
  items: SettingItem[];
}

const settingSections: SettingSection[] = [
  {
    title: 'General',
    icon: Globe,
    iconBg: 'bg-sage-200',
    iconColor: 'text-forest-900',
    items: [
      { label: 'Nom de la communaute', value: 'DiaspoEEC', type: 'text' },
      { label: 'Langue par defaut', value: 'Francais', type: 'select' },
      { label: 'Fuseau horaire', value: 'Europe/Paris (UTC+1)', type: 'select' },
      { label: 'Mode maintenance', value: false, type: 'toggle', description: 'Desactive l\'acces public au site' },
    ],
  },
  {
    title: 'Notifications',
    icon: Bell,
    iconBg: 'bg-gold-200/50',
    iconColor: 'text-gold-600',
    items: [
      { label: 'Notifications push', value: true, type: 'toggle' },
      { label: 'Email de bienvenue', value: true, type: 'toggle' },
      { label: 'Rappels evenements', value: true, type: 'toggle' },
      { label: 'Resume hebdomadaire', value: false, type: 'toggle' },
    ],
  },
  {
    title: 'Securite',
    icon: Shield,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    items: [
      { label: 'Authentification Keycloak', value: 'Connecte', type: 'status' },
      { label: 'Double authentification', value: true, type: 'toggle' },
      { label: 'Duree de session', value: '24 heures', type: 'select' },
      { label: 'Inscription ouverte', value: true, type: 'toggle' },
    ],
  },
  {
    title: 'Dons & Paiements',
    icon: Key,
    iconBg: 'bg-terra-500/10',
    iconColor: 'text-terra-600',
    items: [
      { label: 'Stripe API', value: 'Connecte', type: 'status' },
      { label: 'PayPal', value: 'Connecte', type: 'status' },
      { label: 'Devise par defaut', value: 'EUR', type: 'select' },
      { label: 'Recus automatiques', value: true, type: 'toggle' },
    ],
  },
];

function buildInitialToggles(): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  settingSections.forEach((s) =>
    s.items.forEach((i) => {
      if (i.type === 'toggle') map[`${s.title}-${i.label}`] = i.value as boolean;
    })
  );
  return map;
}

function buildInitialTexts(): Record<string, string> {
  const map: Record<string, string> = {};
  settingSections.forEach((s) =>
    s.items.forEach((i) => {
      if (i.type === 'text' || i.type === 'select') map[`${s.title}-${i.label}`] = i.value as string;
    })
  );
  return map;
}

export default function AdminParametresPage() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(buildInitialToggles);
  const [texts, setTexts] = useState<Record<string, string>>(buildInitialTexts);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [openSelect, setOpenSelect] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const { addToast } = useToastStore();
  const { theme, setTheme } = useUIStore();
  const isDark = theme === 'dark';

  /* ── Handlers ── */
  const handleToggle = (key: string) => {
    setToggles((p) => ({ ...p, [key]: !p[key] }));
  };

  const startEditing = (key: string) => {
    setEditingKey(key);
    setEditValue(texts[key] ?? '');
  };

  const confirmEdit = () => {
    if (editingKey && editValue.trim()) {
      setTexts((p) => ({ ...p, [editingKey]: editValue.trim() }));
      addToast('Valeur modifiee', 'success');
    }
    setEditingKey(null);
  };

  const cancelEdit = () => setEditingKey(null);

  const handleSelectOption = (key: string, option: string) => {
    setTexts((p) => ({ ...p, [key]: option }));
    setOpenSelect(null);
    addToast('Valeur modifiee', 'success');
  };

  const handleSave = () => addToast('Parametres enregistres avec succes', 'success');

  const handleReset = () => {
    setToggles(buildInitialToggles());
    setTexts(buildInitialTexts());
    addToast('Parametres reinitialises', 'success');
  };

  const handleExport = () => addToast('Export des donnees en cours...', 'info');

  const handleDangerResetConfirm = () => {
    setShowResetConfirm(false);
    addToast('Base de donnees reinitialisee', 'warning');
  };

  return (
    <section className="mx-auto max-w-[1000px] p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            className="text-2xl font-semibold text-forest-900 md:text-3xl"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Parametres
          </h2>
          <p className="mt-1 text-sm text-ink-500">Configuration generale de la plateforme</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-forest-900/20 bg-white px-4 py-2.5 text-sm font-medium text-forest-900 transition-all hover:bg-sage-200"
          >
            <RotateCcw className="h-4 w-4" />
            Reinitialiser
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Save className="h-4 w-4" />
            Enregistrer
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
            Apparence
          </h3>
        </div>
        <div className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-cream-50/50">
          <div>
            <p className="text-sm font-medium text-ink-900">Mode sombre</p>
            <p className="text-xs text-ink-500">
              {isDark ? 'Le theme sombre est actif' : 'Activer le theme sombre pour l\'interface'}
            </p>
          </div>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={cn(
              'relative h-6 w-[44px] rounded-xl transition-colors duration-300',
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
            <div key={section.title} className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
              {/* Section header */}
              <div className="flex items-center gap-3 border-b border-gray-50 px-6 py-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${section.iconBg}`}>
                  <Icon className={`h-[18px] w-[18px] ${section.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-forest-900" style={{ fontFamily: 'var(--font-heading)' }}>
                  {section.title}
                </h3>
              </div>

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {section.items.map((item) => {
                  const key = `${section.title}-${item.label}`;
                  const isEditing = editingKey === key;
                  const isSelectOpen = openSelect === key;

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-cream-50/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900">{item.label}</p>
                        {item.description && <p className="text-xs text-ink-500">{item.description}</p>}
                      </div>

                      {/* Toggle */}
                      {item.type === 'toggle' && (
                        <button
                          onClick={() => handleToggle(key)}
                          className={cn(
                            'relative h-6 w-[44px] flex-shrink-0 rounded-xl transition-colors',
                            toggles[key] ? 'bg-forest-700' : 'bg-ink-200'
                          )}
                        >
                          <span
                            className={cn(
                              'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform',
                              toggles[key] ? 'translate-x-[22px]' : 'translate-x-0.5'
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
                              onClick={() => startEditing(key)}
                              className="group flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-ink-600 transition hover:bg-sage-100/50 hover:text-forest-900"
                            >
                              <span>{texts[key]}</span>
                              <Pencil className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Select (dropdown) */}
                      {item.type === 'select' && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenSelect(isSelectOpen ? null : key)}
                            className="flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-sm text-ink-600 transition hover:border-forest-900/20 hover:bg-sage-100/50 hover:text-forest-900"
                          >
                            <span>{texts[key]}</span>
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
                                {(selectOptions[item.label] ?? []).map((opt) => (
                                  <button
                                    key={opt}
                                    onClick={() => handleSelectOption(key, opt)}
                                    className={cn(
                                      'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-cream-50',
                                      texts[key] === opt ? 'font-medium text-forest-900' : 'text-ink-600'
                                    )}
                                  >
                                    {texts[key] === opt && <Check className="h-3.5 w-3.5 text-forest-700" />}
                                    <span className={texts[key] === opt ? '' : 'pl-[22px]'}>{opt}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* Status */}
                      {item.type === 'status' && (
                        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          {item.value as string}
                        </span>
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
            Zone dangereuse
          </h3>
        </div>
        <div className="divide-y divide-red-50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-ink-900">Exporter toutes les donnees</p>
              <p className="text-xs text-ink-500">Telecharger une copie complete des donnees</p>
            </div>
            <button
              onClick={handleExport}
              className="rounded-xl border-2 border-ink-200 px-4 py-2 text-sm font-medium text-ink-600 transition-all hover:bg-ink-50"
            >
              Exporter
            </button>
          </div>
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-medium text-red-700">Reinitialiser la base de donnees</p>
              <p className="text-xs text-ink-500">Cette action est irreversible</p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
            >
              Reinitialiser
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showResetConfirm}
        title="Reinitialiser la base de donnees"
        message="Cette action va supprimer toutes les donnees de la plateforme. Cette action est irreversible. Etes-vous sur de vouloir continuer ?"
        confirmLabel="Reinitialiser"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={handleDangerResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />
    </section>
  );
}
