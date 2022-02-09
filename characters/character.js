import * as Three from '../src/three.js'
import { RoundedBoxGeometry } from '../src/RoundedBoxGeometry.js'
import { Profile } from '../profiles/profile.js'
import { GAME } from '../app/script.js'
import * as Sounds from '../app/audio.js'
import * as Utils from '../app/utils.js'
import rewards from '../app/rewards.js'
import { FARM } from '../app/modes/farm.js'
import { Bullets, bulletSprite } from '../app/bullets/bullet.js'
import { OBJLoader } from '../src/Loader/OBJLoader.js'
import Particles from '../app/systems/particle.js'
import { GLTFLoader } from '../src/Loader/GLTFLoader.js'

window.ModelLoader = new GLTFLoader()
var COIN;
window.TxtLoader = new Three.TextureLoader();

async function getCoin() {
	ModelLoader.load('../assets/gltf/coin.gltf', e => {

		var mesh = e.scene.children[0]
		mesh.children.shift()
		mesh.scale.set(.8, .8, .8)
		mesh.rotation.x = Math.PI / 2

		//mesh.position.set(self.mesh.position.x, 2, self.mesh.position.z)

		for (var i = 0; i < mesh.children.length; i++) {

			if (mesh.children[i].type === "Mesh") {
				mesh.children[i].material = new Three.MeshToonMaterial()

				var c = mesh.children[i].name

				if (c.length > 7) {
					c = c.split("_")[0]
				}
				mesh.children[i].material.color.set(c)

			}
			//COIN.push(mesh.children[i])
		}
		COIN = mesh
		console.log(mesh)
	})

}
getCoin()

class Hero {

	constructor() {

		this.color = "white"
		this.size = { w: 4, h: 4, d: 4 }
		this.mesh = null
		this.mapBullet = window.TextureLoader.load(`assets/images/textures/${Profile.bulletType}.png`)
		this.position = new Three.Vector3(0, 4, 0)
		this.scene = SCENE
		this.HitMap = TextureLoader.load("assets/images/textures/bladeHit.png")
		this.life = document.getElementById('life')
		this.hp = document.getElementById('hp')
		this.hpLeft = Profile.maxHP
		this.bombDamage = Profile.bombDamage + Profile.bombDamage * Profile.bulletDamage(Profile.bulletType)
		this.velocity = Profile.velocity
		this.mapRadius = Profile.mapRadius
		this.gunRange = Profile.gunRange
		this.nearEnemy = []
		this.bulletSpeed = Profile.bullets.filter(e => { return e.name === Profile.bulletType })[0].stats.bulletSpeed
		this.rotateAngle = new Three.Vector3(0, 1, 0)
		this.rotateQuarternion = new Three.Quaternion()
		this.immune = false
		this.running = false

	}

	// public function
	hurt(attack, vel) {
		if (!this.immune) {
			this.hpLeft = this.hpLeft - attack
			this.hp.style.width = this.hpLeft + "%"

			this.velocity = this.velocity - vel

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

			this.hpLeft < 0 ? FARM.gameOver() : false

			// Blood drops Effect

			var ranW = Math.random() * (1.5 - .5) + .5
			var ranH = Math.random() * (0.3 - .1) + 0.1

			var ranX = Math.random() * (3 - 0.5) + 0.5

			var pos = {
				x: this.mesh.position.x + ranX,
				y: 1,
				z: this.mesh.position.z + ranX
			}

			let blood = new Three.Mesh(new Three.BoxBufferGeometry(ranW, ranH, ranW), new Three.MeshToonMaterial({ color: "red", transparent: true, opacity: .6 }))
			blood.position.copy(pos)
			window.SCENE.add(blood)
			window.bloods.push(blood)


		}
		return false;
	}


