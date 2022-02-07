import * as Sounds from '../app/audio.js'

var JoyStick = (function(container, parameters)
{

	parameters = parameters || {};
	var title = parameters.title,
		width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
		height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
		internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#00AA00" : parameters.internalFillColor),
		internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
		internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
		externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
		externalStrokeColor = (typeof parameters.externalStrokeColor === "undefined" ? "#008000" : parameters.externalStrokeColor),
		autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);

	var internalRadius
	var maxMoveStick
	var externalRadius
	var centerX
	var centerY
	// Used to save current position of stick
	var movedX
	var movedY
	var circumference
	// Create Canvas element and add it in the Container object
	var objContainer = document.getElementById(container);
	var canvas;
	var bulc;

	canvas = document.createElement("canvas");
	canvas.id = title;
	objContainer.appendChild(canvas);
	var context = canvas.getContext("2d");
	if (width === 0) { width = objContainer.clientWidth; }
	if (height === 0) { height = objContainer.clientHeight; }
	canvas.width = width;
	canvas.height = height;
	circumference = 2 * Math.PI
	internalRadius = (canvas.width - ((canvas.width / 2) + 10)) / 3;
	maxMoveStick = internalRadius + 5;
	externalRadius = internalRadius + 30;
	centerX = canvas.width / 2;
	centerY = canvas.height / 2;
	// Used to save current position of stick
	movedX = centerX;
	movedY = centerY;


	var pressed = 0; // Bool - 1=Yes - 0=No
	var offSet = $(`#${title}`).offset()


	var boxAreaX = canvas.width / 3
	var boxAreaY = canvas.height / 3

	// Check if the device support the touch or not
	if ("ontouchstart" in document.documentElement)
	{

		canvas.addEventListener("touchstart", onTouchStart, false);
		//	canvas.addEventListener("touchstart", onTouchStart, false);
		canvas.addEventListener("touchmove", onTouchMove, false);
		canvas.addEventListener("touchend", onTouchEnd, false);

	}
	else if ("onkeydown" in document.documentElement)
	{
		document.addEventListener("keydown", onKeyDown, false);
		document.addEventListener("keyup", onKeyUp, false);
	}
	// Draw the object

	drawInternal();


	function drawInternal()
	{
		context.beginPath();
		if (movedX < internalRadius) { movedX = maxMoveStick; }
		if ((movedX + internalRadius) > canvas.width) { movedX = canvas.width - (maxMoveStick); }
		if (movedY < internalRadius) { movedY = maxMoveStick; }
		if ((movedY + internalRadius) > canvas.height) { movedY = canvas.height - (maxMoveStick); }
		context.arc(movedX, movedY, internalRadius, 0, circumference, false);
		// create radial gradient
		var grd = context.createRadialGradient(centerX, centerY, 5, centerX, centerY, 200);
		// Light color
		grd.addColorStop(0, internalFillColor);
		// Dar mok color
		grd.addColorStop(1, internalStrokeColor);
		context.fillStyle = "white";
		context.fill();

	}

	/**
	 * @desc Events for manage touch
	 */
	function onTouchStart(event)
	{
		drawInternal()

	}

	function onTouchMove(event)
	{

		if (container === "joystick") {
			// Prevent the browser from doing its default thing (scroll, zoom)
			event.preventDefault();
			if (event.targetTouches[0].target === canvas && window.gobo)
			{


				joy.GetDir()


				movedX = event.targetTouches[0].pageX;
				movedY = event.targetTouches[0].pageY;
				// Manage offset
				if (canvas.offsetParent.tagName.toUpperCase() === "BODY")
				{
					movedX -= canvas.offsetLeft;
					movedY -= canvas.offsetTop;
				}
				else
				{
					movedX -= canvas.offsetParent.offsetLeft;
					movedY -= canvas.offsetParent.offsetTop;
				}
				// Delete canvas
				context.clearRect(0, 0, canvas.width, canvas.height);
				// Redraw object

				drawInternal();


			} else {
				context.clearRect(0, 0, canvas.width, canvas.height);
				// Redraw object

				movedX = centerX;
				movedY = centerY;

				drawInternal();
			}
		} else if (container === "skillpad") {
			// Prevent the browser from doing its default thing (scroll, zoom)
			event.preventDefault();
		//	if (event.targetTouches[0].target === canvas && window.gobo)
		//	{


				skillPad.GetDirSkill(event)


				movedX = event.targetTouches[0].pageX;
				movedY = event.targetTouches[0].pageY;
				// Manage offset
				if (canvas.offsetParent.tagName.toUpperCase() === "BODY")
				{
					movedX -= canvas.offsetLeft;
					movedY -= canvas.offsetTop;
				}
				else
				{
					movedX -= canvas.offsetParent.offsetLeft;
					movedY -= canvas.offsetParent.offsetTop;
				}
				// Delete canvas
				context.clearRect(0, 0, canvas.width, canvas.height);
				// Redraw object

				drawInternal();


			/*} else {
				context.clearRect(0, 0, canvas.width, canvas.height);
				// Redraw object

				movedX = centerX;
				movedY = centerY;

				drawInternal();
			}*/
		}

	}

	function onTouchEnd(event)
	{
		
		if (container === "skillpad"){
			window.skillFunc(window.enemies)
		}
		
		//	pressed = 0;
		keyPressed = ""

		// If required reset position store variable
		if (autoReturnToCenter)
		{
			movedX = centerX;
			movedY = centerY;
		}

		// Delete canvas
		context.clearRect(0, 0, canvas.width, canvas.height);
		// Redraw object
		drawInternal();

		//canvas.unbind('touchmove');
	}

	/**
	 * @desc Events for manage mouse
	 */

	function onKeyDown(event)
	{
		joy.GetMouseDir(event);
	}

	function onMouseUp(event)
	{
		keyPressed = ""
	}

	this.GetDir = function()
	{

		/*	var eX = e.clientX - offSet.left
			var eY = e.clientY - offSet.top
			
			if (eX >= centerX) {
				eX = eX - centerX
				
			} else {
				eX = -(centerX - eX)
			}
			
			if (eY >= centerY) {
				eY = centerY - eY
			} else {
				eY = -(eY - centerY)
			}
			
			eX = eX / centerX
			eY = eY / centerY
			
			eX >= 1 ? eX = 1 : eX = eX
			eY >= 1 ? eY = 1 : eY = eY
			
			eX <= -1 ? eX = -1 : eX = eX
			eY <= -1 ? eY = -1 : eY = eY
			
			keyPressed = {
				x: eX,
				z: eY
			}*/

		var horizontal = movedX;
		var vertical = movedY;

		if (vertical >= 0 && vertical <= boxAreaY) {
			keyPressed = "N"
			if (horizontal >= 0 && horizontal <= boxAreaX) {
				keyPressed = "NW"
			} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
				keyPressed = "NE"
			}

		} else if (vertical >= boxAreaY * 2 && vertical <= boxAreaY * 3) {
			keyPressed = "S"
			if (horizontal >= 0 && horizontal <= boxAreaX) {
				keyPressed = "SW"
			} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
				keyPressed = "SE"
			}

		} else if (horizontal >= 0 && horizontal <= boxAreaX) {
			keyPressed = "W"
		} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
			keyPressed = "E"
		}


		return;
	};

	this.GetMouseDir = function(e)
	{

		/*	var eX = e.clientX - offSet.left
			var eY = e.clientY - offSet.top
			
			if (eX >= centerX) {
				eX = eX - centerX
				
			} else {
				eX = -(centerX - eX)
			}
			
			if (eY >= centerY) {
				eY = centerY - eY
			} else {
				eY = -(eY - centerY)
			}
			
			eX = eX / centerX
			eY = eY / centerY
			
			eX >= 1 ? eX = 1 : eX = eX
			eY >= 1 ? eY = 1 : eY = eY
			
			eX <= -1 ? eX = -1 : eX = eX
			eY <= -1 ? eY = -1 : eY = eY
			
			keyPressed = {
				x: eX,
				z: eY
			}*/

		if (e.keyCode === 87) {
			keyPressed = "N"

		} else if (e.keyCode === 83) {
			keyPressed = "S"

		} else if (e.keyCode === 63) {
			keyPressed = "W"
		} else if (e.keyCode === 68) {
			keyPressed = "E"
		}
		return;
	}


	this.GetDirSkill = function(event)
	{

		/*	var eX = e.clientX - offSet.left
			var eY = e.clientY - offSet.top
			
			if (eX >= centerX) {
				eX = eX - centerX
				
			} else {
				eX = -(centerX - eX)
			}
			
			if (eY >= centerY) {
				eY = centerY - eY
			} else {
				eY = -(eY - centerY)
			}
			
			eX = eX / centerX
			eY = eY / centerY
			
			eX >= 1 ? eX = 1 : eX = eX
			eY >= 1 ? eY = 1 : eY = eY
			
			eX <= -1 ? eX = -1 : eX = eX
			eY <= -1 ? eY = -1 : eY = eY
			
			keyPressed = {
				x: eX,
				z: eY
			}*/

		var RY;
		
		
		var horizontal = movedX;
		var vertical = movedY;

		if (vertical >= 0 && vertical <= boxAreaY) {
			// N
			RY = 0
			if (horizontal >= 0 && horizontal <= boxAreaX) {
				// NW
				RY = Math.PI / 4
			} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
				// NE
				RY = -Math.PI / 4
			}

		} else if (vertical >= boxAreaY * 2 && vertical <= boxAreaY * 3) {
			// s
			RY = Math.PI
			if (horizontal >= 0 && horizontal <= boxAreaX) {
				// SW
				RY = Math.PI / 4 + Math.PI / 2
			} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
				// SE
				RY = -Math.PI / 4 - Math.PI / 2
			}

		} else if (horizontal >= 0 && horizontal <= boxAreaX) {
			// W
			RY = Math.PI / 2
		} else if (horizontal >= boxAreaX * 2 && horizontal <= boxAreaX * 3) {
			// E
			RY = -Math.PI / 2
		}

		
		// update quaternions
		var angleYCameraDirection = Math.atan2(
			(hero.mesh.position.x - window.CAMERA.position.x),
			(hero.mesh.position.z - window.CAMERA.position.z))

		var angle = angleYCameraDirection + RY

		TweenMax.to(window.skillArrow.rotation, .5, {
			z: RY
		})

		
		//	window.skillArrow.rotation.z = 

		return;
	};

});


export { JoyStick }