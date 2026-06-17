
self.addEventListener('push', (e) => {
  const data = e.data.json();
  const options = {
    icon: '/images/favicon.svg',
    ...data,
  };
  self.registration.showNotification(data.title, options);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.notification.data) {
    if (event.notification.data.navigateTo) {
      event.waitUntil(
        clients
          .matchAll({
            type: "window",
          })
          .then((clientList) => {
            for (const client of clientList) {
              if (client.url.endsWith(event.notification.data.navigateTo) && "focus" in client) {
                return client.focus();
              }
            }
            if (clients.openWindow) {
              return clients.openWindow(event.notification.data.navigateTo);
            }
          }),
      );
      return;
    }
  }
  if (event.action === 'messages') {
    event.waitUntil(clients.openWindow('/messages'));
  } else if (event.action === 'dismiss') {
    console.log('Notification dismissed.');
  } else {
    event.waitUntil(clients.openWindow('/'));
  }
});
