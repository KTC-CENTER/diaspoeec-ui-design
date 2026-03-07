export type UserRole = 'fidele' | 'pasteur' | 'responsable_zone' | 'admin';
export type Ministere = 'chorale' | 'jeunesse' | 'diaconie' | 'enseignement' | 'priere' | 'evangelisation';
export type DiasporaType = 'etudiante' | 'professionnelle' | 'familiale' | 'missionnaire';
export type Sexe = 'homme' | 'femme';

export interface Paroisse {
  id: string;
  slug: string;
  code: string;
  label: string;
  ville?: string;
  synode?: string;
  region?: string;
  pasteurNom?: string;
  messageAccueil?: string;
  logoUrl?: string;
  splashImageUrl?: string;
  couleurPrimaire: string;
  couleurSecondaire: string;
  couleurAccent: string;
  actif: boolean;
}

export interface User {
  id: string;
  nomComplet: string;
  email: string;
  emailVerified: boolean;
  googleId?: string | null;
  avatarUrl?: string;
  paroisseId?: string;
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
