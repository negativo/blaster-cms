var fs = require("fs");
var $F = require("./functions");

module.exports = function($ee){

	//WATCH FOR CONFIGURATION FILE CHANGE AND SYNC WITH SERVER ENV AND MONGODB
	fs.watch(global.appRoot+"/bin/config.json",function(change,file){
		console.log("routines.js", change);
		if (change === "change" ){
			//GLOBAL DB CONNECTION&REFRESH
			$ee.emit("config_file_changed","Warning: Configuration file changed by humans, error may occure")
			fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
				if(file.length > 0) { 
					var configs = JSON.parse(file);
					$F.syncConfig(configs,$ee);
				}
			});
		}else if (change === "rename") {
			//stand for DELETED
			
		}
	});
}

