'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface CountryOption {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
}

const countries: CountryOption[] = [
  { code: 'CM', dialCode: '+237', flag: '🇨🇲', name: 'Cameroun' },
  { code: 'FR', dialCode: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'DE', dialCode: '+49', flag: '🇩🇪', name: 'Allemagne' },
  { code: 'BE', dialCode: '+32', flag: '🇧🇪', name: 'Belgique' },
  { code: 'CH', dialCode: '+41', flag: '🇨🇭', name: 'Suisse' },
  { code: 'GB', dialCode: '+44', flag: '🇬🇧', name: 'Royaume-Uni' },
  { code: 'US', dialCode: '+1', flag: '🇺🇸', name: 'Etats-Unis' },
  { code: 'CA', dialCode: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'GA', dialCode: '+241', flag: '🇬🇦', name: 'Gabon' },
  { code: 'CI', dialCode: '+225', flag: '🇨🇮', name: 'Cote d\'Ivoire' },
  { code: 'SN', dialCode: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'CD', dialCode: '+243', flag: '🇨🇩', name: 'RD Congo' },
  { code: 'CG', dialCode: '+242', flag: '🇨🇬', name: 'Congo' },
  { code: 'TD', dialCode: '+235', flag: '🇹🇩', name: 'Tchad' },
  { code: 'IT', dialCode: '+39', flag: '🇮🇹', name: 'Italie' },
  { code: 'ES', dialCode: '+34', flag: '🇪🇸', name: 'Espagne' },
  { code: 'NL', dialCode: '+31', flag: '🇳🇱', name: 'Pays-Bas' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  error?: string;
}

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  error,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputId = 'phone-input';
  const errorId = 'phone-input-error';

  const selectedCountry =
    countries.find((c) => c.code === countryCode) ?? countries[0];

  const filteredCountries = search
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.dialCode.includes(search) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : countries;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleCountrySelect = (country: CountryOption) => {
    onCountryCodeChange(country.code);
    setIsOpen(false);
    setSearch('');
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits, spaces, and dashes
    const cleaned = e.target.value.replace(/[^\d\s-]/g, '');
    onChange(cleaned);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="mb-1.5 block text-sm font-medium text-ink-700"
      >
        Telephone
      </label>
      <div
        className={cn(
          'flex items-center rounded-xl border bg-white transition-all',
          'focus-within:border-forest-500 focus-within:ring-2 focus-within:ring-forest-500/10',
          error
            ? 'border-error focus-within:border-error focus-within:ring-error/10'
            : 'border-ink-200 hover:border-ink-300'
        )}
      >
        {/* Country Code Selector */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded-l-xl border-r border-ink-200 px-3 py-2.5 text-sm transition-colors hover:bg-cream-50"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
          >
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="font-medium text-ink-700">
              {selectedCountry.dialCode}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-ink-400 transition-transform',
                isOpen && 'rotate-180'
              )}
            />
          </button>

          {/* Country Dropdown */}
          {isOpen && (
            <div className="absolute left-0 top-full z-50 mt-1 w-64 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-xl">
              {/* Search */}
              <div className="border-b border-ink-100 p-2">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un pays..."
                  className="w-full rounded-lg bg-cream-50 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 outline-none"
                  autoFocus
                />
              </div>

              {/* Country List */}
              <ul
                className="max-h-52 overflow-y-auto py-1"
                role="listbox"
              >
                {filteredCountries.map((country) => (
                  <li key={`${country.code}-${country.dialCode}`}>
                    <button
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className={cn(
                        'flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-cream-50',
                        country.code === countryCode && 'bg-forest-900/5 font-medium'
                      )}
                      role="option"
                      aria-selected={country.code === countryCode}
                    >
                      <span className="text-base leading-none">{country.flag}</span>
                      <span className="flex-1 text-left text-ink-800">
                        {country.name}
                      </span>
                      <span className="text-xs text-ink-500">
                        {country.dialCode}
                      </span>
                    </button>
                  </li>
                ))}
                {filteredCountries.length === 0 && (
                  <li className="px-3 py-4 text-center text-sm text-ink-400">
                    Aucun pays trouve
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          id={inputId}
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder="612 345 678"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 rounded-r-xl bg-transparent px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 outline-none"
        />
      </div>
      {error && (
        <p id={errorId} className="mt-1 text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
