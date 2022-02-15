let Profile = {
	level: 1,
	heroName: "cube",
	heroType: "default",
	coins: 100,
	bombReload: 3,
	velocity: 15,
	rank: "noob",
	maxHP: 100,
	bulletType: "ninjabladeBullet",
	bombDamage: 20,
	energy: 10,
	mapRadius: 120,
	atomBombRadius: 20,
	atomLevel: 100,
	playGame: false,
	gunRange: 20,
	countdownMin: 5,
	keys: 0,
	skills: [{
		// Special Skill, Skill 1
			name: "forceField",
			damage: 3,
			img: "assets/images/textures/field.png",
			type: "special",
			cooldown: 10
	}, {
		// Static Skill, Skill 2
			name: "instantKill",
			damage: 0.8, // scaling down targets to 80%
			img: "assets/images/textures/gun.png",
			type: "static",
			cooldown: 10
	},
		{
			// Dynamic Skill, Skill 3
			name: "laserBeam",
			damage: 0.8, // scaling down targets to 80%
			img: "assets/images/coin.png",
			type: "dynamic",
			cooldown: 10
	}],
	Heroes: [
		{
			name: "cube",
			heroClass: "default",
			premium: false,
			unlockable: false
		}
		],

	// FB Data Functions
	FB: {
		update: function() {},
		get: function() {},
		delete: function() {}
	},
	bulletDamage: function(type) {
		var g;
		switch (type) {
			case "normalBullet":
				g = .1
				break;
			case "bladeBullet":
				g = .3
				break;
			case "laserBullet":
				g = .35
				break;
			case "laserlightBullet":
				g = .4
				break;
			case "phoenixfireBullet":
				g = .45
				break;
			case "jellyfishBullet":
				g = .55
				break;
			case "lasertubeBullet":
				g = .59
				break;
			case "pixelBullet":
				g = .5
				break;
			case "ninjabladeBullet":
				g = .6
				break;
		}
		return g
	},
	items: [],
	bullets: [{
		name: "ninjabladeBullet",
		description: "",
		stats: {
			damage: "+10%",
			bulletSpeed: 200
		}
	}],
	skins: []

}

let Levels = {
	levels: []
}

let Sounds = {
	sound: false,
	music: false
}

let User = {
	name: null,
	id: null,
	locale: null,
	image: new Image(),
	platform: null
}



export { Profile, Levels, Sounds, User }