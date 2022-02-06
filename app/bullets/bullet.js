import * as Three from '/src/three.js'
import * as Sounds from '../audio.js'
import * as Utils from '../utils.js'
import { Profile } from '/profiles/profile.js'
import { GAME } from '../script.js'


var Bullets = {
	normal: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.IcosahedronGeometry(.9), new Three.MeshNormalMaterial())

		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)

		Utils.playSound(Sounds.normalGun)

		return g;
	},
	blade: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet
		}))
		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)

		g.scale.set(.2, .2, .2)
		TweenMax.to(g.scale, .5, {
			x: 1,
			y: 1,
			z: 1
		})

		Utils.playSound(Sounds.bladeGun)

		return g;
	},
	laser: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.CylinderGeometry(1, 1, 6), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet
		}))
		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)
		Utils.playSound(Sounds.laserGun)

		return g;
	},
	laserLight: function() {
		var g = new Three.Group()

		var blade = TextureLoader.load("assets/images/textures/ninjabladeBullet.png")

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 9), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet
		}))
		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)

		g.scale.set(.2, .2, .2)
		TweenMax.to(g.scale, .5, {
			x: 1,
			y: 1,
			z: 1
		})
		g.done = false
		
		
		var tut = setInterval(() => {
			if (g.done) {
				clearInterval(tut)
		
			} else {
				//	for (var i = 0; i < 2; i++) {
				var size = Math.random() * (2.8 - 1) + 1
				var tuts = new Three.Mesh(new Three.PlaneGeometry(size, size), new Three.MeshToonMaterial({
					transparent: true,
					side: 2,
					map: blade
				}))
				tuts.rotation.x = -Math.PI / 2

				var position = {
					x: g.position.x + Math.random() * (2 - 1) + 1,
					y: g.position.y + Math.random() * (2 - 1) + 1,
					z: g.position.z + Math.random() * (2 - 1) + 1
				}

				//	tuts.scale.set(0, 0, 0)
				tuts.position.copy(position)

				SCENE.add(tuts)
				//	tutsi.push(tuts)
				//	}

				TweenMax.to(tuts.scale, .8, {
					x: .1,
					y: .1,
					z: .1,
					onComplete: () => {
						tuts.material.dispose()
						tuts.geometry.dispose()
						SCENE.remove(tuts)
						tuts = null
					}
				})
			
			}
		}, 50)

		Utils.playSound(Sounds.laserLightGun)

		return g;
	},
	phoenixFire: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet,
			side: 2
		}))

		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true
		g.add(b)

		var bb = new Three.Mesh(new Three.PlaneBufferGeometry(7, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet,
			side: 2
		}))
		bb.castShadow = true
		bb.receiveShadow = true
		bb.rotation.y = Math.PI / 2
		bb.rotation.z = -Math.PI / 2

		g.add(bb)
		g.position.copy(hero.mesh.position)

		g.scale.set(.2, .2, .2)
		TweenMax.to(g.scale, .5, {
			x: 1,
			y: 1,
			z: 1
		})

		Utils.playSound(Sounds.bladeGun)

		return g;
	},
	jellyFish: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(19, 19), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet
		}))
		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)

		g.scale.set(.2, .2, .2)
		TweenMax.to(g.scale, .5, {
			x: 1,
			y: 1,
			z: 1
		})

		Utils.playSound(Sounds.laserLightGun)

		return g;
	},
	laserTube: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.TorusGeometry(.7, .1, 20, 30), new Three.MeshToonMaterial({
			color: "red"
		}))
		b.position.z = 1
		g.add(b)

		var c = new Three.Mesh(new Three.TorusGeometry(1, .1, 20, 30), new Three.MeshToonMaterial({
			color: "red"
		}))

		g.add(c)


		var d = new Three.Mesh(new Three.TorusGeometry(.7, .1, 20, 30), new Three.MeshToonMaterial({
			color: "red"
		}))
		d.position.z = -1
		g.add(d)

		var e = new Three.Mesh(new Three.CylinderGeometry(.005, .1, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/rod.png")
		}))
		e.rotation.x = Math.PI / 2
		e.position.z = 1.8
		g.add(e)

		var f = new Three.Mesh(new Three.SphereGeometry(.2), new Three.MeshToonMaterial({ color: "yellowgreen" }))
		f.position.z = -2
		g.add(f)

		g.position.copy(hero.mesh.position)

		TweenMax.to(g.scale, .3, {
			x: 1.4,
			y: 1.4,
			z: 1.4
		})

		Utils.playSound(Sounds.laserLightGun)

		return g;
	},
	pixelBullet: function() {
		var g = new Three.Group()

		var tail = new Three.Mesh(new Three.PlaneGeometry(1.7, 8), new Three.MeshToonMaterial({
			transparent: true,
			side: 2,
			map: TextureLoader.load("assets/images/textures/rod.png")
		}))
		tail.rotation.x = Math.PI / 2

		var head = new Three.Mesh(new Three.BoxGeometry(2, 2, 2), new Three.MeshNormalMaterial())
		head.position.set(0, 0, -5)
	

		g.add(tail, head)
		g.position.copy(hero.mesh.position)

		Utils.playSound(Sounds.pixelBulletGun)


		
		var tut = setInterval(() => {
			if (g.done) {
				clearInterval(tut)
			} else {
				//	for (var i = 0; i < 2; i++) {
				var size = Math.random() * (1 - .1) + .1
				var tuts = new Three.Mesh(new Three.BoxBufferGeometry(size, size, size), new Three.MeshNormalMaterial())

				var position = {
					x: g.position.x + Math.random() * (2 - 1) + 1,
					y: g.position.y + Math.random() * (2 - 1) + 1,
					z: g.position.z + Math.random() * (2 - 1) + 1
				}

				//	tuts.scale.set(0, 0, 0)
				tuts.position.copy(position)

				SCENE.add(tuts)
				//	tutsi.push(tuts)
				//	}

				TweenMax.to(tuts.scale, 1, {
					x: .1,
					y: .1,
					z: .1,
					onComplete: () => {
						tuts.material.dispose()
						tuts.geometry.dispose()
						SCENE.remove(tuts)
						tuts = null
					}
				})
			
			}
		}, 50)


		return g;
	},
	ninjaBlade: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 9), new Three.MeshToonMaterial({
			transparent: true,
			map: hero.mapBullet
		}))
		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)

		g.scale.set(.2, .2, .2)
		TweenMax.to(g.scale, .5, {
			x: 1,
			y: 1,
			z: 1
		})
		TweenMax.to(g.rotation, .7, {
			y: 2
		})


		var tot = 0
		var tut = setInterval(() => {
			if (tot > 3) {
				clearInterval(tut)
			} else {
				//	for (var i = 0; i < 2; i++) {
				var size = Math.random() * (2.8 - 1) + 1
				var tuts = new Three.Mesh(new Three.PlaneGeometry(size, size), new Three.MeshToonMaterial({
					transparent: true,
					side: 2,
					map: hero.mapBullet
				}))
				tuts.rotation.x = -Math.PI / 2

				var position = {
					x: g.position.x + Math.random() * (2 - 1) + 1,
					y: g.position.y + Math.random() * (2 - 1) + 1,
					z: g.position.z + Math.random() * (2 - 1) + 1
				}

				//	tuts.scale.set(0, 0, 0)
				tuts.position.copy(position)

				SCENE.add(tuts)
				//	tutsi.push(tuts)
				//	}

				TweenMax.to(tuts.scale, .8, {
					x: .1,
					y: .1,
					z: .1,
					onComplete: () => {
						tuts.material.dispose()
						tuts.geometry.dispose()
						SCENE.remove(tuts)
					}
				})
				tot++
			}
		}, 50)
		Utils.playSound(Sounds.laserLightGun)

		return g;
	}

}

