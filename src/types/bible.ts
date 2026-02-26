export interface PlanLecture {
  id: string;
  titre: string;
  dureeJours: number;
  joursCompletes: number;
  icone: string;
}

export interface LectureJour {
  reference: string;
  titre: string;
  texte: string;
}

export interface NoteBible {
  id: string;
  reference: string;
  contenu: string;
  createdAt: string;
}
