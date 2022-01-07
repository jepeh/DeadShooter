import { Profile, Sounds } from "../profiles/profile.js"
import * as sounds from './audio.js'
import * as Three from '../src/three.js'
import { TWEEN } from '../src/tween.module.min.js'

$("#thanks").on('click', () => {
	$("#cover, #ccnscvr").css("display", "none")
	Profile.coins = Profile.coins + 100
	$("#coin-txt").text(Profile.coins)
	window.location.href = "/index.html?play=true"
})

$("#music").on('click', function() {
	Sounds.music ? $("#music div").css({ transform: "translateX(-63%)", backgroundColor: "rgba(255,255,255,.7)" }) : $("#music div").css({ transform: "translateX(63%)", backgroundColor: "rgba(0,0,0,.7)" });
	!Sounds.music ? $("#music").css({ backgroundColor: "rgba(255,255,255,.8)" }) : $("#music").css({ backgroundColor: "rgba(0,0,0,.4)" })
	Sounds.music ? Sounds.music = false : Sounds.music = true

	playSound(sounds.toggle)
})

$("#sound").on('click', function() {
	Sounds.sound ? $("#sound div").css({ transform: "translateX(-63%)", backgroundColor: "rgba(255,255,255,.7)" }) : $("#sound div").css({ transform: "translateX(63%)", backgroundColor: "rgba(0,0,0,.7)" });
	!Sounds.sound ? $("#sound").css({ backgroundColor: "rgba(255,255,255,.8)" }) : $("#sound").css({ backgroundColor: "rgba(0,0,0,.4)" })
	Sounds.sound ? Sounds.sound = false : Sounds.sound = true

	playSound(sounds.toggle)
})


function isEnergy() {
	if (Profile.energy > 0) return true;
	else return false
}

function notEnergy() {
	$("#alert").css("display", "block")
	playSound(sounds.energy)

}

function playSound(sound) {

	if (Sounds.sound) {
		sound.currentTime > 0 ? sound.currentTime = 0 : false
		var ss = sound.play()
		if (ss !== undefined) ss.then(() => {})
			.catch((e) => {})
	}
}


