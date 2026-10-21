self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Перехват пуш-сообщения в фоновом режиме
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { title: '🚨 ТРЕВОГА ZAMMLER', body: 'Время выполнения задачи!' };
    
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'icon.png',
        vibrate: [500, 200, 500, 200, 500],
        requireInteraction: true, // Уведомление висит на экране, пока пользователь не нажмет
        actions: [
            { action: 'open', title: 'Открыть приложение' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Клик по уведомлению разворачивает приложение
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('./index.html');
        })
    );
});
