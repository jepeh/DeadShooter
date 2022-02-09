import * as three from '/src/three.js'

var Particles = function(obj) {

	this._p = obj;
	this._particlesArray = [];
	this._origin = null; //new three.Vector3()
	this._map = null;
	this._end = false;

	this._p.interval === undefined ? this._p.interval = 300 : this._p.interval = this._p.interval

	var self = this;

	//void
	// immediately invoked functions
	! function applyTexture(tex) {

		if (tex === undefined) {
			self._map = window.TextureLoader.load("assets/images/textures/particleTexture.png")
		} else {
			self._map = tex;
		}

		return;
	}(this._p.texture)
	//	void
	! function setOrigin(coord) {
		self._origin = coord
		return;
	}(self._p.center)

	//private functions
	function disposeParticle(p) {

	}


	this.__proto__.start =
		function() {

			self._p.loop ? (function() {

				var interval = setInterval(() => {
					if (self._end) {
						clearInterval(interval)
					}
					else {

						var size = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize;
						var particle = new three.Mesh(new three.PlaneGeometry(size, size), new three.MeshToonMaterial({
							transparent: true,
							side: 2,
							map: self._map
						}))

						// random position
						var pos = {
							x: self._origin.x, // + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
							y: self._origin.y, //+ Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
							z: self._origin.z //+ Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
						}

						var targetPos = {
							x: pos.x + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
							y: pos.y + Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
							z: pos.z + Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
						}

						// align particles
						particle.position.copy(pos)
						//initial particle size, 0
						particle.scale.set(0, 0, 0)
						// store particles in array
						//self._particlesArray.push(particle)
						// add to scene
						window.SCENE.add(particle)

						// Scale Animation
						TweenMax.to(particle.scale, self._p.inTiming, {
							x: self._p.targetScale.x,
							y: self._p.targetScale.z,
							z: self._p.targetScale.z,
							onUpdate: () => {
								particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
							}
						})

						TweenMax.to(particle.position, self._p.targetTiming, {
							x: targetPos.x, //self._p.loopSetting.positions.x
							y: targetPos.y,
							z: targetPos.z,
							onUpdate: () => {
								particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
							},
							onComplete: () => {
								TweenMax.to(particle.scale, self._p.outTiming, {
									x: .3,
									y: .3,
									z: .3,
									onUpdate: () => {
										particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
									},
									onComplete: () => {
										particle.material.dispose()
										particle.geometry.dispose()
										window.SCENE.remove(particle)
									}
								})
							}
						})
					}
				}, self._p.interval)

			})() : (function() {

				var doneCount = 0;

				var interval = setInterval(() => {
					if (doneCount === self._p.pCount) {
						clearInterval(interval)
						doneCount = 0
					} else {
						doneCount++
						var size = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize;
						var particle = new three.Mesh(new three.PlaneGeometry(size, size), new three.MeshToonMaterial({
							transparent: true,
							side: 2,
							map: self._map
						}))

						// random position
						var pos = {
							x: self._origin.x + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
							y: self._origin.y + Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
							z: self._origin.z + Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
						}

						// align particles
						particle.position.copy(pos)
						//initial particle size, 0
						particle.scale.set(0, 0, 0)
						// store particles in array
						self._particlesArray.push(particle)
						// add to scene
						window.SCENE.add(particle)

						// Scale Animation
						TweenMax.to(particle.scale, self._p.inTiming, {
							x: self._p.targetScale.x,
							y: self._p.targetScale.y,
							z: self._p.targetScale.z,
							onUpdate: () => {
								particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
							}
						})

						TweenMax.to(particle.position, self._p.targetTiming, {
							y: self._p.positions.y.maxY,
							onUpdate: () => {
								particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
							},
							onComplete: () => {
								TweenMax.to(particle.scale, self._p.outTiming, {
									x: .3,
									y: .3,
									z: .3,
									onUpdate: () => {
										particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z))
									},
									onComplete: () => {


										particle.material.dispose()
										particle.geometry.dispose()
										window.SCENE.remove(particle)

									}
								})
							}
						})
					}

				}, self._p.interval)

			})()
		}

	//	void
	this.__proto__.end =
		function() {

			self._end = true;

			return;
		}
}

export default Particles;