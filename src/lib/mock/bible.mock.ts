import type { PlanLecture, LectureJour, NoteBible } from '@/types';

export const mockPlansLecture: PlanLecture[] = [
  {
    id: 'plan_001',
    titre: 'Les Psaumes en 30 jours',
    dureeJours: 30,
    joursCompletes: 15,
    icone: 'book-open',
  },
  {
    id: 'plan_002',
    titre: "L'Evangile de Jean en 21 jours",
    dureeJours: 21,
    joursCompletes: 4,
    icone: 'scroll-text',
  },
  {
    id: 'plan_003',
    titre: 'Les Beatitudes en 7 jours',
    dureeJours: 7,
    joursCompletes: 0,
    icone: 'heart',
  },
  {
    id: 'plan_004',
    titre: 'Proverbes en 31 jours',
    dureeJours: 31,
    joursCompletes: 0,
    icone: 'lightbulb',
  },
];

export const mockLectureJour: LectureJour = {
  id: 'lecture_001',
  reference: 'Psaume 23:1-6',
  titre: "L'Eternel est mon berger",
  likeCount: 12,
  userLiked: false,
  texte:
    "L'Eternel est mon berger : je ne manquerai de rien.\n\nIl me fait reposer dans de verts paturages, il me dirige pres des eaux paisibles.\n\nIl restaure mon ame, il me conduit dans les sentiers de la justice, a cause de son nom.\n\nQuand je marche dans la vallee de l'ombre de la mort, je ne crains aucun mal, car tu es avec moi : ta houlette et ton baton me rassurent.\n\nTu dresses devant moi une table, en face de mes adversaires ; tu oins d'huile ma tete, et ma coupe deborde.\n\nOui, le bonheur et la grace m'accompagneront tous les jours de ma vie, et j'habiterai dans la maison de l'Eternel jusqu'a la fin de mes jours.",
};

export const mockNotesBible: NoteBible[] = [
  {
    id: 'note_001',
    reference: 'Romains 8:28',
    contenu:
      'Toutes choses concourent au bien de ceux qui aiment Dieu. Meme les epreuves de la diaspora font partie de Son plan pour nous. Ce verset me porte dans les moments difficiles loin du pays.',
    createdAt: '2026-02-24T14:30:00Z',
  },
  {
    id: 'note_002',
    reference: 'Philippiens 4:13',
    contenu:
      'Je puis tout par celui qui me fortifie. Cette promesse me porte chaque jour dans mes defis professionnels a Paris. A relire chaque matin avant le travail.',
    createdAt: '2026-02-22T09:15:00Z',
  },
  {
    id: 'note_003',
    reference: 'Josue 1:9',
    contenu:
      'Fortifie-toi et prends courage. Ne t\'effraie point et ne t\'epouvante point, car l\'Eternel, ton Dieu, est avec toi partout ou tu iras. Verset partage par le Pasteur Ndongo lors du culte de dimanche.',
    createdAt: '2026-02-20T20:00:00Z',
  },
];

export const mockPlansDecouverte: PlanLecture[] = [
  {
    id: 'plan_discover_001',
    titre: 'Introduction aux Proverbes',
    dureeJours: 31,
    joursCompletes: 0,
    icone: 'lightbulb',
  },
  {
    id: 'plan_discover_002',
    titre: 'La vie de Jesus',
    dureeJours: 40,
    joursCompletes: 0,
    icone: 'cross',
  },
  {
    id: 'plan_discover_003',
    titre: 'Femmes de la Bible',
    dureeJours: 21,
    joursCompletes: 0,
    icone: 'heart',
  },
  {
    id: 'plan_discover_004',
    titre: "L'Apocalypse expliquee",
    dureeJours: 22,
    joursCompletes: 0,
    icone: 'flame',
  },
];
