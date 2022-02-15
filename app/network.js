var Network = {
	check: function() {
		// Check Connection
		if (navigator.connection.type === "none") {
			$("#networkStat-line").css("background", "red")
		} else {
			$("#networkStat-line").css("background", "green")
		}
		
		// Listen for Connection Change
		
		navigator.connection.ontypechange = function() {
			if (navigator.connection.type === "none") {
			$("#networkStat-line").css("background", "red")
		} else {
			$("#networkStat-line").css("background", "green")
		}

		}
	}
}

var Battery = {
	update: function() {
		navigator.getBattery().then(e => {
			var p = 100 * e.level;
			var color = "#00FF27" // green

			if (20 > p) {
				color = "#FF2400"
			} else {
				color = "#00FF27"
			}

			$("#battery-percent").css({
				width: `${p}%`,
				backgroundColor: color
			})
			
			// listen for level increase change
			e.onlevelchange = function(ee) {
				p = 100 * ee.target.level

				if (20 > p) {
					color = "#FF2400"
				} else {
					color = "#00FF27"
				}

				$("#battery-percent").css({
					width: `${p}%`,
					backgroundColor: color
				})

			}
		})
	}
}

export { Network, Battery }