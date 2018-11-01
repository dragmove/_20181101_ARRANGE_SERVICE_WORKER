var CACHE_NAME = 'cache-v1';

var urlsToCache = [
  // '/_20181101_ARRANGE_SERVICE_WORKER/',
  '/_20181101_ARRANGE_SERVICE_WORKER/public/css/index.css',
  // '/_20181101_ARRANGE_SERVICE_WORKER/public/img/favicon.ico',
  '/_20181101_ARRANGE_SERVICE_WORKER/public/img/award_bg.jpg',
  '/_20181101_ARRANGE_SERVICE_WORKER/public/img/namecard_bg.jpg',
  '/_20181101_ARRANGE_SERVICE_WORKER/public/img/winter.png'
];

self.addEventListener('install', function(event) {
  console.log('install');

  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log('opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('success cache.addAll');
      })
      .catch(function(error) {
        console.log('cache error :', error);
      })
  );
});

// after install
self.addEventListener('fetch', function(event) {
  console.log('fetch');

  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log('caches.match response :', response);

      // Cache hit - return response
      if (response) {
        console.log('cache hit :', response);
        return response;
      }

      return fetch(event.request);
    })
  );
});
