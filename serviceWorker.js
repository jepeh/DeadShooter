self.addEventListener("install", (installEvent) => {
	/*installEvent.waitUntil(
		caches.open("ZMB").then((cache) => {
			console.log("caching...")
			return cache.addAll(ASSETS);
		})
		.catch(e => {
			console.warn(e)
		})
	);*/
	console.log("installed")
});

self.addEventListener("active", e => {
	console.log("activated")
})

self.addEventListener('fetch', function(event) {
	console.log("fetching for "+event.request.url)
	event.respondWith(
		caches.open(cacheName)
		.then(function(cache) {
			cache.match(event.request)
				.then(function(cacheResponse) {
					if (cacheResponse) {
						console.log("found in cache!")
					} else {
						console.log("not found in cache, fetching to network")
					}
					
					fetch(event.request)
						.then(function(networkResponse) {
							console.log("putting fetched data to cache")
							cache.put(event.request, networkResponse)
						})
					return cacheResponse || networkResponse
				})
		})
	)
});