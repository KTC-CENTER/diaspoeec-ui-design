import { useQuery } from '@tanstack/react-query';
import { mockUsers } from '@/lib/mock/users.mock';
import { mockDons } from '@/lib/mock/dons.mock';
import { mockCampagnes } from '@/lib/mock/campagnes.mock';
import { mockEvenements } from '@/lib/mock/evenements.mock';
import { mockSignalements } from '@/lib/mock/moderation.mock';
import { delay } from '@/lib/api/client';
import type { User } from '@/types';

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
    queryFn: async () => {
      await delay(300);
      return {
        totalFideles: 2847,
        nouveauxParMois: 124,
        totalDons: 12450,
        croissanceDons: 18,
        totalEvenements: 8,
        evenementsSemaine: 3,
        totalMeditations: 156,
        meditationsSemaine: 4,
      };
    },
  });
}

export function useAdminMembers(filters?: AdminMemberFilters) {
  return useQuery({
    queryKey: ['admin-members', filters],
    queryFn: async () => {
      await delay(400);
      let members = [...mockUsers];

      if (filters?.search) {
        const search = filters.search.toLowerCase();
        members = members.filter(
          (u) =>
            u.nomComplet.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search)
        );
      }
      if (filters?.diaspora && filters.diaspora !== 'all') {
        members = members.filter((u) => u.typeDiaspora === filters.diaspora);
      }
      if (filters?.pays && filters.pays !== 'all') {
        members = members.filter((u) => u.paysResidence === filters.pays);
      }
      if (filters?.role && filters.role !== 'all') {
        members = members.filter((u) => u.role === filters.role);
      }
      if (filters?.statut && filters.statut !== 'all') {
        members = members.filter((u) => u.statut === filters.statut);
      }

      return {
        members,
        total: mockUsers.length,
        actifs: mockUsers.filter((u) => u.statut === 'actif').length,
        inactifs: mockUsers.filter((u) => u.statut === 'inactif').length,
        nouveaux: 12,
      };
    },
  });
}

export function useAdminDons() {
  return useQuery({
    queryKey: ['admin-dons'],
    queryFn: async () => {
      await delay(300);

      // Monthly chart data (6 months)
      const monthlyData = [
        { label: 'Sept', value: 1850 },
        { label: 'Oct', value: 2100 },
        { label: 'Nov', value: 1600 },
        { label: 'Dec', value: 3200 },
        { label: 'Jan', value: 2400 },
        { label: 'Fev', value: 2800 },
      ];

      // Payment method breakdown
      const paymentMethods = [
        { label: 'Carte bancaire', value: 68 },
        { label: 'PayPal', value: 32 },
      ];

      // Top donors
      const topDonors = mockUsers
        .sort((a, b) => b.donsEffectues - a.donsEffectues)
        .slice(0, 5)
        .map((u) => ({
          nom: u.nomComplet,
          nombreDons: u.donsEffectues,
          total: u.donsEffectues * 85, // Approx
        }));

      return {
        totalCollecte: 45230,
        donsCount: mockDons.length,
        campagnes: mockCampagnes,
        dons: mockDons,
        monthlyData,
        paymentMethods,
        topDonors,
        donMoyen: 127,
      };
    },
  });
}

export function useModeration() {
  return useQuery({
    queryKey: ['moderation'],
    queryFn: async () => {
      await delay(300);
      const pending = mockSignalements.filter((s) => s.statut === 'en_attente');
      const history = mockSignalements.filter((s) => s.statut !== 'en_attente');
      return {
        pending,
        history,
        total: mockSignalements.length,
        pendingCount: pending.length,
      };
    },
  });
}
