importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch (_) {
    return;
  }

  const title = data.title || "ZAMMLER - Сеть 1";
  const body = data.body || data.alert || "Новая задача по расписанию";
  const url = data.url || data.launchURL || "./";

  const options = {
    body,
    icon: "./icon.png",
    badge: "./icon.png",
    requireInteraction: true,
    renotify: true,
    tag: data.tag || "zammler-task",
    vibrate: [500, 200, 500, 200, 700],
    data: { url }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || "./";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if ("focus" in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(targetUrl);
    })
  );
});
