// var fs = require("fs");
// var __root = global.appRoot;
// var mongoose = require("mongoose");
// var Q = require("q");
// var crypto = require("../library/crypto");
// var $S = require("../configs/functions").shared;

// //get DB models
// var User = require("../models/user.js");
// var Blog = require("../models/blog.js");

// var blogSetup = {
// 	// getUserInfo:function(data){
// 	// 	//this.install(data);
// 	// 	if(data) return blogSetup.install(data);
// 	// },
// 	install:function(user){
// 		//file generated from this
// 		var blogConfig = {
// 			db:crypto.encrypt(blogSetup.link),
// 			title:user.blogName,
// 			author: user.username
// 		}
// 		var deferred = Q.defer();
// 		mongoose.disconnect();
// 		mongoose.connect(blogSetup.link+"/"+user.blogName,function(err){
// 			if(!err){
// 				blogSetup.link = blogSetup.link+"/"+user.blogName;
// 				var hash = crypto.encrypt(user.password);
// 				var u = new User({username:user.username, password: hash, admin:true, createdOn: Date.now() });
// 				User.findOne({ 'username': user.username }, function (err, person) {
// 				  //save user
// 				  if (person) return deferred.reject({ msg:"User exists.", status:500 });
// 					u.save(function(err){
// 						if(err) console.log("first user install err:",err);
// 					});
// 					//save blog info
// 					var b = new Blog({ title: user.blogName, createdOn: Date.now() });
// 					b.save(function(err){
// 						console.log("install.js, saving blog to database:", err);
// 					});
// 					deferred.resolve({ msg:"Installation OK ", status:200 });
// 				});
// 			}else{
// 				deferred.reject({ msg:err, status:500 });
// 			}
// 		});
// 		return deferred.promise;
// 	}

// }//endmodule

// module.exports = blogSetup;