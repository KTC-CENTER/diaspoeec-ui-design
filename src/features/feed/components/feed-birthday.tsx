'use client';

import { useState } from 'react';
import { useToastStore } from '@/stores/toast.store';

interface FeedBirthdayProps {
  name: string;
  age: number;
}

export function FeedBirthday({ name, age }: FeedBirthdayProps) {
  const [wished, setWished] = useState(false);
  const { addToast } = useToastStore();
  return (
    <article
      className="rounded-2xl overflow-hidden card-hover shadow-sm"
      style={{ background: 'linear-gradient(135deg, #FEFAE0 0%, #F4D35E33 50%, #FEFAE0 100%)' }}
    >
      <div className="p-5 border border-gold-600/20 rounded-2xl">
        <div className="flex items-center gap-4">
          {/* Cake emoji */}
          <div className="w-14 h-14 rounded-full bg-gold-400 flex items-center justify-center text-3xl shadow-sm">
            {'\u{1F382}'}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-ink-900 mb-0.5">
              Joyeux anniversaire !
            </h3>
            <p className="text-sm text-ink-600">
              {name} fete ses {age} ans aujourd&apos;hui
            </p>
          </div>
        </div>

        {/* Action - Gold button */}
        <button
          onClick={() => {
            setWished(true);
            addToast(`Votre voeu d'anniversaire a ete envoye a ${name} !`, 'success');
          }}
          disabled={wished}
          className={`mt-4 w-full py-2.5 text-sm font-semibold rounded-xl transition-colors shadow-sm ${
            wished
              ? 'bg-forest-900 text-white opacity-80'
              : 'bg-gold-600 text-white hover:bg-terra-600'
          }`}
        >
          {wished ? 'Voeu envoye !' : 'Lui souhaiter'}
        </button>
      </div>
    </article>
  );
}
