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

		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

				fragmentShader: [

		"varying vec3 vPositionW;",
		"varying vec3 vNormalW;",

		"void main() {",

		"	vec3 color = vec3(0,0,1);",
		"	vec3 viewDirectionW = normalize(cameraPosition - vPositionW);",
		"	float fresnelTerm = dot(viewDirectionW, vNormalW);",
		"	fresnelTerm = clamp(1.0 - fresnelTerm, 0., 1.);",

		"	gl_FragColor = vec4( color * fresnelTerm, 1.);",

		"}"

	].join("\n")

			};

			var gm = new Three.SphereBufferGeometry(3);

			var sm = new Three.ShaderMaterial({
				vertexShader: FresnelShader.vertexShader,
				fragmentShader: FresnelShader.fragmentShader
			})

						
			var sphere = new Three.Mesh(gm, sm)
			sphere.position.copy(window.character.children[2].position)
			sphere.scale.set(0, 0, 0)
			window.SCENE.add(sphere)

			//window.gobo = false

			TweenMax.to(sphere.scale, 2, {
				x: 1,
				y: 1,
				z: 1,
				onComplete: () => {
					var laser = new Three.Mesh(new Three.CylinderBufferGeometry(1, 1, 40), new Three.MeshToonMaterial({ color: "blue" }))
					laser.position.copy(sphere.position)
						
					laser.rotation.x = -Math.PI / 2
					laser.rotation.z = window.character.rotation.y
					window.SCENE.add(laser)


					var mp = window.TextureLoader.load("assets/images/textures/laser.png")

					var laser2 = new Three.Mesh(new Three.CylinderBufferGeometry(1.8, 1.8, 40), new Three.MeshToonMaterial({
						map: mp,
						transparent: true
					}))

					laser2.position.copy(sphere.position)
					laser2.rotation.x = -Math.PI / 2
					laser2.rotation.z = window.character.rotation.y
					window.SCENE.add(laser2)


				}
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

			TweenMax.to(field.scale, .8, { x: 1, y: 1, z: 1 })

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