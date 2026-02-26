export type EventType = 'culte' | 'conference' | 'retraite' | 'formation' | 'jeunesse';

export interface ProgrammeItem {
  heure: string;
  description: string;
}

export interface Evenement {
  id: string;
  titre: string;
  type: EventType;
  date: string;
  heureFin?: string;
  lieu: string;
  lienZoom?: string;
  description: string;
  programme: ProgrammeItem[];
  maxParticipants?: number;
  participantsInscrits: number;
  commentCount: number;
  actif: boolean;
  createurId?: string;
  createurNom?: string;
}
