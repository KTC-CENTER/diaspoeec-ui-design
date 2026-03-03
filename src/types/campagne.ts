export interface Campagne {
  id: string;
  titre: string;
  description: string;
  objectifMontant: number | null;
  montantCollecte: number;
  nombreDonateurs: number;
  affectationFonds: string[];
  dateDebut: string;
  dateFin?: string;
  statut: 'active' | 'terminee' | 'pausee';
}
