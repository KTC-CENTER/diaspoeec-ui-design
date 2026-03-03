import { cn } from '@/lib/utils/cn';

interface CountryData {
  pays: string;
  nombre: number;
}

interface DiasporaMapProps {
  data?: CountryData[];
}

// Noms d'affichage pour les codes ISO 3166-1 alpha-2
const COUNTRY_NAMES: Record<string, string> = {
  FR: 'France', DE: 'Allemagne', BE: 'Belgique', CH: 'Suisse',
  GB: 'Royaume-Uni', IT: 'Italie', ES: 'Espagne', PT: 'Portugal',
  NL: 'Pays-Bas', LU: 'Luxembourg', SE: 'Suede', NO: 'Norvege',
  DK: 'Danemark', FI: 'Finlande', AT: 'Autriche', IE: 'Irlande',
  PL: 'Pologne', GR: 'Grece', CZ: 'Rep. tcheque', HU: 'Hongrie', RO: 'Roumanie',
  CA: 'Canada', US: 'Etats-Unis', MX: 'Mexique',
  BR: 'Bresil', AR: 'Argentine', CO: 'Colombie',
  CM: 'Cameroun', GA: 'Gabon', CG: 'Congo', CD: 'RD Congo',
  CF: 'Centrafrique', TD: 'Tchad', BI: 'Burundi', RW: 'Rwanda',
  CI: "Cote d'Ivoire", SN: 'Senegal', ML: 'Mali', TG: 'Togo',
  BJ: 'Benin', NG: 'Nigeria', GH: 'Ghana', GN: 'Guinee',
  NE: 'Niger', BF: 'Burkina', SL: 'Sierra Leone',
  KE: 'Kenya', TZ: 'Tanzanie', ET: 'Ethiopie', UG: 'Ouganda',
  ZA: 'Afrique du Sud', AO: 'Angola', MZ: 'Mozambique', ZW: 'Zimbabwe',
  MA: 'Maroc', DZ: 'Algerie', TN: 'Tunisie', EG: 'Egypte',
  MG: 'Madagascar', MU: 'Ile Maurice', AU: 'Australie', JP: 'Japon', CN: 'Chine',
};

// Conversion ISO alpha-2 → emoji drapeau (Regional Indicator Symbols)
function isoToFlag(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  return code.toUpperCase().replace(/./g, (char) =>
    String.fromCodePoint(char.charCodeAt(0) + 127397)
  );
}

function getFlag(pays: string): string {
  // Si c'est un code ISO (2 lettres majuscules)
  if (/^[A-Z]{2}$/.test(pays)) return isoToFlag(pays);
  // Sinon essai insensible casse/accents sur les noms
  const normalized = pays.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const found = Object.entries(COUNTRY_NAMES).find(([, name]) =>
    name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() === normalized
  );
  return found ? isoToFlag(found[0]) : '🌍';
}

function getDisplayName(pays: string): string {
  if (/^[A-Z]{2}$/.test(pays)) return COUNTRY_NAMES[pays] ?? pays;
  return pays;
}

export function DiasporaMap({ data = [] }: DiasporaMapProps) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
        <h3
          className="mb-5 text-lg font-semibold text-forest-900"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Repartition geographique
        </h3>
        <p className="text-center text-sm text-ink-400 py-8">Aucune donnee geographique disponible</p>
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.nombre - a.nombre);
  const total = sorted.reduce((s, c) => s + c.nombre, 0);
  const top = sorted.slice(0, 7);
  const autres = total - top.reduce((s, c) => s + c.nombre, 0);

  const getSize = (index: number): 'large' | 'medium' | 'small' => {
    if (index === 0) return 'large';
    if (index <= 3) return 'medium';
    return 'small';
  };

  return (
    <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
      <h3
        className="mb-5 text-lg font-semibold text-forest-900"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Repartition geographique
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {top.map((country, index) => {
          const size = getSize(index);
          const flag = getFlag(country.pays);

          if (size === 'large') {
            return (
              <div
                key={getDisplayName(country.pays)}
                className="rounded-xl bg-gradient-to-br from-forest-900 to-forest-700 p-4 text-center text-white sm:col-span-2 lg:col-span-2"
              >
                <div className="mb-1 text-2xl">{flag}</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {country.nombre.toLocaleString('fr-FR')}
                </div>
                <div className="text-[11px] opacity-80">{getDisplayName(country.pays)}</div>
              </div>
            );
          }

          if (size === 'medium') {
            return (
              <div
                key={getDisplayName(country.pays)}
                className="rounded-xl bg-sage-200 p-3 text-center"
              >
                <div className="mb-0.5 text-lg">{flag}</div>
                <div
                  className="text-lg font-bold text-forest-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {country.nombre.toLocaleString('fr-FR')}
                </div>
                <div className="text-[10px] text-ink-500">{getDisplayName(country.pays)}</div>
              </div>
            );
          }

          return (
            <div
              key={getDisplayName(country.pays)}
              className="rounded-xl bg-cream-100 p-3 text-center"
            >
              <div className="mb-0.5 text-lg">{flag}</div>
              <div
                className="text-lg font-bold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {country.nombre.toLocaleString('fr-FR')}
              </div>
              <div className="text-[10px] text-ink-500">{getDisplayName(country.pays)}</div>
            </div>
          );
        })}
      </div>

      {autres > 0 && (
        <div className="mt-3 text-center">
          <span className="inline-block rounded-lg bg-gray-100 px-4 py-2 text-sm text-ink-500">
            Autres pays : <strong className="text-forest-900">{autres.toLocaleString('fr-FR')}</strong> fideles
          </span>
        </div>
      )}
    </div>
  );
}
