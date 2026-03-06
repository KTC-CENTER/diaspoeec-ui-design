// ============================================================================
// API Client - DiaspoEEC
// Connected to NestJS backend on port 8080.
// ============================================================================

import { ENDPOINTS } from './endpoints';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const SESSION_ID_KEY = 'auth_session_id';

function getStoredLocale(): string {
  if (typeof window === 'undefined') return 'fr';
  try {
    const stored = JSON.parse(localStorage.getItem('diaspoeec-locale') || '{}');
    return stored?.state?.locale || 'fr';
  } catch {
    return 'fr';
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// Token management
// ============================================================================

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_ID_KEY);
}

export function setTokens(accessToken: string, refreshToken: string, sessionId?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (sessionId) localStorage.setItem(SESSION_ID_KEY, sessionId);
  // Also persist to Capacitor Preferences (native Android)
  persistTokensNative(accessToken, refreshToken, sessionId);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(SESSION_ID_KEY);
  clearTokensNative();
}

/** Persist tokens to Capacitor Preferences (fire-and-forget) */
function persistTokensNative(accessToken: string, refreshToken: string, sessionId?: string) {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.set({ key: TOKEN_KEY, value: accessToken });
      Preferences.set({ key: REFRESH_TOKEN_KEY, value: refreshToken });
      if (sessionId) Preferences.set({ key: SESSION_ID_KEY, value: sessionId });
    });
  }).catch(() => {});
}

function clearTokensNative() {
  import('@capacitor/core').then(({ Capacitor }) => {
    if (!Capacitor.isNativePlatform()) return;
    import('@capacitor/preferences').then(({ Preferences }) => {
      Preferences.remove({ key: TOKEN_KEY });
      Preferences.remove({ key: REFRESH_TOKEN_KEY });
      Preferences.remove({ key: SESSION_ID_KEY });
    });
  }).catch(() => {});
}

/** Restore tokens from Capacitor Preferences into localStorage (call on app init) */
export async function restoreTokensFromNative(): Promise<boolean> {
  try {
    const { Capacitor } = await import('@capacitor/core');
    if (!Capacitor.isNativePlatform()) return false;
    const { Preferences } = await import('@capacitor/preferences');
    const { value: access } = await Preferences.get({ key: TOKEN_KEY });
    const { value: refresh } = await Preferences.get({ key: REFRESH_TOKEN_KEY });
    const { value: sessionId } = await Preferences.get({ key: SESSION_ID_KEY });
    if (access && refresh) {
      localStorage.setItem(TOKEN_KEY, access);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      if (sessionId) localStorage.setItem(SESSION_ID_KEY, sessionId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// Response handling
// ============================================================================

/**
 * Backend wraps responses in { data, meta? } via TransformInterceptor.
 * This function unwraps the data field.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Maintenance mode — redirect non-admin users
    if (res.status === 503 && typeof window !== 'undefined') {
      if (!window.location.pathname.startsWith('/maintenance') && !window.location.pathname.startsWith('/admin')) {
        window.location.href = '/maintenance';
      }
    }
    const body = await res.json().catch(() => ({ message: 'Erreur inconnue' }));
    const message = body?.message || body?.error || 'Erreur inconnue';
    throw new ApiError(res.status, Array.isArray(message) ? message[0] : message);
  }
  const json = await res.json();
  // Unwrap { data } envelope from backend TransformInterceptor
  if (json && typeof json === 'object' && 'data' in json) {
    return json.data as T;
  }
  return json as T;
}

// ============================================================================
// Token refresh logic
// ============================================================================

let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE}${ENDPOINTS.AUTH.REFRESH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return false;

    const json = await res.json();
    const data = json?.data ?? json;
    if (data.accessToken && data.refreshToken) {
      setTokens(data.accessToken, data.refreshToken, data.sessionId);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ============================================================================
// Core fetch with auto-refresh
// ============================================================================

async function fetchWithAuth<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  const token = getToken();
  const sessionId = getSessionId();
  const locale = getStoredLocale();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(sessionId ? { 'X-Session-Id': sessionId } : {}),
  };

  let res = await fetch(url, { ...options, headers });

  // On 401, try refreshing the token once
  if (res.status === 401 && getRefreshToken()) {
    if (!refreshPromise) {
      refreshPromise = tryRefreshToken().finally(() => {
        refreshPromise = null;
      });
    }

    const refreshed = await refreshPromise;
    if (refreshed) {
      const newToken = getToken();
      const newSessionId = getSessionId();
      const newHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
        ...(newSessionId ? { 'X-Session-Id': newSessionId } : {}),
      };
      res = await fetch(url, { ...options, headers: newHeaders });
    }
  }

  return handleResponse<T>(res);
}

// ============================================================================
// API Client
// ============================================================================

export const apiClient = {
  async get<T>(endpoint: string, options?: { params?: Record<string, string> }): Promise<T> {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, value);
        }
      });
    }
    return fetchWithAuth<T>(url.toString(), { method: 'GET' });
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchWithAuth<T>(`${API_BASE}${endpoint}`, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchWithAuth<T>(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async patch<T>(endpoint: string, body?: unknown): Promise<T> {
    return fetchWithAuth<T>(`${API_BASE}${endpoint}`, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  async delete<T>(endpoint: string): Promise<T> {
    return fetchWithAuth<T>(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
    });
  },
};
