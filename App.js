//import * as sound from '/app/audio.js'

const ASSETS = [
	"Game.html",
	"style.css",
	"main.js",
	"app/script.js",
	"app/audio.js",
	"app/rewards.js",
	"app/utils.js",
	"app/bullets/bullet.js",
	"app/map/map.js",
	"app/modes/adventure.js",
	"app/modes/farm.js",
	"app/modes/rumblearena.js",
	"app/systems/particle.js",
	"characters/character.js",
	"controller/controller.js",
	"controller/joy.js",
	"profiles/profile.js",
	"skills/skills.js",
	"src/index.js",
	"src/jquery-3.6.0.js",
	"src/jquery.easypiechart.min.js",
	"src/OimoPhysics.js",
	"src/OP.js",
	"src/OrbitControls.js",
	"src/RoundedBoxGeometry.js",
	"src/three.js",
	"src/TextGeometry.js",
	"src/TweenMax.min.js",
	"src/Loader/FBXLoader.js",
	"src/Loader/GLTFLoader.js",
	"src/Loader/FontLoader.js",
	"src/Loader/OBJLoader.js",
	"assets/vid.mp4",
	"assets/audio/bladeGun.wav",
	"assets/audio/bomb.mp3",
	"assets/audio/coin.wav",
	"assets/audio/color.wav",
	"assets/audio/die.wav",
	"assets/audio/eat.mp3",
	"assets/audio/energy.wav",
	"assets/audio/farmmode.mp3",
	"assets/audio/farmModeReward.wav",
	"assets/audio/gamemode.wav",
	"assets/audio/gameOver.wav",
	"assets/audio/gameWin.wav",
	"assets/audio/gift.wav",
	"assets/audio/gun.wav",
	"assets/audio/instantKill.wav",
	"assets/audio/laserGun.wav",
	"assets/audio/laserLightGun.wav",
	"assets/audio/lightningStrike.mp3",
	"assets/audio/mainMusic.mp3",
	"assets/audio/menu.wav",
	"assets/audio/normalGun.wav",
	"assets/audio/pixelBullet.mp3",
	"assets/audio/selectInv.wav",
	"assets/audio/toggle.wav",
	"assets/fonts/lineicons.css",
	"assets/fonts/LineIcons.eot",
	"assets/fonts/LineIcons.svg",
	"assets/fonts/LineIcons.ttf",
	"assets/fonts/LineIcons.woff",
	"assets/fonts/LineIcons.woff2",
	"assets/fonts/Quicksand_Light_Regular.json",
	"assets/fonts/Quicksand_Medium_Regular.json",
	"assets/fonts/Quicksand-Bold.ttf",
	"assets/fonts/Quicksand-Light.ttf",
	"assets/fonts/Quicksand-Medium.ttf",
	"assets/fonts/Quicksand-Regular.ttf",
	"assets/fonts/Quicksand-SemiBold.ttf",
	"assets/gltf/box.gltf",
	"assets/gltf/coin.gltf",
	"assets/images/atomoff.png",
	"assets/images/atomon.png",
	"assets/images/background.jpg",
	"assets/images/blockgamesblack.png",
	"assets/images/blockgameswhite.png",
	"assets/images/coin_reward.png",
	"assets/images/coin.png",
	"assets/images/energy.png",
	"assets/images/farming.png",
	"assets/images/lockmode.png",
	"assets/images/key.png",
	"assets/images/logo.png",
	"assets/images/logo2.png",
	"assets/images/map.png",
	"assets/images/profile.jpg",
	"assets/images/rewards",
	"assets/images/skillArrow.png",
	"assets/images/textures",
	"assets/images/zombie.png",
	"assets/images/rewards/10coins.png",
	"assets/images/rewards/1coin.png",
	"assets/images/rewards/1energy.png",
	"assets/images/rewards/1key.png",
	"assets/images/rewards/5coins.png",
	"assets/images/rewards/atom.png",
	"assets/images/rewards/damage.png",
	"assets/images/rewards/hp.png",
	"assets/images/rewards/speed.png",
	"assets/images/textures/bladeBullet.png",
	"assets/images/textures/bladeHit.png",
	"assets/images/textures/dis.png",
	"assets/images/textures/field.png",
	"assets/images/textures/gun.png",
	"assets/images/textures/gunrange.png",
	"assets/images/textures/halo.png",
	"assets/images/textures/heal.png",
	"assets/images/textures/Hh.gif",
	"assets/images/textures/IKrod.png",
	"assets/images/textures/instantKill.png",
	"assets/images/textures/jellyfishBullet.png",
	"assets/images/textures/laser.png",
	"assets/images/textures/laserAura.png",
	"assets/images/textures/laserBeam.png",
	"assets/images/textures/laserBullet.png",
	"assets/images/textures/laserlightBullet.png",
	"assets/images/textures/lasers.png",
	"assets/images/textures/lightning.png",
	"assets/images/textures/ninjabladeBullet.png",
	"assets/images/textures/phoenixfireBullet.png",
	"assets/images/textures/rod.png",
	"assets/images/textures/summonZombie.png",
	"assets/images/textures/particleTexture.png",
	];


if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker
			.register("serviceWorker.js")
			.then((res) => {
				alert("service worker installed! caching files...")
				console.log("installed")
				
				caches.open("ZMB").then( e =>{
					
					e.addAll(ASSETS)
					alert("cached!")
				})
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
/*
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

*/