var mongoose = require("mongoose");
var Blog = require("../models/blog.js");
var Q = require("q");
var install = require("../controllers/install");

module.exports = {
	render:{
			header:{
				title:"Blog",
				author:"Author"
			},
			footer:{},
			local:{}
	},
	refreshData: function(){
		var deferred = Q.defer();
		Blog.findOne(function(err,blog){
			if (!err) deferred.resolve(blog);
				else deferred.reject(err);
		});
		return deferred.promise;
	},
	dbConnect:function(link){
		var deferred = Q.defer();
		mongoose.connect(link,function(err){
			console.log("common.js MongoConnection:", err);
			if (err) return deferred.reject(err);
			return deferred.resolve("OK");
		});
		return deferred.promise;
	},
	isBlogInstalled:function(){
		install.isInstalled()
			.then(function(installed){
				return installed;
			})
			.fail(function(installed){
				return installed;
			});
	}
}