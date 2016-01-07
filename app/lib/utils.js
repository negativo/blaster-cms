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
	};

	return utils;

}

