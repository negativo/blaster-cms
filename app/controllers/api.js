module.exports = function(app){


	var $utils  = require("../lib/utils")(app),
	cms_installer  = require('../configs/installer'),
	toSlug  = require('to-slug-case'),
	User    = require("../models/user"),
	Configs = require("../models/configs"),
	Post    = require("../models/posts"),
	Page    = require("../models/pages"),
	Comment = require("../models/comments");
	
	return {
		install_index: function(req,res){
			app.set("views", app.locals.__root + "/installer" );
			res.render('install');
		},
		install_mongo:function(req,res){
			$utils.checkDatabase(req.body)
				.then(function(promise){
					res.send(promise);
				})
				.catch(function(err){
					console.log("api-request.js :51 >>>>>>>>", err);
					res.send(err);
				});
		},
		install_cms:function(req,res){
			cms_installer.install(app,req.body)
			.then(function(promise){
				console.log("api-request.js :58", promise);
				req.isInstalled = true;
				res.send(promise);
			})
			.fail(function(error){
				console.log("api-request.js :58", error);
				res.send(error);
			});
		},
		search_term: function(req,res){
			console.log("api-request.js :149", req.body);
			Post.find({ "title": new RegExp(req.body.name) }, function(err,post){
				if(post) res.send(post)
					else res.send(err)
			});
		},
	};

}


	