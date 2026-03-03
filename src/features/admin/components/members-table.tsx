'use client';

import { useState } from 'react';
import {
  Search,
  FileText,
  FileSpreadsheet,
  MoreHorizontal,
  Users,
  TrendingUp,
  X,
  Mail,
  Phone,
  MapPin,
  Church,
  Calendar,
  Heart,
  Gift,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate, getInitials, formatParoisse } from '@/lib/utils/format';
import { useAdminMembers, useUpdateMember } from '@/features/admin/hooks/use-admin';
import { PAYS_LIST, DIASPORA_TYPES } from '@/lib/utils/constants';
import { CustomSelect } from '@/components/forms/custom-select';
import { useToastStore } from '@/stores/toast.store';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { exportToCSV, exportToExcel } from '@/lib/utils/export';
import type { ExportColumn } from '@/lib/utils/export';
import type { User, UserRole } from '@/types';

const diasporaColors: Record<string, string> = {
  professionnelle: 'bg-blue-50 text-blue-700',
  etudiante: 'bg-purple-50 text-purple-700',
  familiale: 'bg-pink-50 text-pink-700',
  missionnaire: 'bg-green-50 text-green-700',
};

const ROLE_LABELS: Record<UserRole, string> = {
  fidele: 'Fidele',
  pasteur: 'Pasteur',
  responsable_zone: 'Responsable zone',
  admin: 'Admin',
};

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: 'fidele', label: 'Fidele' },
  { value: 'pasteur', label: 'Pasteur' },
  { value: 'responsable_zone', label: 'Responsable zone' },
  { value: 'admin', label: 'Admin' },
];

const memberExportColumns: ExportColumn<User>[] = [
  { header: 'Nom', accessor: (m) => m.nomComplet },
  { header: 'Email', accessor: (m) => m.email },
  { header: 'Role', accessor: (m) => ROLE_LABELS[m.role] },
  { header: 'Statut', accessor: (m) => m.statut },
  { header: 'Type diaspora', accessor: (m) => m.typeDiaspora },
  { header: 'Pays', accessor: (m) => {
    const country = PAYS_LIST.find((p) => p.value === m.paysResidence);
    return country?.label || m.paysResidence;
  }},
  { header: 'Ville', accessor: (m) => m.ville },
  { header: 'Telephone', accessor: (m) => m.telephone || '' },
  { header: 'Baptise', accessor: (m) => m.baptise ? 'Oui' : 'Non' },
  { header: 'Ministeres', accessor: (m) => m.ministeres.join(', ') },
  { header: 'Dons effectues', accessor: (m) => m.donsEffectues },
  { header: 'Inscription', accessor: (m) => m.createdAt.split('T')[0] },
];

