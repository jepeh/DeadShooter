self.addEventListener("install", installEvent => {
	
	installEvent.waitUntil(
		caches.open("static").then(cache => {
			return cache.addAll(['/', './', 'assets', './assets', '/assets', 'assets/images/blockgameswhite.png'])
		})
	);
})

window.location.reload(true)


self.addEventListener("fetch", e =>{
	console.log(`ferching for ${e.request.url}`)
})

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
	// Prevent the mini-infobar from appearing on mobile
	e.preventDefault();
	// Stash the event so it can be triggered later.
	deferredPrompt = e;
	// Update UI notify the user they can install the PWA
	showInstallPromotion();
	// Optionally, send analytics event that PWA install promo was shown.
	console.log(`'beforeinstallprompt' event was fired.`);
});