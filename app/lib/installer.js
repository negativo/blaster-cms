var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q"),
User         = require("../models/user"),
Configs      = require("../models/configs"),
Post         = require("../models/posts"),
Page         = require("../models/pages"),	
crypto       = require("../lib/crypto");


var check_database = function(app){
	var Config = require("../models/configs");

	// installation check fired from event.js on mongo successfull connection
	mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_TABLE );

	Config.findOne({},function(err,data){
		if(err) console.log("utils.js :45", err);

		if(!err && data) {
			app.set('is_installed', true);
		}

		if(!err && !data) {
			install(app)
			.then(function(data){
				app.set('is_installed', true);
				process.emit('setup_done');
			},function(err){
				if(err) console.log("utils.js :42", err);
			})
		}
	});
}

var install = function(app){
	var deferedInstall = Q.defer();
	var confData = {};

	function createUser(){
		var deferred = Q.defer();
		User.findOne({"username": process.env.ADMIN_USERNAME },function(err,user){
			if(err) console.log("installer.js :29", err);
			if (err) deferred.reject({err:err, message:"error finding existing user"});
			if(!user) {
				User.setup(function(err, user){					
					if(err) deferred.reject({err:err, message:"error saving user"})

					Post.setup(user._id);
					Page.setup();

					deferred.resolve({message:"User created", user: user});
				});
			} else{
				console.log("installer.js :58", "exists");
				deferred.reject({error:"User Exists", user: user.username });
			}
		});
		return deferred.promise;
	}

	function saveBlogConf(){
		var deferred = Q.defer();

		app.settings.admin        = confData.admin = process.env.ADMIN_USERNAME;
		app.settings.title        = confData.title = process.env.SITENAME;
		app.settings.subtitle     = confData.subtitle = process.env.SITESUBTITLE;
		app.settings.is_installed = confData.isInstalled = true;
		app.settings.home         = confData.home = "home-template";

		new Configs(confData)
		.save(function(err){
			if (err) return deferred.reject({err:err, message:"error saving configurations"});
		});

		deferred.resolve({message:"User&Blog Created", err:null });
		
		return deferred.promise;
	}

	/**
	 * RESOLVE ALL INSTALLATION PROMISE
	 */
	createUser()
	.then(saveBlogConf)
	.then(function(promise){
		deferedInstall.resolve(promise);
	})
	.catch(function(error){
		deferedInstall.reject(error);	
	});

	return deferedInstall.promise;

};


exports.check_database = check_database;
