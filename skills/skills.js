import * as Three from '../src/three.js'
import { GAME } from '../app/script.js'
import * as Utils from "../app/utils.js"
import * as Sounds from "../app/audio.js"
import Particles from '../app/systems/particle.js'

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
			hero.immune = true

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
			lightningMap.wrapT = Three.RepeatWrapping
			lightningMap.repeat.set(2, 2)

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
						window.boss.hurt()

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

				var uu = setInterval(() => {
					lightningMap.offset.y -= .1

					if (lightningMap.offset.y <= 0) {
						lightningMap.offset.y = 1
					}
				}, 70)

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
								clearInterval(uu)
								hero.immune = false
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
		func: function(p) {
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
		func: function(arr) {

			window.gobo = false
			hero.immune = true

			var map = TextureLoader.load("assets/images/textures/bladeHit.png")
			var mmap = TextureLoader.load("assets/images/textures/instantKill.png")
			var rod = TextureLoader.load("assets/images/textures/IKrod.png")



			// Find Targets 
			var HX = character.position.x,
				HZ = character.position.z;
			var returnArr = []

			for (var d = 0; d < arr.length; d++) {

				var en = {
					x: arr[d].mesh.position.x,
					z: arr[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange - 10 && HX + hero.gunRange + 10 > en.x && HZ + hero.gunRange + 10 > en.z && en.z > HZ - hero.gunRange - 10) {
					returnArr.push(arr[d])
				}

			}

			if (window.bossGame) {
				returnArr.push(window.boss)
			}

			var plane = new Three.Mesh(new Three.PlaneGeometry(12, 12), new Three.MeshToonMaterial({
				transparent: true,
				side: 2,
				map: mmap,
				opacity: .6
			}))

			plane.rotation.x = -Math.PI / 2
			plane.position.copy(character.position)
			plane.scale.set(0, 0, 0)
			SCENE.add(plane)

			TweenMax.to(plane.scale, 1.2, {
				x: 1.5,
				y: 1.5,
				z: 1.5
			})

			var plane2 = new Three.Mesh(new Three.PlaneGeometry(12, 12), new Three.MeshToonMaterial({
				transparent: true,
				side: 2,
				map: mmap,
				opacity: .6
			}))

			plane2.rotation.x = -Math.PI / 2
			plane2.position.copy(character.position)
			plane2.scale.set(0, 0, 0)
			SCENE.add(plane2)

			TweenMax.to(plane2.scale, 1, {
				x: 1,
				y: 1,
				z: 1
			})
			TweenMax.to(plane2.position, 1, {
				y: 10,
				onComplete: () => {
					var hh = 0
					var hu = setInterval(() => {
						if (hh >= returnArr.length) {
							clearInterval(hu)
							window.gobo = true
							hero.immune = false
							TweenMax.to(character.position, .2, {
								x: HX,
								z: HZ,
								onComplete: () => {
									for (var i = 0; i < returnArr.length; i++) {
										if (returnArr[i].mesh.name === "boss") {
											returnArr[i].hurt()
											returnArr[i].hp -= 10
										} else {
											returnArr[i].hp = 0
										}
									}
								}
							})
							TweenMax.to(plane.scale, 1, {
								x: 0,
								y: 0,
								z: 0,
								onComplete: () => {
									plane.material.dispose()
									plane.geometry.dispose()
									SCENE.remove(plane)
								}
							})
							TweenMax.to(plane2.scale, 1, {
								x: 0,
								y: 0,
								z: 0,
								onComplete: () => {
									plane2.material.dispose()
									plane2.geometry.dispose()
									SCENE.remove(plane2)
								}
							})
						} else {



							Utils.playSound(Sounds.instantKill)
							hh++

							var pos = returnArr[returnArr.length - hh].mesh.position

							var dx = (character.position.x - pos.x) * (character.position.x - pos.x)
							var dz = (character.position.z - pos.z) * (character.position.z - pos.z)
							var dis = Math.abs(Math.sqrt(dx + dz))

							var mPoint = {
								x: (pos.x + character.position.x) / 2,
								z: (pos.z + character.position.z) / 2
							}

							var ddx = character.position.x - pos.x
							var ddz = character.position.z - pos.z
							var aY = Math.atan2(ddx, ddz)


							var t = new Three.Mesh(new Three.PlaneGeometry(2, dis), new Three.MeshToonMaterial({ side: 2, opacity: .6, transparent: true, map: rod }))
							t.position.x = mPoint.x
							t.position.z = mPoint.z
							t.position.y = 3
							t.rotation.x = -Math.PI / 2
							t.rotation.z = aY
							t.scale.y = 0
							SCENE.add(t)

							TweenMax.to(t.scale, .9, {
								y: 1,
								onComplete: () => {
									t.material.dispose()
									t.geometry.dispose()
									SCENE.remove(t)
								}
							})

							character.rotation.y = aY

							TweenMax.to(character.position, .2, {
								x: pos.x,
								z: pos.z,
								onComplete: () => {

									// Hit

									var size = 9
									if (returnArr[returnArr.length - hh].mesh.name === "boss") size = 28
									else size = 9

									var h = new Three.Mesh(new Three.PlaneGeometry(size, size), new Three.MeshToonMaterial({
										transparent: true,
										map: map
									}))
									h.position.copy(pos)
									h.rotation.x = -Math.PI / 2
									h.scale.set(0, 0, 0)

									SCENE.add(h)
									TweenMax.to(h.scale, .9, {
										x: 1.3,
										y: 1.3,
										z: 1.3
									})



									var ttt = setTimeout(() => {
										h.material.dispose()
										h.geometry.dispose()
										SCENE.remove(h)
										clearTimeout(ttt)
									}, 900)

								}
							})

						}
					}, 210)
				}
			})




			return;
		}
	}, {
		name: "run",
		duration: 10000,
		func: function(phys) {

			var currentVel = hero.velocity
			var map = TextureLoader.load("assets/images/textures/ninjabladeBullet.png")

			hero.running = true
			hero.velocity = 35

			var sys = new Particles({
				center: character.position,
				texture: map,
				size: {
					minSize: .5,
					maxSize: 2
				},
				loop: true,
				isCenterSpawn: true,
				targetTiming: .3,
				inTiming: .5,
				outTiming: 2,
				upward: true,
				targetPosition: {

					minX: -2.5,
					maxX: 2.5,


					minY: -2,
					maxY: 2,


					minZ: -2.5,
					maxZ: 2.5

				},
				targetScale: new Three.Vector3(1, 1, 1),
				interval: 60
			})

			sys.start()


			var mapp = TextureLoader.load("assets/images/textures/lightning.png")
			mapp.offset = { x: 0, y: 0 }
			mapp.wrapT = Three.RepeatWrapping
			mapp.repeat.set(1, 1)
			var m = new Three.MeshToonMaterial({
				transparent: true,
				side: 2,
				map: mapp //TextureLoader.load("assets/images/textures/bladeBullet.png")
			})

			var hop = setInterval(() => {
				mapp.offset.x -= .08
				if (mapp.offset.x <= 0) {
					mapp.offset.x = 1
				}
			}, 30)

			var g = new Three.PlaneGeometry(20, 4)
			var mesh = new Three.Mesh(g, m)
			mesh.rotation.x = -Math.PI / 2
			mesh.rotation.z = Math.PI / 2
			mesh.position.z = -10
			character.add(mesh)


			//	var tutsi = []
			/*var tut = setInterval(() => {
				//	for (var i = 0; i < 2; i++) {
				var size = Math.random() * (2 - 1) + 1
				var tuts = new Three.Mesh(new Three.PlaneBufferGeometry(size, size), new Three.MeshToonMaterial({
					transparent: true,
					map: rod,
					side: 2
				}))

				var position = {
					x: character.position.x + Math.random() * (2 - (-2)) + (-2),
					y: character.position.y + Math.random() * (2 - (-2)) + (-2),
					z: character.position.z + Math.random() * (2 - (-2)) + (-2)
				}

				//	tuts.scale.set(0, 0, 0)
				tuts.position.copy(position)
				tuts.rotation.x = -Math.PI / 2
				tuts.rotation.z = character.rotation.y
				SCENE.add(tuts)
				tutsi.push(tuts)

				//	}
				for (var ii = 0; ii < tutsi.length; ii++) {

					TweenMax.to(tutsi[ii].scale, 2, {
						x: 0,
						y: 0,
						z: 0
					})
				}

			}, 70)*/


			var stop = setTimeout(() => {
				clearTimeout(stop)
				sys.end()
				//	clearInterval(tut)
				hero.velocity = currentVel
				hero.running = false
				character.remove(mesh)
				/*	for (var u = 0; u < tutsi.length; u++) {
						tutsi[u].material.dispose()
						tutsi[u].geometry.dispose()
						SCENE.remove(tutsi[u])
					}*/
				//	tutsi.length = 0
			}, this.duration)
			return;
		}
	},
	{
		name: "laserBeam",
		duration: 3000,
		func: function(tVector) {
			var walkDir = new Three.Vector3()
			var rotateAngle = new Three.Vector3(0, 1, 0)
			// calculate direction
			window.character.getWorldDirection(walkDir)
			walkDir.y = 0
			walkDir.normalize()

			walkDir.applyAxisAngle(rotateAngle, tVector)

			// target Vector
			var moveX = walkDir.x * 5
			var moveZ = walkDir.z * 5

			//	rotate Angle
			var angleYCameraDirection = Math.atan2(
				(hero.mesh.position.x - CAMERA.position.x),
				(hero.mesh.position.z - CAMERA.position.z))

			TweenMax.to(character.rotation, .5, {
				y: angleYCameraDirection + window.RY
			})

			var dx = (moveX + 15) - moveX
			var dz = (moveZ + 15) - moveZ
			var dis = Math.abs(Math.sqrt((dx * dx) + (dz * dz)))

			var mPoint = new Three.Vector3(0, 2, 0)
			mPoint.x = (character.position.x + moveX) + (character.position.x + walkDir.x * 20) / 2
			mPoint.z = (character.position.z + moveZ) + (character.position.z + walkDir.z * 20) / 2

			var laser = new Three.Mesh(new Three.CylinderGeometry(2, 2, 3), new Three.MeshToonMaterial())
			laser.position.x = character.position.x + moveX
			laser.position.z = character.position.z + moveZ
			laser.rotation.x = -Math.PI / 2
			laser.rotation.z = angleYCameraDirection + window.RY

			SCENE.add(laser)

			TweenMax.to(laser.scale, 2, {
				y: 10
			})

			return;
		}
	}
	]

export default Skills;