	// Drop Bombs
	bomb() {

		if (Math.floor(Profile.bombReload !== 0)) {

			Profile.bombReload === 1 ? $("#bomb p").text("Reload") : $("#bomb p").text("Bomb")

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
				//this.mesh.rotation.y = 0
				window.gobo = false
				Profile.bombReload = Profile.bombReload - 1


				$("#bomb").css("transform", "scale(1.05)")
				$("#bombbar div").css("width", Profile.bombReload * 100 / 3 + "%")

				var tu = setTimeout(() => {
					$("#bomb").css("transform", "scale(1.1)")
					clearTimeout(tu)
				}, 10)

				window.gunrange.material.opacity = 0

				var sts = 0;
				var x = this.nearEnemy[0].x
				var z = this.nearEnemy[0].z
				var xx = this.nearEnemy[0].mesh.position.x
				var zz = this.nearEnemy[0].mesh.position.z

				var angleYCameraDirection = Math.atan2(
					(this.nearEnemy[0].mesh.position.x - this.mesh.position.x),
					(this.nearEnemy[0].mesh.position.z - this.mesh.position.z))

				TweenMax.to(this.mesh.rotation, .25, {
					y: angleYCameraDirection
				})
				var trail;
				if (this.running) {
					trail = this.mesh.children[this.mesh.children.length - 1]
					TweenMax.to(trail.scale, .3, {
						x: 0,
						y: 0,
						z: 0
					})
				}

				var shoot = setInterval(() => {
					if (sts > 2) {
						clearInterval(shoot);
						window.gobo = true
						if (this.running) {
							TweenMax.to(trail.scale, .3, {
								x: 1,
								y: 1,
								z: 1
							})
						}

					} else {
						sts++
						var b = hero.renderBullet()
						b.vtr = {
							x: x,
							z: z
						}

						var bDirection = Math.atan2(
							(b.position.x - xx),
							(b.position.z - zz))

						b.rotation.y = bDirection

						window.SCENE.add(b)
						window.droppedBomb.push(b)

					}

				}, this.bulletSpeed)

			}
			else if (SCENE.getObjectByName("boss") && window.gobo) {
				hero.gunRange = 35
				window.gunrange.scale.x = 1.5
				window.gunrange.scale.z = 1.5
				gunrange.scale.y = 1.5

				var HX = hero.mesh.position.x,
					HZ = hero.mesh.position.z;

				if (window.boss.mesh.position.x > HX - hero.gunRange && HX + hero.gunRange > window.boss.mesh.position.x && HZ + hero.gunRange > window.boss.mesh.position.z && window.boss.mesh.position.z > HZ - hero.gunRange) {
					Profile.bombReload === 1 ? $("#bomb p").text("Reload") : $("#bomb p").text("Bomb")

					window.gobo = false
					Profile.bombReload = Profile.bombReload - 33


					$("#bomb").css("transform", "scale(1.05)")
					$("#bombbar div").css("width", Profile.bombReload + "%")

					var tu = setTimeout(() => {
						$("#bomb").css("transform", "scale(1.1)")
						clearTimeout(tu)
					}, 10)

					window.gunrange.material.opacity = 0
					var trail;
					if (this.running) {
						trail = this.mesh.children[this.mesh.children.length - 1]
						TweenMax.to(trail.scale, .3, {
							x: 0,
							y: 0,
							z: 0
						})
					}

					var sts = 0;
					var x = window.boss.x
					var z = window.boss.z
					var xx = window.boss.mesh.position.x
					var zz = window.boss.mesh.position.z

					// rotate Mesh

					//	var directionOffset = Math.atan2(this.nearEnemy[0].mesh.position.z, this.nearEnemy[0].mesh.position.x) * 180 / Math.PI
					var angleYCameraDirection = Math.atan2(
						(window.boss.mesh.position.x - this.mesh.position.x),
						(window.boss.mesh.position.z - this.mesh.position.z))

					TweenMax.to(this.mesh.rotation, .25, {
						y: angleYCameraDirection,
						onComplete: function() {
							var shoot = setInterval(() => {
								if (sts > 2 || window.boss.hp <= 0) {
									window.gobo = true
									clearInterval(shoot);
									if (this.running) {
										TweenMax.to(trail.scale, .3, {
											x: 1,
											y: 1,
											z: 1
										})
									}
								} else {
									sts++
									var b = hero.renderBullet()
									b.vtr = {
										x: x,
										z: z
									}
									var bDirection = Math.atan2(
										(b.position.x - xx),
										(b.position.z - zz))

									b.rotation.y = bDirection

									window.SCENE.add(b)
									window.droppedBomb.push(b)
								}

							}, hero.bulletSpeed)
						}
					})
					// update quaternions


				} else {
					window.gunrange.material.opacity = .3
					window.gunrange.position.y = .2
					var j = setTimeout(() => {
						window.gunrange.material.opacity = 0

						clearTimeout(j)
					}, 100)
				}
			}
			else {
				window.gunrange.material.opacity = .3
				window.gunrange.position.y = .2
				var j = setTimeout(() => {
					window.gunrange.material.opacity = 0

					clearTimeout(j)
				}, 100)
			}
		} else {
			if (Profile.bombReload === 3) {} else {
				var sr = setInterval(() => {
					if (Profile.bombReload > 2) {
						clearInterval(sr)
					} else {
						Profile.bombReload++
						$("#bombbar div").css("width", Profile.bombReload * 100 / 3 + "%")
					}
				}, 400)
			}
		}

		this.nearEnemy.length = 0

