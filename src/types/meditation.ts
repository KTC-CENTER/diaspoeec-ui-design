export type MeditationCategorie = 'foi' | 'priere' | 'famille' | 'esperance' | 'grace' | 'perseverance';

export interface Meditation {
  id: string;
  titre: string;
  extrait: string;
  contenu: string;
  categorie: MeditationCategorie;
  auteurId: string;
  auteurNom: string;
  auteurRole: string;
  thumbnailGradient: string;
  tempsLecture: number;
  likes: number;
  commentCount: number;
  publishedAt: string;
  userLiked?: boolean;
}
