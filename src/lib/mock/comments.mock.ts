import type { Comment } from '@/types';

export const mockComments: Record<string, Comment[]> = {
  med_001: [
    {
      id: 'com_001',
      auteurId: 'usr_003',
      auteurNom: 'Marie-Claire Fotso',
      auteurRole: 'Fidele',
      contenu:
        'Merci Pasteur pour cette meditation. Elle tombe a point nomme dans ma vie. Je traverse une periode difficile avec mes etudes a Berlin, et ces paroles me rappellent que Dieu est fidele meme quand on ne voit pas le bout du tunnel.',
      likes: 8,
      replies: [
        {
          id: 'com_001_r1',
          auteurId: 'usr_002',
          auteurNom: 'Pasteur Emmanuel Ndongo',
          auteurRole: 'Pasteur',
          contenu:
            "Courage ma soeur ! Dieu achevera Son oeuvre en toi. N'hesite pas a nous appeler si tu as besoin de priere. La communaute est la pour te soutenir.",
          likes: 5,
          replies: [],
          createdAt: '2026-02-24T09:00:00Z',
        },
      ],
      createdAt: '2026-02-24T07:30:00Z',
    },
    {
      id: 'com_002',
      auteurId: 'usr_004',
      auteurNom: 'Samuel Biyong',
      auteurRole: 'Diacre',
      contenu:
        "Hebreux 11:1 est l'un de mes versets preferes. Cette meditation m'encourage a continuer dans la foi malgre les defis du quotidien a Bruxelles. Soyons fortifies freres et soeurs !",
      likes: 4,
      replies: [],
      createdAt: '2026-02-24T10:15:00Z',
    },
    {
      id: 'com_003',
      auteurId: 'usr_009',
      auteurNom: 'Sophie Manga',
      contenu:
        'Amen ! La foi est notre bouclier. Merci pour ce rappel precieux. Je partage cette meditation avec mon groupe de cellule de maison a Lyon.',
      likes: 3,
      replies: [],
      createdAt: '2026-02-24T12:00:00Z',
    },
    {
      id: 'com_004',
      auteurId: 'usr_007',
      auteurNom: 'Elise Nkotto',
      auteurRole: 'Responsable jeunesse',
      contenu:
        "Cette meditation me touche profondement. En tant que jeune etudiante loin du Cameroun, la foi est vraiment ce qui me porte chaque jour. Merci Pasteur Ndongo pour ces mots d'encouragement.",
      likes: 6,
      replies: [],
      createdAt: '2026-02-24T14:30:00Z',
    },
  ],
  med_002: [
    {
      id: 'com_005',
      auteurId: 'usr_007',
      auteurNom: 'Elise Nkotto',
      auteurRole: 'Responsable jeunesse',
      contenu:
        "La priere est vraiment le souffle de notre vie spirituelle. Depuis que j'ai rejoint le groupe de priere en ligne, ma vie a change. Merci pour cette meditation edifiante !",
      likes: 6,
      replies: [],
      createdAt: '2026-02-22T08:00:00Z',
    },
    {
      id: 'com_006',
      auteurId: 'usr_008',
      auteurNom: 'Paul Essomba',
      contenu:
        "Depuis New York, je confirme que la priere nous unit par-dela les oceans. Que Dieu benisse l'EEC de la diaspora. Continuons a prier les uns pour les autres !",
      likes: 7,
      replies: [],
      createdAt: '2026-02-22T15:00:00Z',
    },
  ],
};
