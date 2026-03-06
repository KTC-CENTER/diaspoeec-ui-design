export interface PlanLecture {
  id: string;
  titre: string;
  dureeJours: number;
  joursCompletes: number;
  icone: string;
  lectureDisponible?: boolean;
}

export interface LectureJour {
  id: string | null;
  reference: string;
  titre: string;
  texte: string;
  contenu?: string;
  likeCount: number;
  userLiked: boolean;
}

export interface NoteBible {
  id: string;
  reference: string;
  contenu: string;
  createdAt: string;
}
