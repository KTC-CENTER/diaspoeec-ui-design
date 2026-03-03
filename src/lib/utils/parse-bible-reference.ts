export interface ParsedBibleReference {
  livre: string;
  chapitre: number;
  versetDebut: number;
  versetFin: number;
}

const CANONICAL_NAMES = [
  'Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth',
  '1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques',
  'Esdras','Néhémie','Esther','Job','Psaumes','Proverbes','Ecclésiaste',
  'Cantique des Cantiques','Ésaïe','Jérémie','Lamentations','Ézéchiel','Daniel',
  'Osée','Joël','Amos','Abdias','Jonas','Michée','Nahoum','Habakuk','Sophonie',
  'Aggée','Zacharie','Malachie',
  'Matthieu','Marc','Luc','Jean','Actes','Romains',
  '1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens',
  '1 Thessaloniciens','2 Thessaloniciens','1 Timothée','2 Timothée','Tite','Philémon',
  'Hébreux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse',
];

const ALIASES: Record<string, string> = {
  Gn: 'Genèse', Ge: 'Genèse', Gen: 'Genèse',
  Ex: 'Exode', Exo: 'Exode',
  Lv: 'Lévitique', Lev: 'Lévitique',
  Nb: 'Nombres', Num: 'Nombres',
  Dt: 'Deutéronome', Deu: 'Deutéronome',
  Jos: 'Josué', Jg: 'Juges', Jug: 'Juges', Rt: 'Ruth',
  '1S': '1 Samuel', '1Sam': '1 Samuel',
  '2S': '2 Samuel', '2Sam': '2 Samuel',
  '1R': '1 Rois', '1Ro': '1 Rois',
  '2R': '2 Rois', '2Ro': '2 Rois',
  '1Ch': '1 Chroniques', '1Chr': '1 Chroniques',
  '2Ch': '2 Chroniques', '2Chr': '2 Chroniques',
  Esd: 'Esdras', Né: 'Néhémie', Ne: 'Néhémie', Neh: 'Néhémie', Est: 'Esther', Jb: 'Job',
  Ps: 'Psaumes', Psa: 'Psaumes',
  Pr: 'Proverbes', Pro: 'Proverbes',
  Ec: 'Ecclésiaste', Qo: 'Ecclésiaste',
  Ct: 'Cantique des Cantiques', Ca: 'Cantique des Cantiques',
  Ési: 'Ésaïe', Es: 'Ésaïe', Isa: 'Ésaïe',
  Jr: 'Jérémie', Jer: 'Jérémie', Lm: 'Lamentations', La: 'Lamentations',
  Éz: 'Ézéchiel', Ez: 'Ézéchiel', Da: 'Daniel', Dan: 'Daniel',
  Os: 'Osée', Ho: 'Osée', Jl: 'Joël', Joe: 'Joël',
  Am: 'Amos', Ab: 'Abdias', Ob: 'Abdias', Jon: 'Jonas',
  Mi: 'Michée', Mic: 'Michée', Na: 'Nahoum', Nah: 'Nahoum',
  Ha: 'Habakuk', Hab: 'Habakuk', So: 'Sophonie', Zep: 'Sophonie',
  Ag: 'Aggée', Hag: 'Aggée', Za: 'Zacharie', Zec: 'Zacharie', Ml: 'Malachie', Mal: 'Malachie',
  Mt: 'Matthieu', Mat: 'Matthieu', Mc: 'Marc', Mar: 'Marc', Lc: 'Luc', Jn: 'Jean',
  Ac: 'Actes', Act: 'Actes',
  Rm: 'Romains', Ro: 'Romains', Rom: 'Romains',
  '1Co': '1 Corinthiens', '1Cor': '1 Corinthiens',
  '2Co': '2 Corinthiens', '2Cor': '2 Corinthiens',
  Ga: 'Galates', Gal: 'Galates',
  Éph: 'Éphésiens', Eph: 'Éphésiens',
  Ph: 'Philippiens', Phi: 'Philippiens', Php: 'Philippiens',
  Col: 'Colossiens',
  '1Th': '1 Thessaloniciens', '1The': '1 Thessaloniciens',
  '2Th': '2 Thessaloniciens', '2The': '2 Thessaloniciens',
  '1Ti': '1 Timothée', '1Tim': '1 Timothée',
  '2Ti': '2 Timothée', '2Tim': '2 Timothée',
  Tt: 'Tite', Tit: 'Tite', Phm: 'Philémon', Phile: 'Philémon',
  Hé: 'Hébreux', He: 'Hébreux', Heb: 'Hébreux',
  Jc: 'Jacques', Jas: 'Jacques',
  '1Pi': '1 Pierre', '1Pe': '1 Pierre', '1Pet': '1 Pierre',
  '2Pi': '2 Pierre', '2Pe': '2 Pierre', '2Pet': '2 Pierre',
  '1Jn': '1 Jean', '1Jo': '1 Jean',
  '2Jn': '2 Jean', '2Jo': '2 Jean',
  '3Jn': '3 Jean', '3Jo': '3 Jean',
  Jd: 'Jude', Jud: 'Jude', Ap: 'Apocalypse', Rev: 'Apocalypse', Apo: 'Apocalypse',
  // Formes singulières / sans accents
  'Psaume': 'Psaumes', 'Psaum': 'Psaumes',
  'Proverbe': 'Proverbes',
  'Acte': 'Actes',
  'Genese': 'Genèse',
  'Levitique': 'Lévitique',
  'Deuteronome': 'Deutéronome',
  'Josue': 'Josué',
  'Nehemie': 'Néhémie',
  'Esaie': 'Ésaïe', 'Esaïe': 'Ésaïe', 'Isaie': 'Ésaïe',
  'Jeremie': 'Jérémie',
  'Ezechiel': 'Ézéchiel',
  'Joel': 'Joël',
  'Michee': 'Michée',
  'Ephesiens': 'Éphésiens',
  'Hebreux': 'Hébreux',
  'Philemon': 'Philémon',
  'Cantique': 'Cantique des Cantiques', 'Cantiques': 'Cantique des Cantiques',
};

