import * as Three from '../src/three.js'
import { RoundedBoxGeometry } from '../src/RoundedBoxGeometry.js'
import { Profile } from '../profiles/profile.js'
import { GAME } from '../app/script.js'
import { TWEEN } from '../src/tween.module.min.js'
import * as Sounds from '../app/audio.js'
import * as Utils from '../app/utils.js'
import rewards from '../app/rewards.js'

class Hero {

	constructor() {

		this.color = "white"
		this.size = { w: 4, h: 4, d: 4 }
		this.mesh = null

		this.position = new Three.Vector3(0, 4, 0)
		this.scene = SCENE
		this.life = document.getElementById('life')
		this.hp = document.getElementById('hp')
		this.hpLeft = Profile.maxHP
		this.bombDamage = Profile.bombDamage
		this.velocity = Profile.velocity
		this.mapRadius = Profile.mapRadius
		this.gunRange = Profile.gunRange
		this.nearEnemy = []

	}

	// public function
	hurt(attack) {

		this.hpLeft = this.hpLeft - attack
		this.hp.style.width = this.hpLeft + "%"

		this.velocity = this.velocity - 0.01

		//update life count and speed count
		$("#lifecount").text("life " + Math.floor(this.hpLeft) + "/100")
		$("#speed").text("speed " + Math.floor(this.velocity * 100 / Profile.velocity) + "%")

		this.heroHurt()

		if (this.hpLeft < 30) {
			this.hp.style.backgroundColor = 'red'
			$("#critical").css("display", "block")
		} else {
			this.hp.style.backgroundColor = '#11CCFF'
			$("#critical").css("display", "none")
		}

		this.hpLeft < 0 ? GAME.gameOver() : false

		return false;
	}


