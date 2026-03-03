import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDons, getDonHistory, getSubscriptions, createDon } from '@/lib/api/dons.api';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { Campagne } from '@/types';

export function useDons() {
  return useQuery({
    queryKey: ['dons'],
    queryFn: getDons,
  });
}

export function useDonHistory() {
  return useQuery({
    queryKey: ['don-history'],
    queryFn: getDonHistory,
  });
}

export function useCampagnes() {
  return useQuery({
    queryKey: ['campagnes'],
    queryFn: async () => {
      return apiClient.get<Campagne[]>(ENDPOINTS.CAMPAGNES);
    },
  });
}

export function useCampagne(id: string) {
  return useQuery({
    queryKey: ['campagne', id],
    queryFn: async () => {
      return apiClient.get<Campagne>(ENDPOINTS.CAMPAGNE_BY_ID(id));
    },
  });
}

export function useCreateDon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      campagneId: string;
      montant: number;
      devise: string;
      frequence: string;
      estAnonyme: boolean;
      message?: string;
      methodePaiement: string;
    }) => {
      const don = await createDon(data as Parameters<typeof createDon>[0]);
      return {
        success: true,
        donId: don.id,
        message: 'Don enregistre avec succes',
      };
    },
    onSuccess: () => {
      // Invalider les caches pour que les campagnes et l'historique soient a jour
      queryClient.invalidateQueries({ queryKey: ['campagnes'] });
      queryClient.invalidateQueries({ queryKey: ['don-history'] });
      queryClient.invalidateQueries({ queryKey: ['don-stats'] });
    },
  });
}

export function useDonStats() {
  return useQuery({
    queryKey: ['don-stats'],
    queryFn: async () => {
      const [history] = await Promise.all([
        getDonHistory(),
        getSubscriptions(),
      ]);

      const totalAmount = history.reduce((sum, d) => sum + parseFloat(String(d.montant)), 0);
      const currentYear = new Date().getFullYear();
      const thisYearDons = history.filter(
        (d) => new Date(d.createdAt).getFullYear() === currentYear
      );
      const thisYearAmount = thisYearDons.reduce((sum, d) => sum + parseFloat(String(d.montant)), 0);

      return {
        totalDonne: totalAmount,
        totalCetteAnnee: thisYearAmount,
        nombreDons: history.length,
        devise: 'EUR' as const,
      };
    },
  });
}
