
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
    const type = event.notification.data.type;
    if (type) {
      const navigateTo = "/"+ {
        generic: "dashboard",
      }[type];
      event.waitUntil(
        clients
          .matchAll({
            type: "window",
          })
          .then((clientList) => {
            for (const client of clientList) {
              if (client.url.endsWith(navigateTo) && "focus" in client) {
                return client.focus();
              }
            }
            if (clients.openWindow) {
              return clients.openWindow(navigateTo);
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
