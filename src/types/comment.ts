export interface Comment {
  id: string;
  auteurId: string;
  auteurNom: string;
  auteurRole?: string;
  contenu: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}
