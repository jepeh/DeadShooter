import * as Three from '../src/three.js'
import { GAME } from '../app/script.js'
import * as Utils from "../app/utils.js"
import * as Sounds from "../app/audio.js"

var Skills = [
	{
		name: "octaBullets",
		func: function() {
			alert()
		}
	}, {
		name: "dwarfism",
		func: function() {

		}
	},
	{
		name: "lightningStrike",
		func: function(pos) {


			window.gobo = false

			var angleYCameraDirection = Math.atan2(
				(pos.x - hero.mesh.position.x),
				(pos.z - hero.mesh.position.z))

			var targetPos = {
				x: pos.x,
				z: pos.z
			}
			TweenMax.to(hero.mesh.rotation, .5, {
				y: angleYCameraDirection
			})

			var arr = window.enemies.length > 0 ? window.enemies : window.babyZombies
			var arrToKill = GAME.findTargetS(arr, hero.mesh.position)
			var lightningMap = TextureLoader.load("assets/images/textures/lightning.png")

			var go = setTimeout(() => {


				var plane = new Three.Mesh(new Three.PlaneBufferGeometry(hero.gunRange * 1.2, hero.gunRange * 1.2), new Three.MeshToonMaterial({
					map: TextureLoader.load("assets/images/textures/laserAura.png"),
					transparent: true,
					side: 2,
					opacity: .7
				}))
				plane.position.copy(character.position)
				plane.position.y = 1
				plane.rotation.x = -Math.PI / 2
				plane.scale.set(0, 0, 0)

				window.SCENE.add(plane)

				TweenMax.to(plane.scale, .8, {
					x: 1,
					y: 1,
					z: 1

				})
				var pp = []
				TweenMax.to(plane.rotation, 1.5, {
					z: 2,
					onComplete: () => {


					}
				})

				var ty = setTimeout(() => {
					// Lightning Strikes

					Utils.playSound(Sounds.lightningStrike)

					for (var o = 0; o < arrToKill.length; o++) {
						var lightning = new Three.Mesh(new Three.PlaneGeometry(4, 150), new Three.MeshToonMaterial({
							side: 2,
							transparent: true,
							map: lightningMap

						}))
						lightning.position.copy(arrToKill[o].mesh.position)
						lightning.scale.y = 0
						lightning.rotation.y = Math.atan2((CAMERA.position.x - arrToKill[o].mesh.position.x), (CAMERA.position.z - arrToKill[o].mesh.position.z))
						pp.push(lightning)
						SCENE.add(lightning)
						TweenMax.to(lightning.scale, .4, {
							y: 1
						})
						arrToKill[o].hp = 0


						var strike = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({
							transparent: true,
							opacity: .5
						}))
						strike.position.copy(arrToKill[o].mesh.position)
						strike.scale.set(0, 0, 0)

						SCENE.add(strike)
						TweenMax.to(strike.scale, .4, {
							x: 1,
							y: 1,
							z: 1,
							onComplete: () => {
								TweenMax.to(strike.scale, .3, {
									x: 0,
									y: 0,
									z: 0
								})
							}
						})
						pp.push(strike)
					}

					if (window.bossGame) {
						var lightning = new Three.Mesh(new Three.PlaneGeometry(9, 100), new Three.MeshToonMaterial({
							side: 2,
							transparent: true,
							map: lightningMap

						}))

						lightning.position.copy(window.boss.mesh.position)
						lightning.scale.y = 0
						lightning.rotation.y = Math.atan2((CAMERA.position.x - window.boss.mesh.position.x), (CAMERA.position.z - window.boss.mesh.position.z))
						pp.push(lightning)
						SCENE.add(lightning)
						TweenMax.to(lightning.scale, .4, {
							y: 1
						})
						window.boss.hp -= 10
						boss.hurt()

					}

					var tyy = setTimeout(() => {
						for (var p = 0; p < pp.length; p++) {
							pp[p].material.dispose()
							pp[p].geometry.dispose()
							SCENE.remove(pp[p])
						}
						clearTimeout(tyy)
					}, 800)

					clearTimeout(ty)


				}, 1200)

				var parts = []
				var skss = 0;
				var sks = setInterval(() => {
					if (skss >= 2) {
						skss = 0
						clearInterval(sks)
						TweenMax.to(plane.scale, .6, {
							x: 0,
							y: 0,
							z: 0,
							onComplete: () => {
								plane.material.dispose()
								plane.geometry.dispose()
								plane.parent.remove(plane)
								window.gobo = true
							}
						})
					} else {
						skss++
						for (var i = 0; i < 16; i++) {

							var geom = new Three.IcosahedronGeometry(.5, 0);
							var mat = new Three.MeshNormalMaterial();

							var mesh = new Three.Mesh(geom, mat);

							var pos = {
								x: character.position.x,
								y: character.position.y,
								z: character.position.z
							}

							var targetX = pos.x + (-1 + Math.random() * 2) * 12;
							var targetY = pos.y + (-1 + Math.random() * 2) * 12;
							var targetZ = pos.z + (-1 + Math.random() * 2) * 12;

							mesh.position.x = targetX
							mesh.position.y = targetY
							mesh.position.z = targetZ
							mesh.needsUpdate = true

							SCENE.add(mesh)
							parts.push(mesh)

							TweenMax.to(mesh.scale, 1, { x: .1, y: .1, z: .1 });
							TweenMax.to(mesh.position, 1.6, {
								x: pos.x,
								y: pos.y,
								z: pos.z,
								ease: Power2.easeOut,
								onComplete: function() {
									mesh.material.dispose()
									mesh.geometry.dispose()
									for (var u = 0; u < parts.length; u++) {
										parts[u].material.dispose()
										parts[u].geometry.dispose()
										if (parts[u].parent) parts[u].parent.remove(parts[u])
									}

									return;
								}
							});
						}
					}
				}, 700)

				clearTimeout(go)
			}, 700)
			return;
		}
	},
	{
		name: "forceField",
		duration: 19000,
		func: function(pos, p) {
			const field = new Three.Mesh(new Three.SphereGeometry(6), new Three.MeshToonMaterial())
			p.addMesh(field, 1)
			field.material.transparent = true
			field.scale.set(.1, .1, .1)
			field.material.side = 2
			field.material.flatShading = true

			var map = window.TextureLoader.load('assets/images/textures/field.png')
			field.material.map = map

			field.position.copy(hero.mesh.position)
			field.position.y = 4
			SCENE.add(field)

			TweenMax.to(field.scale, 1.2, { x: 1, y: 1, z: 1 })

			window.shieldOn = true
			hero.shield = field

			var ts = setTimeout(() => {
				TweenMax.to(field.scale, .9, {
					x: 0,
					y: 0,
					z: 0,
					onComplete: function() {
						p.setMeshPosition(field, {
							x: 0,
							y: -10,
							z: 0
						})
						if (field.parent) field.parent.remove(field)
						hero.shield = undefined
						window.shieldOn = false
						return;
					}
				})
				clearTimeout(ts)
			}, this.duration)

			return;
		}
	},
	{
		name: "instantKill",
		duration: 20000,
		func: function(pos) {

			window.gobo = false
			hero.immune = true

			// Find Targets 
			var HX = character.position.x,
				HZ = character.position.z;
			var returnArr = []
			var arr = window.enemies.length > 0 ? enemies : babyZombies

			for (var d = 0; d < arr.length; d++) {

				var en = {
					x: arr[d].mesh.position.x,
					z: arr[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange - 10 && HX + hero.gunRange + 10 > en.x && HZ + hero.gunRange + 10 > en.z && en.z > HZ - hero.gunRange - 10) {
					returnArr.push(arr[d])
				}

			}

			var hh = 0
			var hu = setInterval(() => {
				if (hh >= returnArr.length) {
					clearInterval(hu)
					window.gobo = true
					hero.immune = false
					TweenMax.to(character.position, .2, {
						x: HX,
						z: HZ,
						onComplete: ()=>{
							for (var i=0; i<returnArr.length; i++){
								returnArr[i].hp = 0
							}
						}
					})
				} else {
					hh++
					var pos = returnArr[returnArr.length-hh].mesh.position
					TweenMax.to(character.position, .2, {
						x: pos.x,
						z: pos.z,
						onComplete: ()=>{
						
							// Hit
							var h = new Three.Mesh(new Three.SphereGeometry(4), new Three.MeshToonMaterial({
								transparent: true,
								opacity: .4
							}))
							h.position.copy(pos)
							SCENE.add(h)
							
							// Trail Effect
							
						}
					})
					
					}
			}, 200)

			return;
		}
	}
	]

export default Skills;