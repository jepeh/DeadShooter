import { Profile } from '../profiles/profile.js'
import * as Three from '../src/three.js'

var rewards = {
	a: function() {
		// plus 1 coin
		Profile.coins += 1
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/1coin.png")
		return {
			reward: "+1 coin!",
			isAward: {
				type: "coin",
				value: 1
			}
		}
	},
	b: function() {
		// plus 5 coins
		Profile.coins += 5
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/5coins.png")
		return {
			reward: "+5 coins!",
			isAward: {
				type: "coin",
				value: 5
			}
		}
	},
	c: function() {
		// plus 10 coins
		Profile.coins += 10
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/10coins.png")
		return {
			reward: "+10 coins!",
			isAward: {
				type: "coin",
				value: 10
			}
		}
	},
	d: function() {
		// plus 1 key
		Profile.keys += 1
		$("#keystxt").text(Profile.keys)
		rew("assets/images/rewards/1key.png")
		return {
			reward: "+1 key!",
			isAward: {
				type: "key",
				value: 1
			}
		}
	},
	e: function() {
		// plus 1 energy
		Profile.energy += 1
		rew("assets/images/rewards/1energy.png")
		return {
			reward: "+1 energy!",
			isAward: {
				type: "energy",
				value: 1
			}
		}
	},
	f: function() {
		// plus 10% HP
		if (hero.hpLeft >= 100) {}
		else if (hero.hpLeft < 30) {
			// 35% of its current hp
			var hpToAdd = hero.hpLeft * .35
			hero.hpLeft = hero.hpLeft + hpToAdd
			if (hero.hpLeft > 100) {
				hero.hpLeft = 100
			}
			hero.hp.style.width = hero.hpLeft + "%"
			if (hero.hpLeft > 30) {
				hero.hp.style.backgroundColor = "#11CCFF"
				$("#critical").css("display", "none")
			}
		}
		else
		{
			// 10% of its current hp
			var hpToAdd = hero.hpLeft * .10
			hero.hpLeft = hero.hpLeft + hpToAdd
			if (hero.hpLeft > 100) {
				hero.hpLeft = 100
			}
			hero.hp.style.width = hero.hpLeft + "%"
		}
		rew("assets/images/rewards/hp.png");


		// function

		window.gobo = false

		var m = [
			new Three.MeshToonMaterial({ transparent: true, opacity: .6 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 }),
			new Three.MeshToonMaterial({ transparent: true, opacity: 0 })
			]

		var mp = TextureLoader.load("assets/images/textures/rod.png");

		m[0].map = mp
		m[0].side = 2

		var field = new Three.Mesh(new Three.CylinderGeometry(5, 5, 20, 50), m)
		field.position.copy(hero.mesh.position)
		field.scale.set(0, 0, 0)

		window.SCENE.add(field)

		var pss = []

		for (var i = 0; i < 15; i++) {
			var fd = new Three.Mesh(new Three.CylinderGeometry(.07, .08, 12, ), new Three.MeshToonMaterial({ transparent: true, map: mp }))
			fd.material.needsUpdate = true
			var pos = {
				x: hero.mesh.position.x + Math.floor(Math.random() * (3 - (-3)) + (-3)),
				y: hero.mesh.position.y + Math.floor(Math.random() * (3 - (-5)) + (-5)),
				z: hero.mesh.position.z + Math.floor(Math.random() * (3 - (-3)) + (-3)),
			}

			fd.position.set(pos.x, pos.y, pos.z)
			window.SCENE.add(fd)
			pss.push(fd)
		}

		for (var i = 0; i < pss.length; i++) {
			var m = pss[i]

			TweenMax.to(pss[i].scale, .7, {
				x: 1,
				y: .2,
				z: 1
			})

			TweenMax.to(pss[i].position, .7, {
				x: pss[i].position.x,
				y: 20,
				z: pss[i].position.z,
				onComplete: function() {
					for (var ii = 0; ii < pss.length; ii++) {
						pss[ii].material.dispose()
						pss[ii].geometry.dispose()
						window.SCENE.remove(pss[ii])
					}
				}
			})

		}

		TweenMax.to(field.scale, .9, {
			x: 1,
			y: 1,
			z: 1,
			onComplete: function() {
				window.gobo = true

				field.geometry.dispose()
				window.SCENE.remove(field)
			}
		})


		var plane = new Three.Mesh(new Three.PlaneBufferGeometry(12, 12), new Three.MeshToonMaterial({
			map: TextureLoader.load("assets/images/textures/heal.png"),
			transparent: true,
			side: 2
		}))
		plane.position.copy(character.position)
		plane.position.y = 1
		plane.rotation.x = -Math.PI / 2
		plane.scale.set(0, 0, 0)

		window.SCENE.add(plane)

		TweenMax.to(plane.scale, 1, {
			x: 1,
			y: 1,
			z: 1,
			onComplete: function() {
				TweenMax.to(plane.scale, .7, {
					x: 0,
					y: 0,
					z: 0,
					onComplete: function() {
						if (plane.parent) {
							plane.material.dispose()
							plane.geometry.dispose()
							SCENE.remove(plane)
						}
					}
				})
			}
		})
		TweenMax.to(plane.rotation, 3.5, {
			z: 2
		})

		return {
			reward: "+10% HP!"
		}
	},
	g: function() {
		// plus 15% Velocity
		if (hero.hpLeft >= 15) {} else {
			// 10% of its current hp
			var vToAdd = hero.velocity * .20
			hero.velocity = hero.velocity + vToAdd
			if (hero.velocity > 20) {
				hero.velocity = 20
			}
			//hero.hp.style.width = hero.hpLeft + "%"
		}
		rew("assets/images/rewards/speed.png");
		return {
			reward: "+15% Speed!"
		}
	},
	h: function() {
		//plus 15% bullet damage 
		var dmg = hero.bombDamage * .15
		hero.bombDamage += dmg
		rew("assets/images/rewards/damage.png");
		return {
			reward: "+15% bullet damage!"
		}
	},
	i: function() {
		// atom bomb reload
		// reload to 100%
		Profile.atomLevel = 100
		$('.chart').data('easyPieChart').update(Profile.atomLevel)
		$(".atomimgoff").css({
			opacity: 1
		})
		$(".atomimgoff").attr("src", "assets/images/atomon.png")
		$(".atomimgoff").removeClass().addClass("atomimgon")
		rew("assets/images/rewards/atom.png")
		return {
			reward: "atombomb 100% reloaded!"
		}
	}
}

function rew(path) {
	$("#rewards").html('')
	$("#rewards").css("display", "block")
	$("#rewards").html(`<img src="${path}"/>`)
	var sc = setTimeout(() => {
		$("#rewards").css("display", "none")
		clearTimeout(sc)
	}, 2300)
	return;
}
export default rewards;