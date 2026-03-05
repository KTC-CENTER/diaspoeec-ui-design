import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDashboardStats, getMembersAdmin, getDonsAdmin, getModeration,
  moderateItem, getSettings, updateSettings, getParoissesAdmin,
  createParoisse, updateParoisse, deleteParoisse, reactivateUser,
} from '@/lib/api/admin.api';
import type { ModerationAction, AppSettingsData } from '@/lib/api/admin.api';
import { updateMember } from '@/lib/api/members.api';
import type { UpdateMemberPayload } from '@/lib/api/members.api';
import { createCampagne, updateCampagne } from '@/lib/api/campagnes.api';
import type { CreateCampagnePayload } from '@/lib/api/campagnes.api';

interface AdminMemberFilters {
  search?: string;
  diaspora?: string;
  pays?: string;
  role?: string;
  statut?: string;
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => getDashboardStats(),
  });
}

export function useAdminMembers(filters?: AdminMemberFilters) {
  return useQuery({
    queryKey: ['admin-members', filters],
    queryFn: async () => {
      const result = await getMembersAdmin({
        recherche: filters?.search,
        role: filters?.role && filters.role !== 'all' ? filters.role : undefined,
        statut: filters?.statut && filters.statut !== 'all' ? filters.statut : undefined,
        pays: filters?.pays && filters.pays !== 'all' ? filters.pays : undefined,
        diaspora: filters?.diaspora && filters.diaspora !== 'all' ? filters.diaspora : undefined,
      });
      return {
        members: result.members,
        total: result.total,
        actifs: result.members.filter((u) => u.statut === 'actif').length,
        inactifs: result.members.filter((u) => u.statut === 'inactif').length,
        nouveaux: 0,
      };
    },
  });
}

export function useAdminDons() {
  return useQuery({
    queryKey: ['admin-dons'],
    queryFn: async () => {
      const [donsResult, stats] = await Promise.all([getDonsAdmin(), getDashboardStats()]);
      return {
        totalCollecte: donsResult.totalMontant,
        donsMoisEnCours: stats.donsMoisEnCours,
        totalDonateurs: donsResult.totalDonateurs,
        donMoyen: donsResult.dons.length > 0
          ? Math.round(donsResult.totalMontant / donsResult.dons.length)
          : 0,
        dons: donsResult.dons,
        monthlyData: stats.evolutionDons.map((e) => ({ label: e.mois, value: e.montant })),
        topDonateurs: stats.topDonateurs,
        methodePaiement: stats.methodePaiement,
      };
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMemberPayload }) =>
      updateMember(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
  });
}

export function useCreateCampagne() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampagnePayload) => createCampagne(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campagnes'] });
    },
  });
}

export function useUpdateCampagne() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCampagnePayload> }) =>
      updateCampagne(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campagnes'] });
    },
  });
}

export function useModeration() {
  return useQuery({
    queryKey: ['moderation'],
    queryFn: async () => {
      const signalements = await getModeration();
      const pending = signalements.filter((s) => s.statut === 'en_attente');
      const history = signalements.filter((s) => s.statut !== 'en_attente');
      return {
        pending,
        history,
        total: signalements.length,
        pendingCount: pending.length,
      };
    },
  });
}

export function useModerationAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: ModerationAction }) =>
      moderateItem(id, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['moderation'] });
    },
  });
}

export function useReactivateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reactivateUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-members'] });
    },
  });
}

// ── Settings ──

export function useSettings() {
  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: getSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AppSettingsData>) => updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
    },
  });
}

// ── Paroisses ──

export function useParoissesAdmin() {
  return useQuery({
    queryKey: ['admin-paroisses'],
    queryFn: getParoissesAdmin,
  });
}

export function useCreateParoisse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { slug: string; label: string; ville?: string }) => createParoisse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paroisses'] });
      queryClient.invalidateQueries({ queryKey: ['paroisses'] });
    },
  });
}

export function useUpdateParoisse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<{ slug: string; label: string; ville: string; actif: boolean }> }) =>
      updateParoisse(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paroisses'] });
      queryClient.invalidateQueries({ queryKey: ['paroisses'] });
    },
  });
}

export function useDeleteParoisse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteParoisse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-paroisses'] });
      queryClient.invalidateQueries({ queryKey: ['paroisses'] });
    },
  });
}