	// Drop Bombs
	bomb() {

		if (Math.floor(Profile.bombReload > 0)) {
			// hero position
			var HX = hero.mesh.position.x,
				HZ = hero.mesh.position.z;

			for (var d = 0; d < enemies.length; d++) {

				var en = {
					x: enemies[d].mesh.position.x,
					z: enemies[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange && HX + hero.gunRange > en.x && HZ + hero.gunRange > en.z && en.z > HZ - hero.gunRange) {
					this.nearEnemy.push(enemies[d])
				}

			}

			if (this.nearEnemy[0] && window.gobo) {
				window.gobo = false
				Profile.bombReload = Profile.bombReload - 33

				Utils.playSound(Sounds.bomb)
				$("#bomb").css("transform", "scale(1.05)")
				$("#bombbar div").css("width", Profile.bombReload + "%")

				var tu = setTimeout(() => {
					$("#bomb").css("transform", "scale(1.1)")
					clearTimeout(tu)
				}, 10)

				window.gunrange.material.opacity = 0

				var sts = 0;
				var x = this.nearEnemy[0].x
				var z = this.nearEnemy[0].z
				
				// rotate Mesh
				var rY = Math.atan2(this.nearEnemy[0].x, this.nearEnemy[0].z) * 180 / Math.PI
				this.mesh.rotation.y = 0
				this.mesh.rotation.y = rY
			
				
				var shoot = setInterval(() => {
				
					if (sts > 2) {
						window.gobo = true
						clearInterval(shoot);
					} else {
						sts++
						var b = hero.renderBullet()
						b.vtr = {
							x: x,
							z: z
						}
						window.SCENE.add(b)
						window.droppedBomb.push(b)
					}

				}, 200)

			}
			else if (SCENE.getObjectByName("boss")) {

				Profile.bombReload = Profile.bombReload - 33
				Utils.playSound(Sounds.bomb)

				$("#bomb").css("transform", "scale(1.05)")
				$("#bombbar div").css("width", Profile.bombReload + "%")

				var tu = setTimeout(() => {
					$("#bomb").css("transform", "scale(1.1)")
					clearTimeout(tu)
				}, 10)

				window.gunrange.material.opacity = 0

				var b = this.renderBullet()

				b.vtr = {
					x: window.boss.x, //this.nearEnemy[0].mesh.geometry.parameters.width < this.mesh.children[0].geometry.parameters.width ? -this.nearEnemy[0].x : this.nearEnemy[0].x,
					z: window.boss.z //this.nearEnemy[0].mesh.geometry.parameters.width < this.mesh.children[0].geometry.parameters.width ? -this.nearEnemy[0].z : this.nearEnemy[0].z
				}

				this.scene.add(b)
				window.droppedBomb.push(b)
				this.bullets = this.bullets - 1
			}
			else {

				window.gunrange.material.opacity = .1
				var j = setTimeout(() => {
					window.gunrange.material.opacity = 0
					clearTimeout(j)
				}, 100)

				if (Math.floor(Profile.bombReload > 0)) {
					Profile.bombReload = 0

					var sett = setInterval(() => {

						if (Math.floor(Profile.bombReload >= 100)) {
							clearInterval(sett)
							Profile.bombReload = 100
							$("#bombbar div").css("width", Profile.bombReload + "%")

						} else {
							Profile.bombReload = Profile.bombReload + 10
							$("#bombbar div").css("width", Profile.bombReload + "%")
						}

					}, 100)

				} else {
					Profile.bombReload = 0
					var sett = setInterval(() => {
						if (Math.floor(Profile.bombReload >= 100)) {
							clearInterval(sett)
							Profile.bombReload = 100
							$("#bombbar div").css("width", Profile.bombReload + "%")
						} else {
							Profile.bombReload = Profile.bombReload + 10
							$("#bombbar div").css("width", Profile.bombReload + "%")
						}
					}, 100)
				}

			}

		} else {
			
			Profile.bombReload = 0
			var sett = setInterval(() => {

				if (Math.floor(Profile.bombReload >= 100)) {
					clearInterval(sett)
					Profile.bombReload = 100
					$("#bombbar div").css("width", Profile.bombReload + "%")
				} else {
					Profile.bombReload = Profile.bombReload + 10
					$("#bombbar div").css("width", Profile.bombReload + "%")
				}

			}, 100)
		}

		this.nearEnemy.length = 0

		return;
	}



	bulletUpdate(time, p) {

		// update bomb velocity and calculate
		// bounding
		for (var b = 0; b < window.droppedBomb.length; b++) {
			droppedBomb[b].position.x -= droppedBomb[b].vtr.x * .09
			droppedBomb[b].position.z -= droppedBomb[b].vtr.z * .09

			if (droppedBomb[b].position.x > 100 || droppedBomb[b].position.x < -100 || droppedBomb[b].position.z > 100 || droppedBomb[b].position.z < -100) {

				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				this.scene.remove(droppedBomb[b])
				droppedBomb.splice(b, 1)
			}
		}

		// update coins
		for (var b = 0; b < window.droppedCoins.length; b++) {
			droppedCoins[b].rotation.x = Math.cos(time) * 3
			droppedCoins[b].rotation.z = Math.sin(time) * 3
			droppedCoins[b].rotation.y = Math.sin(time) * 3

			// check if hero got the coin
			var zBack = this.mesh.position.z - this.mesh.children[0].geometry.parameters.depth / 2,
				zFront = this.mesh.position.z + this.mesh.children[0].geometry.parameters.depth / 2,
				xBack = this.mesh.position.x - this.mesh.children[0].geometry.parameters.width / 2,
				xFront = this.mesh.position.x + this.mesh.children[0].geometry.parameters.width / 2;

			var cX = droppedCoins[b].position.x,
				cZ = droppedCoins[b].position.z;

			if (zFront > cZ && cZ > zBack && xFront > cX && cX > xBack) {

				droppedCoins[b].position.y = 2

				// dlete coins from array and scene
				droppedCoins[b].children.forEach(e => {
					e.material.dispose()
					e.geometry.dispose()
				})

				this.scene.remove(droppedCoins[b])
				droppedCoins.splice(b, 1)

				Utils.playSound(Sounds.coin)

				Profile.coins = Profile.coins + 1
				$("#coins p").text(Profile.coins)
			}

		}


		// GIFT BOX
		for (var b = 0; b < window.mysteryboxes.length; b++) {

			// check if hero got the coin
			var zBack = this.mesh.position.z - this.mesh.children[0].geometry.parameters.depth / 2,
				zFront = this.mesh.position.z + this.mesh.children[0].geometry.parameters.depth / 2,
				xBack = this.mesh.position.x - this.mesh.children[0].geometry.parameters.width / 2,
				xFront = this.mesh.position.x + this.mesh.children[0].geometry.parameters.width / 2;

			var cX = mysteryboxes[b].position.x,
				cZ = mysteryboxes[b].position.z;

			if (zFront > cZ && cZ > zBack && xFront > cX && cX > xBack) {

				// Random Rewards
				var fcns = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
				var idx = Math.floor(Math.random() * (fcns.length - 1) + 1)

				//	var reward = rewards[fcns[idx]]();
				rewards.f()

				// dlete coins from array and scene
				mysteryboxes[b].children.forEach(e => {

					e.type === "Mesh" ? e.material.dispose() : false
					e.type === "Mesh" ? e.geometry.dispose() : false

				})

				this.scene.remove(mysteryboxes[b])
				mysteryboxes.splice(b, 1)

			}

		}


		return;
	}
}


var Enemy = function(position, color, size, x, z, scene, c, r, name) {

	var self = this

	self.position = position
	self.color = color
	self.size = size
	self.mesh = null
	self.x = x
	self.z = z
	self.name = name
	self.render = r
	self.camera = c
	self.velocity = 10
	self.radius = self.size > 4 ? 30 : 40
	self.walkDirection = new Three.Vector3()
	self.rotateAngle = new Three.Vector3(0, 1, 0)
	self.rotateQuarternion = new Three.Quaternion()
	self.scene = scene
	self.hp = 100
	self.attack = self.size > 5 ? 1.5 : .5
	self.giveBomb = self.size > hero.size ? 0 : 35


	// private functions
	// encapsulation

	self.renderEnemy = function() {

		const mesh = new Three.Mesh(new Three.BoxGeometry(self.size.w, self.size.h, self.size.d), new Three.MeshPhongMaterial({ color: self.color }))
		mesh.position.set(self.position.x, self.position.y, self.position.z)
		mesh.castShadow = true
		mesh.receiveShadow = true
		mesh.name = self.name
		self.mesh = mesh

		/*	self.lf = `<div class="eLife" id="${self.name}"><div></div></div>`
		$("body").append(self.lf)
		$(`#${self.name}`).css('width', self.size.w > 2 ? "70px" : "30px")
*/
		return mesh
	}

	//*******************************************
	// public function
	//*******************************************
	self.update = function(p, delta, h) {

		var t = 0

		var PosXBack = self.mesh.position.x - self.radius,
			PosXFront = self.mesh.position.x + self.radius,
			PosZBack = self.mesh.position.z - self.radius,
			PosZFront = self.mesh.position.z + self.radius;

		var zBack = h.position.z - h.children[0].geometry.parameters.depth / 2,
			zFront = h.position.z + h.children[0].geometry.parameters.depth / 2,
			xBack = h.position.x - h.children[0].geometry.parameters.width / 2,
			xFront = h.position.x + h.children[0].geometry.parameters.width / 2;

		var zzBack = self.mesh.position.z - self.mesh.geometry.parameters.depth / 2,
			zzFront = self.mesh.position.z + self.mesh.geometry.parameters.depth / 2,
			xxBack = self.mesh.position.x - self.mesh.geometry.parameters.width / 2,
			xxFront = self.mesh.position.x + self.mesh.geometry.parameters.width / 2;


		//*******************************************
		// Hurt the hero
		//*******************************************

		if (zzFront > zFront && zBack > zzBack && xxFront > xFront && xBack > xxBack) {
			hero.hurt(self.attack)
		}
		//Phase 1 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xFront > xxBack && xxBack > xBack) {
			hero.hurt(self.attack)

		}
		// Phase 3 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xxFront > xBack && xFront > xxFront) {
			hero.hurt(self.attack)
		}
		// Phase 2 hurt
		else if (xBack >= xxBack && xxFront >= xFront && zFront > zzBack && zzBack > zBack) {
			hero.hurt(self.attack)

		}
		// Phase 4 hurt
		else if (xBack >= xxBack && xxFront >= xFront & zzFront > zBack && zFront > zzFront) {
			hero.hurt(self.attack)
		}