		return;
	}



	bulletUpdate(time) {

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
				droppedBomb[b].done = true
				droppedBomb[b] = null
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
				Profile.coins = Profile.coins + droppedCoins[b].val

				// dlete coins from array and scene


				/*if (droppedCoins[b].field) {

					TweenMax.to(droppedCoins[b].field.scale, .5, {
						x: 0,
						z: 0,
						onComplete: () => {
							window.droppedCoins[b].field.geometry.dispose()
							window.droppedCoins[b].field.material.forEach(e => {
								e.dispose()
							})

							window.SCENE.remove(droppedCoins[b].field)
							SCENE.remove(droppedCoins[b].field)
							SCENE.remove(droppedCoins[b])
							droppedCoins.splice(b, 1)
						}
					})



				}*/

				window.SCENE.remove(droppedCoins[b])
				droppedCoins.splice(b, 1)

				Utils.playSound(Sounds.coin)


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
			var clr = mysteryboxes[b].children[mysteryboxes[b].children.length - 1].material.color

			if (zFront > cZ && cZ > zBack && xFront > cX && cX > xBack) {

				// Random Rewards
				var fcns = ["a", "b", "c", "d", "e", "f", "g", "h", "i"]
				var idx = Math.floor(Math.random() * (fcns.length - 1) + 1)

				if (hero.running) {
					if (idx === 6) {
						idx = 1
					}
				}
				if (hero.velocity < 9) {
					idx = 6
				}

				var boxReward = rewards[fcns[idx]]();

				Utils.playSound(Sounds.gift)

				// check if it's additional awards
				if (boxReward.isAward) {
					window.addRewards.push(boxReward.isAward)
				}

				var parts = []
				var pos = {
					x: mysteryboxes[b].position.x,
					y: mysteryboxes[b].position.y,
					z: mysteryboxes[b].position.z
				}

				for (var i = 0; i < 10; i++) {

					var geom = new Three.IcosahedronGeometry(3, 0);
					var mat = new Three.MeshToonMaterial({
						color: clr
					});

					var mesh = new Three.Mesh(geom, mat);
					mesh.position.x = mysteryboxes[b].position.x
					mesh.position.y = mysteryboxes[b].position.y
					mesh.position.z = mysteryboxes[b].position.z
					mesh.rotation.y = Math.floor(Math.random() * 10)
					mesh.needsUpdate = true
					mesh.scale.set(.3, .3, .3)
					var targetX = pos.x + (-1 + Math.random() * 2) * 10;
					var targetY = pos.y + (-1 + Math.random() * 2) * 10;
					var targetZ = pos.z + (-1 + Math.random() * 2) * 10;

					SCENE.add(mesh)
					parts.push(mesh)

					TweenMax.to(mesh.rotation, .5, { x: Math.random() * 12, z: Math.random() * 12 });
					TweenMax.to(mesh.scale, .5, { x: .1, y: .1, z: .1 });
					TweenMax.to(mesh.position, .6, {
						x: targetX,
						y: targetY,
						z: targetZ,
						delay: Math.random() * .1,
						ease: Power2.easeOut,
						onComplete: function() {
							mesh.scale.set(3, 3, 3)
							mesh.material.dispose()
							mesh.geometry.dispose()
							for (var u = 0; u < parts.length; u++) {
								if (parts[u].parent) parts[u].parent.remove(parts[u])
							}
						}
					});

				}

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


var Enemy = function(position, color, size, x, z, scene, c, r, name, physics) {

	var self = this
	self.physics = physics
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

		const mesh = new Three.Mesh(new Three.BoxGeometry(self.size.w, self.size.h, self.size.d), new Three.MeshToonMaterial({ color: self.color }))
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
			hero.hurt(self.attack, 0.01)
		}
		//Phase 1 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xFront > xxBack && xxBack > xBack) {
			hero.hurt(self.attack, 0.01)

		}
		// Phase 3 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xxFront > xBack && xFront > xxFront) {
			hero.hurt(self.attack, 0.01)
		}
		// Phase 2 hurt
		else if (xBack >= xxBack && xxFront >= xFront && zFront > zzBack && zzBack > zBack) {
			hero.hurt(self.attack, 0.01)

		}
		// Phase 4 hurt
		else if (xBack >= xxBack && xxFront >= xFront & zzFront > zBack && zFront > zzFront) {
			hero.hurt(self.attack, 0.01)
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

			//	var angleYCameraDirection = Math.atan2(h.position.x, h.position.z) * 180 / Math.PI

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
				//	self.mesh.rotation.y > angleYCameraDirection ? self.mesh.rotation.y-- : self.mesh.rotation.y++
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
			var angleYCameraDirection = Math.atan2(
				(self.mesh.position.x - hero.mesh.position.x),
				(self.mesh.position.z - hero.mesh.position.z))

			TweenMax.to(self.mesh.rotation, .25, {
				y: angleYCameraDirection
			})


			// Update mesh position
			p.setMeshPosition(self.mesh, {
				x: self.mesh.position.x + mX,
				y: self.mesh.position.y,
				z: self.mesh.position.z + mZ
			})

			//	self.mesh.rotation.y = self.rotateQuarternion
		}
		// continue walking
		else {


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
				droppedBomb[b].done = true
				// Hurt animation for enemy
				self.mesh.material.color.set("red")
				var u = setTimeout(() => {
					self.mesh.material.color.set(self.color)
					clearTimeout(u)
				}, 100)



				var pos = droppedBomb[b].position

				bulletSprite(pos)

				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				self.scene.remove(droppedBomb[b])
				self.scene.remove(droppedBomb[b].child)
				window.droppedBomb[b].removed = true
				window.droppedBomb[b] = null
				window.droppedBomb.splice(b, 1)


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

		if (self.hp <= 0) {
			self.die()
		}

		return;
	}

	self.die = function() {
		// update Atom Level
		Profile.atomLevel >= 90 ? Enemy.prototype.lvl() : Profile.atomLevel = Profile.atomLevel + 10, $('.chart').data('easyPieChart').update(Profile.atomLevel);

		/*	window.loader.load('../assets/gltf/coin.gltf', e => {

				var mesh = e.scene.children[0]
				mesh.children.shift()

				mesh.scale.set(.08, .08, .08)

				mesh.rotation.x = Math.PI / 2

				mesh.position.set(self.mesh.position.x, 2, self.mesh.position.z)

				for (var i = 0; i < mesh.children.length; i++) {
					if (mesh.children[i].type === "Mesh") {
						mesh.children[i].material = new Three.MeshToonMaterial()

						var c = mesh.children[i].name

						if (c.length > 7) {
							c = c.split("_")[0]
						}
						mesh.children[i].material.color.set(c)
					}
				}
				mesh.val = 1
				window.droppedCoins.push(mesh)
				self.scene.add(mesh)
			})*/

		var coin = new Three.Group()

	//	for (var c = 0; c < COIN.children.length; c++) {

	var mesh0 = new Three.Mesh(COIN.children[0].geometry, COIN.children[0].material)
	mesh0.position.set(0,-2,1)
	mesh0.scale.z = 2
	//mesh0.rotation.z = Math.PI/4+Math.PI/3
	coin.add(mesh0)

	var mesh1 = new Three.Mesh(COIN.children[1].geometry, COIN.children[1].material)
	mesh1.position.set(-1.8,.9,1)
	mesh1.scale.z = 2
	mesh1.rotation.z = Math.PI/2.8
	coin.add(mesh1)

	var mesh2 = new Three.Mesh(COIN.children[2].geometry, COIN.children[2].material)
	mesh2.position.set(1.8,.9,1)
	mesh2.rotation.z = -Math.PI/2.8
	mesh2.scale.z = 2
	coin.add(mesh2)


	var mesh3 = new Three.Mesh(COIN.children[3].geometry, COIN.children[3].material)
	mesh3.position.set(0, 0, -.2)
	coin.add(mesh3)

	var mesh4 = new Three.Mesh(COIN.children[4].geometry, COIN.children[4].material)
	mesh4.position.set(0, 0, 0)

	coin.add(mesh4)

	//	}

	coin.scale.set(.1, .1, .1)
	coin.position.copy(this.mesh.position)
	coin.val = 1
	window.droppedCoins.push(coin)
	SCENE.add(coin)

		var parts = []
		var pos = {
			x: self.mesh.position.x,
			y: self.mesh.position.y,
			z: self.mesh.position.z
		}

		for (var i = 0; i < 5; i++) {

			var geom = new Three.TetrahedronGeometry(3, 0);
			var mat = new Three.MeshToonMaterial({
				color: "green"
			});
			var mesh = new Three.Mesh(geom, mat);
			mesh.position.x = self.mesh.position.x
			mesh.position.y = self.mesh.position.y
			mesh.position.z = self.mesh.position.z
			mesh.rotation.y = Math.floor(Math.random() * 10)
			mesh.needsUpdate = true
			mesh.scale.set(.3, .3, .3)
			var targetX = pos.x + (-1 + Math.random() * 2) * 5;
			var targetY = pos.y + (-1 + Math.random() * 2) * 5;
			var targetZ = pos.z + (-1 + Math.random() * 2) * 5;

			SCENE.add(mesh)
			parts.push(mesh)

			TweenMax.to(mesh.rotation, 1, { x: Math.random() * 12, z: Math.random() * 12 });
			TweenMax.to(mesh.scale, 1, { x: .1, y: .1, z: .1 });
			TweenMax.to(mesh.position, .6, {
				x: targetX,
				y: .2,
				z: targetZ,
				delay: Math.random() * .5,
				ease: Power2.easeOut,
				onComplete: function() {

					mesh.material.dispose()
					mesh.geometry.dispose()

				}
			});

		}


		self.physics.setMeshPosition(self.mesh, {
			x: self.mesh.position.x,
			y: -15,
			z: self.mesh.position.z
		})

		for (var hh = 0; hh < hero.nearEnemy.length; hh++) {
			if (self.mesh.name === hero.nearEnemy[hh].mesh.name) {
				hero.nearEnemy.splice(hh, 1)
			}
		}

		//self.scene.add(c)
		var n = self.mesh.name
		self.mesh.geometry.dispose()
		self.mesh.material.dispose()
		self.scene.remove(self.mesh)
		var index = window.enemyList.findIndex(e => e.name === n);
		window.enemyList.splice(index, 1)
		window.enemies.splice(index, 1)


		// If Enemy lnegth < 0, summon Boss
		if (window.inGame) {
			enemies.length <= 0 ? FARM.EnemyBoss() : false
		}

		window.killed = window.killed + 1
		//update zombie count
		$("#zombiecount p").html("Zombies x" + window.enemies.length)

		// Dust particles
		Utils.playSound(Sounds.die)

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
	this.run = true
	this.summonTime = Profile.level > 5 ? 25000 : 15000
	this.walkDirection = new Three.Vector3()
	this.rotateAngle = new Three.Vector3(0, 2, 0)

	this.render = function() {
		this.mesh = new Three.Group()

		var mainBody = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshNormalMaterial())
		mainBody.material.transparent = true
		mainBody.material.opacity = 0
		this.mesh.add(mainBody)

		this.Body = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshToonMaterial({ color: 'green' }))
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

		// Rotation towards Hero
		var angleYCameraDirection = Math.atan2(
			(self.mesh.position.x - hero.mesh.position.x),
			(self.mesh.position.z - hero.mesh.position.z))

		TweenMax.to(self.mesh.rotation, .25, {
			y: angleYCameraDirection
		})

		// move model & camera
		var mX = self.walkDirection.x * self.velocity * d
		var mZ = self.walkDirection.z * self.velocity * d

		self.z = hero.mesh.position.z - self.mesh.position.z
		self.x = hero.mesh.position.x - self.mesh.position.x

		if (self.run) {
			self.mesh.position.x += mX
			self.mesh.position.z += mZ
		}

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
			hero.hurt(self.attack, 0.01)
		}
		//Phase 1 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xFront > xxBack && xxBack > xBack) {
			hero.hurt(self.attack, 0.01)

		}
		// Phase 3 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xxFront > xBack && xFront > xxFront) {
			hero.hurt(self.attack, 0.01)
		}
		// Phase 2 hurt
		else if (xBack >= xxBack && xxFront >= xFront && zFront > zzBack && zzBack > zBack) {
			hero.hurt(self.attack, 0.01)

		}
		// Phase 4 hurt
		else if (xBack >= xxBack && xxFront >= xFront & zzFront > zBack && zFront > zzFront) {
			hero.hurt(self.attack, 0.01)
		}

		// Bullet Hurt

		var PosXBackB = self.mesh.position.x - self.mesh.children[0].geometry.parameters.width / 2,
			PosXFrontB = self.mesh.position.x + self.mesh.children[0].geometry.parameters.width / 2,
			PosZBackB = self.mesh.position.z - self.mesh.children[0].geometry.parameters.depth / 2,
			PosZFrontB = self.mesh.position.z + self.mesh.children[0].geometry.parameters.depth / 2;


		for (var b = 0; b < droppedBomb.length; b++) {

			var bombX = droppedBomb[b].position.x,
				bombY = droppedBomb[b].position.y,
				bombZ = droppedBomb[b].position.z;

			if (PosZFrontB > bombZ && bombZ > PosZBackB && PosXFrontB > bombX && bombX > PosXBackB) {


				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				SCENE.remove(droppedBomb[b])
				window.droppedBomb[b].removed = true
				window.droppedBomb[b].done = true
				window.droppedBomb[b] = null
				window.droppedBomb.splice(b, 1)


				self.hurt()

				var parts = []
				var pos = {
					x: bombX,
					y: bombY,
					z: bombZ
				}

				for (var i = 0; i < 10; i++) {

					var geom = new Three.TetrahedronGeometry(8, 0);
					var mat = new Three.MeshToonMaterial({
						color: "green"
					});
					var mesh = new Three.Mesh(geom, mat);
					mesh.position.x = self.mesh.position.x
					mesh.position.y = self.mesh.position.y
					mesh.position.z = self.mesh.position.z
					mesh.rotation.y = Math.floor(Math.random() * 10)
					mesh.needsUpdate = true
					mesh.scale.set(.3, .3, .3)
					var targetX = pos.x + (-1 + Math.random() * 2) * 10;
					var targetY = pos.y + (-1 + Math.random() * 2) * 10;
					var targetZ = pos.z + (-1 + Math.random() * 2) * 10;

					SCENE.add(mesh)
					parts.push(mesh)

					TweenMax.to(mesh.rotation, .5, { x: Math.random() * 12, z: Math.random() * 12 });
					TweenMax.to(mesh.scale, .5, { x: .1, y: .1, z: .1 });
					TweenMax.to(mesh.position, .6, {
						x: targetX,
						y: targetY,
						z: targetZ,
						delay: Math.random() * .1,
						ease: Power2.easeOut,
						onComplete: function() {

							mesh.material.dispose()
							mesh.geometry.dispose()
							for (var u = 0; u < parts.length; u++) {
								if (parts[u].parent) parts[u].parent.remove(parts[u])
							}
						}
					});

				}


			}

		}

		// if hp < 0, game win
		if (self.hp <= 0) {

			self.mesh.traverse(e => {
				if (e.type === "Mesh") {
					e.material.dispose()
					e.geometry.dispose()
				}

				return;
			})
			SCENE.remove(self.mesh)
			FARM.gameWin()
		}

		return;
	}


	self.hurt = function() {
		// decrrased hp
		var dmg = hero.bombDamage / 40
		self.hp = self.hp - dmg

		// Hurt animation for enemy
		self.mesh.children[1].material.color.set("red")
		var u = setTimeout(() => {
			self.mesh.children[1].material.color.set("green")
			clearTimeout(u)
		}, 100)
	}

	self.summonZombies = function() {
		for (var i = 0; i < 6; i++) {

			var posIn = self.mesh.position
			var w = self.mesh.children[1].geometry.parameters.width

			var pos = {
				x: posIn.x + Math.random() * (w + 10 - (-(w + 10))) + (-(w + 10)),
				y: posIn.y + Math.random() * (15 - 5) + 5,
				z: posIn.z + Math.random() * (w + 10 - (-(w + 10))) + (-(w + 10))
			}
			var n = i + "bb"
			var zb = new BabyZombies(n)
			var zombie = zb.makeZombies()

			zombie.position.copy(pos)

			SCENE.add(zombie)
			window.babyZombies.push(zb)
			TweenMax.to(zombie.position, .8, {
				y: 2
			})
		}
	}

	var sum = setInterval(() => {
		if (self.hp <= 0 || !window.inGame) {
			clearInterval(sum)
		} else {
			self.run = false
			var plane = new Three.Mesh(new Three.PlaneBufferGeometry(32, 32), new Three.MeshToonMaterial({
				map: TextureLoader.load("assets/images/textures/summonZombie.png"),
				transparent: true,
				side: 2
			}))
			plane.position.copy(self.mesh.position)
			plane.position.y = 1
			plane.rotation.x = -Math.PI / 2
			plane.scale.set(0, 0, 0)

			window.SCENE.add(plane)


			var m = [
			new Three.MeshToonMaterial({ transparent: true, opacity: .9, color: "red" }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 })
			]

			var mp = TextureLoader.load("assets/images/textures/rod.png");

			m[0].map = mp
			m[0].side = 2


			var field = new Three.Mesh(new Three.CylinderGeometry(19, 19, 30, 50), m)
			field.position.copy(self.mesh.position)
			field.scale.set(0, 1, 0)

			window.SCENE.add(field)

			TweenMax.to(field.scale, 3.5, {
				x: 1,
				y: 1,
				z: 1,
				onComplete: function() {
					TweenMax.to(field.scale, 3, {
						x: 0,
						y: 1,
						z: 0,
						onComplete: function() {
							field.geometry.dispose()
							window.SCENE.remove(field)
						}
					})

				}
			})

			TweenMax.to(plane.scale, 1, {
				x: 1,
				y: 1,
				z: 1,
				onComplete: function() {
					TweenMax.to(plane.rotation, 3, {
						z: 2,
						onComplete: function() {

							self.summonZombies()


							TweenMax.to(plane.scale, 1, {
								x: 0,
								y: 0,
								z: 0,
								onComplete: function() {
									if (plane.parent) {
										plane.material.dispose()
										plane.geometry.dispose()
										SCENE.remove(plane)
									}
									self.run = true
								}
							})

						}
					})
				}
			})


		}
	}, self.summonTime)

}


