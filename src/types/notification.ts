export type NotificationType =
  | 'nouvelle_meditation'
  | 'rappel_evenement'
  | 'anniversaire'
  | 'confirmation_don'
  | 'reponse_commentaire'
  | 'like'
  | 'rappel_lecture'
  | 'culte_en_direct'
  | 'nouvel_evenement_zone';

export interface Notification {
  id: string;
  type: NotificationType;
  titre: string;
  description: string;
  lien?: string;
  lu: boolean;
  createdAt: string;
}