		self.walkDirection.x = self.x
		self.walkDirection.z = self.z
		self.rotateAngle.normalize()
		self.walkDirection.normalize()
		//self.mesh.quaternion.rotateTowards(self.rotateQuarternion, .1)

		// Update self mesh's position
		self.walkDirection.applyAxisAngle(self.rotateAngle, 0)

		self.velocity = 5

		// move model & camera
		var mX = self.walkDirection.x * self.velocity * delta
		var mZ = self.walkDirection.z * self.velocity * delta


		// Intuitive System
		// Check Hero in Surroundings
		if (xBack > PosXBack && zFront < PosZFront && PosXFront > xFront && PosZBack < zBack) {

			// chase the hero

			var angleYCameraDirection = Math.atan2(h.position.x, h.position.z) * 180 / Math.PI

			var originX = h.position.x,
				originZ = h.position.z

			var enemyX = self.mesh.position.x,
				enemyZ = self.mesh.position.z

			// Check every Quadrants
			// Q1

			if (originZ < enemyZ && originX < enemyX) {
				self.x = h.position.x - self.mesh.position.x
				self.z = h.position.z - self.mesh.position.z

			}
			// Q4
			else if (originZ < enemyZ && originX > enemyX) {
				self.x = h.position.x - self.mesh.position.x
				self.z = h.position.z - self.mesh.position.z
				self.mesh.rotation.y > angleYCameraDirection ? self.mesh.rotation.y-- : self.mesh.rotation.y++
			}
			// Q3
			else if (originZ > enemyZ && enemyX > originX) {
				self.x = h.position.x - self.mesh.position.x
				self.z = h.position.z - self.mesh.position.z
			}
			// Q2
			else if (originZ > enemyZ && originX > enemyX) {
				self.x = h.position.x - self.mesh.position.x
				self.z = h.position.z - self.mesh.position.z
			}


			// Update mesh position
			p.setMeshPosition(self.mesh, {
				x: self.mesh.position.x + mX,
				y: self.mesh.position.y,
				z: self.mesh.position.z + mZ
			})

			//	self.mesh.rotation.y = self.rotateQuarternion
		} else {


			self.walkDirection.x = self.x
			self.walkDirection.z = self.z

			p.setMeshPosition(self.mesh, {
				x: self.mesh.position.x + mX,
				y: self.mesh.position.y,
				z: self.mesh.position.z + mZ
			})

		}


