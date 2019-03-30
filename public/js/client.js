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
    });
  }
})();
