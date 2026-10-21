self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : { 
        title: '🚨 ZAMMLER: ВНИМАНИЕ!', 
        body: 'Наступило время выполнения задачи!' 
    };
    
    const options = {
        body: data.body,
        icon: 'icon.png',
        badge: 'icon.png',
        vibrate: [500, 200, 500, 200, 500, 200, 500],
        requireInteraction: true, // Висит на экране, пока не нажмут
        tag: 'alarm-notification', // Заменяет старые уведомления новым
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Клик по уведомлению разворачивает приложение поверх всех окон
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                let client = clientList[i];
                if ('focus' in client) {
                    return client.focus(); // Разворачивает уже открытую вкладку поверх всего
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html'); // Открывает заново, если была закрыта
            }
        })
    );
});