		// Check Boundings
		if (self.mesh.position.x > 100) {
			self.mesh.position.x = -100
			if (self.mesh.position.z > 100 || self.mesh.position.z < -100) {
				self.mesh.position.z = 100 || -100
			}
		} else if (self.mesh.position.x < -100) {
			self.mesh.position.x = 100
			if (self.mesh.position.z > 100 || self.mesh.position.z < -100) {
				self.mesh.position.z = 100 || -100
			}
		} else if (self.mesh.position.z > 100) {
			self.mesh.position.z = -100
			if (self.mesh.position.x > 100 || self.mesh.position.x < -100) {
				self.mesh.position.x = 100 || -100
			}
		} else if (self.mesh.position.z < -100) {
			self.mesh.position.z = 100
			if (self.mesh.position.x > 100 || self.mesh.position.x < -100) {
				self.mesh.position.x = 100 || -100
			}
		}



		// Update Bombs and if true, hurt enemy itself.

		var PosXBackB = self.mesh.position.x - self.mesh.geometry.parameters.width / 2,
			PosXFrontB = self.mesh.position.x + self.mesh.geometry.parameters.width / 2,
			PosZBackB = self.mesh.position.z - self.mesh.geometry.parameters.depth / 2,
			PosZFrontB = self.mesh.position.z + self.mesh.geometry.parameters.depth / 2;


		for (var b = 0; b < droppedBomb.length; b++) {

			var bombX = droppedBomb[b].position.x,
				bombZ = droppedBomb[b].position.z;

			if (PosZFrontB > bombZ && bombZ > PosZBackB && PosXFrontB > bombX && bombX > PosXBackB) {

				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				self.scene.remove(droppedBomb[b])
				self.scene.remove(droppedBomb[b].child)
				window.droppedBomb[b].removed = true
				window.droppedBomb.splice(b, 1)

				// Hurt animation for enemy
				self.mesh.material.color.set("red")
				var u = setTimeout(() => {
					self.mesh.material.color.set(self.color)
					clearTimeout(u)
				}, 100)

				// decrrased hp
				var dmg = hero.bombDamage
				self.hp = self.hp - dmg

			}
		}

		// the zombie died
		// drop coins

		Enemy.prototype.lvl = function() {
			Profile.atomLevel = Profile.atomLevel + 10
			$(".atomimgoff").css({
				opacity: 1
			})
			$(".atomimgoff").attr("src", "assets/images/atomon.png")
			$(".atomimgoff").removeClass().addClass("atomimgon")
			Profile.atomLevel = 100

		}

		// Hero died
		// Game Over