function stripAccents(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

const CANONICAL_INDEX = new Map<string, string>(
  CANONICAL_NAMES.map((n) => [stripAccents(n).toLowerCase(), n])
);

function resolveBook(raw: string): string {
  if (ALIASES[raw]) return ALIASES[raw];
  const rawLower = raw.toLowerCase();
  for (const [key, val] of Object.entries(ALIASES)) {
    if (key.toLowerCase() === rawLower) return val;
  }
  const normalized = stripAccents(rawLower);
  if (CANONICAL_INDEX.has(normalized)) return CANONICAL_INDEX.get(normalized)!;
  return raw;
}

/**
 * Parses a French Bible reference string.
 * "Jean 3:16"     → { livre: 'Jean', chapitre: 3, versetDebut: 16, versetFin: 16 }
 * "Jean 3:16-18"  → { livre: 'Jean', chapitre: 3, versetDebut: 16, versetFin: 18 }
 * "Psaumes 23"    → { livre: 'Psaumes', chapitre: 23, versetDebut: 1, versetFin: 999 }
 */
export function parseReference(ref: string): ParsedBibleReference | null {
  if (!ref) return null;
  const trimmed = ref.trim();

  const withVerse = /^(.+?)\s+(\d+):(\d+)(?:-(\d+))?$/;
  const chapterOnly = /^(.+?)\s+(\d+)$/;

  let match = trimmed.match(withVerse);
  if (match) {
    return {
      livre: resolveBook(match[1]),
      chapitre: parseInt(match[2], 10),
      versetDebut: parseInt(match[3], 10),
      versetFin: match[4] ? parseInt(match[4], 10) : parseInt(match[3], 10),
    };
  }

  match = trimmed.match(chapterOnly);
  if (match) {
    return { livre: resolveBook(match[1]), chapitre: parseInt(match[2], 10), versetDebut: 1, versetFin: 999 };
  }

  return null;
}
