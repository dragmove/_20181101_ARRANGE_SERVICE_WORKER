var CACHE_NAME = 'cache-v1';

var urlsToCache = [
  '/_20181101_ARRANGE_SERVICE_WORKER/',
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
        console.log('cache hit. return response :', response);
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and can only be consumed once. Since we are consuming this once by cache and once by the browser for fetch, we need to clone the response.
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream and because we want the browser to consume the response as well as the cache consuming the response, we need to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
