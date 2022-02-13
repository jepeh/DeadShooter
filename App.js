import * as sound from '/app/audio.js'

if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker
			.register("/serviceWorker.js")
			.then((res) => {
				//alert("installed");

			})
			.catch((err) => alert(err));
	});
}

let deferredPrompt;
var install = document.getElementById("install")

window.addEventListener("beforeinstallprompt", (e) => {
	deferredPrompt = e;
	install.innerText = "Install"
});

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
	if (c > 1) {} else {
		sound.mainMusic.currentTime > 0 ? sound.mainMusic.currentTime = 0 : false
		var ss = sound.mainMusic.play()
		if (ss !== undefined) ss.then(() => {})
			.catch((e) => { console.warn(e) })
	}
});



var vid = document.getElementById("vid")

if (innerWidth > innerHeight) {
	vid.src = "assets/vid2.mp4"
	$("#logo").css({
		width: "30vw",
		marginLeft: "-15vw"
	})
	$("#logo").css({
		width: "20vw",
		marginLeft: "-10vw"
	})
	$("#install").css({
		width: "30vw",
		marginLeft: "-15vw"
	})
	$("#title, #description, #mode,#modedes").css({
		fontSize: "15px"
	})
	$("#wallpaper").css({
		width: "50vw",
		marginLeft: "-25vw",
		top: "205%"
	})
	$("#CR").css("top", "270%")
	document.getElementById("cover").style.display = "none"

} else {
	vid.src = "assets/vid.mp4"
	$("#logo").css({
		width: "80vw",
		marginLeft: "-40vw"
	})
	$("#install").css({
		width: "50vw",
		marginLeft: "-25vw"
	})
	$("#title, #mode").css({
		fontSize: "6vw"
	})
	$("#description, #modedes").css({
		fontSize: "4vw"
	})
	$("#wallpaper").css({
		width: "90vw",
		marginLeft: "-45vw",
		top: "195%"
	})
	$("#CR").css("top", "220%")
document.getElementById("cover").style.display = "block"

}


window.onresize = function() {

	if (innerWidth > innerHeight) {

		vid.src = "assets/vid2.mp4"
		$("#logo").css({
			width: "20vw",
			marginLeft: "-10vw"
		})
		$("#install").css({
			width: "30vw",
			marginLeft: "-15vw"
		})
		$("#title, #description, #mode,#modedes").css({
			fontSize: "15px"
		})
		$("#wallpaper").css({
			width: "50vw",
			marginLeft: "-25vw",
			top: "205%"
		})
		$("#CR").css("top", "270%")
		document.getElementById("cover").style.display = "none"
	} else {
		vid.src = "assets/vid.mp4"
		document.getElementById("cover").style.display = "block"

		$("#logo").css({
			width: "80vw",
			marginLeft: "-40vw"
		})
		$("#install").css({
			width: "50vw",
			marginLeft: "-25vw"
		})
		$("#title, #mode").css({
			fontSize: "6vw"
		})
		$("#description, #modedes").css({
			fontSize: "4vw"
		})
		$("#wallpaper").css({
			width: "90vw",
			marginLeft: "-45vw",
			top: "195%"
		})
		$("#CR").css("top", "220%")

	}
}