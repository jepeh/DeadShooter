import { GAME } from './app/script.js'
import * as Utils from './app/utils.js'
import * as Sounds from './app/audio.js'
//import * as T from './src/three.js'

$("#playbtn").on(' click ', () => {
	$("#cover, #GameMode").css("display", "grid")
	$("#playbtn").css("display", "none")
	Utils.playSound(Sounds.gameMode)
});


$("#GMCancel").on(' click ', () => {
	$("#cover, #GameMode").css("display", "none")
	$("#playbtn").css("display", "grid")

});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log(res))
      .catch(err => console.log("service worker not registered", err))
  })
}