		if (self.hp < 0) {
			$(`#${self.name}`).remove()

			// update Atom Level
			Profile.atomLevel >= 90 ? Enemy.prototype.lvl() : Profile.atomLevel = Profile.atomLevel + 10, $('.chart').data('easyPieChart').update(Profile.atomLevel);

			window.loader.load('../assets/gltf/coin.gltf', e => {

				var mesh = e.scene.children[0]
				mesh.children.shift()

				mesh.scale.set(.08, .08, .08)

				mesh.rotation.x = Math.PI / 2

				mesh.position.set(self.mesh.position.x, 2, self.mesh.position.z)

				for (var i = 0; i < mesh.children.length; i++) {
					if (mesh.children[i].type === "Mesh") {
						mesh.children[i].material = new Three.MeshPhongMaterial()

						var c = mesh.children[i].name

						if (c.length > 7) {
							c = c.split("_")[0]
						}
						mesh.children[i].material.color.set(c)
					}
				}
				window.droppedCoins.push(mesh)
				self.scene.add(mesh)
			})


			p.setMeshPosition(self.mesh, {
				x: self.mesh.position.x + mX,
				y: -2,
				z: self.mesh.position.z + mZ
			})

			for (var hh = 0; hh < hero.nearEnemy.length; hh++) {
				if (self.mesh.name === hero.nearEnemy[hh].mesh.name) {
					hero.nearEnemy.splice(hh, 1)
				}
			}

			self.scene.add(c)
			var n = self.mesh.name
			self.mesh.geometry.dispose()
			self.mesh.material.dispose()

			self.scene.remove(self.mesh)

			var index = window.enemyList.findIndex(e => e.name === n);
			window.enemyList.splice(index, 1)
			window.enemies.splice(index, 1)

			// If Enemy lnegth < 0, summon Boss
			if (window.inGame) {
				window.enemies.length <= 0 ? GAME.EnemyBoss() : false
			}


			window.killed = window.killed + 1
			//update zombie count
			$("#zombiecount p").html("Zombies x" + window.enemies.length)

			// Dust particles


		}


		TWEEN.update()
		return;
	}

}

