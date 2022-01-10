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
	}
	]

export default Skills;