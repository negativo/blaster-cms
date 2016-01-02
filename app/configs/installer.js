var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q"),
User         = require("../models/user"),
Configs      = require("../models/configs"),
Post         = require("../models/posts"),
Page         = require("../models/pages"),	
crypto       = require("../lib/crypto");

exports.install = function(app, cms){
	var deferedInstall = Q.defer();
	var cms = cms;
	var confData = {};

	mongoose.disconnect();

	console.log("installer.js :16", cms);

	function connect(cms){
		var deferred = Q.defer();
		console.log("installer.js :18", app.settings.db_link );
		mongoose.connect(app.settings.db_link ,function(err){
			deferred.resolve({ err:err })
		});
		return deferred.promise;
	}

	function createUser(prev){
		var deferred = Q.defer();
		User.findOne({"username":cms.username},function(err,user){
			console.log("installer.js :29", err);
			if (err) deferred.reject({err:err, message:"error finding existing user"});
			if(!user) {
				new User({ username:cms.username, password:crypto.bcrypt.encrypt(cms.password), admin:true, role:"admin" })
				.save(function(err,user){
					if(err) deferred.reject({err:err, message:"error saving user"})
					//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
					new Post({
						title:"Sample post",
						slug:"sample-post",
						body:"Hello World!",
						publishedBy:{
							user:user._id,
						},
						status:"published"
					}).save();
					new Page({
						slug:"sample-page",
						title:"Sample",
						body:"Hi I'm a page :)",
						publishedBy:{
							user:cms.user,
						},
						status:"published"
					}).save();
					//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
					deferred.resolve({message:"User created", user: user});
				});
			} else{
				console.log("installer.js :58", "exists");
				deferred.reject({error:"User Exists", user: cms.username});
			}
		});
		return deferred.promise;
	}

	function saveBlogConf(prev){
		var deferred = Q.defer();
		app.settings.admin = confData.admin = cms.username;
		app.settings.title = confData.title = cms.title;
		app.settings.subtitle = confData.subtitle = cms.subtitle;
		app.settings.is_installed = confData.isInstalled = true;
		app.settings.home = confData.home = "home-template";
		new Configs(confData)
		.save(function(err){
			if (err) return deferred.reject({err:err, message:"error saving configurations"});
			console.log("installer.js :76", "PRE > SAVE CONF ON FILE");
			fs.writeFileSync( app.locals.__root + "/bin/config.json", JSON.stringify({ db_link: crypto.encrypt(app.settings.db_link) }) );
		});
		deferred.resolve({message:"User&Blog Created", err:null });
		return deferred.promise;
	}

	connect()
	.then(createUser)
	.then(saveBlogConf)
	.then(function(promise){
		deferedInstall.resolve(promise);
	})
	.fail(function(error){
		deferedInstall.reject(err);	
	});

	return deferedInstall.promise;

};