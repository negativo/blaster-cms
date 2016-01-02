var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q"),
User         = require("../models/user"),
Configs      = require("../models/configs"),
Post         = require("../models/posts"),
Page         = require("../models/pages"),	
crypto       = require("../lib/crypto"),
Message      = require("../lib/message-helper").message;


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
		changePwd:function(userId, password, newPwd){
			var deferred = Q.defer();
			User.findById( userId,{ password:1 }, function(err,user){
				if(user) {
					if( user.comparePassword(password) ){
						user.password = crypto.bcrypt.encrypt(newPwd);
						user.save(function(err,saved){
							console.log("functions.js :47", err, saved);
							if (err === null) deferred.resolve("Password changed");
							if (err !== null) deferred.reject("error while saving " + err);
						});
					}else{
						deferred.reject("current password incorrect ");
					};
				}
				if(err) {
					deferred.reject("user not found " + err);
				}
			});
			return deferred.promise;
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
		register:function(newUser){
			var deferred = Q.defer();
			new User({ 
				username:newUser.username, 
				password:crypto.bcrypt.encrypt(newUser.password),  
				role:"guest"
			}).save(function(err,user){
				if ( err === null ) return deferred.resolve(new Message("User Created!"));
				return deferred.reject( new Message(null, "Error saving user, try again!") );
			});
			
			return deferred.promise;
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

