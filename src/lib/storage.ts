/**
 * Persistent storage adapter.
 * Uses @capacitor/preferences on native (SharedPreferences on Android)
 * and localStorage on web.
 */

import { Capacitor } from '@capacitor/core';

const isNative = typeof window !== 'undefined' && Capacitor.isNativePlatform();

let Preferences: typeof import('@capacitor/preferences').Preferences | null = null;

// Lazy-load Preferences only on native
async function getPreferences() {
  if (!isNative) return null;
  if (!Preferences) {
    const mod = await import('@capacitor/preferences');
    Preferences = mod.Preferences;
  }
  return Preferences;
}

export async function storageSet(key: string, value: string): Promise<void> {
  const prefs = await getPreferences();
  if (prefs) {
    await prefs.set({ key, value });
  } else if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

export async function storageGet(key: string): Promise<string | null> {
  const prefs = await getPreferences();
  if (prefs) {
    const { value } = await prefs.get({ key });
    return value;
  }
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
}

export async function storageRemove(key: string): Promise<void> {
  const prefs = await getPreferences();
  if (prefs) {
    await prefs.remove({ key });
  } else if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}
