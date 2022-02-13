self.addEventListener("install", (installEvent) => {

  installEvent.waitUntil(
    caches.open("static").then((cache) => {
  
      return cache.addAll([
        "/",
        "./",
        "assets",
        "./assets",
        "/assets",
        "assets/images/blockgameswhite.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  console.log(`ferching for ${e.request.url}`);

   e.respondWith(
    caches.match(e.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(e.request);
      }
    ));
});