function bulletSprite(pos) {
	switch (Profile.bulletType) {
		case "normalBullet": //
			normal(pos)
			break;
		case "bladeBullet": //
			blade(pos)
			break;
		case "laserBullet": //
			laser(pos)
			break;
		case "laserlightBullet": //
			laserlight(pos)
			break;
		case "phoenixfireBullet":
			phoenixfire(pos)
			break;
		case "jellyfishBullet":
			jellyfish(pos)
			break;
		case "lasertubeBullet": //
			lasertube(pos)
			break;
		case "pixelBullet": //
			pixelbullet(pos)
			break;
		case "ninjabladeBullet": //
			ninjablade(pos)
			break;
	}
}


function normal(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({ color: "white", transparent: true, opacity: .3 }))
	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .1, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})

	for (var i = 0; i < 10; i++) {

		var geom = new Three.BoxGeometry(1.3, 1.3, 1.3);
		var mat = new Three.MeshToonMaterial({
			color: "white"
		});
		var mesh = new Three.Mesh(geom, mat);

		mesh.position.copy(pos)
		mesh.rotation.y = Math.floor(Math.random() * 10)
		mesh.needsUpdate = true
		mesh.scale.set(.2, .2, .2)
		var targetX = pos.x + (-1 + Math.random() * 2) * 6;
		var targetY = pos.y + (-1 + Math.random() * 2) * 6;
		var targetZ = pos.z + (-1 + Math.random() * 2) * 6;

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
	return;
}

