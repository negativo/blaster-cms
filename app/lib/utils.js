var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q");

module.exports = function(app){
	var __app 				 = app.locals.__app,
			__root         = app.locals.__root;

	var installer = require('./installer');

	var utils = {
		connectDatabase:function(URI,$ee){ 
			var options = { replset:{ socketOptions:{} }, server:{ socketOptions:{} } };
			options.replset.socketOptions = { keepAlive: 1 };
			options.server.socketOptions = { keepAlive: 1 };
			mongoose.connect(URI, options);
		},
		dataParser:function(original,name,add){
			if(typeof original === "string" ){ 
				original = JSON.parse(original); 
				if( name && add ) original[name] = add;
			} else {
				if( name && add ) original[name] = add;
			}
			return JSON.stringify(original);
		},
		isInstalled: function(){
			var Config = require("../models/configs");

			Config.findOne({},function(err,data){
				if(err) console.log("utils.js :45", err);

				if(!err && data) {
					app.set('is_installed', true);
				}

				if(!err && !data) {
					installer.install(app)
					.then(function(data){
						app.set('is_installed', true);
						console.log("utils.js :40", data);
					},function(err){
						console.log("utils.js :42", err);
					})
				}
			});
			
		}
	};

	return utils;

}

