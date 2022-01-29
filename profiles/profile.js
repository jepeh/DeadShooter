let Profile = {
	level: 1,
	heroName: "cube",
	coins: 100,
	bombReload: 3,
	velocity: 15,
	rank: "noob",
	maxHP: 100,
	bulletType: "laserfire",
	bombDamage: 20,
	energy: 10,
	mapRadius: 90,
	atomBombRadius: 20,
	atomLevel: 0,
	playGame: false,
	gunRange: 20,
	countdownMin: 8,
	keys: 0,
	skills: [{
		name: "rockBomb",
		damage: 3,
		img: "assets/images/textures/field.png"
	}, {
		name: "laserBeam",
		damage: 0.8, // scaling down targets to 80%
		img: "assets/images/textures/gun.png"
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
			case "normal":
				g = .1
				break;
			case "blade":
				g = .3
				break;
			case "laser":
				g = .35
				break;
			case "laserlight":
				g = .4
				break;
			case "laserfire": 
				g = .45
				break;
		}
		return g
	},
	items: [],
	bullets: [{
		name: "laserfire",
		description: "",
		stats: {
			damage: "+10%",
			bulletSpeed: 250
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