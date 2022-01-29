import * as Three from '/src/three.js'
import * as Sounds from '../audio.js'
import * as Utils from '../utils.js'

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
			map: TextureLoader.load("assets/images/textures/blade.png")
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
			map: TextureLoader.load("assets/images/textures/field.png")
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

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 9), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/laserlight.png")
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
	phoenixFire: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(7, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/laserfire.png"),
			side: 2
		}))

		b.rotation.x = -Math.PI / 2
		b.castShadow = true
		b.receiveShadow = true
		g.add(b)

		var bb = new Three.Mesh(new Three.PlaneBufferGeometry(7, 7), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/laserfire.png"),
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
			map: TextureLoader.load("assets/images/textures/jellyfish.png")
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
}
export { Bullets }