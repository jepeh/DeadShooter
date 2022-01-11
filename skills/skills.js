import * as Three from '../src/three.js'

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
		name: "laserBeam",
		func: function() {
			
			var sphere = new Three.Mesh(new Three.SphereGeometry(1.6), new Three.MeshNormalMaterial())
			sphere.position.x = hero.mesh.position.x+3
			sphere.position.y = hero.mesh.position.y
			sphere.position.z = hero.mesh.position.z+3
			sphere.scale.set(0,0,0)
			sphere.material.flatShading = true
			
			SCENE.add(sphere)
			
			TweenMax.to(sphere.scale, .9, {
				x: 1,
				y: 1,
				z: 1
			})
			
			var parts = []
			for (var i = 0; i < 10; i++) {

				var geom = new Three.IcosahedronGeometry(.5, 0);
				var mat = new Three.MeshNormalMaterial();

				var mesh = new Three.Mesh(geom, mat);
					
				var pos = {
					x: hero.mesh.position.x+3,
					y: hero.mesh.position.y,
					z: hero.mesh.position.z+3
				}	
							
				var targetX = pos.x + (-1 + Math.random() * 2) * 5;
				var targetY = pos.y + (-1 + Math.random() * 2) * 5;
				var targetZ = pos.z + (-1 + Math.random() * 2) * 5;

				mesh.position.x = targetX
				mesh.position.y = targetY
				mesh.position.z = targetZ
				mesh.needsUpdate = true
	
				SCENE.add(mesh)
				parts.push(mesh)

				TweenMax.to(mesh.scale, .6, { x: .05, y: .05, z: .05 });
				TweenMax.to(mesh.position, .6, {
					x: pos.x,
					y: pos.y,
					z: pos.z,
					delay: Math.random() * .1,
					ease: Power2.easeOut,
					onComplete: function() {
						mesh.material.dispose()
						mesh.geometry.dispose()
						for (var u = 0; u < parts.length; u++) {
							if (parts[u].parent) parts[u].parent.remove(parts[u])
						}
						return;
					}
				});

			}
			
			return;
		}
	},
	{
		name: "forceField",
		duration: 20000,
		func: function() {
			const field = new Three.Mesh(new Three.SphereGeometry(6), new Three.MeshPhongMaterial())
			field.material.transparent = true
			field.material.opacity = .5
			field.scale.set(.1,.1,.1)
			
			var map = window.TextureLoader.load('assets/images/textures/shield.png')
			field.material.map = map
			
			field.position.copy(hero.mesh.position)
			SCENE.add(field)
			
			TweenMax.to(field.scale, .8, {x: 1, y:1, z:1})
			var ii = 0
			var i = setInterval(()=>{
				if (ii > this.duration) {
					clearInterval(i)
					TweenMax.to(field.scale, .8, {x: 0, y: 0, z:0, onComplete: function(){
						field.material.dispose()
						field.geometry.dispose()
						if (field.parent) field.parent.remove(field)
					}})
				} else {
					ii += 6.5
					field.rotation.y += .009
					field.rotation.x += .009
					field.position.copy(hero.mesh.position)
				}
			}, 1)
		}
	}
	]

export default Skills;