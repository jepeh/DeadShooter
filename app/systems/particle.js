import * as three from '/src/three.js'

var Particles = function(obj) {

	this._p = obj;
	this._particlesArray = [];
	this._origin = null; //new three.Vector3()
	this._map = null;
	this._end = false;

	this._p.interval === undefined ? this._p.interval = 300 : this._p.interval = this._p.interval
	this._p.isCenterSpawn === undefined ? this._p.isCenterSpawn = true : false
	this._p.initialScale === undefined ? this._p.initialScale = { x: 0, y: 0, z: 0 } : this._p.initialScale
	this._p.targetStartScale === undefined ? this._p.targetStartScale = { x: 1, y: 1, z: 1 } : this._p.targetStartScale
	this._p.targetEndScale === undefined ? this._p.targetEndScale = { x: 0, y: 0, z: 0 } : this._p.targetEndScale
	//	this._p.targetScale === undefined ? this._p.targetScale = { x: 1, y: 1, z: 1 } : this._p.targetScale = this._p.targetScale

	this._group = new three.Group()
	console.log(this._group)
	this._group.rotation.copy(this._p.particleRotation === undefined ? new three.Euler(0, 0, 0) : this._p.particleRotation)
	this._group.position.copy(this._p.particlePosition === undefined ? new three.Vector3(0, 0, 0) : this._p.particlePosition)
	window.SCENE.add(this._group)

	this._groupMesh = new three.Mesh(new three.BoxGeometry(3, 3, 3), new three.MeshPhongMaterial({ wireframe: true }))
	this._groupMesh.position.set(0, 1.5, 0)
	if (this._p.particleSource) this._group.add(this._groupMesh)
	var self = this;

	//void
	// immediately invoked functions
	! function applyTexture(tex) {
		if (tex === undefined) {
			self._map = window.TextureLoader.load("assets/images/textures/particleTexture.png")
		} else {
			self._map = self._p.texture
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

						var size = {};
						if (self._p.size.isRandom) {
							size.x, size.y = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
							//size.y = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
						} else {
							size.x = self._p.size.x
							size.y = self._p.size.y
						}

						var particle;

						if (self._p.mesh === undefined) {
							particle = new three.Mesh(new three.PlaneGeometry(size.x, size.y), new three.MeshToonMaterial({
								transparent: true,
								side: 2,
								map: self._map,
								depthTest: self._p.depthTest
							}))
						} else {
							particle = new three.Mesh(self._p.mesh.geometry, self._p.mesh.material)
						}


						self._p.upward ? particle.rotation.x = -Math.PI / 2 : false

						var pos;

						if (self._p.isCenterSpawn) {

							// random position
							pos = {
								x: self._origin.x, // + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
								y: self._origin.y, //+ Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
								z: self._origin.z //+ Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
							}

						} else {
							pos = {
								x: self._origin.x + Math.random() * (self._p.randomSpawn.maxX - self._p.randomSpawn.minX) + self._p.randomSpawn.minX,
								y: self._origin.y + Math.random() * (self._p.randomSpawn.maxY - self._p.randomSpawn.minY) + self._p.randomSpawn.minY,
								z: self._origin.z + Math.random() * (self._p.randomSpawn.maxZ - self._p.randomSpawn.minZ) + self._p.randomSpawn.minZ
							}
						}


						var targetPos = {
							x: pos.x + Math.random() * (self._p.targetPosition.maxX - self._p.targetPosition.minX) + self._p.targetPosition.minX,
							y: pos.y + Math.random() * (self._p.targetPosition.maxY - self._p.targetPosition.minY) + self._p.targetPosition.minY,
							z: pos.z + Math.random() * (self._p.targetPosition.maxZ - self._p.targetPosition.minZ) + self._p.targetPosition.minZ
						}

						// align particles
						particle.position.copy(pos)
						//initial particle size, 0
						particle.scale.copy(self._p.initialScale)
						// store particles in array
						//self._particlesArray.push(particle)
						// add to scene
						self._group.add(particle)

						// Scale Animation
						TweenMax.to(particle.scale, self._p.inTiming, {
							x: self._p.targetStartScale.x,
							y: self._p.targetStartScale.z,
							z: self._p.targetStartScale.z,
							onUpdate: () => {
								self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
							}
						})

						if (self._p.linearTarget) {
							TweenMax.to(particle.position, self._p.targetTiming, {
								// only increase y position
								y: targetPos.y,
								onUpdate: () => {
									self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
								},
								onComplete: () => {
									TweenMax.to(particle.scale, self._p.outTiming, {
										x: self._p.targetEndScale.x,
										y: self._p.targetEndScale.y,
										z: self._p.targetEndScale.z,
										onUpdate: () => {
											self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
										},
										onComplete: () => {

											particle.material.dispose()
											particle.geometry.dispose()
											self._group.remove(particle)

											// callback function
											if (self._p.endFunction) {
												//console.log(self._p.endFunction)
												self._p.endFunction(particle.position)

											}
										}
									})
								}
							})
						} else {
							TweenMax.to(particle.position, self._p.targetTiming, {
								x: targetPos.x, //self._p.loopSetting.positions.x
								y: targetPos.y,
								z: targetPos.z,
								onUpdate: () => {
									self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
								},
								onComplete: () => {
									TweenMax.to(particle.scale, self._p.outTiming, {
										x: self._p.targetEndScale.x,
										y: self._p.targetEndScale.y,
										z: self._p.targetEndScale.z,
										onUpdate: () => {
											self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
										},
										onComplete: () => {

											particle.material.dispose()
											particle.geometry.dispose()
											self._group.remove(particle)

											// callback function
											if (self._p.endFunction) {
												//console.log(self._p.endFunction)
												self._p.endFunction(particle.position)

											}
										}
									})
								}
							})
						}

					}
				}, self._p.interval)

			})() : (function() {

				if (!self._p.instantSpawn) {
					var doneCount = 0;
					var interval = setInterval(() => {
						if (doneCount === self._p.pCount) {
							clearInterval(interval)
							doneCount = 0
						} else {
							doneCount++
							//var size = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize;
							var size = {};
							if (self._p.size.isRandom) {
								size.x = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
								size.y = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
								//size.y = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
							} else {
								size.x = self._p.size.x
								size.y = self._p.size.y
							}

							var particle;

							if (self._p.mesh === undefined) {
								particle = new three.Mesh(new three.PlaneGeometry(size.x, size.y), new three.MeshToonMaterial({
									transparent: true,
									side: 2,
									map: self._map,
									depthTest: self._p.depthTest
								}))
							} else {
								particle = new three.Mesh(self._p.mesh.geometry, self._p.mesh.material)
							}

							var pos;

							if (self._p.isCenterSpawn) {

								// random position
								pos = {
									x: self._origin.x, // + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
									y: self._origin.y, //+ Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
									z: self._origin.z //+ Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
								}

							} else {
								pos = {
									x: self._origin.x + Math.random() * (self._p.randomSpawn.maxX - self._p.randomSpawn.minX) + self._p.randomSpawn.minX,
									y: self._origin.y + Math.random() * (self._p.randomSpawn.maxY - self._p.randomSpawn.minY) + self._p.randomSpawn.minY,
									z: self._origin.z + Math.random() * (self._p.randomSpawn.maxZ - self._p.randomSpawn.minZ) + self._p.randomSpawn.minZ
								}
							}


							var targetPos = {
								x: pos.x + Math.random() * (self._p.targetPosition.maxX - self._p.targetPosition.minX) + self._p.targetPosition.minX,
								y: pos.y + Math.random() * (self._p.targetPosition.maxY - self._p.targetPosition.minY) + self._p.targetPosition.minY,
								z: pos.z + Math.random() * (self._p.targetPosition.maxZ - self._p.targetPosition.minZ) + self._p.targetPosition.minZ
							}

							// align particles
							particle.position.copy(pos)
							//initial particle size, 0
							particle.scale.copy(self._p.initialScale)
							// store particles in array
							self._particlesArray.push(particle)
							// add to scene
							self._group.add(particle)

							// Scale Animation
							TweenMax.to(particle.scale, self._p.inTiming, {
								x: self._p.targetStartScale.x,
								y: self._p.targetStartScale.y,
								z: self._p.targetStartScale.z,
								onUpdate: () => {
									self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
								}
							})


							if (self._p.linearTarget) {
								TweenMax.to(particle.position, self._p.targetTiming, {
									// only increase y position
									y: targetPos.y,
									onUpdate: () => {
										self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
									},
									onComplete: () => {
										TweenMax.to(particle.scale, self._p.outTiming, {
											x: self._p.targetEndScale.x,
											y: self._p.targetEndScale.y,
											z: self._p.targetEndScale.z,
											onUpdate: () => {
												self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
											},
											onComplete: () => {


												particle.material.dispose()
												particle.geometry.dispose()
												self._group.remove(particle)

											}
										})
									}
								})
							} else {
								TweenMax.to(particle.position, self._p.targetTiming, {
									x: targetPos.x, //self._p.loopSetting.positions.x
									y: targetPos.y,
									z: targetPos.z,
									onUpdate: () => {
										self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
									},
									onComplete: () => {
										TweenMax.to(particle.scale, self._p.outTiming, {
											x: self._p.targetEndScale.x,
											y: self._p.targetEndScale.y,
											z: self._p.targetEndScale.z,
											onUpdate: () => {
												self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
											},
											onComplete: () => {


												particle.material.dispose()
												particle.geometry.dispose()
												self._group.remove(particle)

											}
										})
									}
								})
							}
						}

					}, self._p.interval)

				}
				else {

					var particlesArray = []

					for (var i = 0; i < self._p.pCount; i++) {

						//var size = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize;
						var size = {};
						if (self._p.size.isRandom) {
							size.x = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
							size.y = size.x // Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
							//size.y = Math.random() * (self._p.size.maxSize - self._p.size.minSize) + self._p.size.minSize
						} else {
							size.x = self._p.size.x
							size.y = self._p.size.y
						}

						var particle;

						if (self._p.mesh === undefined) {
							particle = new three.Mesh(new three.PlaneGeometry(size.x, size.y), new three.MeshToonMaterial({
								transparent: true,
								side: 2,
								map: self._map,
								depthTest: self._p.depthTest
							}))
						} else {
							particle = new three.Mesh(self._p.mesh.geometry, self._p.mesh.material)
						}


						var pos;

						if (self._p.isCenterSpawn) {

							// random position
							pos = {
								x: self._origin.x, // + Math.random() * (self._p.positions.x.maxX - self._p.positions.x.minX) + self._p.positions.x.minX,
								y: self._origin.y, //+ Math.random() * (self._p.positions.y.maxY - self._p.positions.y.minY) + self._p.positions.y.minY,
								z: self._origin.z //+ Math.random() * (self._p.positions.z.maxZ - self._p.positions.z.minZ) + self._p.positions.z.minZ
							}

						} else {
							pos = {
								x: self._origin.x + Math.random() * (self._p.randomSpawn.maxX - self._p.randomSpawn.minX) + self._p.randomSpawn.minX,
								y: self._origin.y + Math.random() * (self._p.randomSpawn.maxY - self._p.randomSpawn.minY) + self._p.randomSpawn.minY,
								z: self._origin.z + Math.random() * (self._p.randomSpawn.maxZ - self._p.randomSpawn.minZ) + self._p.randomSpawn.minZ
							}
						}


						var targetPos = {
							x: pos.x + Math.random() * (self._p.targetPosition.maxX - self._p.targetPosition.minX) + self._p.targetPosition.minX,
							y: pos.y + Math.random() * (self._p.targetPosition.maxY - self._p.targetPosition.minY) + self._p.targetPosition.minY,
							z: pos.z + Math.random() * (self._p.targetPosition.maxZ - self._p.targetPosition.minZ) + self._p.targetPosition.minZ
						}



						if (self._p.systemShape === "sphere") {

							// Calculate Distance
							var dx = targetPos.x - pos.x
							var dy = targetPos.y - pos.y
							var dz = targetPos.z - pos.z

							var dis = (dx * dx) + (dy * dy) + (dz * dz)
							var distance = Math.sqrt(dis)

							if (distance > self._p.targetRadius) {
								var mi = distance - self._p.targetRadius

								targetPos.x = targetPos.x - mi
								targetPos.y = targetPos.y - mi
								targetPos.z = targetPos.z - mi
							}

						}

						// align particles
						particle.position.copy(pos)
						//initial particle size, 0
						particle.scale.copy(self._p.initialScale)
						// store particles in array
						self._particlesArray.push(particle)
						// add to scene
						self._group.add(particle)
						particlesArray.push(particle)

						// Scale Animation
						TweenMax.to(particle.scale, self._p.inTiming, {
							x: self._p.targetStartScale.x,
							y: self._p.targetStartScale.y,
							z: self._p.targetStartScale.z,
							onUpdate: () => {
								self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
							}
						})


						if (self._p.linearTarget) {
							TweenMax.to(particle.position, self._p.targetTiming, {
								// only increase y position
								y: targetPos.y,
								onUpdate: () => {
									self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
								},
								onComplete: () => {
									TweenMax.to(particle.scale, self._p.outTiming, {
										x: self._p.targetEndScale.x,
										y: self._p.targetEndScale.y,
										z: self._p.targetEndScale.z,
										onUpdate: () => {
											self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
										},
										onComplete: () => {

											for (var o = 0; o < particlesArray.length; o++) {
												particlesArray[o].material.dispose()
												particlesArray[o].material.dispose()
												self._group.remove(particlesArray[o])
											}
											/*particle.material.dispose()
											particle.geometry.dispose()
											self._group.remove(particle)*/

										}
									})
								}
							})
						} else {
							TweenMax.to(particle.position, self._p.targetTiming, {
								x: targetPos.x, //self._p.loopSetting.positions.x
								y: targetPos.y,
								z: targetPos.z,
								onUpdate: () => {
									self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
								},
								onComplete: () => {

										TweenMax.to(particle.scale, self._p.outTiming, {
											x: self._p.targetEndScale.x,
											y: self._p.targetEndScale.y,
											z: self._p.targetEndScale.z,
											onUpdate: () => {
												self._p.updateY ? particle.rotation.y = Math.atan2((particle.position.x - CAMERA.position.x), (particle.position.z - CAMERA.position.z)) : false
											},
											onComplete: () => {

												for (var o = 0; o < particlesArray.length; o++) {
													particlesArray[o].material.dispose()
													particlesArray[o].material.dispose()
													self._group.remove(particlesArray[o])
												}
												particle.material.dispose()
													particle.geometry.dispose()
													self._group.remove(particle)

											}
										})
								}
							})
						}


					}



				}

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