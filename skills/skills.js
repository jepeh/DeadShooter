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


			var FresnelShader = {

				uniforms: {},
				vertexShader: [

		"varying vec3 vPositionW;",
		"varying vec3 vNormalW;",

		"void main() {",

		"	vPositionW = vec3( vec4( position, 1.0 ) * modelMatrix);",
		" vNormalW = normalize( vec3( vec4( normal, 0.0 ) * modelMatrix ) );",

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );",

		"}"

	].join("\n"),

				fragmentShader: [
		"varying vec3 vPositionW;",
		"varying vec3 vNormalW;",
		"void main() {",
		"	vec3 color = vec3(.62,.125,.941);",
		"	vec3 viewDirectionW = normalize(cameraPosition - vNormalW);",
		"	float fresnelTerm = dot(viewDirectionW, vNormalW);",
		"	fresnelTerm = clamp(1. - fresnelTerm, 0.08, 1.);",
		"	gl_FragColor = vec4( color * fresnelTerm, .5);",
		"}"

	].join("\n")

			};
			window.gobo = false
			var HX = hero.mesh.position.x,
				HZ = hero.mesh.position.z;
			var targetPos;
			for (var d = 0; d < enemies.length; d++) {

				var en = {
					x: enemies[d].mesh.position.x,
					z: enemies[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange && HX + hero.gunRange > en.x && HZ + hero.gunRange > en.z && en.z > HZ - hero.gunRange) {

					var angleYCameraDirection = Math.atan2(
						(enemies[d].mesh.position.x - hero.mesh.position.x),
						(enemies[d].mesh.position.z - hero.mesh.position.z))
					targetPos = {

						x: enemies[d].x,
						z: enemies[d].z
					}
					TweenMax.to(hero.mesh.rotation, .5, {
						y: angleYCameraDirection
					})
				}
			}


			var go = setTimeout(() => {

				var gm = new Three.SphereBufferGeometry(3);

				var sm = new Three.ShaderMaterial({
					vertexShader: FresnelShader.vertexShader,
					fragmentShader: FresnelShader.fragmentShader
				})
			
				var sphere = new Three.Mesh(gm, sm)
				var target = new Three.Vector3()
				character.children[2].getWorldPosition(target)
				sphere.position.copy(target)
				sphere.scale.set(0, 0, 0)
				window.SCENE.add(sphere)

				var plane = new Three.Mesh(new Three.PlaneBufferGeometry(12, 12), new Three.MeshToonMaterial({
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
				TweenMax.to(plane.rotation, 3.5, {
					z: 2
				})

				/*	var rotate = function() {
							if (typeof rotate === "function") {
								plane.rotation.z += .009
								requestAnimationFrame(rotate)
							}
						}
						rotate()*/

				var tst = setTimeout(() => {
					TweenMax.to(sphere.scale, .4, {
						x: 0,
						y: 0,
						z: 0,
						onComplete: function() {
							window.gobo = true
							if (sphere.parent) {
								sphere.material.dispose()
								sphere.geometry.dispose()
								window.SCENE.remove(sphere)
							}
						}
					})

					TweenMax.to(plane.scale, .4, {
						x: 0,
						y: 0,
						z: 0,
						onComplete: function() {

							if (plane.parent) {
								plane.material.dispose()
								plane.geometry.dispose()
								window.SCENE.remove(plane)
							}
						}
					})

					clearTimeout(tst)
				}, 2300)

				TweenMax.to(sphere.scale, 2, {
					x: 1,
					y: 1,
					z: 1
				})

				var parts = []
				var skss = 0;
				var sks = setInterval(() => {
					if (skss >= 2) {
						skss = 0
						clearInterval(sks)
					} else {
						skss++
						for (var i = 0; i < 16; i++) {

							var geom = new Three.IcosahedronGeometry(.5, 0);
							var mat = new Three.MeshNormalMaterial();

							var mesh = new Three.Mesh(geom, mat);

							var pos = {
								x: sphere.position.x,
								y: sphere.position.y,
								z: sphere.position.z
							}

							var targetX = pos.x + (-1 + Math.random() * 2) * 9;
							var targetY = pos.y + (-1 + Math.random() * 2) * 9;
							var targetZ = pos.z + (-1 + Math.random() * 2) * 9;

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
										if (parts[u].parent) parts[u].parent.remove(parts[u])
									}
									return;
								}
							});
						}
					}
				}, 500)

				clearTimeout(go)
			}, 500)
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
	}
	]

export default Skills;