class BabyZombies {
	constructor(n) {
		this.width = 6
		this.inWidth = 4.5
		this.walkDirection = new Three.Vector3()
		this.rotateAngle = new Three.Vector3(0, 1, 0)
		this.x = 0
		this.z = 0
		this.velocity = 4
		this.mesh = null
		this.hp = 3
		this.name = n
	}

	makeZombies() {
		var zombie = new Three.Group()

		var m1 = new Three.Mesh(new Three.BoxBufferGeometry(this.width, this.width, this.width), new Three.MeshToonMaterial({ color: "green", transparent: true, opacity: .5 }))
		m1.castShadow = true
		m1.receiveShadow = true
		zombie.add(m1)
		var m2 = new Three.Mesh(new Three.BoxBufferGeometry(this.inWidth, this.inWidth, this.inWidth), new Three.MeshToonMaterial({ color: "#580404" }))
		m2.castShadow = true
		m2.receiveShadow = true
		zombie.add(m2)
		this.mesh = zombie
		this.mesh.name = this.name

		return zombie;
	}

	update(delta) {

		this.walkDirection.x = this.x
		this.walkDirection.z = this.z
		this.rotateAngle.normalize()
		this.walkDirection.normalize()

		// Update self mesh's position
		this.walkDirection.applyAxisAngle(this.rotateAngle, 0)


		// Rotation towards Hero
		var angleYCameraDirection = Math.atan2(
			(this.mesh.position.x - hero.mesh.position.x),
			(this.mesh.position.z - hero.mesh.position.z))

		TweenMax.to(this.mesh.rotation, .25, {
			y: angleYCameraDirection
		})

		// move model & camera
		var mX = this.walkDirection.x * this.velocity * delta * 1.3
		var mZ = this.walkDirection.z * this.velocity * delta * 1.3

		this.z = hero.mesh.position.z - this.mesh.position.z
		this.x = hero.mesh.position.x - this.mesh.position.x


		if (window.shieldOn) {

			var dx = window.character.position.x - this.mesh.position.x
			var dz = window.character.position.z - this.mesh.position.z
			var dis = Math.abs(Math.sqrt((dx * dx) + (dz * dz)))

			if (dis <= 12) {
				this.mesh.position.x += -mX //this.mesh.position.x
				this.mesh.position.z += -mZ //this.mesh.position.z
			} else {
				this.mesh.position.x += mX
				this.mesh.position.z += mZ
			}

		} else {
			this.mesh.position.x += mX
			this.mesh.position.z += mZ
		}

		var PosXBackB = this.mesh.position.x - this.width / 2,
			PosXFrontB = this.mesh.position.x + this.width / 2, //self.mesh.geometry.parameters.width / 2,
			PosZBackB = this.mesh.position.z - this.width / 2, //self.mesh.geometry.parameters.depth / 2,
			PosZFrontB = this.mesh.position.z + this.width / 2 //self.mesh.geometry.parameters.depth / 2;


		var zBack = hero.mesh.position.z - hero.mesh.children[0].geometry.parameters.depth / 2,
			zFront = hero.mesh.position.z + hero.mesh.children[0].geometry.parameters.depth / 2,
			xBack = hero.mesh.position.x - hero.mesh.children[0].geometry.parameters.width / 2,
			xFront = hero.mesh.position.x + hero.mesh.children[0].geometry.parameters.width / 2;

		var zzBack = this.mesh.position.z - this.mesh.children[0].geometry.parameters.depth / 2,
			zzFront = this.mesh.position.z + this.mesh.children[0].geometry.parameters.depth / 2,
			xxBack = this.mesh.position.x - this.mesh.children[0].geometry.parameters.width / 2,
			xxFront = this.mesh.position.x + this.mesh.children[0].geometry.parameters.width / 2;


		//*******************************************
		// Hurt the hero
		//*******************************************

		if (zzFront > zFront && zBack > zzBack && xxFront > xFront && xBack > xxBack) {
			//hero.hurt(self.attack)

			hero.hurt(.001, .03)
		}
		//Phase 1 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xFront > xxBack && xxBack > xBack) {
			//	hero.hurt(self.attack)

			hero.hurt(.001, .03)
		}
		// Phase 3 hurt
		else if (zzFront >= zFront && zBack >= zzBack && xxFront > xBack && xFront > xxFront) {
			//	hero.hurt(self.attack)

			hero.hurt(.001, .03)
		}
		// Phase 2 hurt
		else if (xBack >= xxBack && xxFront >= xFront && zFront > zzBack && zzBack > zBack) {
			//hero.hurt(self.attack)

			hero.hurt(.001, .03)

		}
		// Phase 4 hurt
		else if (xBack >= xxBack && xxFront >= xFront & zzFront > zBack && zFront > zzFront) {
			//hero.hurt(self.attack)

			hero.hurt(.001, .03)
		}


