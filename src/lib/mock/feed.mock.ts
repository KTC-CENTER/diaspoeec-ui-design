import type { FeedItem } from '@/types';

export const mockFeedItems: FeedItem[] = [
  {
    id: 'feed_001',
    type: 'meditation',
    data: {
      id: 'med_001',
      titre: 'Marcher par la foi, pas par la vue',
      extrait:
        'La foi est cette conviction profonde qui nous pousse a avancer meme quand le chemin semble incertain.',
      categorie: 'foi',
      auteurNom: 'Pasteur Emmanuel Ndongo',
      auteurRole: 'Pasteur principal, EEC Paris',
      thumbnailGradient: 'from-forest-700 to-forest-500',
      tempsLecture: 7,
      likes: 42,
      commentCount: 8,
    },
    createdAt: '2026-02-24T06:00:00Z',
  },
  {
    id: 'feed_002',
    type: 'evenement',
    data: {
      id: 'evt_002',
      titre: 'Vivre sa foi dans la diaspora',
      type: 'conference',
      date: '2026-02-28T15:00:00Z',
      lieu: 'En ligne (Zoom)',
      participantsInscrits: 52,
      maxParticipants: 200,
      commentCount: 12,
    },
    createdAt: '2026-02-23T18:00:00Z',
  },
  {
    id: 'feed_003',
    type: 'anniversaire',
    data: {
      nom: 'Marie-Claire Fotso',
      age: 27,
      avatarUrl: '/images/avatars/marie-claire.jpg',
    },
    createdAt: '2026-02-25T00:00:00Z',
  },
  {
    id: 'feed_004',
    type: 'campagne',
    data: {
      id: 'camp_002',
      titre: 'Construction du Centre Communautaire',
      objectifMontant: 100000,
      montantCollecte: 72000,
      nombreDonateurs: 215,
      statut: 'active',
    },
    createdAt: '2026-02-22T12:00:00Z',
  },
  {
    id: 'feed_005',
    type: 'live',
    data: {
      id: 'vid_001',
      titre: 'Culte en direct - Dimanche de la Transfiguration',
      type: 'live',
      youtubeId: 'dQw4w9WgXcQ',
      thumbnailGradient: 'from-forest-900 to-ink-800',
      spectateursLive: 145,
      auteur: 'EEC Paris',
    },
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'feed_006',
    type: 'lecture',
    data: {
      reference: 'Psaume 23:1-6',
      titre: "L'Eternel est mon berger",
      planNom: 'Les Psaumes en 30 jours',
      jour: 15,
      totalJours: 30,
    },
    createdAt: '2026-02-25T05:00:00Z',
  },
];
