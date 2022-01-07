import { GAME } from '../script.js'

var map = document.getElementById('map');
var ctx = map.getContext('2d')
map.width = 200
map.height = 200

var cX = map.width / 2 + 3
var cZ = map.height / 2 +  2

function drawMap(enemy) {
	ctx.clearRect(0, 0, innerWidth, innerHeight)

	for (var e = 0; e < enemy.length; e++) {

		var x = enemy[e].mesh.position.x
		var z = enemy[e].mesh.position.z

		// if enemy is in hero's radius
		var hxPos = hero.mesh.position.x + hero.mapRadius / 2
		var hxNeg = hero.mesh.position.x - hero.mapRadius / 2
		var hzPos = hero.mesh.position.z + hero.mapRadius / 2
		var hzNeg = hero.mesh.position.z - hero.mapRadius / 2


		if (x > hxNeg && hxPos > x && z > hzNeg && hzPos > z) {

			x = -x
			z = -z

			x < cX ? x = cX - x : x = x
			z < cZ ? z = cZ - z : z = z

			ctx.beginPath()
			ctx.rect(x, z, 8, 8)
			ctx.fillStyle = "green"
			ctx.fill()
			ctx.closePath()
		}

	}

	// hero
	var hx = -Math.floor(hero.mesh.position.x)
	var hz = -Math.floor(hero.mesh.position.z)

	hx < cX ? hx = cX - hx : hx = hx
	hz < cZ ? hz = cZ - hz : hz = hz

	ctx.beginPath()
	ctx.rect(hx, hz, 8, 8)
	ctx.fillStyle = hero.color
	ctx.fill()
	ctx.closePath()


	// Radius proximity
	ctx.beginPath()
	ctx.rect(hx - hero.mapRadius / 2 + hero.mesh.children[0].geometry.parameters.width / 2, hz + hero.mesh.children[0].geometry.parameters.depth / 2 - hero.mapRadius / 2, hero.mapRadius, hero.mapRadius)
	ctx.fillStyle = "rgba(255,255,255,.09)"
	ctx.fill()
	ctx.closePath()


	return;
}

export { drawMap }