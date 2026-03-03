export interface PlanLecture {
  id: string;
  titre: string;
  dureeJours: number;
  joursCompletes: number;
  icone: string;
  lectureDisponible: boolean;
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
