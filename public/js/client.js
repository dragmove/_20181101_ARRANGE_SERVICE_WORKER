(function() {
  'use strict';

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      console.log('load complete');

      navigator.serviceWorker
        .register('/public/sw.js')
        .then(function(registration) {
          console.log('registration :', registration);

          // Registration was successful
          console.log(
            'ServiceWorker registration successful with scope: ',
            registration.scope
          );
        })
        .catch(function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
})();
