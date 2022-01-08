import { Profile } from '../profiles/profile.js'

var rewards = {
	a: function() {
		// plus 1 coin

		Profile.coins += 1
		$("#coins p").text(Profile.coins)

		return {
			reward: "+1 coin!"
		}
	},
	b: function() {
		// plus 5 coins

		Profile.coins += 5
		$("#coins p").text(Profile.coins)

		return {
			reward: "+5 coins!"
		}
	},
	c: function() {
		// plus 10 coins

		Profile.coins += 10
		$("#coins p").text(Profile.coins)

		return {
			reward: "+10 coins!"
		}
	},
	d: function() {
		// plus 1 key

		Profile.keys += 1
		$("#keystxt").text(Profile.keys)

		return {
			reward: "+1 key!"
		}
	},
	e: function() {
		// plus 1 energy

		Profile.energy += 1

		return {
			reward: "+1 energy!"
		}
	},
	f: function() {
		// plus 10% HP

		if (hero.hpLeft >= 100) {

		} else {
			// 10% of its current hp
			var hpToAdd = hero.hpLeft * .10
			hero.hpLeft = hero.hpLeft + hpToAdd

			if (hero.hpLeft > 100) {
				hero.hpLeft = 100
			}
			hero.hp.style.width = hero.hpLeft + "%"
		}

		return {
			reward: "+10% HP!"
		}

	},
	g: function() {
		// plus 15% Velocity

		if (hero.hpLeft >= 15) {

		} else {
			// 10% of its current hp
			var vToAdd = hero.velocity * .15
			hero.velocity = hero.velocity + vToAdd

			if (hero.velocity > 15) {
				hero.velocity = 15
			}
			//hero.hp.style.width = hero.hpLeft + "%"
		}

		return {
			reward: "+15% Speed!"
		}

	},
	h: function() {
		//plus 15% bullet damage 

		var dmg = hero.bombDamage * .15
		hero.bombDamage += dmg

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
			
		
		return {
			reward: "atombomb 100% reloaded!"
		}
	}
}

export default rewards;