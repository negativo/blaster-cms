var fs = require("fs");
var $F = require("./functions");
var Configs = require("../models/configs");

module.exports = function(app,$ee){

	//keep in sync conf.json with DB
	// fs.watch(global.appRoot+"/bin/config.json",function(change,file){
	// 	console.log("routines.js", change);
	// 	if (change === "change" ){
	// 		//GLOBAL DB CONNECTION&REFRESH
	// 		$ee.emit("config_file_changed","Warning: Configuration file changed by humans, error may occure")
	// 		fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
	// 			if(file.length <= 0 && app.get("mongo_db") ) {
					
	// 				//GET DB_LINK FROM DB IF IT'S CONNECTED
	// 				Configs.findOne({},{ "db_link":1 },function(err,configs){
	// 					fs.writeFile(global.appRoot+"/bin/config.json", JSON.stringify(configs), function(err){
	// 						console.log("routines.js REFETCH:", err);
	// 					});
	// 				});
	// 			}
	// 		});
	// 	}else if (change === "rename") {
	// 		fs.open(global.appRoot+"/bin/config.json","w");
	// 		if( app.get("mongo_db") ) {
	// 			//IF FILE IS EMPTY BUT MONGO IS CONNECTED FETCH CONFIG FROM DB
	// 			Configs.findOne(function(err,configs){
	// 				fs.writeFile(global.appRoot+"/bin/config.json", JSON.stringify(configs), function(err){
	// 					console.log("routines.js REFETCH:", err);
	// 				});
	// 			});
	// 		}			
	// 	}
	// });
}

//TO DO CASE, IF DATABSE IS DROPPED BUT FILE WITH CONF EXIST RECONFIGURE AUTOMATICALLY TABLES FROM IT