var EnemyBoss = function() {

	this.size = {
		w: 15,
		h: 15,
		d: 15
	}

	this.hp = Profile.level > 20 ? Profile.level > 40 ? 350 : 250 : 100
	this.attack = Profile.level > 20 ? Profile.level > 40 ? 3.5 : 2.5 : 1.5
	this.x = .2
	this.z = .2
	this.pos = new Three.Vector3(0, 7.5, 0)
	this.velocity = 5
	this.walkDirection = new Three.Vector3()
	this.rotateAngle = new Three.Vector3(0, 2, 0)

	this.render = function() {
		this.mesh = new Three.Group()

		var mainBody = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshNormalMaterial())
		mainBody.material.transparent = true
		mainBody.material.opacity = 0
		this.mesh.add(mainBody)

		this.Body = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshPhongMaterial({ color: 'green' }))
		this.mesh.add(this.Body)

		this.mesh.position.copy(this.pos)

		//this.p.addMesh(this.mesh, 1)
		return this.mesh
	}

	var self = this

	this.update = function(d) {

		self.walkDirection.x = self.x
		self.walkDirection.z = self.z
		self.rotateAngle.normalize()
		self.walkDirection.normalize()

		// Update self mesh's position
		self.walkDirection.applyAxisAngle(self.rotateAngle, 0)

		self.velocity = 5

		// move model & camera
		var mX = self.walkDirection.x * self.velocity * d
		var mZ = self.walkDirection.z * self.velocity * d

		self.z = hero.mesh.position.z - self.mesh.position.z
		self.x = hero.mesh.position.x - self.mesh.position.x


		self.mesh.position.x += mX
		self.mesh.position.z += mZ

		var zBack = hero.mesh.position.z - hero.mesh.children[0].geometry.parameters.depth / 2,
			zFront = hero.mesh.position.z + hero.mesh.children[0].geometry.parameters.depth / 2,
			xBack = hero.mesh.position.x - hero.mesh.children[0].geometry.parameters.width / 2,
			xFront = hero.mesh.position.x + hero.mesh.children[0].geometry.parameters.width / 2;

		var zzBack = self.mesh.position.z - self.mesh.children[0].geometry.parameters.depth / 2,
			zzFront = self.mesh.position.z + self.mesh.children[0].geometry.parameters.depth / 2,
			xxBack = self.mesh.position.x - self.mesh.children[0].geometry.parameters.width / 2,
			xxFront = self.mesh.position.x + self.mesh.children[0].geometry.parameters.width / 2;


		//*******************************************
		// Hurt the hero
		//*******************************************

		if (zzFront > zFront && zBack > zzBack && xxFront > xFront && xBack > xxBack) {
			hero.hurt(self.attack)
		}
		//Phase 1 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xFront > xxBack && xxBack > xBack) {
			hero.hurt(self.attack)

		}
		// Phase 3 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xxFront > xBack && xFront > xxFront) {
			hero.hurt(self.attack)
		}
		// Phase 2 hurt
		else if (xBack >= xxBack && xxFront >= xFront && zFront > zzBack && zzBack > zBack) {
			hero.hurt(self.attack)

		}
		// Phase 4 hurt
		else if (xBack >= xxBack && xxFront >= xFront & zzFront > zBack && zFront > zzFront) {
			hero.hurt(self.attack)
		}

		// Bullet Hurt

		var PosXBackB = self.mesh.position.x - self.mesh.children[0].geometry.parameters.width / 2,
			PosXFrontB = self.mesh.position.x + self.mesh.children[0].geometry.parameters.width / 2,
			PosZBackB = self.mesh.position.z - self.mesh.children[0].geometry.parameters.depth / 2,
			PosZFrontB = self.mesh.position.z + self.mesh.children[0].geometry.parameters.depth / 2;


		for (var b = 0; b < droppedBomb.length; b++) {

			var bombX = droppedBomb[b].position.x,
				bombZ = droppedBomb[b].position.z;

			if (PosZFrontB > bombZ && bombZ > PosZBackB && PosXFrontB > bombX && bombX > PosXBackB) {


				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				SCENE.remove(droppedBomb[b])
				window.droppedBomb[b].removed = true
				window.droppedBomb.splice(b, 1)

				// Hurt animation for enemy
				self.mesh.children[1].material.color.set("red")
				var u = setTimeout(() => {
					self.mesh.children[1].material.color.set("green")
					clearTimeout(u)
				}, 100)

				// decrrased hp
				var dmg = hero.bombDamage / 60
				self.hp = self.hp - dmg
			}

		}

		// if hp < 0, game win
		if (self.hp <= 0) {

			self.mesh.traverse(e => {
				if (e.type === "Mesh") {
					e.material.dispose()
					e.geometry.dispose()
				}
			})
			SCENE.remove(self.mesh)

			GAME.gameWin()
		}

		return;
	}
}

const Heroes = {}

class defaultHero extends Hero {

	constructor(c, s) {
		super()
	}

	renderHero() {
		const group = new Three.Group()

		const mainBody = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshNormalMaterial())
		mainBody.material.transparent = true
		mainBody.material.opacity = 0
		group.add(mainBody)

		const mesh = new Three.Mesh(new Three.BoxGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshPhongMaterial({ color: this.color }))
		mesh.castShadow = true
		mesh.receiveShadow = true
		mesh.flatShading = true
		//mesh.layers.enable(1);

		group.add(mesh)
		group.position.set(this.position.x, this.position.y, this.position.z)

		this.mesh = group

		// update coins
		$("#bulletCount").text("Bullets x" + this.bullets)
		$("#coinstxt").text("coins x" + this.coins)
		return group;
	}

	anim(e) {
		!window.inGame ? this.mesh.rotation.y = Math.cos(e) * .2 : false

		return;
	}

	initAnim() {
		window.huh = true;
		var hhh = setInterval(() => {

			if (!huh) {
				clearInterval(hhh)
			} else {
				var holo = new Utils.Holo(SCENE)
				holo.commence(huh)
			}

		}, 500)

		return;
	}

	heroHurt() {
		this.mesh.children[1].material.color !== "red" ? this.mesh.children[1].material.color.set("red") : false
		var t = setTimeout(() => {
			this.mesh.children[1].material.color.set(this.color)
			clearTimeout(t)
		}, 500)

		return;
	}

	renderBullet() {

		var g = new Three.Group()

		var b = new Three.Mesh(new Three.IcosahedronGeometry(.9), new Three.MeshNormalMaterial())
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(this.mesh.position)

		return g;
	}

}

Heroes.defaultHero = defaultHero

export { Enemy, Heroes, EnemyBoss }