self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Plant Reminder', body: 'A plant needs watering!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      badge: '/icon.png'
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CHECK_PLANTS') {
    const plants = e.data.plants || [];
    const now = Date.now();
    plants.forEach(p => {
      const elapsed = (now - p.lastWatered) / 86400000;
      if (elapsed >= p.days) {
        self.registration.showNotification('Time to water your plant! 🌱', {
          body: `${p.name} needs watering today.`,
          icon: '/icon.png'
        });
      }
    });
  }
});
