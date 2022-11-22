const CACHE_NAME = 'v1';
const urlsToCache = ['./', './index.js'];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});
self.addEventListener('push', (evt) => {
    const data = evt.data.json();
    console.log(data);
    const title = data.title;
    const options = {
        body: data.body,
        icon: 'test.jpg',
    };
    evt.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', (evt) => {
    const notification = new Notification('test', {
        body: 'TEXT',
    });
    console.log(notification);
    evt.notification.close();
});
