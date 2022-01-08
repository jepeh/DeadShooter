import { Profile } from '../profiles/profile.js'

var rewards = {
	a: function() {
		// plus 1 coin
		Profile.coins += 1
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/1coin.png")
		return {
			reward: "+1 coin!"
		}
	},
	b: function() {
		// plus 5 coins
		Profile.coins += 5
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/5coins.png")
		return {
			reward: "+5 coins!"
		}
	},
	c: function() {
		// plus 10 coins
		Profile.coins += 10
		$("#coins p").text(Profile.coins)
		rew("assets/images/rewards/10coins.png")
		return {
			reward: "+10 coins!"
		}
	},
	d: function() {
		// plus 1 key
		Profile.keys += 1
		$("#keystxt").text(Profile.keys)
		rew("assets/images/rewards/1key.png")
		return {
			reward: "+1 key!"
		}
	},
	e: function() {
		// plus 1 energy
		Profile.energy += 1
		rew("assets/images/rewards/1energy.png")
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
		rew("assets/images/rewards/hp.png");
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