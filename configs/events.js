var $F = require("./functions");

module.exports = function(app,$ee){
	// configuration object updated
	$ee.on("configs_updated",function(configs){
		$F.sharedUpdate(configs);
		console.log("server.js", $F);
	})

}