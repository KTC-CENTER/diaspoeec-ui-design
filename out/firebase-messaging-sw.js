/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyAzzjgcUHaUG72Ru-sbOxibgOo73nmKGr8',
  authDomain: 'diaspo-eec.firebaseapp.com',
  projectId: 'diaspo-eec',
  storageBucket: 'diaspo-eec.firebasestorage.app',
  messagingSenderId: '83260357011',
  appId: '1:83260357011:web:62c55e4d1eccc7b0885066',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'DiaspoEEC';
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-96.png',
    data: { url: payload.data?.lien || '/' },
  };
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(clients.openWindow(url));
});
