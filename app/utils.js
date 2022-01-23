import { Profile, Sounds } from "../profiles/profile.js"
import * as sounds from './audio.js'
import * as Three from '../src/three.js'
import { GAME } from './script.js'

$("#thanks").on('click', () => {
	$("#cover, #ccnscvr").css("display", "none")
	Profile.coins = Profile.coins + 100
	$("#coin-txt").text(Profile.coins)

	var newUrl = new URL(window.location.href)
	newUrl.searchParams.set("isPlaying", true)
	window.location.href = newUrl

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
$("#inv").on('click', () => {
	$("#settings-wrapper")
		.css({
			left: "150%",
			display: "none"
		})

	playSound(sounds.setting)

	$("#menu-close").attr("status", "busy")

	var inv = `<div id="inventory-wrapper">
				<div class="inventory" id="inv-header">
					<p>INVENTORY</p>
					<div>
						<div>
							<p>x0</p>
							<img id="energy-img" src="assets/images/energy.png" />
						</div>
						<div>
							<p>0</p>
							<img id="coin-img" src="assets/images/coin.png" />
						</div>
					</div>
				</div>
				<div class="inventory" id="inv-list">
					<div class="inv-lists">
						<p>ITEMS</p>
					</div>
					<div class="inv-lists">
						<p>SKILLS</p>
					</div>
					<div class="inv-lists">
						<p>SKINS</p>
					</div>
					<div class="inv-lists">
						<p>BULLETS</p>
					</div>
				</div>
				<div class="inventory" id="inv-body"></div>
			</div>`

	$("#menu-container").prepend(inv)
})

//*******************************************
// MENU 
//*******************************************
$("#settings").on('click', function() {
	$("#menu").css('display', "grid")
	$("#alert").css('display', "none")

	playSound(sounds.setting)

	// fetch settings interface

})
$("#menu-close").on('click', function() {

	if ($("#menu-close").attr("status") === "busy") {
		var parent = document.getElementById("menu-container")
		parent.removeChild(parent.children[0])
		$("#menu-close").attr("status", "notbusy")
		$("#settings-wrapper")
			.css({
				left: "0",
				display: "grid"
			})
	} else {
		$("#menu").css('display', "none")
	}
	playSound(sounds.toggle)

})

$("#alert").on('click', function() {
	$("#alert").css("display", "none")
})


function isEnergy() {
	if (Profile.energy > 1) return true;
	else return false
}

function notEnergy() {
	$("#alert").css("display", "block")
	$("#playbtn").css("display", "grid")
	$("#cover, #GameMode").css("display", "none")
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

function stopSound(s) {
	s.pause()
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
								window.loader.load('assets/gltf/coin.gltf', e => {

									var mesh = e.scene.children[0]
									mesh.children.shift()

									mesh.scale.set(.08, .08, .08)
									mesh.rotation.x = Math.PI / 2

									mesh.position.set(pos.x, 2, pos.z)


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
								if (window.enemyList.length <= 0) {
									GAME.EnemyBoss()
								}
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

	var m = [
			new Three.MeshToonMaterial({ transparent: true }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0, side: 2 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0, side: 2 })
			]

	var mp = window.TextureLoader.load("assets/images/textures/halo.png")

	m[0].map = mp
	m[0].side = 2
	var holo = new Three.Mesh(new Three.CylinderGeometry(3.7, 3.7, 16, 35), m)
	holo.scale.set(0, 1, 0)

	window.SCENE.add(holo)

	var cubes = []

	for (var cu = 0; cu < 5; cu++) {

		var x = Math.floor(Math.random() * (3 - (-3)) + (-3));
		var y = Math.floor(Math.random() * (1 - (-5)) + (-5));
		var z = Math.floor(Math.random() * (3 - (-3)) + (-3));

		var cube = new Three.Mesh(new Three.CylinderGeometry(.05, .05, 20), m)
		cube.position.set(x, y, z)
		window.SCENE.add(cube)
		cubes.push(cube)
	}

	this.commence = function() {

		TweenMax.to(holo.scale, .8, {
			x: 1,
			y: 1,
			z: 1
		})

		for (var i = 0; i < cubes.length; i++) {
			var ii = i
			TweenMax.to(cubes[i].position, 1.4, {
				x: cubes[i].position.x,
				y: 22,
				z: cubes[i].position.z,
				easing: Power2.easingIn,
				onComplete: function() {
					for (var ii = 0; ii < cubes.length; ii++) {
						cubes[ii].geometry.dispose()
						window.SCENE.remove(cubes[ii])
					}
				}
			})
			TweenMax.to(cubes[i].scale, 1, {
				x: 1,
				y: .3,
				z: 1
			})
		}

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
		box.scale.set(0.05, .05, .05)

		for (var i = 0; i < box.children.length; i++) {
			if (box.children[i].type === "Mesh") {
				box.children[i].material = new Three.MeshToonMaterial()
				var c = box.children[i].name

				if (c.length > 7) {
					c = c.split("_")[0]
				}
				box.children[i].material.color.set(c)
			}
		}

		box.children[box.children.length - 1].material.color.set(window.colors[Math.floor(Math.random() * (6 - 1) + 1)])

		window.SCENE.add(box)

		var scale = { x: .2, y: .2, z: .2 }

		TweenMax.to(box.scale, .4, { x: scale.x, y: scale.y, z: scale.z })


		window.mysteryboxes.push(box)

	})
	return;
}



export {stopSound, isEnergy, notEnergy, playSound, Atom, Holo, spawnBox }