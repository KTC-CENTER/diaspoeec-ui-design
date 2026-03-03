export interface Video {
  id: string;
  titre: string;
  type: 'enregistre' | 'live' | 'planifie';
  scheduledAt?: string | null;
  youtubeId: string;
  thumbnailGradient: string;
  dureeSeconds?: number;
  vues: number;
  likes: number;
  spectateursLive?: number;
  badge?: 'POPULAIRE' | 'NOEL' | null;
  auteur: string;
  publishedAt: string;
  userLiked?: boolean;
}

export interface ServiceAVenir {
  id: string;
  titre: string;
  date: string;
  heure: string;
  lieu: string;
  rappelActif: boolean;
}
