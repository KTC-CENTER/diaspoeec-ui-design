import type { Evenement } from '@/types';

export const mockEvenements: Evenement[] = [
  {
    id: 'evt_001',
    titre: 'Culte de louange dominical',
    type: 'culte',
    date: '2026-02-22T10:00:00Z',
    heureFin: '2026-02-22T12:30:00Z',
    lieu: 'Eglise EEC Paris, 42 rue de la Convention, 75015 Paris',
    description: `Rejoignez-nous pour notre culte de louange dominical, un moment privilegie de communion fraternelle et d'adoration. Ce dimanche, le Pasteur Emmanuel Ndongo nous partagera un message puissant sur le theme "Vivre comme des ambassadeurs du Christ dans la diaspora".

La chorale de l'EEC Paris nous conduira dans un temps de louange et d'adoration inspire des cantiques traditionnels camerounais et des chants contemporains. Un moment de convivialite autour d'un repas communautaire suivra le culte. Venez avec vos familles, vos amis et vos voisins !`,
    programme: [
      { heure: '10:00', description: 'Accueil et installation des fideles' },
      { heure: '10:15', description: 'Louange et adoration avec la chorale' },
      { heure: '10:45', description: "Lecture biblique et prieres d'intercession" },
      { heure: '11:00', description: 'Message du Pasteur Emmanuel Ndongo' },
      { heure: '11:45', description: 'Offrandes, annonces et benediction finale' },
    ],
    maxParticipants: 120,
    participantsInscrits: 38,
    commentCount: 5,
    actif: true,
  },
  {
    id: 'evt_002',
    titre: 'Vivre sa foi dans la diaspora',
    type: 'conference',
    date: '2026-02-28T15:00:00Z',
    heureFin: '2026-02-28T17:00:00Z',
    lieu: 'En ligne (Zoom)',
    lienZoom: 'https://zoom.us/j/123456789',
    description: `Une conference interactive ouverte a tous les membres de l'EEC dans la diaspora. Comment maintenir une vie de foi vibrante loin du Cameroun ? Comment concilier notre identite culturelle et notre foi chretienne dans un contexte europeen ou americain ? Ces questions seront abordees par un panel de pasteurs et de laics experimentes.

Cette conference sera diffusee en direct sur Zoom et sur la page YouTube de l'EEC Diaspora. Les participants pourront poser leurs questions en direct et interagir avec les panelistes. Un temps de priere communautaire cloturera la rencontre.`,
    programme: [
      { heure: '15:00', description: 'Introduction et presentation des panelistes' },
      { heure: '15:15', description: 'Temoignages de fideles de la diaspora' },
      { heure: '15:45', description: 'Table ronde : "Les defis spirituels de la diaspora"' },
      { heure: '16:30', description: 'Questions-reponses avec les participants' },
      { heure: '16:50', description: 'Priere communautaire et cloture' },
    ],
    maxParticipants: 200,
    participantsInscrits: 52,
    commentCount: 12,
    actif: true,
  },
  {
    id: 'evt_003',
    titre: 'Retraite spirituelle de Careme',
    type: 'retraite',
    date: '2026-03-08T09:00:00Z',
    heureFin: '2026-03-10T16:00:00Z',
    lieu: 'Centre Saint-Joseph, 15 chemin des Collines, 69005 Lyon',
    description: `Une retraite spirituelle de trois jours pour approfondir notre relation avec Dieu en ce temps de Careme. Dans le cadre paisible du Centre Saint-Joseph, nous prendrons le temps de nous retirer du bruit du monde pour ecouter la voix de Dieu.

Le programme alternera entre enseignements bibliques, temps de priere personnelle et communautaire, ateliers de reflexion et moments de convivialite. Les repas sont inclus et prepares avec des specialites camerounaises. Hebergement sur place disponible. Places limitees, inscription obligatoire.`,
    programme: [
      { heure: '09:00', description: 'Accueil, installation et petit-dejeuner' },
      { heure: '10:00', description: 'Premier enseignement : "Le desert, lieu de rencontre avec Dieu"' },
      { heure: '14:00', description: 'Ateliers en petits groupes : partage et priere' },
      { heure: '16:00', description: 'Temps libre et meditation personnelle' },
      { heure: '19:00', description: 'Veillee de louange et temoignages' },
    ],
    maxParticipants: 40,
    participantsInscrits: 24,
    commentCount: 8,
    actif: true,
  },
  {
    id: 'evt_004',
    titre: 'Rencontre des jeunes EEC Europe',
    type: 'jeunesse',
    date: '2026-03-15T10:00:00Z',
    heureFin: '2026-03-15T18:00:00Z',
    lieu: 'Centre communautaire Africain, Rue du Progres 80, 1030 Bruxelles, Belgique',
    description: `La rencontre annuelle des jeunes de l'EEC en Europe est un evenement incontournable ! Jeunes de 18 a 35 ans, venez de Paris, Berlin, Londres, Zurich et d'ailleurs pour une journee de fellowship, de louange et de reflexion sur notre role en tant que jeune generation de l'EEC dans la diaspora.

Au programme : louange contemporaine, enseignement dynamique, ateliers pratiques sur les defis des jeunes chretiens en Europe, et un temps de networking entre jeunes professionnels et etudiants. Le repas de midi est offert. Transport en covoiturage organise depuis Paris et d'autres villes.`,
    programme: [
      { heure: '10:00', description: 'Accueil, cafe et jeux brise-glace' },
      { heure: '11:00', description: 'Louange et adoration avec le groupe de jeunes' },
      { heure: '12:00', description: 'Enseignement : "Etre jeune, chretien et africain en Europe"' },
      { heure: '13:00', description: 'Dejeuner communautaire et networking' },
      { heure: '15:00', description: 'Ateliers au choix : foi et travail, relations, engagement social' },
    ],
    maxParticipants: 80,
    participantsInscrits: 18,
    commentCount: 3,
    actif: true,
  },
  {
    id: 'evt_005',
    titre: 'Formation leaders de cellules de maison',
    type: 'formation',
    date: '2026-03-22T09:00:00Z',
    heureFin: '2026-03-22T17:00:00Z',
    lieu: 'Salle paroissiale EEC Paris, 42 rue de la Convention, 75015 Paris',
    description: `Une journee de formation intensive destinee aux leaders actuels et futurs des cellules de maison de l'EEC. Cette formation abordera les fondamentaux de la direction d'un petit groupe : preparation d'une etude biblique, animation de discussions, accompagnement pastoral de base et gestion des situations difficiles.

Le Pasteur Ndongo et Madame Atangana partageront leur experience et leurs methodes eprouvees pour des cellules de maison dynamiques et spirituellement nourrissantes. Supports de formation fournis. Certificat de participation delivre a l'issue de la formation.`,
    programme: [
      { heure: '09:00', description: 'Accueil et introduction a la formation' },
      { heure: '09:30', description: 'Module 1 : Les fondements bibliques du petit groupe' },
      { heure: '11:00', description: "Module 2 : Preparer et animer une etude biblique" },
      { heure: '14:00', description: "Module 3 : L'accompagnement pastoral en cellule de maison" },
      { heure: '16:00', description: 'Mise en pratique, questions et remise des certificats' },
    ],
    maxParticipants: 30,
    participantsInscrits: 15,
    commentCount: 2,
    actif: true,
  },
  {
    id: 'evt_006',
    titre: 'Culte de Paques',
    type: 'culte',
    date: '2026-04-05T09:30:00Z',
    heureFin: '2026-04-05T13:00:00Z',
    lieu: 'Eglise EEC Paris, 42 rue de la Convention, 75015 Paris',
    description: `Celebrons ensemble la resurrection de notre Seigneur Jesus-Christ ! Le culte de Paques est le moment le plus solennel et le plus joyeux de notre calendrier liturgique. Cette annee, nous vivrons un culte exceptionnel avec la participation de la chorale regionale, un bapteme collectif et un message special du Pasteur Ndongo.

Apres le culte, un grand repas communautaire pascal sera organise dans la salle paroissiale. Chaque famille est invitee a apporter un plat a partager. C'est l'occasion ideale d'inviter vos proches, vos voisins et vos collegues a decouvrir la joie de la communaute EEC.`,
    programme: [
      { heure: '09:30', description: 'Ouverture solennelle et procession de Paques' },
      { heure: '10:00', description: 'Louange et adoration pascale avec la chorale regionale' },
      { heure: '10:45', description: 'Ceremonie de bapteme collectif' },
      { heure: '11:15', description: 'Message de Paques : "Il est ressuscite !"' },
      { heure: '12:00', description: 'Sainte Cene, offrandes et benediction' },
    ],
    maxParticipants: 200,
    participantsInscrits: 0,
    commentCount: 0,
    actif: true,
  },
];
