/* eslint-disable no-undef */
// Service worker for Capacitor SPA fallback routing
// Intercepts navigation requests and serves the app shell (index.html)
// so that client-side routing works for dynamic routes like /meditations/[id]

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only handle navigation requests (not assets, API calls, etc.)
  if (event.request.mode !== 'navigate') return;

  // Don't intercept requests for static files
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff2?|ttf|eot|webp|mp4|webm)$/)) return;

  // Don't intercept Firebase messaging service worker
  if (url.pathname.includes('firebase-messaging-sw')) return;

  // For all other navigation requests, serve the app shell
  event.respondWith(
    fetch(event.request).catch(() => fetch('/index.html'))
  );
});
