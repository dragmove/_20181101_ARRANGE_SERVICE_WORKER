var CACHE_NAME = "cache-v1";

var urlsToCache = [
  "/_20181101_ARRANGE_SERVICE_WORKER/",
  "/_20181101_ARRANGE_SERVICE_WORKER/public/css/index.css",
  // '/_20181101_ARRANGE_SERVICE_WORKER/public/img/favicon.ico',
  "/_20181101_ARRANGE_SERVICE_WORKER/public/img/award_bg.jpg",
  "/_20181101_ARRANGE_SERVICE_WORKER/public/img/namecard_bg.jpg",
  "/_20181101_ARRANGE_SERVICE_WORKER/public/img/winter.png"
];

self.addEventListener("install", function(event) {
  console.log("install");

  // Perform install steps
  /*
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log("opened cache");
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log("success cache.addAll");
      })
      .catch(function(error) {
        console.log("cache error :", error);
      })
  );
  */

  /*
  // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/?hl=ko#on-install-not
  event.waitUntil(
    caches.open("mygame-core-v1").then(function(cache) {

      // 게임의 후반부 레벨을 위한 자산과 같이 즉시 필요하지 않은 더 큰 리소스.
      // core asset 이 아닌 생략 가능한 파일들은, 설치가 완료되기를 기다리지 않아도 된다.
      cache
        .addAll
        // levels 11-20
        ();

      // offline 사용을 위한 필수적인 core asset 의 설치가 완료되기를 기다린다.
      return cache
        .addAll
        // core assets & levels 1-10
        ();
    })
  );
  */
});

// after install
self.addEventListener("fetch", function(event) {
  // 자원에 대한 request 가 발생하면,
  console.log("fetch");

  event.respondWith(
    caches
      .match(event.request, {
        // https://developer.mozilla.org/ko/docs/Web/API/Cache/match
        ignoreSearch: false
      })
      .then(function(response) {
        console.log("caches.match response :", response);

        // 1. 기존에 캐시된 결과가 있는지 검사하여, 있다면 캐시된 값을 반환한다.
        // Cache hit - return response
        // request 에 대해, 서비스 워커가 생성한 캐시에서 기존에 캐시된 결과가 있는지 검색하여, 일치하는 응답이 있을 경우 캐시된 값을 반환한다.
        if (response) {
          console.log("cache hit. return response :", response);
          return response;
        }

        // IMPORTANT: Clone the request. A request is a stream and can only be consumed once. Since we are consuming this once by cache and once by the browser for fetch, we need to clone the response.
        // request 를 복제한다. request 는 스트림이어서 단 한번만 사용할 수 있기 때문이다. 우리는 이것을 캐시에 의해서 한번 소비하고, fetch 를 위해 브라우저에서 한번 소비하고 있으므로, 우리는 response 를 복제할 필요가 있다.
        var fetchRequest = event.request.clone();

        // 2. 캐시된 값이 없다면, 값을 fetch 한다.
        return fetch(fetchRequest).then(function(response) {
          // Check if we received a valid response
          // 2-1. response 가 유효하지 않으면 그대로 반환한다.
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // 2-2. 유효한 response 값을 fetch 했다면, 캐시를 열고 request, response 의 복제본을 저장한다.
          // IMPORTANT: Clone the response. A response is a stream and because we want the browser to consume the response as well as the cache consuming the response, we need to clone it so we have two streams.
          // response 를 복제한다. response 는 스트림이고, 우리는 캐시가 response 를 소비하는 것 뿐만 아니라 브라우저가 response 를 소비하기를 원하기 때문에, 이것을 복제해야 한다. 그래서 우리는 2개의 스트림을 가지게 된다.
          var responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseToCache);
          });

          // 3. response 값을 반환한다.
          return response;
        });
      })
      .catch(error => {
        // 에러 발생시 캐시되어있는 offline.html로 이동시킨다.
        return caches.open(CACHE_NAME).then(cache => {
          // request 의 Accept header 가 페이지 요청일 경우
          if (event.request.headers.get("accept").includes("text/html")) {
            // 캐시되어 있던 offline fallback 페이지로 이동시킨다.
            return cache.match("/offline.html");
          }
        });
      })
  );

  // Cache strategy
  // https://jakearchibald.com/2014/offline-cookbook/

  // 1. On network response
  // user 의 받은 편지함, 또는 article 컨텐츠와 같은 빈번하게 업데이트되는 리소스에 적합한 캐시 전략이다.
  // user avartar 와 같은 필수적이지 않은 컨텐츠에도 유용하지만, 주의가 필요하다.
  /*
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('mysite-dynamic').then(function(cache) {
        return cache.match(event.request).then(function (response) {
          return response || fetch(event.request).then(function(response) {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  });
  */

  // 2. Stable-while-revalidate
  // 최신 버전이 필수적이지 않은 빈번하게 업데이트되는 리소스에 적합한 전략이다.
  // 아바타는 이 범주에 속할 수 있다.
  // 캐시된 버전이 사용 가능하다면 그것을 사용하고, 다음 요청을 대비하여 업데이트 fetch 를 한다.
  // http 의 stable-while-revalidate 전략(https://www.mnot.net/blog/2007/12/12/stale)과 유사하다.
  /*
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.open('mysite-dynamic').then(function(cache) {
        return cache.match(event.request).then(function(response) {
          var fetchPromise = fetch(event.request).then(function(networkResponse) {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          return response || fetchPromise;
        })
      })
    );
  });
  */

  // 3. On Background-sync
  self.addEventListener("sync", function(event) {
    if (event.id == "update-leaderboard") {
      event.waitUntil(
        caches.open("mygame-dynamic").then(function(cache) {
          return cache.add("/leaderboard.json");
        })
      );
    }
  });
});

self.addEventListener("activate", function(event) {
  // 서비스 워커 업데이트시, 이 callback 에서 캐시 관리를 해야 한다.
  /*
  // e.g: 서비스 워커 업데이트
  // 기존에 cache-v1 캐시를 사용하다가, 이번 업데이트에서 pages-cache-v1 과 blog-posts-cache-v1 이라는 2개의 캐시를 만들어 사용하는 방향으로 변경하려고 한다면,
  // install 단계에서 이 2개의 캐시를 생성하고 activate 단계에서 기존의 cache-v1 캐시를 삭제해주어야 한다.

  // 서비스 워커의 모든 캐시를 탐색하여, 캐시 화이트 리스트에 정의되지 않은 캐시를 삭제하는 작업을 한다.
  var cacheWhiteList = ["pages-cache-v1", "blog-posts-cache-v1"];

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhiteList.indexOf(cacheName) === -1) {
            // remove old cache
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // activate 완료시, 이 메소드를 호출하여 브라우저에 대한 제어권을 가져와야 한다.
  return self.clients.claim();
  */
  // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/?hl=ko#on-activate
  /*
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          // Return true if you want to remove this cache,
          // but remember that caches are shared across
          // the whole origin
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
  */
});

// https://developers.google.com/web/fundamentals/codelabs/debugging-service-workers/?hl=ko#_19
self.addEventListener("push", function(event) {
  var title = "Yay a message.";
  var body = "We have received a push message.";
  var icon = "/images/smiley.svg";
  var tag = "simple-push-example-tag";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
      icon: icon,
      tag: tag
    })
  );
});
