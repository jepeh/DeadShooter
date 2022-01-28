import * as Three from '/src/three.js'

var Bullets = {
	normal: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.IcosahedronGeometry(.9), new Three.MeshNormalMaterial())

		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)
		
		return g;
	},
	blade: function() {
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.PlaneBufferGeometry(6,6), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/blade.png")
		}))
		b.rotation.x = - Math.PI/2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)
		
		return g;
	},
	laser: function(){
		var g = new Three.Group()

		var b = new Three.Mesh(new Three.CylinderGeometry(1,1, 6), new Three.MeshToonMaterial({
			transparent: true,
			map: TextureLoader.load("assets/images/textures/field.png")
		}))
		b.rotation.x = - Math.PI/2
		b.castShadow = true
		b.receiveShadow = true

		g.add(b)
		g.position.copy(hero.mesh.position)
		
		return g;
	}
	
}
export { Bullets }