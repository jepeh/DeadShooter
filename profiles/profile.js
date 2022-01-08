let Profile = {
	level: 1,
	heroName: "morph",
	coins: 100,
	bombReload: 100,
	velocity: 15,
	rank: "noob",
	maxHP: 100,
	bombDamage: 50,
	energy: 6,
	mapRadius: 90,
	atomBombRadius: 20,
	atomLevel: 0,
	playGame: false,
	gunRange: 20,
	countdownMin: 8,
	keys: 0,
	skills: [{
		name: "octaBullets",
		damage: 3,
		img: "assets/images/skills/octaBullets.png"
	}, {
		name: "dwarfism",
		damage: 0.8, // scaling down targets to 80%
		img: "assets/images/skills/dwarfism.png"
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

export { Profile, Levels, Sounds }