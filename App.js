if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker
			.register("serviceWorker.js")
			.then(res => {})
			.catch(err => console.log("service worker not registered", err))
	})
}