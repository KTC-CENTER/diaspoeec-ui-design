import type { PlanLecture, LectureJour, NoteBible } from '@/types';
import {
  mockPlansLecture,
  mockLectureJour,
  mockNotesBible,
  mockPlansDecouverte,
} from '@/lib/mock/bible.mock';
import { delay } from './client';
// import { apiClient } from './client';
// import { ENDPOINTS } from './endpoints';

// ============================================================================
// Bible API
// Actuellement : donnees mock avec delai simule
// Production : decommenter les appels apiClient
// ============================================================================

export interface CreateNotePayload {
  reference: string;
  contenu: string;
}

/**
 * Recupere les plans de lecture actifs de l'utilisateur courant.
 */
export async function getPlansLecture(): Promise<PlanLecture[]> {
  await delay(300);

  return [...mockPlansLecture];

  // --- Production ---
  // return apiClient.get<PlanLecture[]>(ENDPOINTS.BIBLE.PLANS);
}

/**
 * Recupere les plans de lecture suggerees (non encore commences).
 */
export async function getPlansDecouverte(): Promise<PlanLecture[]> {
  await delay(300);

  return [...mockPlansDecouverte];

  // --- Production ---
  // return apiClient.get<PlanLecture[]>(ENDPOINTS.BIBLE.PLANS, { params: { type: 'decouverte' } });
}

/**
 * Recupere la lecture du jour pour le plan actif.
 */
export async function getLectureJour(): Promise<LectureJour> {
  await delay(200);

  return { ...mockLectureJour };

  // --- Production ---
  // return apiClient.get<LectureJour>(ENDPOINTS.BIBLE.LECTURE_JOUR);
}

/**
 * Recupere les notes bibliques de l'utilisateur courant.
 */
export async function getNotes(): Promise<NoteBible[]> {
  await delay(300);

  return [...mockNotesBible].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // --- Production ---
  // return apiClient.get<NoteBible[]>(ENDPOINTS.BIBLE.NOTES);
}

/**
 * Cree une nouvelle note biblique.
 */
export async function createNote(data: CreateNotePayload): Promise<NoteBible> {
  await delay(400);

  const newNote: NoteBible = {
    id: `note_${Date.now()}`,
    reference: data.reference,
    contenu: data.contenu,
    createdAt: new Date().toISOString(),
  };

  mockNotesBible.unshift(newNote);
  return newNote;

  // --- Production ---
  // return apiClient.post<NoteBible>(ENDPOINTS.BIBLE.NOTES, data);
}

/**
 * Marque la lecture du jour comme completee.
 */
export async function completeLectureJour(planId: string): Promise<PlanLecture> {
  await delay(300);

  const plan = mockPlansLecture.find((p) => p.id === planId);
  if (!plan) {
    throw new Error('Plan de lecture introuvable');
  }

  if (plan.joursCompletes < plan.dureeJours) {
    plan.joursCompletes += 1;
  }

  return { ...plan };

  // --- Production ---
  // return apiClient.post<PlanLecture>(`${ENDPOINTS.BIBLE.PLANS}/${planId}/complete`);
}

/**
 * Commence un nouveau plan de lecture.
 */
export async function startPlan(planId: string): Promise<PlanLecture> {
  await delay(300);

  const plan = mockPlansDecouverte.find((p) => p.id === planId);
  if (!plan) {
    throw new Error('Plan de lecture introuvable');
  }

  const activePlan = { ...plan, joursCompletes: 0 };
  mockPlansLecture.push(activePlan);

  return activePlan;

  // --- Production ---
  // return apiClient.post<PlanLecture>(`${ENDPOINTS.BIBLE.PLANS}/${planId}/start`);
}