var Atom = function(scene, p, el) {
	this.scene = scene
	this.el = el
	this.p = p
	this.group = new Three.Group()
	this.mesh = new Three.Mesh(new Three.SphereGeometry(.8), new Three.MeshNormalMaterial())
	//	this.mesh.material.flatShading = true
	var self = this
	self.group.add(this.mesh)

	var e1 = new Three.Mesh(new Three.OctahedronGeometry(.2, 2), new Three.MeshNormalMaterial())
	e1.position.set(.5, .9, .9)
	e1.material.flatShading = true

	var e2 = new Three.Mesh(new Three.OctahedronGeometry(.2, 2), new Three.MeshNormalMaterial())
	e2.position.set(.7, -.5, -.9)
	e2.material.flatShading = true

	var e3 = new Three.Mesh(new Three.OctahedronGeometry(.2, 2), new Three.MeshNormalMaterial())
	e3.position.set(-.9, -.9, .9)
	e3.material.flatShading = true

	var e4 = new Three.Mesh(new Three.OctahedronGeometry(.2, 2), new Three.MeshNormalMaterial())
	e4.position.set(-1, -1, -1)
	e4.material.flatShading = true
	var ex = new Three.Mesh(new Three.SphereGeometry(2, 13, 6), new Three.MeshNormalMaterial())
	ex.material.transparent = true
	ex.material.opacity = .2
	ex.material.flatShading = true
	self.group.add(ex)

	self.group.add(e1, e2, e3, e4)
	self.group.position.set(hero.mesh.position.x, hero.mesh.position.y, hero.mesh.position.z)

	self.show = function() {
		return self.group
	}

	this.update = function(e) {
		this.group.rotation.x = e * 6
		this.group.rotation.y = e * 6
		//	this.group.rotation.z += e*6
	}

	this.explode = (function() {
		var h = 0
		var enKill = [];

		var bombXPos = self.group.position.x + Profile.atomBombRadius,
			bombXNeg = self.group.position.x - Profile.atomBombRadius,
			bombZPos = self.group.position.z + Profile.atomBombRadius,
			bombZNeg = self.group.position.z - Profile.atomBombRadius;

		setTimeout(() => {

			var t = setInterval(() => {
				if (h >= 100) {
					h = 0;
					clearInterval(t)
					var hh = 0;
					var tt = setInterval(() => {
						if (hh >= 100) {
							hh = 0
							var uniq = enKill.reduce(function(a, b) {
								if (a.indexOf(b) < 0) a.push(b);
								return a;
							}, []);

							var eneKilling = []

							for (var en = 0; en < uniq.length; en++) {
								for (var u = 0; u < window.enemies.length; u++) {
									if (window.enemies[u].mesh.name === uniq[en]) {
										eneKilling.push(enemies[u])
									}
								}
							}

							for (var ene = 0; ene < eneKilling.length; ene++) {
								var pos = eneKilling[ene].mesh.position
								window.loader.load('../assets/gltf/coin.gltf', e => {

									var mesh = e.scene.children[0]
									mesh.children.shift()

									mesh.scale.set(.08, .08, .08)
									mesh.rotation.x = Math.PI / 2

									mesh.position.set(pos.x, 2, pos.z)


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
								window.killed = window.killed + 1

								eneKilling[ene].mesh.geometry.dispose()
								eneKilling[ene].mesh.material.dispose()
								self.scene.remove(eneKilling[ene].mesh)
								$(`#${eneKilling[ene].name}`).remove()

								for (var ejj = 0; ejj < window.enemies.length; ejj++) {
									if (window.enemies[ejj].mesh.name === eneKilling[ene].mesh.name) {

										window.enemies.splice(ejj, 1)
									}
								}

								for (var ehh = 0; ehh < window.enemyList.length; ehh++) {
									if (window.enemyList[ehh].name === eneKilling[ene].mesh.name) {
										window.enemyList.splice(ehh, 1)
									}
								}


								$("#zombiecount p").html("Zombies x" + window.enemies.length)


							}

							window.atom.mesh.geometry.dispose()
							window.atom.mesh.material.dispose()
							self.scene.remove(self.group)
							window.atom = undefined
							window.a = undefined
							window.atomBomb = false
							clearInterval(tt)
							Profile.atomLevel = 0
							$('.chart').data('easyPieChart').update(0);
							bmb = true

							$(".atomimgon").attr("src", "assets/images/atomoff.png")
							$(".atomimgon").removeClass().addClass("atomimgoff")
							/*enKill.length = 0
							eneKilling.length = 0
							uniq.length = 0*/

						} else {
							hh = hh + 1

							ex.scale.x = ex.scale.x - .1
							ex.scale.y = ex.scale.y - .1
							ex.scale.z = ex.scale.z - .1

							for (var en = 0; en < window.enemies.length; en++) {
								var eX = enemies[en].mesh.position.x,
									eZ = enemies[en].mesh.position.z;

								if (eX > bombXNeg && bombXPos > eX && eZ > bombZNeg && bombZPos > eZ) {
									enemies[en].x = self.group.position.x - enemies[en].mesh.position.x + 1
									enemies[en].z = self.group.position.z - enemies[en].mesh.position.z + 1

									enemies[en].mesh.scale.x = enemies[en].mesh.scale.x - .01
									enemies[en].mesh.scale.y = enemies[en].mesh.scale.y - .01
									enemies[en].mesh.scale.z = enemies[en].mesh.scale.z - .01


									enemies[en].mesh.geometry.parameters.width = .01
									enemies[en].mesh.geometry.parameters.depth = .01
									enemies[en].mesh.geometry.parameters.height = .01

									enKill.push(window.enemies[en].mesh.name)

								}

							}
						}
					}, 10)
				}
				else {
					h = h + 1

					ex.scale.x = ex.scale.x + .1
					ex.scale.y = ex.scale.y + .1
					ex.scale.z = ex.scale.z + .1
				}
			}, 10)

			clearTimeout()
		}, 2500)

		return;
	})()
}

var Holo = function(s) {

	this.holo = new Three.Mesh(new Three.CylinderGeometry(4.5, 4.5, .09, 35), new Three.MeshPhongMaterial({ color: 'lightblue' }))
	this.holo.material.transparent = true
	this.holo.material.opacity = .2
	this.holo.position.y = -0.1
	this.s = s
	this.s.add(this.holo)

	this.cubes = []

	for (var cu = 0; cu < 4; cu++) {

		var size = Math.random() * (.6 - .3) + .3;
		var x = Math.floor(Math.random() * (4.5 - (-4.5)) + (-4.5));
		var y = Math.floor(Math.random() * (4.5 - (-4.5)) + (-4.5));
		var z = Math.floor(Math.random() * (4.5 - (-4.5)) + (-4.5));

		var cube = new Three.Mesh(new Three.BoxGeometry(size, size, size), new Three.MeshPhongMaterial({ color: Profile.heroColor }))
		cube.position.set(x, y, z)
		this.s.add(cube)
		this.cubes.push(cube)
	}

	this.commence = function(hh) {
		var gg = 0;
		var ggg = setInterval(() => {
			if (gg > 70) {
				clearInterval(ggg)
				for (var ii = 0; ii < this.cubes.length; ii++) {
					//this.cubes[i].position.y += .1

					this.cubes[ii].material.dispose()
					this.cubes[ii].geometry.dispose()
					this.s.remove(this.cubes[ii])

				}

			} else {
				gg++

				this.holo.position.y += .09

				for (var i = 0; i < this.cubes.length; i++) {
					this.cubes[i].position.y += .1

					if (this.cubes[i].position.y >= 6) {
						this.cubes[i].material.dispose()
						this.cubes[i].geometry.dispose()
						this.s.remove(this.cubes[i])
						this.cubes.splice(i, 1)
					}
				}


				if (this.holo.position.y >= 5) {
					this.holo.material.dispose()
					this.holo.geometry.dispose()
					this.s.remove(this.holo)
				}

			}
		}, 15)


		return;
	}
}

function spawnBox(p) {
	var pos = {
		x: window.character.position.x,
		z: window.character.position.z
	}

	var ranX = Math.floor(Math.random() * (30 - (-30)) + (-30))
	var ranZ = Math.floor(Math.random() * (30 - (-30)) + (-30))

	pos.x = pos.x + ranX
	pos.z = pos.z + ranZ

	window.loader.load("assets/gltf/box.gltf", e => {

		var box = e.scene.children[0]
		box.children.shift()
		box.position.set(pos.x, 4, pos.z)
		box.scale.set(0.2, .2, .2)

		for (var i = 0; i < box.children.length; i++) {
			if (box.children[i].type === "Mesh") {
				box.children[i].material = new Three.MeshPhongMaterial()
				var c = box.children[i].name

				if (c.length > 7) {
					c = c.split("_")[0]
				}
				box.children[i].material.color.set(c)
			}
		}
		
		box.children[box.children.length-1].material.color.set(window.colors[Math.floor(Math.random()*(6-1)+1)])

		window.SCENE.add(box)

		var scale = { x: .05, y: .05, z: .05}

		var tween = new TWEEN.Tween(scale)
			.to({
				x: .2,
				y: .2,
				z: .2
			}, 700)
			.easing(TWEEN.Easing.Back.In)
			.onUpdate(function() {
				box.scale.set(scale.x, scale.y, scale.z)
			})
			.onComplete(function() {
				//$("#changeColor, #playbtn").css("display", "grid")
			})
			.start()


		window.mysteryboxes.push(box)

	})

}



export { isEnergy, notEnergy, playSound, Atom, Holo, spawnBox }