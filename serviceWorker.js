
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

self.addEventListener("fetch", async event => {
	console.log("fetching.. for ", event.request.url)
	await event.respondWith(
		caches.open("ZMB").then(c => {

			c.match(event.request).then(ee => {
				if (ee) {
					return ee
				} else {
					fetch(event.request).then(res => {
						c.add(res)
						return res
					})
				}
			})

		})
	)
});