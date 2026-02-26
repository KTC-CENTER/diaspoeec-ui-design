import { useQuery, useMutation } from '@tanstack/react-query';
import { mockDons } from '@/lib/mock/dons.mock';
import { mockCampagnes } from '@/lib/mock/campagnes.mock';
import { delay } from '@/lib/api/client';
import type { Don, Campagne } from '@/types';

export function useDons() {
  return useQuery({
    queryKey: ['dons'],
    queryFn: async () => {
      await delay(300);
      return mockDons;
    },
  });
}

export function useCampagnes() {
  return useQuery({
    queryKey: ['campagnes'],
    queryFn: async () => {
      await delay(300);
      return mockCampagnes;
    },
  });
}

export function useCampagne(id: string) {
  return useQuery({
    queryKey: ['campagne', id],
    queryFn: async () => {
      await delay(200);
      return mockCampagnes.find((c) => c.id === id) ?? null;
    },
  });
}

export function useCreateDon() {
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
      await delay(1500);
      return {
        success: true,
        donId: `don_${Date.now()}`,
        message: 'Don enregistre avec succes',
      };
    },
  });
}

export function useDonStats() {
  return useQuery({
    queryKey: ['don-stats'],
    queryFn: async () => {
      await delay(200);
      // Compute stats from mock data for current user
      const userDons = mockDons.filter((d) => d.donateurId === 'usr_001');
      const currentYear = new Date().getFullYear();
      const thisYearDons = userDons.filter(
        (d) => new Date(d.createdAt).getFullYear() === currentYear
      );

      const totalAmount = userDons.reduce((sum, d) => {
        // Simple EUR conversion for display
        return sum + d.montant;
      }, 0);

      const thisYearAmount = thisYearDons.reduce((sum, d) => sum + d.montant, 0);

      return {
        totalDonne: totalAmount,
        totalCetteAnnee: thisYearAmount,
        nombreDons: userDons.length,
        devise: 'EUR' as const,
      };
    },
  });
}
