const ASSETS = [
	"Game.html",
	"style.css",
	"main.js",
	"app/script.js",
	"app/audio.js",
	"app/reward.js",
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
	]


self.addEventListener("install", (installEvent) => {
alert("installing")
	installEvent.waitUntil(
		caches.open("static").then((cache) => {
			alert("caching...")
			return cache.addAll(ASSETS);
		})
		.catch(e => {
			alert(e)
		})
	);
});

/*self.addEventListener("fetch", (e) => {
	alert(`ferching for ${e.request.url}`);

	e.respondWith(
		caches.match(e.request)
		.then(function(response) {
			// Cache hit - return response
			if (response) {
				return response;
			}
			return fetch(e.request);
		}));
});
*/

//window.location.reload(true)

self.addEventListener("fetch", event => {
	alert()
	if (event.request.url === "https://dead-shooter.glitch.me/") {
		// or whatever your app's URL is
		event.respondWith(
			fetch(event.request).catch(err =>
				self.cache.open("static").then(cache => cache.match("/Game.html"))
			)
		);
	} else {
		event.respondWith(
			fetch(event.request).catch(err =>
				caches.match(event.request).then(response => response)
			)
		);
	}
});