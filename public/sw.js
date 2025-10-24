// Service Worker
const CACHE_NAME = 'malu-digital-v1.0.0';
const RUNTIME_CACHE = 'malu-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/mobile.css',
    '/js/config.js',
    '/js/utils.js',
    '/js/api.js',
    '/js/auth.js',
    '/js/credits.js',
    '/js/services.js',
    '/js/forms.js',
    '/js/orders.js',
    '/js/payment.js',
    '/js/notifications.js',
    '/js/app.js',
    '/js/sw-register.js',
    '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];

    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
            })
            .then(cachesToDelete => {
                return Promise.all(cachesToDelete.map(cacheToDelete => {
                    return caches.delete(cacheToDelete);
                }));
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Skip API requests for caching
    if (event.request.url.includes('/api/')) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches.open(RUNTIME_CACHE)
                    .then(cache => {
                        return fetch(event.request)
                            .then(response => {
                                // Cache successful responses
                                if (response.status === 200) {
                                    cache.put(event.request, response.clone());
                                }
                                return response;
                            });
                    });
            })
            .catch(() => {
                // Return offline page if available
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});

// Message event (for skip waiting)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Push notification event
self.addEventListener('push', (event) => {
    if (!event.data) {
        return;
    }

    const data = event.data.json();

    const options = {
        body: data.body,
        icon: '/assets/icon-192.png',
        badge: '/assets/icon-192.png',
        vibrate: [200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