		for (var b = 0; b < droppedBomb.length; b++) {

			var bombX = droppedBomb[b].position.x,
				bombZ = droppedBomb[b].position.z;

			if (PosZFrontB > bombZ && bombZ > PosZBackB && PosXFrontB > bombX && bombX > PosXBackB) {
				this.hp = this.hp - 1
				// Hurt animation for enemy

				// Hit Effect
				bulletSprite(droppedBomb[b].position)

				for (var bb = 0; bb < droppedBomb[b].children.length; bb++) {
					droppedBomb[b].children[bb].geometry.dispose()
					droppedBomb[b].children[bb].material.dispose()
				}

				window.SCENE.remove(droppedBomb[b])
				SCENE.remove(droppedBomb[b].child)
				window.droppedBomb[b].removed = true
				window.droppedBomb[b].done = true
				window.droppedBomb[b] = null

				window.droppedBomb.splice(b, 1)

			}

		}
		if (this.hp <= 0) {
			this.die()
		}
	}

	die() {
		Profile.atomLevel >= 90 ? this.lvl() : Profile.atomLevel = Profile.atomLevel + 10, $('.chart').data('easyPieChart').update(Profile.atomLevel);

		for (var i = 0; i < babyZombies.length; i++) {
			if (this.name === babyZombies[i].name) {
				babyZombies[i].mesh.children.forEach(e => {
					e.material.dispose()
					e.geometry.dispose()
				})
				SCENE.remove(babyZombies[i].mesh)
				babyZombies.splice(i, 1)
			}
		}
	}

	lvl() {
		Profile.atomLevel = Profile.atomLevel + 10
		$(".atomimgoff").css({
			opacity: 1
		})
		$(".atomimgoff").attr("src", "assets/images/atomon.png")
		$(".atomimgoff").removeClass().addClass("atomimgon")
		Profile.atomLevel = 100

	}
}


