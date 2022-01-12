import * as THREE from '../src/three.js'


function CharacterControls(scene, model, orbitControl, camera) {

	const self = this

	self.model = model
	self.orbitControl = orbitControl
	self.camera = camera
	self.scene = scene


	//state
	// temporary data
	self.walkDirection = new THREE.Vector3()
	self.rotateAngle = new THREE.Vector3(0, 1, 0)
	self.rotateQuarternion = new THREE.Quaternion()
	self.cameraTarget = new THREE.Vector3()

	self.update = function(delta, key, light, firing) {

		let isTrue = false

		if (key === "N" ||
			key === "S" ||
			key === "W" ||
			key === "E" ||
			key === "NW" ||
			key === "NE" ||
			key === "SW" ||
			key === "SE") {

			isTrue = true
		}

		// Bullet firing

		// update bullets


		if (isTrue && window.gobo) {
			// diagonal movement angle offset
			var directionOffset = self.directionOffset(key)

			// update quaternions
			var angleYCameraDirection = Math.atan2((self.camera.position.x - self.model.position.x),(self.camera.position.z - self.model.position.z))
	
			//var angle = angleYCameraDirection + directionOffset
			//self.model.rotation.y = angle
		
			self.rotateQuarternion.setFromAxisAngle(self.rotateAngle, angleYCameraDirection + directionOffset)
			self.model.quaternion.rotateTowards(self.rotateQuarternion, .15)
			
			// calculate direction
			self.camera.getWorldDirection(self.walkDirection)
			self.walkDirection.y = 0
			self.walkDirection.normalize()

			self.walkDirection.applyAxisAngle(self.rotateAngle, directionOffset)

			const velocity = hero.velocity

			// move model & camera
			window.moveX = self.walkDirection.x * velocity * delta
			window.moveZ = self.walkDirection.z * velocity * delta

			self.model.position.x = self.model.position.x + moveX
			self.model.position.z = self.model.position.z + moveZ


			/*if (self.model.position.x > 100) {
				self.model.position.x = 100
				self.camera.position.copy(self.camera.position)
			} else if (self.model.position.x < -100) {
				self.model.position.x = -100
				self.camera.position.copy(self.camera.position)

			} else if (self.model.position.z > 100) {
				self.model.position.z = 100
				self.camera.position.copy(self.camera.position)

			} else if (self.model.position.z < -100) {
				self.model.position.z = -100
				self.camera.position.copy(self.camera.position)
			}*/
			
			// Check boundings
			
			if (Math.abs(self.model.position.x) >= window.borderwidth) {
				hero.hurt(2)
				
			} else if(Math.abs(self.model.position.z) >= window.borderwidth){
				hero.hurt(2)
			}

			self.updateCameraTarget(moveX, moveZ)
			isTrue = false
			window.gunrange.position.copy(self.model.position)
			light.position.set(self.model.position.x, 1.5, self.model.position.z)
			//	return {x: self.model.position.x+moveX, y: self.model.position.y, z: self.model.position.z+moveZ}
		}

		return false
	}


	self.updateCameraTarget = function(moveX, moveZ) {

			self.camera.position.x += moveX
			self.camera.position.z += moveZ
			
			
			self.cameraTarget.x = self.model.position.x
			self.cameraTarget.y = self.model.position.y
			self.cameraTarget.z = self.model.position.z
			self.orbitControl.target = self.cameraTarget


		// update camera target 

		self.camera.lookAt(self.model.position)

	}

	self.directionOffset = function(key) {
		var directionOffset = 0 // w

		switch (key) {
			case "S":
				directionOffset = Math.PI
				break;
			case "W":
				directionOffset = Math.PI / 2
				break;
			case "E":
				directionOffset = -Math.PI / 2
				break;
			case "NE":
				directionOffset = -Math.PI / 4
				break;
			case "NW":
				directionOffset = Math.PI / 4
				break;
			case "SW":
				directionOffset = Math.PI / 4 + Math.PI / 2
				break;
			case "SE":
				directionOffset = -Math.PI / 4 - Math.PI / 2
				break;
			default:
				directionOffset = 0
		}

		return directionOffset
	}
}

export { CharacterControls }