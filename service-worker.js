const CACHE_NAME = 'static-cache-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-cache';

// add resources to cache
const addResourcesToCache = async (resources) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(resources);
};

// Network-First for calendar event data
const networkFirstForCalendar = async (request) => {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);

  try {
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Network error', { status: 408 });
  }
};

// Stale-While-Revalidate
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  }).catch(() => {
    return cachedResponse;
  });

  return cachedResponse || fetchPromise;
};

// add resources to cache on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    addResourcesToCache([
      '/',
      '/index.html',
      '/about.html',
      '/style.css',
      '/script.js',
      '/backend/expanded-calendar.json',
      '/assets/clock-black.svg',
      '/assets/clock-white.svg',
      '/assets/download.svg',
      '/assets/line-attach-file-black.svg',
      '/assets/line-attach-file-white.svg',
      '/assets/location-black.svg',
      '/assets/location-white.svg',
    ])
  );
});

// erase old cache on activate
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, DYNAMIC_CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// fetch event listener
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.protocol === 'chrome-extension:') {
    event.respondWith(fetch(event.request));
  } else if (url.pathname === '/backend/expanded-calendar.json') {
    event.respondWith(networkFirstForCalendar(event.request));
  } else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

// push event listener
self.addEventListener('push', function(event) {
  const options = {
    body: event.data ? event.data.text() : 'Push message no payload',
    icon: 'assets/icon/icon-72x72.png',
    badge: 'assets/icon/icon-96x96.png'
  };

  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});