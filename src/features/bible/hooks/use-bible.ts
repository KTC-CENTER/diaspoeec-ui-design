import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPlansLecture,
  getPlansDecouverte,
  getLectureJour,
  getNotes,
  startPlan,
  completeLectureJour,
  createNote,
  getVerset,
  getChapter,
  getLectureCourante,
  adminGetAllPlans,
  adminCreatePlan,
  adminUpdatePlan,
  adminGetPlanDetail,
  adminDeletePlan,
  adminAddLecture,
  adminUpdateLecture,
  adminDeleteLecture,
} from '@/lib/api/bible.api';
import type {
  CreateNotePayload,
  CreatePlanPayload,
  UpdatePlanPayload,
  CreateLectureJourPayload,
  UpdateLectureJourPayload,
} from '@/lib/api/bible.api';

export function usePlansLecture() {
  return useQuery({
    queryKey: ['plans-lecture'],
    queryFn: getPlansLecture,
  });
}

export function useLectureJour() {
  return useQuery({
    queryKey: ['lecture-jour'],
    queryFn: getLectureJour,
  });
}

export function useNotesBible() {
  return useQuery({
    queryKey: ['notes-bible'],
    queryFn: getNotes,
  });
}

export function usePlansDecouverte() {
  return useQuery({
    queryKey: ['plans-decouverte'],
    queryFn: getPlansDecouverte,
  });
}

export function useStartPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => startPlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans-lecture'] });
      queryClient.invalidateQueries({ queryKey: ['plans-decouverte'] });
    },
  });
}

export function useCompleteLectureJour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => completeLectureJour(planId),
    onSuccess: (_data, planId) => {
      queryClient.invalidateQueries({ queryKey: ['plans-lecture'] });
      queryClient.invalidateQueries({ queryKey: ['lecture-courante', planId] });
      queryClient.invalidateQueries({ queryKey: ['profile-bible-stats'] });
    },
  });
}

export function useLectureCourante(planId: string, enabled: boolean) {
  return useQuery({
    queryKey: ['lecture-courante', planId],
    queryFn: () => getLectureCourante(planId),
    enabled: !!planId && enabled,
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNotePayload) => createNote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes-bible'] });
    },
  });
}

export function useVerset(ref: string) {
  return useQuery({
    queryKey: ['verset', ref],
    queryFn: () => getVerset(ref),
    enabled: !!ref,
  });
}

export function useChapter(livre: string, chapitre: number) {
  return useQuery({
    queryKey: ['chapitre', livre, chapitre],
    queryFn: () => getChapter(livre, chapitre),
    enabled: !!livre && chapitre > 0,
  });
}

// ── Admin hooks ──────────────────────────────────────────────────────────────

export function useAdminAllPlans() {
  return useQuery({
    queryKey: ['admin-plans-all'],
    queryFn: adminGetAllPlans,
  });
}

export function useAdminPlanDetail(planId: string) {
  return useQuery({
    queryKey: ['admin-plan-detail', planId],
    queryFn: () => adminGetPlanDetail(planId),
    enabled: !!planId,
  });
}

export function useAdminCreatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePlanPayload) => adminCreatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans-decouverte'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plans-all'] });
    },
  });
}

export function useAdminUpdatePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: UpdatePlanPayload }) =>
      adminUpdatePlan(planId, data),
    onSuccess: (_result, { planId }) => {
      queryClient.invalidateQueries({ queryKey: ['plans-decouverte'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plans-all'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plan-detail', planId] });
    },
  });
}

export function useAdminDeletePlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (planId: string) => adminDeletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans-decouverte'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plans-all'] });
    },
  });
}

export function useAdminAddLecture(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLectureJourPayload) => adminAddLecture(planId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plan-detail', planId] });
    },
  });
}

export function useAdminUpdateLecture(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lectureId, data }: { lectureId: string; data: UpdateLectureJourPayload }) =>
      adminUpdateLecture(lectureId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plan-detail', planId] });
    },
  });
}

export function useAdminDeleteLecture(planId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (lectureId: string) => adminDeleteLecture(lectureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plan-detail', planId] });
    },
  });
}
