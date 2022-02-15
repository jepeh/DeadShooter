import * as sound from '/app/audio.js'

if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker
			.register("serviceWorker.js")
			.then((res) => {
				alert("installed");
				console.log("installed")
			})
			.catch((err) => console.warn(err));
	});
}

let deferredPrompt;
var install = document.getElementById("install")

window.addEventListener("beforeinstallprompt", (e) => {
	deferredPrompt = e;
	install.innerText = "Install"
});



install.addEventListener("click", async () => {
	if (deferredPrompt === undefined) {
	} else {
		deferredPrompt.prompt();
		const { outcome } = await deferredPrompt.userChoice;
		if (outcome === "accepted") {
			deferredPrompt = null;
		}
	}
});

var c = 0;

document.documentElement.addEventListener("click", e => {
	c++
	if (c > 1) {} else {
		sound.mainMusic.currentTime > 0 ? sound.mainMusic.currentTime = 0 : false
		var ss = sound.mainMusic.play()
		if (ss !== undefined) ss.then(() => {})
			.catch((e) => { console.warn(e) })
	}
});