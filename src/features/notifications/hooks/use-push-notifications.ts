'use client';

import { useEffect, useRef, useCallback } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { getFirebaseMessaging } from '@/lib/firebase';
import { registerDeviceToken } from '@/lib/api/notifications.api';
import { useQueryClient } from '@tanstack/react-query';
import { isNativePlatform } from '@/lib/utils/platform';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export function usePushNotifications(userId?: string) {
  const registeredRef = useRef(false);
  const queryClient = useQueryClient();

  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) return null;

    // Check if SW is already registered
    const existing = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
    if (existing?.active) return existing;

    // Register the service worker
    const sw = existing || await navigator.serviceWorker.register('/firebase-messaging-sw.js');

    // Wait for the SW to become active before returning
    if (!sw.active) {
      await new Promise<void>((resolve) => {
        const worker = sw.installing || sw.waiting;
        if (!worker) { resolve(); return; }
        worker.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve();
        });
      });
    }

    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };
    sw.active?.postMessage({ type: 'FIREBASE_CONFIG', config });
    return sw;
  }, []);

  // Native push registration (Capacitor Android)
  const registerNativePush = useCallback(async () => {
    if (registeredRef.current || !userId) return;

    try {
      const { PushNotifications } = await import('@capacitor/push-notifications');

      const permResult = await PushNotifications.requestPermissions();
      if (permResult.receive !== 'granted') return;

      await PushNotifications.register();

      PushNotifications.addListener('registration', async (token) => {
        await registerDeviceToken(token.value, 'android');
        registeredRef.current = true;
      });

      PushNotifications.addListener('pushNotificationReceived', () => {
        queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        const url = notification.notification.data?.lien;
        if (url) {
          window.location.href = url;
        }
      });
    } catch (err) {
      console.error('Native push registration failed:', err);
    }
  }, [userId, queryClient]);

  // Web push registration (Firebase Cloud Messaging)
  const registerWebPush = useCallback(async () => {
    if (registeredRef.current || !userId || !VAPID_KEY) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      const sw = await registerServiceWorker();
      if (!sw) return;

      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: sw,
      });

      if (token) {
        await registerDeviceToken(token, 'web');
        registeredRef.current = true;
      }
    } catch (err: unknown) {
      // Brave and some privacy browsers block FCM push — ignore silently
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('push service') || msg.includes('AbortError')) {
        console.warn('Push notifications non supportees par ce navigateur.');
      } else {
        console.error('Push registration failed:', err);
      }
    }
  }, [userId, registerServiceWorker]);

  const requestPermissionAndRegister = useCallback(async () => {
    if (isNativePlatform()) {
      await registerNativePush();
    } else {
      await registerWebPush();
    }
  }, [registerNativePush, registerWebPush]);

  // Auto-register when user is authenticated
  useEffect(() => {
    if (!userId) return;

    const timer = setTimeout(() => {
      requestPermissionAndRegister();
    }, 3000);

    return () => clearTimeout(timer);
  }, [userId, requestPermissionAndRegister]);

  // Listen for foreground messages (web only)
  useEffect(() => {
    if (typeof window === 'undefined' || isNativePlatform()) return;

    let unsubscribe: (() => void) | undefined;

    getFirebaseMessaging().then((messaging) => {
      if (!messaging) return;

      unsubscribe = onMessage(messaging, () => {
        queryClient.invalidateQueries({ queryKey: ['unread-count'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      });
    });

    return () => unsubscribe?.();
  }, [queryClient]);

  return { requestPermission: requestPermissionAndRegister };
}