export function MembersTable() {
  const [search, setSearch] = useState('');
  const [diasporaFilter, setDiasporaFilter] = useState('all');
  const [paysFilter, setPaysFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statutFilter, setStatutFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const perPage = 8;

  // Local overrides for role/statut changes
  const [overrides, setOverrides] = useState<Record<string, Partial<User>>>({});

  // Modal states
  const [profileMember, setProfileMember] = useState<User | null>(null);
  const [roleMember, setRoleMember] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('fidele');
  const [deactivateMember, setDeactivateMember] = useState<User | null>(null);

  const { addToast } = useToastStore();
  const updateMemberMutation = useUpdateMember();

  const { data, isLoading } = useAdminMembers({
    search,
    diaspora: diasporaFilter,
    pays: paysFilter,
    role: roleFilter,
    statut: statutFilter,
  });

  const rawMembers = data?.members || [];

  // Apply local overrides to members
  const members = rawMembers.map((m) => ({
    ...m,
    ...overrides[m.id],
  }));

  const totalPages = Math.ceil(members.length / perPage);
  const paginatedMembers = members.slice((page - 1) * perPage, page * perPage);

  const getCountryFlag = (code: string) => {
    const country = PAYS_LIST.find((p) => p.value === code);
    return country?.flag || '';
  };

  const getCountryName = (code: string) => {
    const country = PAYS_LIST.find((p) => p.value === code);
    return country?.label || code;
  };

  // --- Action handlers ---

  const handleViewProfile = (member: User) => {
    setOpenDropdown(null);
    setProfileMember(member);
  };

  const handleOpenRoleModal = (member: User) => {
    setOpenDropdown(null);
    setSelectedRole(member.role);
    setRoleMember(member);
  };

  const handleSaveRole = () => {
    if (!roleMember) return;
    updateMemberMutation.mutate(
      { id: roleMember.id, data: { role: selectedRole } },
      {
        onSuccess: () => {
          addToast(`Role de ${roleMember.nomComplet} mis a jour`, 'success');
          setRoleMember(null);
        },
        onError: () => {
          addToast('Erreur lors de la mise a jour du role', 'error');
        },
      }
    );
  };

  const handleOpenDeactivate = (member: User) => {
    setOpenDropdown(null);
    setDeactivateMember(member);
  };

  const handleConfirmDeactivate = () => {
    if (!deactivateMember) return;
    const currentStatut = deactivateMember.statut;
    const newStatut = currentStatut === 'actif' ? 'inactif' : 'actif';
    updateMemberMutation.mutate(
      { id: deactivateMember.id, data: { statut: newStatut } },
      {
        onSuccess: () => {
          const action = newStatut === 'inactif' ? 'desactive' : 'reactive';
          addToast(`${deactivateMember.nomComplet} a ete ${action}`, 'success');
          setDeactivateMember(null);
        },
        onError: () => {
          addToast('Erreur lors de la mise a jour du statut', 'error');
          setDeactivateMember(null);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <div className="rounded-2xl border border-forest-900/5 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              type="text"
              placeholder="Rechercher un fidele..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-gray-200 bg-cream-50 py-2.5 pl-10 pr-4 text-sm focus:border-forest-900 focus:outline-none focus:ring-2 focus:ring-sage-400/30"
            />
          </div>
          <CustomSelect
            value={diasporaFilter}
            onChange={(value) => { setDiasporaFilter(value); setPage(1); }}
            options={[{ value: 'all', label: 'Toutes les diasporas' }, ...DIASPORA_TYPES]}
            className="w-full md:w-auto md:min-w-[180px]"
          />
          <CustomSelect
            value={paysFilter}
            onChange={(value) => { setPaysFilter(value); setPage(1); }}
            options={[{ value: 'all', label: 'Tous les pays' }, ...PAYS_LIST]}
            className="w-full md:w-auto md:min-w-[160px]"
          />
          <CustomSelect
            value={roleFilter}
            onChange={(value) => { setRoleFilter(value); setPage(1); }}
            options={[
              { value: 'all', label: 'Tous les roles' },
              { value: 'fidele', label: 'Fidele' },
              { value: 'pasteur', label: 'Pasteur' },
              { value: 'responsable_zone', label: 'Responsable zone' },
              { value: 'admin', label: 'Admin' },
            ]}
            className="w-full md:w-auto md:min-w-[160px]"
          />
          <CustomSelect
            value={statutFilter}
            onChange={(value) => { setStatutFilter(value); setPage(1); }}
            options={[
              { value: 'all', label: 'Tous statuts' },
              { value: 'actif', label: 'Actif' },
              { value: 'inactif', label: 'Inactif' },
            ]}
            className="w-full md:w-auto md:min-w-[140px]"
          />
        </div>
      </div>

      {/* Stats bar */}
      {data && (
        <div className="flex flex-wrap gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-white px-3 py-1.5 text-sm">
            <Users className="h-3.5 w-3.5 text-forest-900" />
            <strong>{data.total.toLocaleString('fr-FR')}</strong> fideles
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-white px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <strong>{data.actifs.toLocaleString('fr-FR')}</strong> actifs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-200 bg-white px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-yellow-500" />
            <strong>{data.inactifs}</strong> inactifs
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-200 px-3 py-1.5 text-sm font-medium text-forest-900">
            <TrendingUp className="h-3.5 w-3.5" />
            +{data.nouveaux} nouveaux ce mois
          </span>
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm md:block">
        {isLoading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 rounded-lg shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-forest-900/5 bg-forest-900/[0.03]">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Nom
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Diaspora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Pays
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-ink-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedMembers.map((member, i) => {
                  const isEvenRow = i % 2 === 1;
                  const diasporaColor =
                    diasporaColors[member.typeDiaspora] || 'bg-gray-50 text-gray-700';

                  return (
                    <tr
                      key={member.id}
                      className={cn(
                        'tbl-row border-b border-gray-50 transition-colors',
                        isEvenRow && 'bg-cream-50/30'
                      )}
                    >
                      <td className="px-4 py-3 font-medium">
                        {member.nomComplet}
                      </td>
                      <td className="px-4 py-3 text-ink-500">
                        {member.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 text-xs',
                            diasporaColor
                          )}
                        >
                          {member.typeDiaspora}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {getCountryFlag(member.paysResidence)}{' '}
                        {getCountryName(member.paysResidence)}
                      </td>
                      <td className="px-4 py-3">
                        {member.role === 'pasteur' ? (
                          <span className="font-medium text-forest-900">
                            Pasteur
                          </span>
                        ) : member.role === 'responsable_zone' ? (
                          <span className="font-medium text-terra-600">
                            Resp. zone
                          </span>
                        ) : member.role === 'admin' ? (
                          <span className="font-medium text-purple-700">
                            Admin
                          </span>
                        ) : (
                          'Fidele'
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {member.statut === 'actif' ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
                            <span className="h-2 w-2 rounded-full bg-yellow-500" />
                            Inactif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setOpenDropdown(
                                openDropdown === member.id ? null : member.id
                              )
                            }
                            className="rounded-lg p-1.5 hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-ink-500" />
                          </button>
                          {openDropdown === member.id && (
                            <div className="absolute right-0 top-full z-20 mt-1 w-44 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                              <button
                                onClick={() => handleViewProfile(member)}
                                className="block w-full px-3 py-2 text-left text-sm transition hover:bg-sage-200"
                              >
                                Voir profil
                              </button>
                              <button
                                onClick={() => handleOpenRoleModal(member)}
                                className="block w-full px-3 py-2 text-left text-sm transition hover:bg-sage-200"
                              >
                                Modifier role
                              </button>
                              <button
                                onClick={() => handleOpenDeactivate(member)}
                                className="block w-full px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                              >
                                {member.statut === 'actif' ? 'Desactiver' : 'Reactiver'}
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-0 divide-y divide-gray-50 overflow-hidden rounded-2xl border border-forest-900/5 bg-white shadow-sm md:hidden">
        {isLoading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-28 shimmer-bg" />
            ))
          : paginatedMembers.slice(0, 4).map((member) => {
              const diasporaColor =
                diasporaColors[member.typeDiaspora] || 'bg-gray-50 text-gray-700';
              return (
                <div key={member.id} className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{member.nomComplet}</p>
                      <p className="text-xs text-ink-500">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.statut === 'actif' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600">
                          <span className="h-2 w-2 rounded-full bg-green-500" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-600">
                          <span className="h-2 w-2 rounded-full bg-yellow-500" />
                          Inactif
                        </span>
                      )}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === member.id ? null : member.id
                            )
                          }
                          className="rounded-lg p-1 hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-4 w-4 text-ink-500" />
                        </button>
                        {openDropdown === member.id && (
                          <div className="absolute right-0 top-full z-20 mt-1 w-44 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-100 bg-white py-1 shadow-xl">
                            <button
                              onClick={() => handleViewProfile(member)}
                              className="block w-full px-3 py-2 text-left text-sm transition hover:bg-sage-200"
                            >
                              Voir profil
                            </button>
                            <button
                              onClick={() => handleOpenRoleModal(member)}
                              className="block w-full px-3 py-2 text-left text-sm transition hover:bg-sage-200"
                            >
                              Modifier role
                            </button>
                            <button
                              onClick={() => handleOpenDeactivate(member)}
                              className="block w-full px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50"
                            >
                              {member.statut === 'actif' ? 'Desactiver' : 'Reactiver'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs',
                        diasporaColor
                      )}
                    >
                      {member.typeDiaspora}
                    </span>
                    <span className="text-xs text-ink-500">
                      {getCountryFlag(member.paysResidence)}{' '}
                      {getCountryName(member.paysResidence)}
                    </span>
                    {member.role === 'pasteur' ? (
                      <span className="text-xs font-medium text-forest-900">
                        Pasteur
                      </span>
                    ) : member.role === 'responsable_zone' ? (
                      <span className="text-xs font-medium text-terra-600">
                        Resp. zone
                      </span>
                    ) : member.role === 'admin' ? (
                      <span className="text-xs font-medium text-purple-700">
                        Admin
                      </span>
                    ) : (
                      <span className="text-xs">Fidele</span>
                    )}
                  </div>
                </div>
              );
            })}
      </div>

      {/* Pagination + Export */}
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="text-sm text-ink-500">
          {(page - 1) * perPage + 1}-
          {Math.min(page * perPage, members.length)} sur{' '}
          <strong>{members.length.toLocaleString('fr-FR')}</strong>
        </span>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white disabled:opacity-40"
            >
              Precedent
            </button>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm transition',
                    p === page
                      ? 'bg-forest-900 text-white'
                      : 'cursor-pointer border border-gray-200 hover:bg-white'
                  )}
                >
                  {p}
                </button>
              )
            )}
            {totalPages > 3 && <span className="text-ink-500">...</span>}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            onClick={() => {
              exportToCSV(members, memberExportColumns, 'fideles');
              addToast('Export CSV des fideles telecharge', 'success');
            }}
          >
            <FileText className="h-3.5 w-3.5" />
            CSV
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm transition hover:bg-white"
            onClick={() => {
              exportToExcel(members, memberExportColumns, 'fideles');
              addToast('Export Excel des fideles telecharge', 'success');
            }}
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            Excel
          </button>
        </div>
      </div>

      {/* ==================== MODALS ==================== */}

      {/* Profile Detail Modal */}
      {profileMember && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setProfileMember(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setProfileMember(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header with avatar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest-900 to-forest-700 text-xl font-bold text-white">
                {getInitials(profileMember.nomComplet)}
              </div>
              <div>
                <h2
                  className="text-xl font-semibold text-ink-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {profileMember.nomComplet}
                </h2>
                <div className="mt-1 flex items-center gap-2">
                  {profileMember.statut === 'actif' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Actif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                      Inactif
                    </span>
                  )}
                  <span className="rounded-full bg-forest-900/10 px-2 py-0.5 text-xs font-medium text-forest-900">
                    {ROLE_LABELS[profileMember.role]}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="mb-5 space-y-3 rounded-xl bg-cream-50 p-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-ink-400" />
                <span className="text-ink-700">{profileMember.email}</span>
              </div>
              {profileMember.telephone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-ink-400" />
                  <span className="text-ink-700">
                    {profileMember.telephoneCountryCode && `${profileMember.telephoneCountryCode} `}
                    {profileMember.telephone}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-ink-400" />
                <span className="text-ink-700">
                  {profileMember.ville}, {getCountryFlag(profileMember.paysResidence)}{' '}
                  {getCountryName(profileMember.paysResidence)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Church className="h-4 w-4 text-ink-400" />
                <span className="text-ink-700">{formatParoisse(profileMember.paroisseOrigine)}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Type de diaspora
                </p>
                <p className="mt-1">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      diasporaColors[profileMember.typeDiaspora] || 'bg-gray-50 text-gray-700'
                    )}
                  >
                    {profileMember.typeDiaspora}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Baptise
                </p>
                <p className="mt-1 text-sm text-ink-700">
                  {profileMember.baptise ? 'Oui' : 'Non'}
                </p>
              </div>
              {profileMember.baptise && profileMember.dateBapteme && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                    Date de bapteme
                  </p>
                  <p className="mt-1 text-sm text-ink-700">
                    {formatDate(profileMember.dateBapteme)}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Sexe
                </p>
                <p className="mt-1 text-sm capitalize text-ink-700">
                  {profileMember.sexe}
                </p>
              </div>
            </div>

            {/* Ministeres */}
            {profileMember.ministeres.length > 0 && (
              <div className="mb-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">
                  Ministeres
                </p>
                <div className="flex flex-wrap gap-2">
                  {profileMember.ministeres.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-sage-200 px-3 py-1 text-xs font-medium capitalize text-forest-900"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="mb-5 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-cream-50 p-3 text-center">
                <Gift className="mx-auto mb-1 h-4 w-4 text-forest-900" />
                <p className="text-lg font-bold text-ink-900">
                  {profileMember.donsEffectues}
                </p>
                <p className="text-xs text-ink-500">Dons effectues</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3 text-center">
                <Calendar className="mx-auto mb-1 h-4 w-4 text-forest-900" />
                <p className="text-lg font-bold text-ink-900">
                  {profileMember.evenementsSuivis}
                </p>
                <p className="text-xs text-ink-500">Evenements suivis</p>
              </div>
              <div className="rounded-xl bg-cream-50 p-3 text-center">
                <Heart className="mx-auto mb-1 h-4 w-4 text-forest-900" />
                <p className="text-lg font-bold text-ink-900">
                  {profileMember.jaimesTotal}
                </p>
                <p className="text-xs text-ink-500">J&apos;aimes total</p>
              </div>
            </div>

            {/* Inscription date */}
            <div className="border-t border-forest-900/5 pt-4">
              <p className="text-xs text-ink-400">
                Membre depuis le{' '}
                <span className="font-medium text-ink-600">
                  {formatDate(profileMember.createdAt)}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Role Edit Modal */}
      {roleMember && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setRoleMember(null)} />
          <div className="relative max-h-[85vh] w-full max-w-[600px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setRoleMember(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-ink-400 transition hover:bg-ink-50"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-6">
              <h2
                className="text-lg font-semibold text-ink-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Modifier le role
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Modifier le role de <strong>{roleMember.nomComplet}</strong>
              </p>
            </div>

            <div className="mb-2">
              <p className="text-sm text-ink-500">
                Role actuel :{' '}
                <span className="font-medium text-ink-700">
                  {ROLE_LABELS[roleMember.role]}
                </span>
              </p>
            </div>

            <div className="mb-6 mt-4">
              <label className="block text-sm font-medium text-ink-700 mb-1.5">
                Nouveau role
              </label>
              <div className="space-y-2">
                {ROLE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedRole(option.value)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition',
                      selectedRole === option.value
                        ? 'border-forest-900 bg-forest-900/5'
                        : 'border-ink-200 hover:border-forest-700'
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-5 w-5 items-center justify-center rounded-full border-2',
                        selectedRole === option.value
                          ? 'border-forest-900'
                          : 'border-ink-300'
                      )}
                    >
                      {selectedRole === option.value && (
                        <div className="h-2.5 w-2.5 rounded-full bg-forest-900" />
                      )}
                    </div>
                    <span
                      className={cn(
                        'font-medium',
                        selectedRole === option.value
                          ? 'text-forest-900'
                          : 'text-ink-700'
                      )}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setRoleMember(null)}
                className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveRole}
                className="rounded-xl bg-gradient-to-r from-forest-900 to-forest-700 px-5 py-2.5 text-sm font-medium text-white transition hover:shadow-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        open={!!deactivateMember}
        title={
          deactivateMember?.statut === 'actif'
            ? 'Desactiver ce compte ?'
            : 'Reactiver ce compte ?'
        }
        message={
          deactivateMember?.statut === 'actif'
            ? `Le compte de ${deactivateMember?.nomComplet} sera desactive. Il ne pourra plus acceder a la plateforme.`
            : `Le compte de ${deactivateMember?.nomComplet} sera reactive. Il pourra a nouveau acceder a la plateforme.`
        }
        confirmLabel={
          deactivateMember?.statut === 'actif' ? 'Desactiver' : 'Reactiver'
        }
        cancelLabel="Annuler"
        variant={deactivateMember?.statut === 'actif' ? 'danger' : 'warning'}
        onConfirm={handleConfirmDeactivate}
        onCancel={() => setDeactivateMember(null)}
      />
    </div>
  );
}
