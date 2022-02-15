var Network = {
	check: function() {
		// Check Connection
		if (navigator.connection.type === "none") {
			$("#networkStat-line").css("background", "red")
		} else {
			$("#networkStat-line").css("background", "green")
		}
	}
}


export { Network }