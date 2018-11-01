var CACHE_NAME = 'cache-v1';

var urlsToCache = [
  '/',
  '/css/index.css',
  '/img/favicon.ico',
  '/img/award_bg.jpg',
  '/img/namecard_bg.jpg',
  '/img/winter.png'
];

self.addEventListener('install', function(event) {
  console.log('install');

  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(function(obj) {
        console.log('obj :', obj);
      })
      .catch(function(error) {
        console.log('error :', error);
      })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('fetch');

  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('match response :', response);

      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request);
    })
  );
});
