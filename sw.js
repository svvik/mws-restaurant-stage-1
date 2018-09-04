const CACHE_PREFIX = 'mws-restaurant-cache-';
const CACHE_NAME = CACHE_PREFIX + 'v1';

const CACHED_URLS = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/js/dbhelper.js',

  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
];

/**
 * Installs service worker
 */
self.addEventListener('install', evt => {
  console.log('Installing service worker');
  evt.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => {
            console.log(`Cache ${cache} is open`);
            return cache.addAll(CACHED_URLS);
          })
          .catch(err => {
            console.log('Cached install failed: ', err);
          })
  );
});

/**
 * Activation handling
 */
self.addEventListener('activate', evt => {
  console.log('Activating service worker');
  evt.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.filter((cacheName) => {
              return cacheName.startsWith(CACHE_PREFIX) && cacheName != CACHE_NAME;
            }).map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
  );});

/**
 *  Fetch to resource handling
 */
self.addEventListener('fetch', evt => {

  const evtRequest = evt.request;

  evt.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return caches.match(evtRequest).then(response => {
          if (response) {
            return response;
          }
          return fetch(evtRequest).then(response => {
            cache.put(evtRequest, response.clone());
            return response;
          });
        }).catch(err => {
          console.log('Unable to fetch request.', err);
        });
      })
  );
});