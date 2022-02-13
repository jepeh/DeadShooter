import * as sound from '/app/audio.js'

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then((res) => {
        console.log("installed");
        
      })
      .catch((err) => alert(err));
  });
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  deferredPrompt = e;
});

var install = document.getElementById("install")

install.addEventListener("click", async () => {

  if (deferredPrompt === null) {
    
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
  if (c > 1) {
  } else {
	sound.mainMusic.currentTime > 0 ? sound.mainMusic.currentTime = 0 : false
	var ss = sound.mainMusic.play()
	if (ss !== undefined) ss.then(() => {})
		.catch((e) => { console.warn(e) })
  }  
});