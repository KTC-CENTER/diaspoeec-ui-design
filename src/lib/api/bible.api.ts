import type { PlanLecture, LectureJour, NoteBible } from '@/types';
import { apiClient } from './client';
import { ENDPOINTS } from './endpoints';

// ============================================================================
// Bible API
// ============================================================================

export interface CreateNotePayload {
  reference: string;
  contenu: string;
}

export async function getPlansLecture(): Promise<PlanLecture[]> {
  return apiClient.get<PlanLecture[]>(ENDPOINTS.BIBLE.PLANS);
}

export async function getPlansDecouverte(): Promise<PlanLecture[]> {
  return apiClient.get<PlanLecture[]>(ENDPOINTS.BIBLE.PLANS_ALL);
}

export async function getLectureJour(): Promise<LectureJour> {
  return apiClient.get<LectureJour>(ENDPOINTS.BIBLE.LECTURE_JOUR);
}

export async function getNotes(): Promise<NoteBible[]> {
  return apiClient.get<NoteBible[]>(ENDPOINTS.BIBLE.NOTES);
}

export async function createNote(data: CreateNotePayload): Promise<NoteBible> {
  return apiClient.post<NoteBible>(ENDPOINTS.BIBLE.NOTES, data);
}

export async function completeLectureJour(planId: string): Promise<PlanLecture> {
  return apiClient.put<PlanLecture>(`${ENDPOINTS.BIBLE.PLANS}/${planId}/complete-jour`);
}

export async function startPlan(planId: string): Promise<PlanLecture> {
  return apiClient.post<PlanLecture>(`${ENDPOINTS.BIBLE.PLANS}/${planId}/start`);
}

export interface VersetResult {
  reference: string;
  livre: string;
  chapitre: number;
  versets: { numero: number; texte: string }[];
}

export async function getVerset(ref: string): Promise<VersetResult> {
  return apiClient.get<VersetResult>(ENDPOINTS.BIBLE.VERSET, { params: { ref } });
}

export async function getChapter(livre: string, chapitre: number): Promise<VersetResult> {
  return apiClient.get<VersetResult>(ENDPOINTS.BIBLE.CHAPITRE, {
    params: { livre, ch: String(chapitre) },
  });
}

// ── Lecture courante d'un plan ─────────────────────────────────────────────

export interface LecturePlanItem {
  id: string;
  jourNumero: number;
  reference: string;
  titre: string;
  texte: string | null;
}

export interface LectureCouranteResult {
  termine: boolean;
  jourNumero: number;
  lecture: LecturePlanItem | null;
  disponible: boolean;
  prochaineLecture: string | null; // ISO date string UTC minuit du lendemain
}

export async function getLectureCourante(planId: string): Promise<LectureCouranteResult> {
  return apiClient.get<LectureCouranteResult>(ENDPOINTS.BIBLE.LECTURE_COURANTE(planId));
}

// ── Stats ──────────────────────────────────────────────────────────────────

export interface BibleStats {
  plansCompletes: number;
  joursConsecutifs: number;
  versetsAnnotes: number;
}

export async function getBibleStats(): Promise<BibleStats> {
  return apiClient.get<BibleStats>(ENDPOINTS.BIBLE.STATS);
}

// ── Admin ──────────────────────────────────────────────────────────────────

export interface CreatePlanPayload {
  titre: string;
  dureeJours: number;
  icone?: string;
}

export interface CreateLectureJourPayload {
  jourNumero: number;
  reference: string;
  titre: string;
  texte?: string;
}

export interface PlanDetail {
  id: string;
  titre: string;
  dureeJours: number;
  icone?: string;
  lectures: {
    id: string;
    jourNumero: number;
    reference: string;
    titre: string;
    texte: string | null;
  }[];
}

export interface UpdatePlanPayload {
  titre?: string;
  icone?: string;
}

export interface UpdateLectureJourPayload {
  reference?: string;
  titre?: string;
  texte?: string;
}

export interface AdminPlanSummary {
  id: string;
  titre: string;
  dureeJours: number;
  icone?: string;
  joursCompletes: number;
  lectureDisponible: boolean;
  lecturesConfigurees: number;
  estComplet: boolean;
}

export async function adminGetAllPlans(): Promise<AdminPlanSummary[]> {
  return apiClient.get<AdminPlanSummary[]>(ENDPOINTS.BIBLE.ADMIN_PLANS);
}

export async function adminCreatePlan(data: CreatePlanPayload): Promise<{ id: string }> {
  return apiClient.post(ENDPOINTS.BIBLE.ADMIN_PLANS, data);
}

export async function adminUpdatePlan(planId: string, data: UpdatePlanPayload): Promise<PlanDetail> {
  return apiClient.put<PlanDetail>(ENDPOINTS.BIBLE.ADMIN_PLAN_BY_ID(planId), data);
}

export async function adminGetPlanDetail(planId: string): Promise<PlanDetail> {
  return apiClient.get<PlanDetail>(ENDPOINTS.BIBLE.ADMIN_PLAN_BY_ID(planId));
}

export async function adminDeletePlan(planId: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.BIBLE.ADMIN_PLAN_BY_ID(planId));
}

export async function adminAddLecture(planId: string, data: CreateLectureJourPayload): Promise<{ id: string }> {
  return apiClient.post(ENDPOINTS.BIBLE.ADMIN_PLAN_LECTURES(planId), data);
}

export async function adminUpdateLecture(lectureId: string, data: UpdateLectureJourPayload): Promise<{ id: string }> {
  return apiClient.put(ENDPOINTS.BIBLE.ADMIN_LECTURE_BY_ID(lectureId), data);
}

export async function adminDeleteLecture(lectureId: string): Promise<void> {
  return apiClient.delete(ENDPOINTS.BIBLE.ADMIN_LECTURE_BY_ID(lectureId));
}
