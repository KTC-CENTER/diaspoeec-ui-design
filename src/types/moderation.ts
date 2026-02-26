export interface SignalementModeration {
  id: string;
  type: 'commentaire' | 'temoignage';
  severite: 'haute' | 'moyenne' | 'basse';
  contenuSignale: string;
  auteurContenuNom: string;
  signaleParNom: string;
  autresSignalements: number;
  contexte: string;
  statut: 'en_attente' | 'approuve' | 'supprime' | 'utilisateur_suspendu';
  createdAt: string;
}
