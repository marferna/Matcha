const db = require('./fill.js');

db.fill(532).then((response) => {
	if (response == "ok") {
		console.log("la db a été remplie");
	}
})