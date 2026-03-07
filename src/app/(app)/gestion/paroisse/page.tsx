'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Shield,
  LayoutDashboard,
  TrendingUp,
  Heart,
  Calendar,
  BookOpen,
  Search,
  Eye,
  X,
  MapPin,
  Mail,
  Phone,
  Award,
  Plus,
  UserCheck,
  UserMinus,
  Loader2,
  EyeOff,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils/cn';
import { useToastStore } from '@/stores/toast.store';
import { useAuthStore } from '@/stores/auth.store';
import { useTenantStore } from '@/stores/tenant.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { RoleGuard } from '@/features/gestion/components/role-guard';
import { getMembers } from '@/lib/api/members.api';
import { getDons } from '@/lib/api/dons.api';
import { getEvenements } from '@/lib/api/evenements.api';
import { formatMontant } from '@/lib/utils/format';
import {
  getPasteurs,
  createPasteur,
  removePasteur,
  type CreatePasteurPayload,
} from '@/lib/api/members.api';
import type { User, Don, Evenement } from '@/types';
import { GestionEvenementsContent } from '@/app/(app)/gestion/evenements/evenements-content';
import { GestionCultesContent } from '@/app/(app)/gestion/cultes/cultes-content';
import { GestionCampagnesContent } from '@/app/(app)/gestion/campagnes/campagnes-content';
import { CalendarPlus, Video, Megaphone, MessageCircle } from 'lucide-react';
import { useCreateConversation } from '@/features/messages/hooks/use-messages';

type Tab = 'dashboard' | 'fideles' | 'pasteurs' | 'evenements' | 'videos' | 'campagnes';

const TABS: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { key: 'fideles', label: 'Fideles', icon: Users },
  { key: 'pasteurs', label: 'Pasteurs', icon: Shield },
  { key: 'evenements', label: 'Evenements', icon: CalendarPlus },
  { key: 'videos', label: 'Videos', icon: Video },
  { key: 'campagnes', label: 'Campagnes', icon: Megaphone },
];

// ============================================================================
// Dashboard Tab
// ============================================================================

