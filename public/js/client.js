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
      // https://jakearchibald.com/2014/offline-cookbook/
      /*
      document
        .querySelector(".cache-article")
        .addEventListener("click", async event => {
          event.preventDefault();

          const id = this.dataset.articleId;
          const cache = await caches.open("mysite-article-" + id);
          const response = await fetch("/get-article-urls?id=" + id);
          const urls = await response.json();
          await cache.addAll(urls);
        });
      */
    });
  }
})();
