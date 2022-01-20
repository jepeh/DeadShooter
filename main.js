import { GAME } from './app/script.js'

$("#playbtn").on(' click ', () => {
	$("#cover, #GameMode").css("display", "grid")
	$("#playbtn").css("display", "none")
});


$("#GMCancel").on(' click ', () => {
	$("#cover, #GameMode").css("display", "none")
	$("#playbtn").css("display", "grid")
});

console.log(window.frameElement)
console.log(document.location)
console.log(window.location)