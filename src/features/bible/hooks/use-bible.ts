import { useQuery } from '@tanstack/react-query';
import {
  mockPlansLecture,
  mockLectureJour,
  mockNotesBible,
  mockPlansDecouverte,
} from '@/lib/mock/bible.mock';
import { delay } from '@/lib/utils/format';

export function usePlansLecture() {
  return useQuery({
    queryKey: ['plans-lecture'],
    queryFn: async () => {
      await delay(250);
      return mockPlansLecture;
    },
  });
}

export function useLectureJour() {
  return useQuery({
    queryKey: ['lecture-jour'],
    queryFn: async () => {
      await delay(200);
      return mockLectureJour;
    },
  });
}

export function useNotesBible() {
  return useQuery({
    queryKey: ['notes-bible'],
    queryFn: async () => {
      await delay(200);
      return mockNotesBible;
    },
  });
}

export function usePlansDecouverte() {
  return useQuery({
    queryKey: ['plans-decouverte'],
    queryFn: async () => {
      await delay(200);
      return mockPlansDecouverte;
    },
  });
}
