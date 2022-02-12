"use strict";

import * as Three from '../src/three.js'
import { RoundedBoxGeometry } from '../src/RoundedBoxGeometry.js'
import { OrbitControls } from '../src/OrbitControls.js'
import { JoyStick } from '../controller/joy.js'
import { CharacterControls } from '../controller/controller.js'
import * as Character from '../characters/character.js'
import { Profile, Levels, Sounds, User } from '../profiles/profile.js'
import { OimoPhysics } from '../src/OimoPhysics.js'
import { drawMap } from '../app/map/map.js'
import * as Utils from './utils.js'
import * as Sound from './audio.js'
import { GLTFLoader } from '../src/Loader/GLTFLoader.js'
import Skills from '../skills/skills.js'
import { FARM } from '../app/modes/farm.js'
import { Bullets } from "../app/bullets/bullet.js"
import { FontLoader } from "../src/Loader/FontLoader.js"
import { TextGeometry } from '../src/TextGeometry.js'
import { OBJLoader } from '../src/Loader/OBJLoader.js'
import Particles from '../app/systems/particle.js'

// Composer & RenderPass
//import * as Composer from '../src/Composer/EffectComposer.js'
//import {RenderPass} from '../src/Composer/RenderPass.js'

// Shader
//import {UnrealBloomPass} from '../src/Composer/shaders/UnrealBloomPass.js'

var GAME;

