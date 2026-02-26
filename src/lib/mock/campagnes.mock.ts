import type { Campagne } from '@/types';

export const mockCampagnes: Campagne[] = [
  {
    id: 'camp_001',
    titre: "Don general - Soutien a l'EEC",
    description:
      "Votre don general soutient l'ensemble des activites de l'Eglise Evangelique du Cameroun dans la diaspora : cultes, formations, aide sociale, communication et administration. Chaque contribution, quelle que soit sa taille, fait une difference concrete dans la vie de notre communaute dispersee a travers le monde.",
    objectifMontant: 100000,
    montantCollecte: 45000,
    nombreDonateurs: 128,
    affectationFonds: [
      'Fonctionnement des lieux de culte (loyer, electricite, entretien)',
      'Salaires et indemnites des pasteurs et responsables de zone',
      'Activites communautaires et evenements (retraites, conferences, cultes speciaux)',
      'Communication et outils numeriques (site web, application, streaming)',
    ],
    dateDebut: '2026-01-01',
    dateFin: '2026-12-31',
    statut: 'active',
  },
  {
    id: 'camp_002',
    titre: 'Construction du Centre Communautaire',
    description:
      "Le projet de construction d'un Centre Communautaire EEC a Paris est un reve de longue date pour notre diaspora. Ce centre servira de lieu de culte permanent, de salle de reunion, d'espace pour les activites jeunesse et de centre d'accueil pour les nouveaux arrivants camerounais en France. L'acquisition du terrain est finalisee et les travaux doivent debuter au printemps 2026.",
    objectifMontant: 100000,
    montantCollecte: 72000,
    nombreDonateurs: 215,
    affectationFonds: [
      'Travaux de construction et renovation du batiment principal',
      'Amenagement de la grande salle de culte (500 places)',
      'Equipement audiovisuel et sonorisation professionnelle',
      'Amenagement des salles annexes (jeunesse, formation, accueil)',
    ],
    dateDebut: '2025-06-01',
    dateFin: '2027-06-01',
    statut: 'active',
  },
  {
    id: 'camp_003',
    titre: 'Soutien aux etudiants EEC',
    description:
      "Ce fonds est dedie au soutien de nos jeunes etudiants camerounais dans la diaspora. Beaucoup d'entre eux font face a des difficultes financieres importantes : frais de scolarite, logement, alimentation, livres et materiel. Cette campagne vise a leur apporter une aide concrete pour qu'ils puissent poursuivre leurs etudes dans de bonnes conditions tout en servant l'eglise et la communaute.",
    objectifMontant: 10000,
    montantCollecte: 4500,
    nombreDonateurs: 47,
    affectationFonds: [
      "Bourses d'etudes partielles pour les etudiants en difficulte",
      "Aide d'urgence (loyer, alimentation) pour les cas critiques",
      'Achat de materiel informatique et livres universitaires',
    ],
    dateDebut: '2025-09-01',
    dateFin: '2026-08-31',
    statut: 'active',
  },
  {
    id: 'camp_004',
    titre: 'Aide humanitaire Cameroun',
    description:
      "Face aux crises humanitaires qui touchent certaines regions du Cameroun, l'EEC Diaspora se mobilise pour venir en aide a nos freres et soeurs restes au pays. Cette campagne finance l'envoi de vivres, de medicaments, de materiel scolaire et d'aide financiere directe aux familles les plus touchees, en partenariat avec les paroisses locales de l'EEC au Cameroun.",
    objectifMontant: 10000,
    montantCollecte: 2300,
    nombreDonateurs: 34,
    affectationFonds: [
      'Envoi de colis de vivres et de premiere necessite',
      'Achat et distribution de medicaments essentiels',
      'Soutien financier direct aux familles sinistrees via les paroisses locales',
      'Materiel scolaire pour les enfants deplaces',
    ],
    dateDebut: '2025-11-01',
    statut: 'active',
  },
];
