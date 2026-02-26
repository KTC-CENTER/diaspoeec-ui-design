import { format as fnsFormat, parseISO, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date ISO en format lisible.
 * @param date - Date au format ISO string
 * @param formatStr - Format de sortie (par defaut: 'dd MMMM yyyy')
 * @returns La date formatee en francais
 */
export function formatDate(date: string, formatStr: string = 'dd MMMM yyyy'): string {
  try {
    const parsed = parseISO(date);
    return fnsFormat(parsed, formatStr, { locale: fr });
  } catch {
    return date;
  }
}

/**
 * Formate un montant avec sa devise.
 * @param amount - Le montant numerique
 * @param devise - Le code devise (EUR, USD, XAF, etc.)
 * @returns Le montant formate avec le symbole de devise
 */
export function formatMontant(amount: number, devise: string): string {
  const deviseMap: Record<string, { locale: string; currency: string }> = {
    EUR: { locale: 'fr-FR', currency: 'EUR' },
    USD: { locale: 'en-US', currency: 'USD' },
    XAF: { locale: 'fr-CM', currency: 'XAF' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    CHF: { locale: 'fr-CH', currency: 'CHF' },
  };

  const config = deviseMap[devise] || { locale: 'fr-FR', currency: devise };

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount} ${devise}`;
  }
}

/**
 * Formate une date en temps relatif en francais.
 * @param date - Date au format ISO string
 * @returns Temps relatif (ex: "Il y a 2 heures")
 */
export function formatRelativeTime(date: string): string {
  try {
    const parsed = parseISO(date);
    return formatDistanceToNow(parsed, { addSuffix: true, locale: fr });
  } catch {
    return date;
  }
}

/**
 * Extrait les initiales d'un nom complet.
 * @param name - Le nom complet (ex: "Jean-Paul Mbarga")
 * @returns Les initiales (ex: "JM")
 */
export function getInitials(name: string): string {
  if (!name || name.trim().length === 0) return '';

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();

  return `${first}${last}`;
}

/**
 * Utilitaire de delai pour simulation d'API.
 * @param ms - Duree en millisecondes
 * @returns Une promesse qui se resout apres le delai
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
