var fs = require("fs");
var __root = global.appRoot;
var mongoose = require("mongoose");
var Q = require("q");
var crypto = require("../library/crypto");

//get DB models
var User = require("../models/user.js");
var Blog = require("../models/blog.js");

var blogSetup = {
	link:"",
	isInstalled: function(){
		var deferred = Q.defer();
		fs.exists(__root + "/blog.config", function(exists){
			return deferred.resolve(exists);
		})
		return deferred.promise;
	},
	checkMongo:function(mongo){
		//console.log("mongolink:",mongo);
		var testConnection = function(){
			var deferred = Q.defer();
			mongoose.connect(mongo.link,function(err){
				//RESOLVE PROMISE
				if (err) deferred.reject({ err: err, status: 400 });
				if(!err) {
					deferred.resolve({ err: null, status: 200 });
					//if connection is right save link to reuse later
					blogSetup.link = mongo.link;
				}
				mongoose.disconnect();
			});
			return deferred.promise;
		}
		
		return testConnection();
		
	},
	getUserInfo:function(data){
		//this.install(data);
		if(data) return blogSetup.install(data);
	},
	install:function(user){
		//file generated from this
		var blogConfig = {
			db:crypto.encrypt(blogSetup.link),
			title:user.blogName,
			author: user.username
		}
		var deferred = Q.defer();
		mongoose.disconnect();
		mongoose.connect(blogSetup.link+"/"+user.blogName,function(err){
			if(!err){
				blogSetup.link = blogSetup.link+"/"+user.blogName;
				var hash = crypto.encrypt(user.password);
				var u = new User({username:user.username, password: hash, admin:true, createdOn: Date.now() });
				u.findOne({username:user.username},function(err,user){
					if(err) deferred.reject({ msg:"User Exists", status:500 });
					console.log(user);
				})
				u.save(function(err){
					if(err) console.log("first user install err:",err);
				});
				//write config file
				fs.exists("./blog.config",function(exists){
					//console.log(exists);
					if(!exists){
						fs.open("./blog.config","w",function(file){});
						fs.writeFile("./blog.config", JSON.stringify(blogConfig) ,function(err){
							if (err) console.log("write blog.config file error:",err)
						});
					}
				});
				deferred.resolve({ msg:"Installation OK ", status:200 });
			}else{
				deferred.reject({ msg:err, status:500 });
			}
		});
		return deferred.promise;

	}

}//endmodule

module.exports = blogSetup;