const Heroes = {}

class defaultHero extends Hero {

	constructor() {
		super()
	}

	renderHero() {
		const group = new Three.Group()
		group.position.set(this.position.x, this.position.y, this.position.z)

		const mainBody = new Three.Mesh(new Three.BoxBufferGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshNormalMaterial())
		mainBody.material.transparent = true
		mainBody.material.opacity = 0
		mainBody.scale.set(.4, .4, .4)
		group.add(mainBody)

		//	var maptxt = TxtLoader.load('assets/images/coin_reward.png')

		const mesh = new Three.Mesh(new Three.BoxGeometry(this.size.w, this.size.h, this.size.d), new Three.MeshToonMaterial())
		mesh.castShadow = true
		mesh.receiveShadow = true
		group.add(mesh)

		const muzzle = new Three.Mesh(new Three.BoxGeometry(1, 1, 1), new Three.MeshToonMaterial({ transparent: true, opacity: 0 }))
		muzzle.position.set(0, 1, 6)
		group.add(muzzle)
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

		var sys = new Particles({
			pCount: 20,
			center: this.mesh.position,
			texture: window.TextureLoader.load("assets/images/textures/bladeHit.png"),
			size: {
				minSize: 1,
				maxSize: 3
			},
			loop: false,
			targetTiming: 2,
			inTiming: 1,
			outTiming: 2,
			upward: true,
			positions: {
				x: {
					minX: -4,
					maxX: 4
				},
				y: {
					minY: 3,
					maxY: 20
				},
				z: {
					minZ: -4,
					maxZ: 4
				}
			},
			targetScale: new Three.Vector3(1, 1, 1),
			interval: 60
		})

		sys.start()

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
		var g;
		switch (Profile.bulletType) {
			case "normalBullet":
				g = Bullets.normal()
				break;
			case "bladeBullet":
				g = Bullets.blade()
				break;
			case "laserBullet":
				g = Bullets.laser()
				break;
			case "laserlightBullet":
				g = Bullets.laserLight()
				break;
			case "phoenixfireBullet":
				g = Bullets.phoenixFire()
				break;
			case "jellyfishBullet":
				g = Bullets.jellyFish()
				break;
			case "lasertubeBullet":
				g = Bullets.laserTube()
				break;
			case "pixelBullet":
				g = Bullets.pixelBullet()
				break;
			case "ninjabladeBullet":
				g = Bullets.ninjaBlade();
				break;
		}

		return g;
	}

}

Heroes.defaultHero = defaultHero

export { Enemy, Heroes, EnemyBoss }