var fs = require("fs");
var $F = require("./functions");
var Configs = require("../models/configs");

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
				if(file.length <= 0 && $F.shared.db_status === "connected") {
					//IF FILE IS EMPTY BUT MONGO IS CONNECTED FETCH CONFIG FROM DB
					Configs.findOne(function(err,configs){
						fs.writeFile(global.appRoot+"/bin/config.json", JSON.stringify(configs), function(err){

						});
						console.log("routines.js REFETCH:", configs);
					});
				}
			});
		}else if (change === "rename") {
			//stand for DELETED
			
		}
	});
}

//TO DO CASE, IF DATABSE IS DROPPED BUT FILE WITH CONF EXIST RECONFIGURE AUTOMATICALLI TABLES FROM IT