function pixelbullet(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshNormalMaterial({ transparent: true, opacity: .5 }))
	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .18, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})

	for (var i = 0; i < 10; i++) {

		var geom = new Three.BoxGeometry(1.5, 1.5, 1.5);
		var mat = new Three.MeshNormalMaterial({

		});
		var mesh = new Three.Mesh(geom, mat);

		mesh.position.copy(pos)
		mesh.rotation.y = Math.floor(Math.random() * 10)
		mesh.needsUpdate = true
		mesh.scale.set(.2, .2, .2)
		var targetX = pos.x + (-1 + Math.random() * 2) * 6;
		var targetY = pos.y + (-1 + Math.random() * 2) * 6;
		var targetZ = pos.z + (-1 + Math.random() * 2) * 6;

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
	return;
}


function laser(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(4.7), new Three.MeshToonMaterial({ color: "skyblue", transparent: true, opacity: .8 }))
	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .15, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})

	for (var i = 0; i < 5; i++) {

		var geom = new Three.SphereGeometry(1.3);
		var mat = new Three.MeshToonMaterial({
			color: "blue"
		});
		var mesh = new Three.Mesh(geom, mat);

		mesh.position.copy(pos)
		mesh.rotation.y = Math.floor(Math.random() * 10)
		mesh.needsUpdate = true
		mesh.scale.set(.2, .2, .2)
		var targetX = pos.x + (-1 + Math.random() * 2) * 6;
		var targetY = pos.y + (-1 + Math.random() * 2) * 6;
		var targetZ = pos.z + (-1 + Math.random() * 2) * 6;

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
	return;
}

function blade(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.PlaneGeometry(11, 11), new Three.MeshToonMaterial({
		transparent: true,
		side: 2,
		map: hero.HitMap
	}))
	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	hit.rotation.x = Math.PI / 2

	SCENE.add(hit)

	TweenMax.to(hit.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})

	return;
}

function laserlight(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({
		transparent: true,
		side: 2,
		color: "green",
		map: hero.HitMap
	}))

	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})


	return;
}

function ninjablade(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({
		transparent: true,
		side: 2,
		map: hero.HitMap
	}))

	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})


	return;
}

function phoenixfire(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({
		transparent: true,
		side: 2,
		color: "orangered",
		map: hero.HitMap
	}))

	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})


	return;
}


function jellyfish(pos) {
	var parts = []

	// Hit Effect
	var hit = new Three.Mesh(new Three.SphereGeometry(5), new Three.MeshToonMaterial({
		transparent: true,
		side: 2,
		color: "purple",
		map: hero.HitMap
	}))

	hit.position.copy(pos)
	hit.scale.set(0, 0, 0)
	SCENE.add(hit)

	TweenMax.to(hit.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (hit.parent) {
				hit.material.dispose()
				hit.geometry.dispose()
				window.SCENE.remove(hit)
			}
		}
	})


	return;
}


function lasertube(pos) {
	var parts = []

	// Hit Effect

	var g = new Three.Group()

	var b = new Three.Mesh(new Three.TorusGeometry(3, .3, 20, 30), new Three.MeshToonMaterial({
		color: "red"
	}))
	b.position.z = 2
	g.add(b)

	var c = new Three.Mesh(new Three.TorusGeometry(4, .3, 20, 30), new Three.MeshToonMaterial({
		color: "red"
	}))

	g.add(c)


	var d = new Three.Mesh(new Three.TorusGeometry(3, .3, 20, 30), new Three.MeshToonMaterial({
		color: "red"
	}))
	d.position.z = -2
	g.add(d)

	g.rotation.x = Math.PI / 2

	g.position.copy(pos)
	g.scale.set(0, 0, 0)
	SCENE.add(g)

	TweenMax.to(g.scale, .25, {
		x: 1,
		y: 1,
		z: 1,
		onComplete: function() {
			if (g.parent) {
				g.children.forEach(e => {
					e.material.dispose()
					e.geometry.dispose()
				})
				window.SCENE.remove(g)
			}
		}
	})

	return;
}

export { Bullets, bulletSprite }