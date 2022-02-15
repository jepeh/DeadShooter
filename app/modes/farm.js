import * as Three from '/src/three.js'
import { RoundedBoxGeometry } from '/src/RoundedBoxGeometry.js'
import { OrbitControls } from '/src/OrbitControls.js'
import { JoyStick } from '/controller/joy.js'
import { CharacterControls } from '/controller/controller.js'
import * as Character from '/characters/character.js'
import { Profile, Levels, Sounds, User } from '/profiles/profile.js'
import { OimoPhysics } from '/src/OimoPhysics.js'
import { drawMap } from '/app/map/map.js'
import * as Utils from '../utils.js'
import * as Sound from '../audio.js'
import { GLTFLoader } from '/src/Loader/GLTFLoader.js'
import Skills from '/skills/skills.js'
import { GAME } from '../script.js'
import { Network, Battery } from '../network.js'
import Stats from '/src/Stats.js'

var FARM = {
	farmOBJ: {},
	startGame: function(lvl, phys) {

		// Graphics Stat
		var Stat = new Stats()

		// stop animation
		GAME.initAnim = undefined
		GAME.initanim = undefined
		//console.log(document.getElementById('webgl'))

		// update cgart atombomb
		$('.chart').data('easyPieChart').update(Profile.atomLevel)

		// light

		Profile.playGame = true
		Utils.stopSound(Sound.mainMusic)
		Utils.playMusic(Sound.FarmMode)

		// decrease energy
		Profile.energy = Profile.energy - 2


		// inGame session
		window.inGame = true

		pLight.position.set(0, pLight.position.y, 0)

		// reset hero's life stat
		hero.hp.style.width = "100%"
		$("#lifecount").text("life " + Math.floor(hero.hpLeft) + "/100")
		$("#speed").text("speed " + Math.floor(hero.velocity * 100 / Profile.velocity) + "%")


		// display stats
		$("#statcount, #tips, #life, #bombbar, #counter, #utils, #mapicon").css("display", "grid")
		$("#joystick")
			.css("opacity", "1")
		$("#atombomb").css("display", "block")


		// hide elements
		$("#status, #statusbar")
			.css("display", "none")

		$("#coinstxt").text("coins x" + hero.coins)

		// check connection
		Network.check()
		Battery.update()

		//*******************************************
		//	update skills
		//*******************************************	

		function updateSkills() {
			for (var i = 0; i < Profile.skills.length; i++) {
				$(`#Skill${i+1}`).append(`<img class="skillImg" src="${Profile.skills[i].img}"/>`)
				$(`#Skill${i+1}`).attr("name", Profile.skills[i].name)
			}
			return;
		}
		updateSkills()

		// show map
		$("#mapicon").on('touchstart', function() {
			$("#map").css("display", "block")
		})
		$("#mapicon").on('touchend', function() {
			$("#map").css("display", "none")
		})


		/***************************************************
		Physics World 
		**************************************************/

		// Fog

		var tp = setTimeout(() => {
			$("#tips").css({ width: "0%", left: "50%", marginLeft: "-0%" })
			clearTimeout(tp)
		}, 4000)


		phys.addMesh(floor, 0)

		// Generate Enemies
		for (var i = 0; i < Levels.levels[lvl].enemy; i++) {

			var x = Math.floor(Math.random() * (100 - (-100)) + (-100))
			var z = Math.floor(Math.random() * (100 - (-100)) + (-100))

			if (-10 <= z && z <= 10) {
				z += 10
			}
			if (-10 <= x && x <= 10) {
				x += 10
			}


			var size = Math.floor(Math.random() * (10 - 6) + 6)

			var enemy = new Character.Enemy({ x: x, y: size / 2, z: z }, 'green', {
				w: size,
				h: size,
				d: size
			}, Math.random() * .2 - .09, Math.random() * .2 - .09, SCENE, CAMERA, RENDERER, i, phys)

			var mesh = enemy.renderEnemy()
			// name the mesh by iterated variable i

			window.enemyList.push(mesh)
			window.enemies.push(enemy)
			phys.addMesh(mesh, 1)
			window.SCENE.add(mesh)
		}

		// atomBomb
		window.bmb = true
		window.bombgo = true

		var bomb = document.getElementById('bomb')

		if ("ontouchstart" in document.documentElement) {
			document.getElementById("atombomb").addEventListener('touchstart', () => {

				if (Profile.atomLevel >= 0 && bmb) {
					bmb = false
					var arrS = enemies.length >= 1 ? enemies : babyZombies
					window.atom = new Utils.Atom(SCENE, phys, arrS)
					window.a = atom.show()
					window.atomBomb = true
					SCENE.add(window.a)
				} else {

				}
			})

			// Default Bomb
			bomb.addEventListener('touchstart', () => {

				window.bombgo ? hero.bomb() : false

			})

			$("#Skill1").on("touchstart", e => {
				firstSkill(e)

			})
			$("#Skill2").on("touchstart", e => {
				secondSkill(e)
			})
			$("#Skill3").on("touchstart", e => {
				thirdSkill(e)
			})

		} else {
			document.getElementById("atombomb").addEventListener('click', () => {

				if (Profile.atomLevel >= 100 && bmb) {
					bmb = false
					window.atom = new Utils.Atom(SCENE, phys, enemyList)
					window.a = atom.show()
					window.atomBomb = true
					SCENE.add(window.a)
				} else {

				}
			})

			// Default Bomb
			bomb.addEventListener('click', () => {
				hero.bomb()
			})

			$("#Skill1").on("click", e => {

				firstSkill(e)
			})
			$("#Skill2").on("click", e => {
				secondSkill(e)
			})
			$("#Skill3").on("click", e => {
				thirdSkill(e)
			})
		}

		var mmm = [
			new Three.MeshToonMaterial({ transparent: true, depthTest: false }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 })
			]

		// Random Hexagons
		var mk = TextureLoader.load("assets/images/textures/rod.png")

		mmm[0].map = mk
		mmm[1].color.set("green")
		mmm[1].opacity = .4

		for (var uu = 0; uu < 25; uu++) {
			var posx = Math.floor(Math.random() * (150 - (-150)) + (-150))
			var posz = Math.floor(Math.random() * (150 - (-150)) + (-150))
			var grp = new Three.Group()

			for (var u = 0; u < 10; u++) {
				var size = Math.floor(Math.random() * (3 - 1) + 1)
				var height = Math.random() * (1 - .3) + .3
				var posX = Math.floor(Math.random() * (6 - (-6)) + (-6))
				var posZ = Math.floor(Math.random() * (6 - (-6)) + (-6))

				var kyub = new Three.Mesh(new Three.CylinderGeometry(size, size, height, 6), mmm)
				if (u >= 1) {
					kyub.position.set(posX, 1, posZ)
				} else {
					kyub.position.set(0, 1, 0)
				}
				grp.add(kyub)
			}

			SCENE.add(grp)
			grp.position.set(posx, 0, posz)

		}


		var fReloaded = 100,
			sReloaded = 100,
			tReloaded = 100;

		function firstSkill(event) {

			// is First Skill Unlocked? 
			if (firstS) {
				// is First Skill Loaded? 
				if (fReloaded >= 100) {

					var skillStat = Profile.skills[0]
					var SkillObj = Skills.filter(e => {
						return e.name === skillStat.name
					})[0]

					// if special skill
					if (skillStat.type === "special") {
						// Skill Function
						// parameter required, physics.
						SkillObj.func(phys)


						// Reload first Skill
						fReloaded = 0
						$("#Skill1 img").css({
							opacity: .3
						})

						var r = 1;
						var rel = setInterval(() => {
							if (r > 100) {
								fReloaded = 100
								$("#Skill1 div").css({
									top: "100%",
									height: "0%",
									opacity: 0
								})
								$("#Skill1 img").css({
									opacity: 1
								})
								clearInterval(rel)
							} else {
								r++
								$("#Skill1 div").css({
									height: r + "%",
									top: 100 - r + "%",
									opacity: 1
								})
							}
						}, skillStat.cooldown);
					}

				}
			}

			return;
		}

		function secondSkill() {

			// is Second Skill Unlocked? 
			if (secondS) {
				// is Second Skill Loaded? 
				if (sReloaded >= 100) {

					var skillStat = Profile.skills[1]
					var SkillObj = Skills.filter(e => {
						return e.name === skillStat.name
					})[0]

					// if static Skill
					if (skillStat.type === "static") {

						// arrays of enemies to eliminate
						var arrs = window.enemies.length > 0 ? window.enemies : window.babyZombies

						// Skill Function
						// required parameter, array of enemies
						SkillObj.func(arrs)


						// Reload second Skill
						sReloaded = 0
						$("#Skill2 img").css({
							opacity: .3
						})

						var r = 1;
						var rel = setInterval(() => {
							if (r > 100) {
								sReloaded = 100
								$("#Skill2 div").css({
									top: "100%",
									height: "0%",
									opacity: 0
								})
								$("#Skill2 img").css({
									opacity: 1
								})
								clearInterval(rel)
							} else {
								r++
								$("#Skill2 div").css({
									height: r + "%",
									top: 100 - r + "%",
									opacity: 1
								})
							}
						}, skillStat.cooldown);
					}

				}
			}

			return;
		}

		function thirdSkill(event) {

			// is ThirdSkill Unlocked? 
			if (thirdS) {
				// is Third Skill Loaded? 
				if (tReloaded >= 100) {

					var skillStat = Profile.skills[2]
					var SkillObj = Skills.filter(e => {
						return e.name === skillStat.name
					})[0]

					// if dynamic Skill
					if (skillStat.type === "dynamic") {
						window.skillFunc = SkillObj.func


						// show skillPad
						$("#skillpad").css({
							display: "block",
							top: $("#utils")[0].offsetTop,
							left: $("#utils")[0].offsetLeft
						})
						// hide Utils Pad
						$("#utils").css("display", "none")

						var arrow = new Three.Mesh(new Three.PlaneGeometry(35, 35), new Three.MeshToonMaterial({
							transparent: true,
							side: 2,
							opacity: .4,
							map: TextureLoader.load("assets/images/skillArrow.png")
						}))
						arrow.position.y = .2
						arrow.rotation.x = -Math.PI / 2

						character.add(arrow)

						window.skillArrow = arrow

						// Dynamic Function
						// parameter required, target vector

						// Reload third Skill

						window.thirdSkillDone = function() {
							tReloaded = 0
							$("#Skill3 img").css({
								opacity: .3
							})

							var r = 1;
							var rel = setInterval(() => {
								if (r > 100) {
									tReloaded = 100
									$("#Skill3 div").css({
										top: "100%",
										height: "0%",
										opacity: 0
									})
									$("#Skill3 img").css({
										opacity: 1
									})
									clearInterval(rel)
								} else {
									r++
									$("#Skill3 div").css({
										height: r + "%",
										top: 100 - r + "%",
										opacity: 1
									})
								}
							}, skillStat.cooldown);
							window.thirdSkillDone = null
						}

						window.skillCancelFunc = function() {
							window.skillArrow.material.dispose()
							window.skillArrow.geometry.dispose()
							SCENE.remove(window.skillArrow)

							character.remove(skillArrow)
							window.skillArrow = null
							$("#skillpad").css("display", "none")
							$("#utils").css("display", "grid")


							window.skillCancelFunc = null
						}
					}

				}
			}

			return;
		}


		//*******************************************
		// COUNTER
		//**************************************************

		window.particles = [];
		window.killed = 0
		window.gobo = true

		var seconds = Profile.countdownMin * 60

		var counter = setInterval(() => {

			// decrease counter by 1 second
			seconds--
			$("#seconds").text(seconds + " s")

			if (seconds < 0) this.gameOver();

		}, 1000)

		var boxesTime = Profile.level > 10 ? Profile.level > 30 ? 12000 : 18000 : 20000
		var boxes = setInterval(() => {
			Utils.spawnBox()
		}, boxesTime)

		FARM.farmOBJ.boxes = boxes
		FARM.farmOBJ.counter = counter

		//update zombie count
		$("#zombiecount p").html("Zombies x" + enemies.length)

		/**************************************************
		Character Controls
		**************************************************/
		var CHARCONTROLS = new CharacterControls(SCENE, window.character, CONTROLS, CAMERA)

		// Initial Render
		RENDERER.render(SCENE, CAMERA)

		// LOOP FUNCTION
		window.loop = function() {
			// animate map
			drawMap(enemies)
			var delta = CLOCK.getDelta()
			//	window.atom === undefined ? true : window.atom.update(delta)
			CONTROLS.update()
			CHARCONTROLS.update(delta, keyPressed, pLight, window.isFiring)

			for (var i = 0; i < enemies.length; i++) {
				// Update enemies walking and hero detection
				enemies[i].update(phys, delta, character, enemyList)
			}
			for (var i = 0; i < babyZombies.length; i++) {
				// Update enemies walking and hero detection
				babyZombies[i].update(delta)
			}


			//update bombs
			var tt = CLOCK.getElapsedTime()
			cu.rotation.y = tt * 1.6
			if (window.atomBomb) {
				window.atom.update(tt)
			}

			// first skill anim
			if (window.shieldOn) {
				hero.shield.rotation.y = Math.sin(tt) * 1.5
				hero.shield.rotation.x = -Math.cos(tt) * 1.5
				//hero.shield.position.copy(hero.mesh.position)
				phys.setMeshPosition(hero.shield, {
					x: hero.mesh.position.x,
					y: 4,
					z: hero.mesh.position.z
				})
			}

			// Summon Enemy Boss

			for (var i = 0; i < window.mysteryboxes.length; i++) {
				//	mysteryboxes[i].position.y = -Math.cos(tt) *2
				mysteryboxes[i].rotation.y = tt * 1.5
			}

			hero.anim(tt)
			hero.bulletUpdate(tt, phys)


			// Boss Game
			window.bossGame ? window.boss.update(delta) : false

			// update stat
			Stat.begin()
			
			$("#fpscount").text(`Frames Per Second ` + window.fps)
			$("#memorycount").text(`Memory used ` + window.mb+"MB")
			$("#latencycount").text(`Render latency ` + window.ms.toFixed(2)+"ms")

			Stat.end()

			RENDERER.render(SCENE, CAMERA);
			if (typeof FARM.farmOBJ.loop === "function") {
				window.requestAnimationFrame(FARM.farmOBJ.loop)
			}

			return;
		}

		// start loop
		FARM.farmOBJ.loop = window.loop
		FARM.farmOBJ.loop()

		return;
	},

	gameOver: function() {
		Utils.stopSound(Sound.FarmMode)

		if (window.bossGame) {
			var b = SCENE.getObjectByName("boss")
			b.traverse(e => {
				if (e.type === "Mesh") {
					e.material.dispose()
					e.geometry.dispose()
				}
			})
			SCENE.remove(b)
		}

		SCENE.remove(b)

		Utils.playSound(Sound.gameOver)

		// stop clock

		window.inGame = false

		$("#status").text("")
		Profile.level = Profile.level

		FARM.farmOBJ.loop = undefined
		clearInterval(FARM.farmOBJ.counter)
		clearInterval(FARM.farmOBJ.boxes)

		// clear scene childrens
		for (var j = 0; j < enemyList.length; j++) {

			enemyList[j].geometry.dispose()
			enemyList[j].material.dispose()
			SCENE.remove(enemyList[j])

			$(`#${enemyList[j].name}`).remove()
		}
		window.enemyList.length = 0

		for (var m = 0; m < mysteryboxes.length; m++) {

			mysteryboxes[m].traverse(e => {
				e.type === "Mesh" ? e.geometry.dispose() : false
				e.type === "Mesh" ? e.material.dispose() : false
			})

			SCENE.remove(mysteryboxes[m])

		}
		window.mysteryboxes.length = 0


		for (var o = 0; o < droppedBomb.length; o++) {
			droppedBomb[o].done = true
			droppedBomb[o].removed = true
			droppedBomb[o].children.forEach(e => {
				e.material.dispose()
				e.geometry.dispose()
			})
			SCENE.remove(droppedBomb[o])
		}

		droppedBomb.length = 0

		for (var c = 0; c < droppedCoins.length; c++) {
			SCENE.remove(droppedCoins[c])
			droppedCoins[c] = null
		}

		for (var z = 0; z < babyZombies.length; z++) {
			babyZombies[z].mesh.children.forEach(e => {
				e.material.dispose()
				e.geometry.dispose()
			})
			SCENE.remove(babyZombies[z].mesh)
			babyZombies[z].mesh = null
			babyZombies[z] = null
		}

		droppedCoins.length = 0

		$("#statcount, #counter, #life, #bombbar, #atombomb, #critical, #utils, #mapicon")
			.css("display", "none")

		$("#joystick")
			.css("opacity", "0")

		// update time over and gameover stat

		$("#zkilled").text("killed " + window.killed)
		$("#cgained").text("coins " + Profile.coins)
		$("#rank").text(Profile.rank)
		window.enemies.length = 0

		// Center the hero
		character.position.set(0, character.position.y, 0)
		pLight.position.set(0, pLight.position.y, 3.8)

		var ps = new Three.Vector3().copy(CAMERA.position)
		var tarPs = new Three.Vector3(20, 30, 20)

		TweenMax.to(CAMERA.position, 1.8, {
			x: tarPs.x,
			y: tarPs.y,
			z: tarPs.z,
			easing: Power2.easingIn,
			onUpdate: function() {
				CAMERA.lookAt(character.position)
			},
			onComplete: function() {
				CAMERA.lookAt(character.position)
				$("#gameover, #time, #home")
					.css("display", "block")
				$("#gameoverstat").css("display", "grid")
			}
		})


		CLOCK.start()

		var overAnim = function() {

			var b = CLOCK.getElapsedTime()
			character.rotation.y = Math.sin(b) * .6
			cu.rotation.y = b * 1.6
			RENDERER.render(SCENE, CAMERA)
			hero.anim(b)
			CAMERA.lookAt(character.position)
			if (typeof overAnim === "function") {
				window.requestAnimationFrame(overAnim)
			}
		}
		overAnim()

		// Update FACEBOOK PLAYER DATA
		/*	FBInstant.player.setDataAsync({
				level: Profile.level,
				coins: Profile.coins,
				rank: Profile.rank,
				keys: Profile.keys,
				energy: Profile.energy
			}).then(() => {
				console.log("data updated!")
				$("#energy-txt").text(Profile.energy)
			}).catch(e => {
				console.warn(e)
				
			})*/

		// home 
		$("#home").on('click', function() {
			$("#gameover, #time, #home")
				.css("display", "none")
			$("#gameoverstat").css("display", "none")

			//restart hero Character
			window.hero.hpLeft = Profile.maxHP
			window.hero.velocity = Profile.velocity
			window.hero.bullets = Profile.bombs
			Profile.atomLevel = 0


			var newUrl = new URL(window.location.href)
			newUrl.searchParams.set("isPlaying", true)
			window.location.href = newUrl

		})

	},
	gameWin: function() {

		$(".ccns, #ccnscoin, #critical").remove()
		Utils.playSound(Sound.gameWin)
		Utils.stopSound(Sound.FarmMode)

		window.inGame = false

		// increase level
		$("#status, #gamewin2").text("")

		$("#gamewin2").html("You passed level " + Profile.level + " <br /> +100 coins")

		Profile.level = Profile.level + 1
		hero.coins = hero.coins + 100

		// clear timer and Obj loop function
		FARM.farmOBJ.loop = undefined
		clearInterval(FARM.farmOBJ.counter)
		clearInterval(FARM.farmOBJ.boxes)

		// clear scene childrens
		for (var j = 0; j < enemyList.length; j++) {
			enemyList[j].geometry.dispose()
			enemyList[j].material.dispose()
			SCENE.remove(enemyList[j])
		}

		enemyList.length = 0

		for (var m = 0; m < mysteryboxes.length; m++) {

			mysteryboxes[m].traverse(e => {
				e.type === "Mesh" ? e.geometry.dispose() : false
				e.type === "Mesh" ? e.material.dispose() : false
			})

			SCENE.remove(mysteryboxes[m])

		}
		window.mysteryboxes.length = 0


		for (var c = 0; c < droppedCoins.length; c++) {
			SCENE.remove(droppedCoins[c])
			droppedCoins[c] = null
		}

		for (var ccc = 0; ccc < droppedBomb.length; ccc++) {
			droppedBomb[ccc].done = true
			droppedBomb[ccc].removed = true
			droppedBomb[ccc].children.forEach(e => {
				e.material.dispose()
				e.geometry.dispose()
			})
			SCENE.remove(droppedBomb[ccc])
		}
		droppedBomb.length = 0

		droppedCoins.length = 0

		for (var z = 0; z < babyZombies.length; z++) {
			babyZombies[z].mesh.children.forEach(e => {
				e.material.dispose()
				e.geometry.dispose()
			})
			SCENE.remove(babyZombies[z].mesh)
			babyZombies[z].mesh = null
			babyZombies[z] = null
		}

		// hide stats and joystick
		$("#statcount, #counter, #life, #bombbar, #atombomb, #utils, #mapicon")
			.css("display", "none")
		$("#joystick")
			.css("opacity", "0")

		// animate scene win
		pLight.position.set(character.position.x + 2.8, pLight.position.y, character.position.z + 2.8)

		var ps = new Three.Vector3().copy(CAMERA.position)
		var tarPs = new Three.Vector3(character.position.x + 15, character.position.y + 10, character.position.z + 15)

		TweenMax.to(CAMERA.position, 2.5, {
			x: tarPs.x,
			y: tarPs.y,
			z: tarPs.z,

			onUpdate: function() {
				CAMERA.lookAt(character.position)
			},
			onComplete: function() {
				CAMERA.lookAt(character.position)
				// display elements
				$("#gamewin, #gamewin2, #home").css("display", "grid")
				// Facebook Save Data function
			}
		})


		// Win animation
		var winAnim = function() {

			var b = CLOCK.getElapsedTime()
			cu.rotation.y = b * 1.6
			character.rotation.y = Math.sin(b) * .6

			hero.anim(b)

			RENDERER.render(SCENE, CAMERA)
			CAMERA.lookAt(character.position)
			if (typeof winAnim === "function") {
				window.requestAnimationFrame(winAnim)
			}
		}
		winAnim()

		// Update FACEBOOK PLAYER DATA
		/*	FBInstant.player.setDataAsync({
				level: Profile.level,
				coins: Profile.coins,
				rank: Profile.rank,
				keys: Profile.keys,
				energy: Profile.energy
			}).then(() => {
				console.log("data updated!")
			}).catch(e => {
				console.warn(e)
			})*/

		// Home 
		$("#home").on('click', function() {

			character.position.set(0, character.position.y, 0)
			CAMERA.position.set(0, 20, 20)
			CAMERA.lookAt(character.position)
			pLight.position.set(0, pLight.position.y, 0)

			window.killed = 0
			Utils.playSound(Sound.farmModeReward)

			// Update Game data

			CAMERA.lookAt(character.position)

			character.rotation.y = -10
			$("#playbtn, #energy-container, #coin-container").css("display", "grid")
			$("#settings, #version").css("display", "block")

			//restart hero Character
			window.hero.hpLeft = Profile.maxHP
			window.hero.velocity = Profile.velocity
			window.hero.bullets = Profile.bombs
			Profile.atomLevel = 0

			winAnim = undefined
			// hide elements
			$("#gameover, #time, #home, #gameoverstat, #atombomb, #gamewin, #gamewin2")
				.css("display", "none")

			// start initial Animation
			/*Obj.initAnim = initAnim
			Obj.initAnim()*/

			//*******************************************
			/**************************************************
				Additional Rewards
			**************************************************/

			var rewardsArr = [
				{
					type: "coin",
					value: 0
				},
				{
					type: "key",
					value: 0
				},
				{
					type: "energy",
					value: 0
				}
			]

			for (var rw = 0; rw < window.addRewards.length; rw++) {
				switch (addRewards[rw].type) {
					case "coin":
						rewardsArr[0].value += addRewards[rw].value
						break;
					case "key":
						rewardsArr[1].value += addRewards[rw].value
						break;
					case "energy":
						rewardsArr[2].value += addRewards[rw].value
						break;
				}
			}

			// append rewards to banner

			for (var y = 0; y < 3; y++) {
				$(`#reward${y}`).text("+" + rewardsArr[y].value)
			}

			$("#ccnscvr").prepend(`	<img class="ccns" src="assets/images/coin_reward.png" alt="" />
			<p id="ccnscoin">+100 Coins</p>`)

			// REWARDS TIME
			var o = setTimeout(() => {
				$("#cover, #ccnscvr").css("display", "block")
				clearTimeout(o)
			}, 800)
			return;
		})
		return;
	},
	EnemyBoss: function() {
		var tu = setTimeout(() => {
			window.gobo = false
			TweenMax.to(CAMERA.position, 2.3, {
				x: 20,
				y: 50,
				z: 20,
				onUpdate: () => {
					CAMERA.lookAt(0, 0, 0)
					CONTROLS.target = new Three.Vector3(0, 0, 0)
				},
				onComplete: () => {
					CAMERA.lookAt(0, 0, 0)
					CONTROLS.target = new Three.Vector3(0, 0, 0)
					window.boss = new Character.EnemyBoss()


					var m = boss.render()
					m.scale.y = 0

					m.name = "boss"
					SCENE.add(m)
					TweenMax.to(m.scale, .4, {
						y: 1,
						onComplete: () => {
							CAMERA.position.set(character.position.x + 25, 75, character.position.z + 25)
							CAMERA.lookAt(character.position)
							CONTROLS.target = character.position
							window.gobo = true
						}
					})
					window.bossGame = true
					GAME.tips("Boss Enemy has been summoned!")


				}
			})
			clearTimeout(tu)
		}, 900)
	}
}

export { FARM }