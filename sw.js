// ==================== SERVICE WORKER - notifications push ====================
// À héberger au même niveau que messagerie.html (ex: sur GitHub Pages).
// Il tourne en arrière-plan et affiche une notification quand le Worker
// Cloudflare envoie un push, même si l'onglet/la page est fermé(e).

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}

  const title = data.title || 'Nouveau message';
  const options = {
    body: data.body || '',
    icon: data.icon || undefined,
    badge: data.badge || undefined,
    tag: data.convId || undefined,   // regroupe les notifs d'une même conversation
    renotify: true,
    data: { convId: data.convId || null },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./index.html');
    })
  );
});
