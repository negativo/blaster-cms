var mongoose = require("mongoose");
fs           = require("fs"),
Q            = require("q"),
User         = require("../models/user"),
Configs      = require("../models/configs"),
Post         = require("../models/posts"),
Page         = require("../models/pages"),	
crypto       = require("../lib/crypto");

exports.install = function(app){
	var deferedInstall = Q.defer();
	var confData = {};

	function createUser(){
		var deferred = Q.defer();
		User.findOne({"username": process.env.ADMIN_USERNAME },function(err,user){
			console.log("installer.js :29", err);
			if (err) deferred.reject({err:err, message:"error finding existing user"});
			if(!user) {
				new User({ username: process.env.ADMIN_USERNAME, password:  process.env.ADMIN_PASSWORD, admin:true, role:"admin" })
				.save(function(err,user){
					if(err) deferred.reject({err:err, message:"error saving user"})

					//post
					new Post({
						publishedBy:{
							user:user._id,
						}
					}).save();
					
					// page
					new Page({
						publishedBy:{
							user:user.password,
						}
					}).save();

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