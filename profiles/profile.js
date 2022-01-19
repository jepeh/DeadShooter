let Profile = {
	level: 1,
	heroName: "cube",
	coins: 100,
	bombReload: 3,
	velocity: 15,
	rank: "noob",
	maxHP: 100,
	bombDamage: 15,
	energy: 10,
	mapRadius: 90,
	atomBombRadius: 20,
	atomLevel: 0,
	playGame: false,
	gunRange: 20,
	countdownMin: 8,
	keys: 0,
	skills: [{
		name: "forceField",
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
	}

}

let Levels = {
	levels: []
}

let Sounds = {
	sound: true,
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