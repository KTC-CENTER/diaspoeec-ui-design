export type UserRole = 'fidele' | 'pasteur' | 'responsable_zone' | 'admin';
export type Ministere = 'chorale' | 'jeunesse' | 'diaconie' | 'enseignement' | 'priere' | 'evangelisation';
export type DiasporaType = 'etudiante' | 'professionnelle' | 'familiale' | 'missionnaire';
export type Sexe = 'homme' | 'femme';

export interface User {
  id: string;
  nomComplet: string;
  email: string;
  emailVerified: boolean;
  googleId?: string | null;
  avatarUrl?: string;
  dateNaissance: string;
  sexe: Sexe;
  telephone?: string;
  telephoneCountryCode?: string;
  typeDiaspora: DiasporaType;
  paysResidence: string;
  ville: string;
  paroisseOrigine: string;
  baptise: boolean;
  dateBapteme?: string;
  ministeres: Ministere[];
  role: UserRole;
  langue?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  donsEffectues: number;
  evenementsSuivis: number;
  jaimesTotal: number;
  createdAt: string;
}
