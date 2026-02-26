import { cn } from '@/lib/utils/cn';

interface CountryData {
  code: string;
  flag: string;
  name: string;
  count: number;
  /** Visual size: 'large' | 'medium' | 'small' */
  size: 'large' | 'medium' | 'small';
}

const diasporaData: CountryData[] = [
  { code: 'FR', flag: '\uD83C\uDDEB\uD83C\uDDF7', name: 'France', count: 1245, size: 'large' },
  { code: 'DE', flag: '\uD83C\uDDE9\uD83C\uDDEA', name: 'Allemagne', count: 423, size: 'medium' },
  { code: 'BE', flag: '\uD83C\uDDE7\uD83C\uDDEA', name: 'Belgique', count: 312, size: 'medium' },
  { code: 'US', flag: '\uD83C\uDDFA\uD83C\uDDF8', name: 'Etats-Unis', count: 287, size: 'medium' },
  { code: 'GB', flag: '\uD83C\uDDEC\uD83C\uDDE7', name: 'Royaume-Uni', count: 198, size: 'small' },
  { code: 'CH', flag: '\uD83C\uDDE8\uD83C\uDDED', name: 'Suisse', count: 156, size: 'small' },
  { code: 'CA', flag: '\uD83C\uDDE8\uD83C\uDDE6', name: 'Canada', count: 134, size: 'small' },
];

export function DiasporaMap() {
  return (
    <div className="rounded-2xl border border-forest-900/5 bg-white p-6 shadow-sm">
      <h3
        className="mb-5 text-lg font-semibold text-forest-900"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Repartition geographique
      </h3>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {diasporaData.map((country) => {
          if (country.size === 'large') {
            return (
              <div
                key={country.code}
                className="rounded-xl bg-gradient-to-br from-forest-900 to-forest-700 p-4 text-center text-white sm:col-span-2 lg:col-span-2"
              >
                <div className="mb-1 text-2xl">{country.flag}</div>
                <div
                  className="text-xl font-bold"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {country.count.toLocaleString('fr-FR')}
                </div>
                <div className="text-[11px] opacity-80">{country.name}</div>
              </div>
            );
          }

          if (country.size === 'medium') {
            return (
              <div
                key={country.code}
                className="rounded-xl bg-sage-200 p-3 text-center"
              >
                <div className="mb-0.5 text-lg">{country.flag}</div>
                <div
                  className="text-lg font-bold text-forest-900"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {country.count.toLocaleString('fr-FR')}
                </div>
                <div className="text-[10px] text-ink-500">{country.name}</div>
              </div>
            );
          }

          // small
          return (
            <div
              key={country.code}
              className="rounded-xl bg-cream-100 p-3 text-center"
            >
              <div className="mb-0.5 text-lg">{country.flag}</div>
              <div
                className="text-lg font-bold text-forest-900"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {country.count.toLocaleString('fr-FR')}
              </div>
              <div className="text-[10px] text-ink-500">{country.name}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <span className="inline-block rounded-lg bg-gray-100 px-4 py-2 text-sm text-ink-500">
          Autres pays : <strong className="text-forest-900">92</strong> fideles
        </span>
      </div>
    </div>
  );
}
