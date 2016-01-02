var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q");

module.exports = function(app){
	var __app 				 = app.locals.__app,
			__root         = app.locals.__root;

	var utils = {
		connectDatabase:function(URI,$ee){ 
			var options = { replset:{ socketOptions:{} }, server:{ socketOptions:{} } };
			options.replset.socketOptions = { keepAlive: 1 };
			options.server.socketOptions = { keepAlive: 1 };
			mongoose.connect(URI, options);
			$ee.emit("mongo_global","mongo_global");
		},
		checkDatabase:function(mongo){
			var testConnection = function(){
				var deferred = Q.defer();
				mongoose.connect(mongo.link,function(err){
					if (err) deferred.reject({ err: err, status: 400 });
					if (!err) {
						deferred.resolve({ err: null, status: 200 });
						app.set('db_link', mongo.link);
					}
					mongoose.disconnect();
				});
				return deferred.promise;
			}
			return testConnection();		
		}, 
		dataParser:function(original,name,add){
			if(typeof original === "string" ){ 
				original = JSON.parse(original); 
				if( name && add ) original[name] = add;
			} else {
				if( name && add ) original[name] = add;
			}
			return JSON.stringify(original);
		}
	};

	return utils;

}

