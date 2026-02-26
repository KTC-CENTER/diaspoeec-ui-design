'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useMeditations } from '@/features/meditations/hooks/use-meditations';
import { MeditationCard } from '@/features/meditations/components/meditation-card';
import { MeditationFeatured } from '@/features/meditations/components/meditation-featured';

const categories = [
  { key: 'toutes', label: 'Toutes' },
  { key: 'foi', label: 'Foi' },
  { key: 'priere', label: 'Priere' },
  { key: 'famille', label: 'Famille' },
  { key: 'esperance', label: 'Esperance' },
  { key: 'grace', label: 'Grace' },
  { key: 'perseverance', label: 'Perseverance' },
];

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white border border-forest-900/6 shadow-sm">
      <div className="h-40 shimmer-bg" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 rounded shimmer-bg" />
        <div className="h-3 w-1/2 rounded shimmer-bg" />
        <div className="h-3 w-2/3 rounded shimmer-bg" />
      </div>
    </div>
  );
}

export default function MeditationsPage() {
  const [selectedCategorie, setSelectedCategorie] = useState('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const { data: meditations, isLoading } = useMeditations(selectedCategorie);

  const filteredMeditations = meditations?.filter((m) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      m.titre.toLowerCase().includes(query) ||
      m.auteurNom.toLowerCase().includes(query) ||
      m.extrait.toLowerCase().includes(query)
    );
  });

  const featured = filteredMeditations?.[0];
  const remaining = filteredMeditations?.slice(1) || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-ink-900">
          Meditations
        </h1>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Rechercher une meditation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-72 pl-10 pr-4 py-2.5 bg-white border border-forest-900/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-900/20 focus:border-forest-900/30 transition-all"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-4 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategorie(cat.key)}
            className={cn(
              'flex-shrink-0 px-4 py-2 text-sm font-medium rounded-full transition-colors',
              selectedCategorie === cat.key
                ? 'bg-forest-900 text-white'
                : 'bg-white text-ink-600 border border-forest-900/10 hover:bg-sage-200 hover:text-forest-900'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="h-64 rounded-2xl shimmer-bg" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Featured */}
          {featured && (
            <div className="mb-8">
              <MeditationFeatured meditation={featured} />
            </div>
          )}

          {/* Afro Divider */}
          <div className="afro-divider mb-8" />

          {/* Grid */}
          {remaining.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {remaining.map((meditation) => (
                <MeditationCard key={meditation.id} meditation={meditation} />
              ))}
            </div>
          ) : (
            !featured && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-ink-400">Aucune meditation trouvee</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
