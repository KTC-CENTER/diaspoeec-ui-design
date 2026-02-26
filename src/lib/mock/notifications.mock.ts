import type { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  // --- Aujourd'hui (3 non lues) ---
  {
    id: 'notif_001',
    type: 'nouvelle_meditation',
    titre: 'Nouvelle meditation disponible',
    description:
      'Le Pasteur Emmanuel Ndongo a publie une nouvelle meditation : "Marcher par la foi, pas par la vue". Prenez quelques minutes pour la lire et nourrir votre foi.',
    lien: '/meditations/med_001',
    lu: false,
    createdAt: '2026-02-25T07:00:00Z',
  },
  {
    id: 'notif_002',
    type: 'rappel_evenement',
    titre: 'Rappel : Conference en ligne samedi',
    description:
      'La conference "Vivre sa foi dans la diaspora" aura lieu ce samedi 28 fevrier a 15h sur Zoom. N\'oubliez pas de vous connecter ! Lien dans les details de l\'evenement.',
    lien: '/evenements/evt_002',
    lu: false,
    createdAt: '2026-02-25T08:30:00Z',
  },
  {
    id: 'notif_003',
    type: 'anniversaire',
    titre: 'Joyeux anniversaire Marie-Claire !',
    description:
      'Notre soeur Marie-Claire Fotso fete son anniversaire aujourd\'hui. Envoyez-lui un message de voeux et de benedictions pour l\'encourager dans sa marche avec le Seigneur.',
    lu: false,
    createdAt: '2026-02-25T06:00:00Z',
  },

  // --- Hier (3 lues) ---
  {
    id: 'notif_004',
    type: 'confirmation_don',
    titre: 'Don confirme - 50,00 EUR',
    description:
      'Votre don mensuel de 50,00 EUR pour la campagne "Don general - Soutien a l\'EEC" a ete confirme avec succes. Merci pour votre generosite ! Un recu fiscal est disponible dans votre historique.',
    lien: '/dons/historique',
    lu: true,
    createdAt: '2026-02-24T14:30:00Z',
  },
  {
    id: 'notif_005',
    type: 'reponse_commentaire',
    titre: 'Nouvelle reponse a votre commentaire',
    description:
      'Soeur Elise Nkotto a repondu a votre commentaire sur la meditation "La priere qui transforme" : "Merci frere Jean-Paul pour ce beau partage. Votre temoignage nous encourage tous !"',
    lien: '/meditations/med_002',
    lu: true,
    createdAt: '2026-02-24T11:15:00Z',
  },
  {
    id: 'notif_006',
    type: 'like',
    titre: 'Votre commentaire a ete apprecie',
    description:
      '5 personnes ont aime votre commentaire sur la meditation "L\'amour inconditionnel de Dieu". Continuez a partager vos reflexions avec la communaute !',
    lien: '/meditations/med_003',
    lu: true,
    createdAt: '2026-02-24T09:00:00Z',
  },

  // --- Cette semaine (3 lues) ---
  {
    id: 'notif_007',
    type: 'rappel_lecture',
    titre: 'Continuez votre plan de lecture',
    description:
      'Vous etes au jour 15 de votre plan "Les Psaumes en 30 jours". La lecture du jour est le Psaume 23. Ne lachez pas, vous avez deja parcouru 50% du plan !',
    lien: '/bible',
    lu: true,
    createdAt: '2026-02-22T06:00:00Z',
  },
  {
    id: 'notif_008',
    type: 'culte_en_direct',
    titre: 'Culte en direct maintenant',
    description:
      'Le culte de louange dominical est en direct ! Rejoignez-nous en ligne pour un temps de louange et la predication du Pasteur Ndongo. 45 personnes sont deja connectees.',
    lien: '/cultes',
    lu: true,
    createdAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 'notif_009',
    type: 'nouvel_evenement_zone',
    titre: 'Nouvel evenement dans votre zone',
    description:
      'Un nouvel evenement a ete programme pour votre zone : "Rencontre des jeunes EEC Europe" le 15 mars 2026 a Bruxelles. Inscrivez-vous des maintenant, les places sont limitees !',
    lien: '/evenements/evt_004',
    lu: true,
    createdAt: '2026-02-20T14:00:00Z',
  },
];
