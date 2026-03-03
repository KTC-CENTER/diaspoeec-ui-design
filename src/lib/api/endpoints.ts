// ============================================================================
// Centralized API Endpoints - DiaspoEEC
// Ready for Spring Boot backend integration.
// ============================================================================

export const ENDPOINTS = {
  // Authentification
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    REFRESH: '/api/v1/auth/refresh',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    ME: '/api/v1/auth/me',
  },

  // Membres
  MEMBERS: '/api/v1/members',
  MEMBER_BY_ID: (id: string) => `/api/v1/members/${id}`,
  MEMBER_FOLLOW: (id: string) => `/api/v1/members/${id}/follow`,

  // Meditations
  MEDITATIONS: '/api/v1/meditations',
  MEDITATION_BY_ID: (id: string) => `/api/v1/meditations/${id}`,
  MEDITATION_LIKE: (id: string) => `/api/v1/meditations/${id}/like`,
  MEDITATION_BOOKMARK: (id: string) => `/api/v1/meditations/${id}/bookmark`,

  // Evenements
  EVENEMENTS: '/api/v1/evenements',
  EVENEMENT_BY_ID: (id: string) => `/api/v1/evenements/${id}`,
  EVENEMENT_RSVP: (id: string) => `/api/v1/evenements/${id}/rsvp`,

  // Dons
  DONS: '/api/v1/dons',
  DON_HISTORY: '/api/v1/dons/history',
  DON_SUBSCRIPTIONS: '/api/v1/dons/subscriptions',

  // Campagnes
  CAMPAGNES: '/api/v1/campagnes',
  CAMPAGNE_BY_ID: (id: string) => `/api/v1/campagnes/${id}`,

  // Notifications
  NOTIFICATIONS: '/api/v1/notifications',
  NOTIFICATION_READ: (id: string) => `/api/v1/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: '/api/v1/notifications/read-all',

  // Bible
  BIBLE: {
    PLANS: '/api/v1/bible/plans',
    PLANS_ALL: '/api/v1/bible/plans/all',
    LECTURE_JOUR: '/api/v1/bible/lecture-jour',
    NOTES: '/api/v1/bible/notes',
    VERSET: '/api/v1/bible/verset',
    CHAPITRE: '/api/v1/bible/chapitre',
    STATS: '/api/v1/bible/stats',
    LECTURE_COURANTE: (planId: string) => `/api/v1/bible/plans/${planId}/lecture-courante`,
    ADMIN_PLANS: '/api/v1/bible/admin/plans',
    ADMIN_PLAN_BY_ID: (id: string) => `/api/v1/bible/admin/plans/${id}`,
    ADMIN_PLAN_LECTURES: (id: string) => `/api/v1/bible/admin/plans/${id}/lectures`,
    ADMIN_LECTURE_BY_ID: (id: string) => `/api/v1/bible/admin/lectures/${id}`,
  },

  // Cultes
  CULTES: {
    VIDEOS: '/api/v1/cultes/videos',
    VIDEO_BY_ID: (id: string) => `/api/v1/cultes/videos/${id}`,
    VIDEO_LIKE: (id: string) => `/api/v1/cultes/videos/${id}/like`,
    SERVICES: '/api/v1/cultes/services',
    RAPPEL: (id: string) => `/api/v1/cultes/services/${id}/rappel`,
  },

  // Commentaires
  COMMENTS: '/api/v1/comments',
  COMMENTS_BY_TARGET: (targetType: string, targetId: string) =>
    `/api/v1/comments/${targetType}/${targetId}`,

  // Likes
  LIKES: '/api/v1/likes',

  // Admin
  ADMIN: {
    DASHBOARD: '/api/v1/admin/dashboard',
    MEMBERS: '/api/v1/admin/members',
    DONS: '/api/v1/admin/dons',
    MODERATION: '/api/v1/admin/moderation',
    MODERATE_ITEM: (id: string) => `/api/v1/admin/moderation/${id}`,
  },
} as const;