function DashboardTab({ members, pasteurs, donsMois, evenementsActifs, dons, evenements, onNavigate }: {
  members: User[];
  pasteurs: User[];
  donsMois: string;
  evenementsActifs: number;
  dons: Don[];
  evenements: Evenement[];
  onNavigate: (tab: Tab) => void;
}) {
  const paroisse = useTenantStore((s) => s.paroisse);
  const currentUser = useAuthStore((s) => s.user);

  const stats = [
    { icon: Users, label: 'Fideles', value: members.length, color: 'bg-forest-500/10 text-forest-700' },
    { icon: Shield, label: 'Pasteurs', value: pasteurs.length, color: 'bg-gold-500/10 text-gold-700' },
    { icon: Heart, label: 'Dons ce mois', value: donsMois, color: 'bg-terra-500/10 text-terra-700' },
    { icon: Calendar, label: 'Evenements actifs', value: evenementsActifs, color: 'bg-sage-500/10 text-sage-700' },
  ];

  const now = new Date();
  const recentDons = [...dons]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const upcomingEvents = [...evenements]
    .filter((e) => new Date(e.date) > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const totalDons = dons.reduce((sum, d) => sum + Number(d.montant), 0);
  const donateursUniques = new Set(dons.filter((d) => !d.estAnonyme && d.donateurId).map((d) => d.donateurId)).size;

  return (
    <div className="space-y-6">
      {/* Parish Info */}
      {paroisse && (
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: `${paroisse.couleurPrimaire}20`,
            background: `linear-gradient(135deg, ${paroisse.couleurPrimaire}08, ${paroisse.couleurSecondaire}08)`,
          }}
        >
          <h3 className="text-lg font-semibold text-ink-900">{paroisse.label}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-500">
            {paroisse.ville && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {paroisse.ville}
              </span>
            )}
            {paroisse.synode && <span>{paroisse.synode}</span>}
            {currentUser?.nomComplet && (
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                {currentUser.nomComplet}
              </span>
            )}
          </div>
          {paroisse.messageAccueil && (
            <p className="mt-2 text-sm italic text-ink-400">&quot;{paroisse.messageAccueil}&quot;</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-ink-100 px-2 py-0.5 font-mono text-xs text-ink-600">
              {paroisse.code}
            </span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: paroisse.couleurPrimaire }} />
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: paroisse.couleurSecondaire }} />
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: paroisse.couleurAccent }} />
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm">
            <div className={cn('mb-2 inline-flex rounded-xl p-2', s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-ink-900">{s.value}</p>
            <p className="text-xs text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Donors */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-terra-600" />
              <h4 className="text-sm font-semibold text-ink-900">Derniers donateurs</h4>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-400">
              <span>{donateursUniques} donateur{donateursUniques !== 1 ? 's' : ''}</span>
              <span className="font-medium text-forest-700">{formatMontant(totalDons, 'EUR')} total</span>
            </div>
          </div>
          <div className="divide-y divide-gray-50">
            {recentDons.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-terra-500/10 text-xs font-semibold text-terra-700">
                    {d.estAnonyme ? '?' : initials(d.donateurNom ?? '?')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">
                      {d.estAnonyme ? 'Anonyme' : d.donateurNom}
                    </p>
                    <p className="text-xs text-ink-400 truncate">{d.campagneNom}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-forest-900">{formatMontant(d.montant, d.devise)}</p>
                  <p className="text-[10px] text-ink-400">{formatRelativeDate(d.createdAt)}</p>
                </div>
              </div>
            ))}
            {recentDons.length === 0 && (
              <p className="py-4 text-center text-sm text-ink-400">Aucun don pour le moment</p>
            )}
          </div>
          {dons.length > 5 && (
            <button
              onClick={() => onNavigate('campagnes')}
              className="mt-3 w-full rounded-xl border border-forest-900/10 py-2 text-xs font-medium text-forest-700 transition hover:bg-sage-100"
            >
              Voir toutes les campagnes
            </button>
          )}
        </div>

        {/* Recent Members */}
        <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-forest-700" />
              <h4 className="text-sm font-semibold text-ink-900">Derniers inscrits</h4>
            </div>
            <button
              onClick={() => onNavigate('fideles')}
              className="text-xs font-medium text-forest-700 hover:underline"
            >
              Voir tous
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {members.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream-100">
                  {initials(m.nomComplet)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900 truncate">{m.nomComplet}</p>
                  <p className="text-xs text-ink-400">{m.email}</p>
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="py-4 text-center text-sm text-ink-400">Aucun fidele pour le moment</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sage-700" />
              <h4 className="text-sm font-semibold text-ink-900">Prochains evenements</h4>
            </div>
            <button
              onClick={() => onNavigate('evenements')}
              className="text-xs font-medium text-forest-700 hover:underline"
            >
              Gerer
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((e) => {
              const eventDate = new Date(e.date);
              return (
                <div
                  key={e.id}
                  className="flex gap-3 rounded-xl border border-forest-900/5 bg-cream-50/50 p-3 transition hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-forest-900 text-white">
                    <span className="text-[10px] font-medium uppercase leading-none">
                      {eventDate.toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-base font-bold leading-tight">{eventDate.getDate()}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{e.titre}</p>
                    <p className="flex items-center gap-1 text-xs text-ink-400">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{e.lieu}</span>
                    </p>
                    <p className="text-xs text-ink-400">
                      {e.participantsInscrits} inscrit{e.participantsInscrits !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

// ============================================================================
// Fideles Tab
// ============================================================================

function FidelesTab({ members }: { members: User[] }) {
  const [search, setSearch] = useState('');
  const [viewItem, setViewItem] = useState<User | null>(null);
  const createConversation = useCreateConversation();
  const router = useRouter();

  const filtered = members.filter((m) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.nomComplet.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.ville && m.ville.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher un fidele..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-forest-900/10 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-forest-700 focus:ring-2 focus:ring-forest-900/10"
          />
        </div>
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {filtered.length} fidele{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="divide-y divide-gray-50">
          {filtered.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-cream-50/50"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-forest-900 text-xs font-semibold text-cream-100">
                  {initials(m.nomComplet)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink-900 truncate">{m.nomComplet}</p>
                  <p className="text-xs text-ink-500">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.ville && (
                  <span className="hidden items-center gap-1 text-xs text-ink-400 sm:flex">
                    <MapPin className="h-3 w-3" /> {m.ville}
                  </span>
                )}
                <button
                  onClick={() => setViewItem(m)}
                  className="rounded-lg p-1.5 text-ink-400 transition hover:bg-sage-200 hover:text-forest-900"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">Aucun fidele trouve</p>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
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
            <h3 className="mb-4 text-lg font-semibold text-ink-900" style={{ fontFamily: 'var(--font-heading)' }}>
              Fiche membre
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-forest-900 text-lg font-semibold text-cream-100">
                  {initials(viewItem.nomComplet)}
                </div>
                <div>
                  <p className="font-semibold text-ink-900">{viewItem.nomComplet}</p>
                  <span className={cn(
                    'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                    viewItem.statut === 'actif' ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'
                  )}>
                    {viewItem.statut}
                  </span>
                </div>
              </div>
              <div className="h-px bg-ink-100" />
              <div>
                <p className="text-sm font-medium text-ink-500">Email</p>
                <p className="flex items-center gap-1.5 text-sm text-ink-900"><Mail className="h-3.5 w-3.5 text-ink-400" />{viewItem.email}</p>
              </div>
              {viewItem.telephone && (
                <div>
                  <p className="text-sm font-medium text-ink-500">Telephone</p>
                  <p className="flex items-center gap-1.5 text-sm text-ink-900"><Phone className="h-3.5 w-3.5 text-ink-400" />{viewItem.telephone}</p>
                </div>
              )}
              {viewItem.ville && (
                <div>
                  <p className="text-sm font-medium text-ink-500">Localisation</p>
                  <p className="flex items-center gap-1.5 text-sm text-ink-900"><MapPin className="h-3.5 w-3.5 text-ink-400" />{viewItem.ville}{viewItem.paysResidence ? `, ${viewItem.paysResidence}` : ''}</p>
                </div>
              )}
              {viewItem.ministeres && viewItem.ministeres.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-ink-500">Ministeres</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {viewItem.ministeres.map((m) => (
                      <span key={m} className="flex items-center gap-1 rounded-full bg-sage-200 px-2.5 py-0.5 text-xs font-medium capitalize text-forest-900">
                        <Award className="h-3 w-3" />{m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-6">
                <div>
                  <p className="text-sm font-medium text-ink-500">Dons</p>
                  <p className="text-sm font-semibold text-forest-900">{viewItem.donsEffectues}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink-500">Evenements</p>
                  <p className="text-sm font-semibold text-forest-900">{viewItem.evenementsSuivis}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setViewItem(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  if (!viewItem) return;
                  createConversation.mutate(viewItem.id, {
                    onSuccess: (conv) => {
                      setViewItem(null);
                      router.push(`/messages?conversation=${conv.id}`);
                    },
                  });
                }}
                disabled={createConversation.isPending}
                className="flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-forest-800 disabled:opacity-50"
              >
                <MessageCircle className="h-4 w-4" />
                Envoyer un message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Pasteurs Tab
// ============================================================================

function PasteursTab({ pasteurs, refetch }: { pasteurs: User[]; refetch: () => void }) {
  const queryClient = useQueryClient();
  const { addToast } = useToastStore();
  const currentUser = useAuthStore((s) => s.user);

  const createMutation = useMutation({
    mutationFn: (data: CreatePasteurPayload) => createPasteur(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pasteurs'] });
      refetch();
      addToast('Pasteur ajoute avec succes', 'success');
      resetForm();
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => removePasteur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pasteurs'] });
      refetch();
      addToast('Pasteur retire', 'success');
    },
    onError: (err: Error) => addToast(err.message, 'error'),
  });

  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<User | null>(null);
  const [form, setForm] = useState({ nomComplet: '', email: '', password: '' });

  const resetForm = () => {
    setShowForm(false);
    setForm({ nomComplet: '', email: '', password: '' });
    setShowPassword(false);
  };

  const handleSubmit = () => {
    if (!form.nomComplet.trim() || !form.email.trim() || !form.password.trim()) {
      addToast('Tous les champs sont requis', 'error');
      return;
    }
    createMutation.mutate(form);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-forest-900/10 bg-sage-200 px-3 py-1 text-xs font-medium text-forest-900">
          {pasteurs.length} pasteur{pasteurs.length !== 1 ? 's' : ''}
        </span>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-700"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="rounded-2xl border border-forest-900/5 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-ink-900">Nouveau pasteur</h4>
            <button onClick={resetForm} className="rounded-lg p-1 text-ink-400 hover:bg-ink-50">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              value={form.nomComplet}
              onChange={(e) => setForm((p) => ({ ...p, nomComplet: e.target.value }))}
              placeholder="Nom complet *"
              className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email *"
              className="rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="Mot de passe *"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-forest-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-forest-700 disabled:opacity-60"
            >
              {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
              Ajouter
            </button>
            <button onClick={resetForm} className="rounded-xl border border-ink-200 px-4 py-2 text-sm text-ink-600 hover:bg-ink-50">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Pasteurs List */}
      <div className="overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm">
        <div className="divide-y divide-gray-50">
          {pasteurs.map((p) => {
            const isSelf = p.id === currentUser?.id;
            return (
              <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-3.5 transition-colors hover:bg-cream-50/50">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold-600 text-xs font-semibold text-white">
                    {initials(p.nomComplet)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-ink-900 truncate">{p.nomComplet}</p>
                      {isSelf && (
                        <span className="rounded-full bg-forest-900/10 px-2 py-0.5 text-[10px] font-medium text-forest-900">Vous</span>
                      )}
                    </div>
                    <p className="flex items-center gap-1 text-xs text-ink-500"><Mail className="h-3 w-3" />{p.email}</p>
                  </div>
                </div>
                {!isSelf && (
                  <button
                    onClick={() => setRemoveTarget(p)}
                    className="rounded-lg p-2 text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                )}
              </div>
            );
          })}
          {pasteurs.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-400">Aucun pasteur</p>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!removeTarget}
        title="Retirer ce pasteur"
        message={`${removeTarget?.nomComplet} sera retrocede au role de fidele.`}
        confirmLabel="Retirer"
        cancelLabel="Annuler"
        variant="danger"
        onConfirm={() => { if (removeTarget) removeMutation.mutate(removeTarget.id); setRemoveTarget(null); }}
        onCancel={() => setRemoveTarget(null)}
      />
    </div>
  );
}

// ============================================================================
// Helpers
// ============================================================================

function initials(name: string) {
  return name.split(' ').filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function formatRelativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `il y a ${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days}j`;
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// ============================================================================
// Main Page
// ============================================================================

function GestionParoisseContent() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const paroisse = useTenantStore((s) => s.paroisse);

  const { data: membersRaw, isLoading: loadingMembers } = useQuery({
    queryKey: ['gestion-paroisse-members'],
    queryFn: () => getMembers(),
  });

  const { data: pasteursRaw, isLoading: loadingPasteurs, refetch: refetchPasteurs } = useQuery({
    queryKey: ['pasteurs'],
    queryFn: getPasteurs,
  });

  const { data: donsRaw } = useQuery({
    queryKey: ['gestion-paroisse-dons'],
    queryFn: getDons,
  });

  const { data: evenementsRaw } = useQuery({
    queryKey: ['gestion-paroisse-evenements'],
    queryFn: () => getEvenements(),
  });

  const members = (membersRaw ?? []).filter((m) => m.role === 'fidele');
  const pasteurs = pasteursRaw ?? [];
  const isLoading = loadingMembers || loadingPasteurs;

  // Dons du mois en cours
  const now = new Date();
  const donsMois = (donsRaw ?? [])
    .filter((d) => {
      const date = new Date(d.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, d) => sum + Number(d.montant), 0);

  // Evenements a venir
  const evenementsActifs = (evenementsRaw ?? []).filter((e) => new Date(e.date) > now).length;

  return (
    <section className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-semibold text-forest-900 md:text-3xl"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {paroisse?.label ?? 'Ma Paroisse'}
        </h1>
        <p className="mt-1 text-sm text-ink-500">
          Gerez votre paroisse, vos fideles, evenements et campagnes
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 rounded-xl border border-forest-900/5 bg-cream-50 p-1 min-w-max">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all',
                tab === t.key
                  ? 'bg-white text-forest-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700'
              )}
            >
              <t.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {tab === 'evenements' ? (
        <GestionEvenementsContent />
      ) : tab === 'videos' ? (
        <GestionCultesContent />
      ) : tab === 'campagnes' ? (
        <GestionCampagnesContent />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
        </div>
      ) : (
        <>
          {tab === 'dashboard' && <DashboardTab members={members} pasteurs={pasteurs} donsMois={formatMontant(donsMois, 'EUR')} evenementsActifs={evenementsActifs} dons={donsRaw ?? []} evenements={evenementsRaw ?? []} onNavigate={setTab} />}
          {tab === 'fideles' && <FidelesTab members={members} />}
          {tab === 'pasteurs' && <PasteursTab pasteurs={pasteurs} refetch={refetchPasteurs} />}
        </>
      )}
    </section>
  );
}

export default function GestionParoissePage() {
  return (
    <RoleGuard allowedRoles={['pasteur', 'admin']}>
      <GestionParoisseContent />
    </RoleGuard>
  );
}
