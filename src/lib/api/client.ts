// ============================================================================
// API Client - DiaspoEEC
// Currently returns mock data via delay simulation.
// Replace with real fetch calls when Spring Boot backend is ready.
// ============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => 'Erreur inconnue');
    throw new ApiError(res.status, text);
  }
  return res.json();
}

/**
 * Client API centralise pour les appels au backend Spring Boot.
 * Toutes les methodes ajoutent automatiquement le token d'authentification
 * et gerent les erreurs de maniere uniforme.
 *
 * Pour l'instant, les fonctions API individuelles utilisent les mocks.
 * Quand le backend sera pret, decommentez les appels ci-dessous.
 */
export const apiClient = {
  async get<T>(endpoint: string, options?: { params?: Record<string, string> }): Promise<T> {
    const url = new URL(`${API_BASE}${endpoint}`);
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    const token = getToken();
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return handleResponse<T>(res);
  },

  async post<T>(endpoint: string, body?: unknown): Promise<T> {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(endpoint: string, body?: unknown): Promise<T> {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return handleResponse<T>(res);
  },
};

/**
 * Simule un delai reseau pour les appels API mock.
 * A supprimer quand le backend sera connecte.
 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
