(function() {
  "use strict";

  // https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ko#_5
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/_20181101_ARRANGE_SERVICE_WORKER/sw.js")
        .then(function(registration) {
          console.log("registration :", registration);

          // Registration was successful
          console.log(
            "ServiceWorker registration successful with scope: ",
            registration.scope
          );
        })
        .catch(function(err) {
          // Registration failed :(
          console.log("ServiceWorker registration failed: ", err);
        });

      navigator.serviceWorker.ready.then(function(registration) {
        console.log("ServiceWorker Ready");
      });

      // We can save something to cache by user interaction from client pages.
      // https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/?hl=ko#on-user-interaction
      /*
      document.querySelector('.cache-article').addEventListener('click', function(event) {
        event.preventDefault();

        var id = this.dataset.articleId;
        caches.open('mysite-article-' + id).then(function(cache) {
          fetch('/get-article-urls?id=' + id).then(function(response) {
            // /get-article-urls returns a JSON-encoded array of
            // resource URLs that a given article depends on
            return response.json();
          }).then(function(urls) {
            cache.addAll(urls);
          });
        });
      });
      */
    });
  }
})();