var Game = (function(w, func) {

	// Check if browser support WebGL

	if (w) {
		var loc = new URL(window.location.href)

		// morph window device pixel ratio
		//	window.devicePixelRatio = 2

		/*	FBInstant.initializeAsync()
				.then(() => {

					var loaded = 1;
					var loading = setInterval(() => {
						if (loaded >= 100) {
							clearInterval(loading)
						}
						else {
							loaded++
						}

						FBInstant.setLoadingProgress(loaded)
					}, 100)

					var loc = new URL(window.location.href)

					if (loc.searchParams.get("isPlaying")) {
						// Play Game
						playResume(FBInstant)

					} else {

						FBInstant.startGameAsync()
							.then(() => {

								console.log("Game Started!")
								//	play Game	
								play(FBInstant)
								// FB start Game End

							})
							.catch(e => {
								// FB Start Game Async Error
								console.log(e)
							})
					}
					// FB Initialize end
				})
				.catch(e => {
					// FB Initialize Async error
					console.log(e)
				})*/

		// Fetch or Save FB Player Data

		loc.searchParams.get("isPlaying") ? playResume(true) : playResume(true)
	}

	function play(FB) {
		$("body").append(`<img id="splash" src="assets/images/blockgameswhite.png"/>`)
		$("body").css({ background: 'white', transition: 'all 2s' })
		var bb = setTimeout(() => {
			$("#splash").attr("src", "assets/images/blockgamesblack.png")
			$('body').css("background", "black")


			var bbb = setTimeout(() => {
				$("#splash").remove()
				$("body").append(`<img id="logo" src="assets/images/logo.png" />`)

				var ho = setTimeout(() => {
					clearTimeout(ho)
					$("#logo").remove()
					$("body").css('background', "#191C25")
					func(FB)
				}, 1300)


				clearTimeout(bbb)
			}, 1900)


			clearTimeout(bb)
		}, 1800)

	}

	function playResume(FB) {
		//	$("#loader").css("display", "block");

		var hu = setTimeout(() => {
			$("#loader").css("display", "none")
			func(FB)
			clearTimeout(hu)
		}, 100)

	}

})(window || this, function(Facebook) {


	// Fetch FB User Data
	// Get Player User Data
	/*	User.id = FBInstant.player.getID();
		User.name = FBInstant.player.getName();
		User.image.crossOrigin = 'anonymous';
		User.image.src = FBInstant.player.getPhoto();
		User.locale = FBInstant.getLocale();
		User.platform = FBInstant.getPlatform()

		// Save Initial Data
		FBInstant.player.getDataAsync(["level", "heroName", "bulletType", "coins", "rank", "maxHP", "bombDamage", "energy", "mapRadius", "atomBombRadius", "gunRange", "keys", "skills", "Heroes", "countdownMin"])
			.then(data => {

				if (data["level"] === undefined) {

					console.log("Player is new")
					FBInstant.player.setDataAsync({
						level: Profile.level,
						heroName: Profile.heroName,
						bulletType: Profile.bulletType,
						coins: Profile.coins,
						rank: Profile.rank,
						maxHP: Profile.maxHP,
						bombDamage: Profile.bombDamage,
						energy: Profile.energy,
						mapRadius: Profile.mapRadius,
						atomBombRadius: Profile.atomBombRadius,
						gunRange: Profile.gunRange,
						countdownMin: Profile.countdownMin,
						keys: Profile.keys,
						skills: [{
							name: "forceField",
							damage: 3,
							img: "assets/images/textures/field.png"
		}, {
							name: "laserBeam",
							damage: 0.8, // scaling down targets to 80%
							img: "assets/images/textures/gun.png"
		}],
						Heroes: [
							{
								name: "cube",
								heroClass: "default",
								premium: false,
								unlockable: false
			}
			]
					}).then(() => {
						console.log("Data Set!")
						// Update Profile Names, Images
						$("#Profile-src").attr("src", User.image.src)
						$("#ProfileInfo-Name").text(User.name)
						$("#gameid").text("Game ID: " + User.id)
						$("#ProfileInfo-Rank").text("Rank: " + Profile.rank)


						
						// FACEBOOK DATA UPDATE
						//*******************************************%


					}).catch(e => {
						console.warn(e)

					})
				} else {

					// Old Players
					Profile.level = data["level"]
					Profile.heroName = data["heroName"]
					Profile.energy = data["energy"]
					Profile.coins = data["coins"]
					Profile.rank = data["rank"]
					Profile.maxHP = data["maxHP"]
					Profile.bulletType = data["bulletType"]
					Profile.bombDamage = data["bombDamage"]
					Profile.mapRadius = data["mapRadius"]
					Profile.atomBombRadius = data["atomBombRadius"]
					Profile.keys = data["keys"]
					Profile.gunRange = data["gunRange"]
					Profile.skills = data["skills"]
					Profile.countdownMin = data["countdownMin"]
					Profile.Heroes = data["Heroes"]

					console.log("Data fetched!")
					// Update Profile Names, Images
					$("#Profile-src").attr("src", User.image.src)
					$("#ProfileInfo-Name").text(User.name)
					$("#gameid").text("Game ID: " + User.id)
					$("#ProfileInfo-Rank").text("Rank: " + Profile.rank)


					

					// FACEBOOK DATA UPDATE
					//*******************************************%

				}
			}).catch((e) => {
				console.warn(e)
			})
	*/

	$(".e-TXT").text(Profile.energy)
	$(".c-TXT").text(Profile.coins)


	var world = OimoPhysics().then(phys => {

		$("#loader").css('display', 'none')
		// RETRIEVE FACEBOOK PLAYER GAME DATA	

		// RETRIEVE FACEBOOK PLAYER GAME DATA	

		// MUSIC AND SOUND
		Sounds.sound ? $("#sound div").css({ transform: "translateX(-63%)", backgroundColor: "rgba(255,255,255,.7)" }) : $("#sound div").css({ transform: "translateX(63%)", backgroundColor: "rgba(0,0,0,.7)" });
		!Sounds.sound ? $("#sound").css({ backgroundColor: "rgba(255,255,255,.8)" }) : $("#sound").css({ backgroundColor: "rgba(0,0,0,.4)" })
		Sounds.sound ? Sounds.sound = false : Sounds.sound = true

		Sounds.music ? $("#music div").css({ transform: "translateX(-63%)", backgroundColor: "rgba(255,255,255,.7)" }) : $("#music div").css({ transform: "translateX(63%)", backgroundColor: "rgba(0,0,0,.7)" });
		!Sounds.music ? $("#music").css({ backgroundColor: "rgba(255,255,255,.8)" }) : $("#music").css({ backgroundColor: "rgba(0,0,0,.4)" })
		Sounds.music ? Sounds.music = false : Sounds.music = true

		var Obj = Object.create(null)

		// For Later resizing of browser
		var sizes = {
			width: window.innerWidth,
			height: window.innerHeight
		}

		var CANVAS = document.getElementById('webgl')

		//ThreeJS window Variables
		window.SCENE = new Three.Scene()

		window.CAMERA = new Three.PerspectiveCamera(30, sizes.width / sizes.height, 1, 4000)
		window.CLOCK = new Three.Clock()
		window.RENDERER = new Three.WebGLRenderer({
			canvas: CANVAS,
			antialias: true,
			alpha: true
		})

		document.fullscreenEnabled = true

		/*	function launchFullScreen(element) {
			alert()
			if (element.requestFullScreen) {
				element.requestFullScreen();
			} else if (element.mozRequestFullScreen) {
				element.mozRequestFullScreen();
			} else if (element.webkitRequestFullScreen) {
				element.webkitRequestFullScreen();
			}
		}

		// Launch fullscreen for browsers that support it!
		launchFullScreen(document.documentElement); // the whole page

*/
		
		
		window.CONTROLS = new OrbitControls(CAMERA, RENDERER.domElement)
		CONTROLS.enabled = true
		CONTROLS.enablePan = false
		CONTROLS.enableZoom = false
		CONTROLS.minPolarAngle = -Math.PI / 4;
		CONTROLS.maxPolarAngle = Math.PI / 3;

		CLOCK.autoStart = false
		CLOCK.startTime = 0
		CLOCK.elapsedTime = 0
		CLOCK.start()

		//window dynamic variables
		window.keyPressed = ""
		window.droppedBomb = []
		window.droppedCoins = []
		window.inGame = false
		window.firstS = true
		window.secondS = true
		window.thirdS = true
		window.addRewards = []
		window.babyZombies = []
		window.mysteryboxes = []
		window.TextLoader = new FontLoader();


		CAMERA.layers.enable(0)

		/************ FUNCTIONS START************/
		document.documentElement.style.setProperty('--width', innerWidth / 2 + "px")
		document.documentElement.style.setProperty('--height', innerHeight / 2 + "px")

			! function() {
				$('#Chart').easyPieChart({
					size: 50,
					barColor: "#40F0FFD4",
					scaleLength: 1,
					lineWidth: 3,
					trackColor: "#525151",
					lineCap: "circle",
					animate: 1000,
				});

			}()

		// display logo
		$("#coin-container, #energy-container, #settings, #coin-container").css('display', 'grid')

		// initiate Level array

		function generateLevels() {
			var cnt = 0;
			do {
				cnt++;
				Levels.levels.push({
					level: cnt,
					enemy: cnt > 10 ? cnt > 30 ? 80 : 50 : 30
				})
			} while (cnt <= 50)
		}
		generateLevels()

		// FACEBOOK DATA UPDATE


		function resize() {

			sizes.width = window.innerWidth
			sizes.height = window.innerHeight

			CAMERA.aspect = sizes.width / sizes.height
			CAMERA.updateProjectionMatrix()

			RENDERER.setSize(sizes.width, sizes.height);
			RENDERER.setPixelRatio(window.devicePixelRatio)
			RENDERER.shadowMap.enabled = true

			RENDERER.render(SCENE, CAMERA)

			// Landscape detector
			/*	if (innerWidth > innerHeight) {
					$("#LANDSCAPEDetector").css("display", "block")
				} else {
					$("#LANDSCAPEDetector").css("display", "none")

				}*/

			return false
		}

		Obj.resize = resize

		window.addEventListener('resize', () => {
			Obj.resize()
		})

		/*************FUNCTIONS END**************/


		RENDERER.setSize(sizes.width, sizes.height);
		RENDERER.setPixelRatio(window.devicePixelRatio)
		RENDERER.shadowMap.enabled = true
		CAMERA.position.set(0, 30, 20)

		// Lights and Shadow

		const ambLight = new Three.AmbientLight('white', .6)
		const dirLight = new Three.DirectionalLight('white', .3)

		dirLight.position.set(0, 100, -100)
		dirLight.castShadow = true
		dirLight.shadow.mapSize.width = 1024 * 2
		dirLight.shadow.mapSize.height = 1024 * 2


		window.TextureLoader = new Three.TextureLoader()

		var d = 200

		dirLight.shadow.camera.left = -d
		dirLight.shadow.camera.right = d
		dirLight.shadow.camera.top = d
		dirLight.shadow.camera.bottom = -d
		dirLight.shadow.camera.far = 1000
		dirLight.shadow.camera.near = 1
		window.uTime = 0;


		SCENE.add(dirLight, ambLight)

		// Add ambient and dirlight in the scene

		/**************************************************
		Update Game Modes
		**************************************************/
		var modes = document.getElementById("GMDiv")

		for (var va = 0; va < modes.children.length - 1; va++) {
			if (modes.children[va].attributes.status.value === "locked") {
				modes.children[va].style.backgroundImage = "url(assets/images/lockmode.png)"
			}

		}

		/**************************************************
		PLAY GAME MODES
		**************************************************/
		$(".GMDivs").on("click", (e) => {
			switch (e.currentTarget.attributes.stage.value) {
				case "farming":
					Utils.playSound(Sound.color)
					Utils.isEnergy() ? startAnim(Profile.level) : Utils.notEnergy()
					break;
				default:
			}
		})

		var jj = false
		$("body").on("touchstart", e => {

			if (!jj) {
				Utils.playMusic(Sound.mainMusic)
				jj = true
				$("body").off()
			}
			return;
		})

		

		$("#utils")[0].offsetLeft


		$("#skillpad").css({
			top: $("#utils")[0].offsetTop,
			left: $("#utils")[0].offsetLeft
		})


		//*******************************************	
		//Update  Personal Game Data
		//*******************************************
		// energy

		/*	var h = TextureLoader.load("assets/images/textures/lasers.png")
			h.wrapS = Three.RepeatMapping
			
			var mesh = new Three.Mesh(new Three.PlaneGeometry(9, 9), new Three.ShaderMaterial({
				uniforms: {
					text: {
						type: "t",
						value: h
					},
					text2: {
						type: "t",
						value: TextureLoader.load("assets/noise.jpeg")
					},
					uTime: {
						type: "f",
						value: window.uTime
					}
				},
				vertexShader: `
				varying vec2 vUv;
			
				void main(){
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
					}
				`,
				fragmentShader: `
				
				precision mediump float;
				
				uniform sampler2D text;
				uniform sampler2D text2;
				uniform float uTime;
				varying vec2 vUv;
				vec4 cl;
				
				void main() {
				
					float time = uTime * 2.;
				
					vec2 tile = vec2(1., 1.);
					vec2 offset = vec2(time,0.0);
					
					
					vec2 UVU = vUv * tile + offset;
				
					vec4 CA = texture2D(text2, vUv);
					vec4 CB = texture2D(text, UVU);
					
					vec4 c = CA * CB;
					
					
					
				//	cl = vec4(0.0,0.0,1.0,1.0);
					vec4 color = c;
				
					
					gl_FragColor = color;
				}
				`,
				transparent: true,
				side: 2
			}))
			mesh.position.y = 5
			
			SCENE.add(mesh)*/



		// floor
		window.floor = new Three.Mesh(new Three.BoxGeometry(305, 1, 305), new Three.MeshToonMaterial({ color: "#191C25" }))
		floor.position.y = -1
		floor.castShadow = true
		floor.receiveShadow = true

		SCENE.add(floor)
		window.border = new Three.Mesh(new Three.RingGeometry(305, 306, 4), new Three.MeshToonMaterial({ color: "red", side: Three.DoubleSide }))
		border.position.y = 1
		border.rotation.x = Math.PI / 2
		border.rotation.z = Math.PI / 4
		SCENE.add(border)

		window.pLight = new Three.PointLight("#01F0FF", 1, 20)

		pLight.position.set(0, 1.5, 0)
		pLight.shadow.mapSize.width = 1024 * 2
		pLight.shadow.mapSize.height = 1024 * 2
		pLight.shadow.radius = 8
		SCENE.add(pLight)

		// render hero
		window.hero = makeHero()

		function makeHero() {
			var hero;
			switch (Profile.heroName) {
				case "cube":
					hero = new Character.Heroes.defaultHero();
					break;
			}
			return hero;
		}


		function ch() {

			window.character = hero.renderHero()
			character.name = Profile.heroName
			character.position.set(0, 2.5, 0)
			character.receiveShadow = true
			character.scale.set(.1, .1, .1)
			character.rotation.y = -10
			CAMERA.position.set(0, 20, 20)
			CAMERA.lookAt(character.position)
				SCENE.add(window.character)

		}


		ch()





		window.mm = [
			new Three.MeshToonMaterial({ transparent: true }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 })
			]

		var mp = TextureLoader.load('assets/images/textures/field.png')
		mm[0].map = mp
		mm[0].side = 2

		window.cu = new Three.Mesh(new Three.CylinderGeometry(4, 4, 4, 50, 60), mm)
		cu.position.set(0, 4, 0)

		SCENE.add(cu)


		window.gunrange = new Three.Mesh(new Three.PlaneGeometry(hero.gunRange * 2, hero.gunRange * 2), new Three.MeshToonMaterial({
			map: TextureLoader.load("assets/images/textures/gunrange.png"),
			side: 2,
			depthTest: false
		}))
		gunrange.material.transparent = true
		gunrange.material.opacity = 0
		gunrange.rotation.x = -Math.PI / 2
		gunrange.position.copy(window.character.position)
		gunrange.position.y = .2
		SCENE.add(gunrange)

		var fog = new Three.Fog("#000000", 70, 100)
		fog.opacity = .1
		//	SCENE.fog = fog

		TweenMax.to(character.scale, .9, {
			x: 1,
			y: 1,
			z: 1,
			easing: Power2.easingIn,
			onComplete: function() {
				$("#playbtn").css("display", "grid")
			}
		})
		TweenMax.to(cu.position, 1.2, {
			x: 0,
			y: -1.3,
			z: 0,
			easing: Power2.easingIn,
			onComplete: function() {
				$("#playbtn").css("display", "grid")
			}
		})

		//*******************************************
		// Change Color 
		//*******************************************
		window.colors = ["orange", "blue", "violet", "yellow", "white", "pink"]

		/*
		***********************************************
		MAIN GAME
		***********************************************
		*/
		/*	var tru = new Three.Group()
			var mesh = new Three.Mesh(new Three.PlaneGeometry(3, 10), new Three.MeshToonMaterial({
				side: 2,
				map: TextureLoader.load("assets/images/textures/laserBeam.png"),
				transparent: true
			}))
			mesh.rotation.z = Math.PI / 4

			var mesh2 = new Three.Mesh(new Three.PlaneGeometry(6, 6), new Three.MeshToonMaterial({
				side: 2,
				transparent: true,
				map: TextureLoader.load("assets/ll.png")
			}))
			mesh2.rotation.z = -Math.PI / 4
			mesh2.position.set(2.5, -2.5, 0)
			tru.add(mesh, mesh2)

				var sys = new Particles({
					loop: true,
					size: {
						isRandom: true,
						minSize: .2,
						maxSize: 1
					},
					center: character.position,
					particleRotation: new Three.Euler(0,0,0),
					particlePosition: new Three.Vector3(0,90,0),
					//	particlePosition: character.position,
					isCenterSpawn: false,
					randomSpawn: {
						minX: -40,
						maxX: 40,
						minY: -0,
						maxY: 0,
						minZ: -40,
						maxZ: 40
					},
					particleSource: true,
					linearTarget: false,
					depthTest: true,
					center: character.position,
					mesh: tru,
					//	texture: TextureLoader.load("assets/images/textures/bladeHit.png"),
					isUpward: false,
					inTiming: .2,
					outTiming: .2,
					targetTiming: 1,
					targetPosition: {
						minX: 30,
						maxX: 30,
						minY: -91,
						maxY: -91,
						minZ: -0,
						maxZ: 0
					},
					interval: 200,
					initialScale: new Three.Vector3(1, 1, 1),
					endFunction: (pos) =>{
						var hit = new Three.Mesh(new Three.PlaneGeometry(20,20), new Three.MeshToonMaterial({
							transparent: true,
							map: TextureLoader.load("assets/ll.png"),
						depthTest: false
						}))
						hit.position.copy(pos)
						hit.scale.set(0,0,0)
						hit.rotation.x = -Math.PI/2
						sys._group.add(hit)
						TweenMax.to(hit.scale, .7, {
							x: 1,
							y: 1,
							z: 1,
							onComplete: ()=>{
								TweenMax.to(hit.scale, .5, {
									x: 0,
									y: 0,
									z: 0,
									onComplete: ()=>{
										hit.material.dispose()
										hit.geometry.dispose()
										sys._group.remove(hit)
									}
								})
							}
						})
					}
				})
				sys.start()*/



		/*var mesh = new Three.Mesh(new Three.SphereGeometry(.3), new Three.MeshToonMaterial())
		SCENE.add(mesh)

		var to = setInterval(() => {
			if (mesh.position.y > 20) {
				clearInterval(to)
				var sys = new Particles({
					loop: false,
					size: {
						isRandom: true,
						minSize: .2,
						maxSize: 1
					},
					center: new Three.Vector3(0, 0, 0),
					particlePosition: mesh.position,
					//	mesh: new Three.Mesh(new Three.SphereGeometry(.3), new Three.MeshToonMaterial()),
					//	particlePosition: character.position,
					isCenterSpawn: true,
					particleSource: true,
					linearTarget: false,
					depthTest: true,
					texture: TextureLoader.load("assets/fire.png"),
					inTiming: .1,
					outTiming: .1,
					targetTiming: .9,
					targetPosition: {
						minX: -5,
						maxX: 5,
						minY: -5,
						maxY: 5,
						minZ: -5,
						maxZ: 5
					},
					pCount: 100,
					instantSpawn: true,
					systemShape: "sphere",
					radius: 10,
					initialScale: new Three.Vector3(0, 0, 0),
					endScale: new Three.Vector3(0, 0, 0),
					targetScale: new Three.Vector3(1, 1, 1)
				})
				sys.start()
			} else {
				mesh.position.y += 1
			}
		}, 10)*/

		window.enemyList = []
		window.enemies = []
		window.bloods = []
		SCENE.add(new Three.AxesHelper(30))

		function notif(txt) {
			$("#status").css("display", "block")
			$("#status").text(txt)

			var ggg = setTimeout(() => {
				$("#status").css("display", "none")
				clearTimeout(ggg)
			}, 3400)
			return;
		}

		Obj.notif = notif

		// joystick
		window.joy = new JoyStick("joystick", {
			width: 110,
			height: 110
		})

		window.skillPad = new JoyStick("skillpad", {
			width: 150,
			height: 150
		})

		// align skillpad


		// animation game
		function startAnim(lvl) {

			CONTROLS.enabled = false
			$("#cover, #GameMode, #playbtn, #logo, #settings, #energy-container, #coin-container, #version, #trademark")
				.css("display", "none")
			character.position.set(0, 2.5, 0)

			var tarPos = new Three.Vector3(20, 60, 20)

			hero.initAnim()

			$("#status").text("preparing the field...")
			$("#status, #statusbar").css("display", "block")
			var oo = setTimeout(() => {
				$("#status").text("initiating zombies...")
				clearTimeout(oo)
			}, 2000)

			var nm = 0;

			TweenMax.to(CAMERA.position, 4, {
				x: tarPos.x,
				y: tarPos.y,
				z: tarPos.z,
				easing: Power2.easingIn,
				onUpdate: function() {
					CAMERA.lookAt(character.position)
					nm = nm + .8
					if (nm > 100) {} else {
						$("#bar").css("width", nm + "%")
					}
				},
				onComplete: function() {
					nm = 0
					CAMERA.lookAt(character.position)
					// Start game
					$("#status").text("initiation completed!")
					var str = setTimeout(function() {
						FARM.startGame(lvl, phys)
						clearTimeout(str)
						CONTROLS.target = character.position
						// Fetch GLTF assets
					}, 700)
				}
			})

			return;
		}


		/*	var FresnelShader = {

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
			"	vec3 color = vec3(1.,1.,1.);",
			"	vec3 viewDirectionW = normalize(cameraPosition - vNormalW);",
			"	float fresnelTerm = dot(viewDirectionW, vNormalW);",
			"	fresnelTerm = clamp(1.2- fresnelTerm, 0.8, 10.);",
			"	gl_FragColor = vec4(color * fresnelTerm, 1.);",
			"}"

		].join("\n")

				};

			var spt = new Three.Mesh(new Three.SphereGeometry(2), new Three.ShaderMaterial({
				vertexShader: FresnelShader.vertexShader,
				fragmentShader: FresnelShader.fragmentShader
			}))
			
			spt.position.set(6,4,0)
			var cu2 = new Three.Mesh(new Three.CylinderGeometry(4, 4, 1, 50, 60), mm)
			cu2.position.copy(spt.position)
			
			var cu3 = new Three.Mesh(new Three.CylinderGeometry(4, 4, 1, 50, 60), mm)
			cu3.position.copy(spt.position)
			cu3.rotation.x = Math.PI/4
			
			var cu4 = new Three.Mesh(new Three.CylinderGeometry(4, 4, 1, 50, 60), mm)
			cu4.position.copy(spt.position)
			cu4.rotation.z = Math.PI/2
			
			SCENE.add(spt, cu2, cu3, cu4)*/


		// initial animation
		//RENDERER.autoClear = false
		function Anim() {

			window.initAnim = function() {
				var now = Date.now() / 400

				if (typeof Obj.initAnim === "function") {
					requestAnimationFrame(Obj.initAnim)
				}

				var elapsedTime = CLOCK.getElapsedTime()
				//character.rotation.y = Math.cos(elapsedTime) * .2
				hero.anim(elapsedTime)
				cu.rotation.y = elapsedTime
				//	mesh.material.uniforms.uTime.value += .01

				/*cu2.rotation.y = Math.cos(elapsedTime)
				cu2.rotation.z = elapsedTime
				cu2.rotation.x = Math.sin(-elapsedTime)
				cu3.rotation.y = elapsedTime
				cu3.rotation.z = Math.sin(elapsedTime)
				cu3.rotation.x = elapsedTime
				cu4.rotation.y = elapsedTime
				cu4.rotation.z = elapsedTime
				cu4.rotation.x = Math.cos(elapsedTime)*/
				//	render layer0 boom
				//	RENDERER.clear()
				//	CAMERA.layers.set(1)
				//	composer.render()

				//render layer1 normal
				//	RENDERER.clearDepth()
				//	CAMERA.layers.set(0)


				//	composer.render()
				RENDERER.render(SCENE, CAMERA)



				return;
			}

			Obj.initAnim = initAnim
			Obj.initAnim()


			return;
		}
		Anim()

		Obj.startAnim = startAnim

		function tips(txt) {

			$("#tips").css({
				display: "grid",
				width: "70%",
				left: "50%",
				marginLeft: "-35%"
			})

			$("#tips").text(txt)

			var tp = setTimeout(() => {
				$("#tips").css({ width: "0%", left: "50%", marginLeft: "-0%" })
				clearTimeout(tp)
			}, 4000)
		}
		Obj.tips = tips

		Obj.findTarget = function(arr, pos) {
			var HX = pos.x,
				HZ = pos.z;

			for (var d = 0; d < arr.length; d++) {

				var en = {
					x: arr[d].mesh.position.x,
					z: arr[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange && HX + hero.gunRange > en.x && HZ + hero.gunRange > en.z && en.z > HZ - hero.gunRange) {
					return {
						status: true,
						pos: arr[d].mesh.position
					}
				}

			}
		}

		Obj.findTargetS = function(arr, pos) {
			var HX = pos.x,
				HZ = pos.z;
			var returnArr = []

			for (var d = 0; d < arr.length; d++) {

				var en = {
					x: arr[d].mesh.position.x,
					z: arr[d].mesh.position.z
				}

				if (en.x > HX - hero.gunRange && HX + hero.gunRange > en.x && HZ + hero.gunRange > en.z && en.z > HZ - hero.gunRange) {
					returnArr.push(arr[d])
				}

			}

			return returnArr;
		}

		/**************************************************
		Instantiate Game Object
		*************************************************/
		GAME === Obj ? true : GAME = Obj

	})

});

export { GAME }