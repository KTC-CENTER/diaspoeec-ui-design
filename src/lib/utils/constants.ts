import {
  Home,
  BookOpen,
  Calendar,
  Heart,
  Church,
  Bell,
  User,
  Users,
  DollarSign,
  Shield,
  Music,
  GraduationCap,
  HandHeart,
  BookOpenCheck,
  Flame,
  Megaphone,
} from 'lucide-react';

// ============================================
// PAYS
// ============================================

export const PAYS_LIST = [
  { value: 'FR', label: 'France', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
  { value: 'CM', label: 'Cameroun', flag: '\uD83C\uDDE8\uD83C\uDDF2' },
  { value: 'DE', label: 'Allemagne', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { value: 'US', label: 'Etats-Unis', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { value: 'CA', label: 'Canada', flag: '\uD83C\uDDE8\uD83C\uDDE6' },
  { value: 'GB', label: 'Royaume-Uni', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { value: 'CH', label: 'Suisse', flag: '\uD83C\uDDE8\uD83C\uDDED' },
  { value: 'BE', label: 'Belgique', flag: '\uD83C\uDDE7\uD83C\uDDEA' },
  { value: 'IT', label: 'Italie', flag: '\uD83C\uDDEE\uD83C\uDDF9' },
  { value: 'ES', label: 'Espagne', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
  { value: 'NL', label: 'Pays-Bas', flag: '\uD83C\uDDF3\uD83C\uDDF1' },
  { value: 'GA', label: 'Gabon', flag: '\uD83C\uDDEC\uD83C\uDDE6' },
  { value: 'CI', label: 'Cote d\'Ivoire', flag: '\uD83C\uDDE8\uD83C\uDDEE' },
  { value: 'SN', label: 'Senegal', flag: '\uD83C\uDDF8\uD83C\uDDF3' },
  { value: 'CG', label: 'Congo', flag: '\uD83C\uDDE8\uD83C\uDDEC' },
  { value: 'GQ', label: 'Guinee equatoriale', flag: '\uD83C\uDDEC\uD83C\uDDF6' },
  { value: 'TD', label: 'Tchad', flag: '\uD83C\uDDF9\uD83C\uDDE9' },
  { value: 'CF', label: 'Centrafrique', flag: '\uD83C\uDDE8\uD83C\uDDEB' },
  { value: 'NG', label: 'Nigeria', flag: '\uD83C\uDDF3\uD83C\uDDEC' },
  { value: 'ZA', label: 'Afrique du Sud', flag: '\uD83C\uDDFF\uD83C\uDDE6' },
] as const;

// ============================================
// PAROISSES EEC
// ============================================

export const PAROISSES = [
  'Paroisse de Bonanjo - Douala',
  'Paroisse de New-Bell - Douala',
  'Paroisse de Deido - Douala',
  'Paroisse de Bali - Douala',
  'Paroisse de Bonaberi - Douala',
  'Paroisse de Akwa - Douala',
  'Paroisse du Centre - Yaounde',
  'Paroisse de Mvog-Ada - Yaounde',
  'Paroisse de Mvolyee - Yaounde',
  'Paroisse de Nkoldongo - Yaounde',
  'Paroisse de Bastos - Yaounde',
  'Paroisse de Biyem-Assi - Yaounde',
  'Paroisse de Limbe',
  'Paroisse de Buea',
  'Paroisse de Bafoussam',
  'Paroisse de Bamenda',
  'Paroisse de Kribi',
  'Paroisse de Edea',
  'Paroisse de Nkongsamba',
  'Paroisse de Garoua',
  'Paroisse de Maroua',
  'Paroisse de Bertoua',
  'Paroisse de Ebolowa',
  'Paroisse de Sangmelima',
  'Autre paroisse EEC',
] as const;

// ============================================
// DEVISES
// ============================================

export const DEVISES = [
  { value: 'EUR', label: 'Euro', symbol: '\u20AC' },
  { value: 'USD', label: 'Dollar US', symbol: '$' },
  { value: 'XAF', label: 'Franc CFA', symbol: 'FCFA' },
  { value: 'GBP', label: 'Livre sterling', symbol: '\u00A3' },
  { value: 'CHF', label: 'Franc suisse', symbol: 'CHF' },
] as const;

// ============================================
// MINISTERES
// ============================================

export const MINISTERES_OPTIONS = [
  { value: 'chorale', label: 'Chorale', icon: Music },
  { value: 'jeunesse', label: 'Jeunesse', icon: GraduationCap },
  { value: 'diaconie', label: 'Diaconie', icon: HandHeart },
  { value: 'enseignement', label: 'Enseignement', icon: BookOpenCheck },
  { value: 'priere', label: 'Priere', icon: Flame },
  { value: 'evangelisation', label: 'Evangelisation', icon: Megaphone },
] as const;

// ============================================
// TYPES DE DIASPORA
// ============================================

export const DIASPORA_TYPES = [
  { value: 'etudiante', label: 'Etudiante' },
  { value: 'professionnelle', label: 'Professionnelle' },
  { value: 'familiale', label: 'Familiale' },
  { value: 'missionnaire', label: 'Missionnaire' },
] as const;

// ============================================
// TYPES D'EVENEMENTS
// ============================================

export const EVENT_TYPES = [
  { value: 'culte', label: 'Culte', color: 'forest' },
  { value: 'conference', label: 'Conference', color: 'gold' },
  { value: 'retraite', label: 'Retraite', color: 'sage' },
  { value: 'formation', label: 'Formation', color: 'terra' },
  { value: 'jeunesse', label: 'Jeunesse', color: 'ink' },
] as const;

// ============================================
// CATEGORIES DE MEDITATIONS
// ============================================

export const MEDITATION_CATEGORIES = [
  { value: 'foi', label: 'Foi' },
  { value: 'priere', label: 'Priere' },
  { value: 'famille', label: 'Famille' },
  { value: 'esperance', label: 'Esperance' },
  { value: 'grace', label: 'Grace' },
  { value: 'perseverance', label: 'Perseverance' },
] as const;

// ============================================
// NAVIGATION PRINCIPALE (SIDEBAR)
// ============================================

export const NAV_ITEMS = [
  {
    href: '/accueil',
    label: 'Accueil',
    icon: Home,
  },
  {
    href: '/meditations',
    label: 'Meditations',
    icon: BookOpen,
  },
  {
    href: '/evenements',
    label: 'Evenements',
    icon: Calendar,
  },
  {
    href: '/dons/nouveau',
    label: 'Dons',
    icon: Heart,
  },
  {
    href: '/cultes',
    label: 'Cultes',
    icon: Church,
  },
  {
    href: '/bible',
    label: 'Bible',
    icon: BookOpenCheck,
  },
  {
    href: '/notifications',
    label: 'Notifications',
    icon: Bell,
  },
  {
    href: '/profil',
    label: 'Profil',
    icon: User,
  },
] as const;

// ============================================
// NAVIGATION ADMIN (SIDEBAR)
// ============================================

export const ADMIN_NAV_ITEMS = [
  {
    href: '/admin/fideles',
    label: 'Fideles',
    icon: Users,
  },
  {
    href: '/admin/dons',
    label: 'Dons',
    icon: DollarSign,
  },
  {
    href: '/admin/moderation',
    label: 'Moderation',
    icon: Shield,
  },
] as const;
