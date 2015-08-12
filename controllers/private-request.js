var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	Users = require("../models/user"),
	Configs = require("../models/configs"),
	Posts = require("../models/posts"),
	Pages = require("../models/pages");

var base_url = global.base_url;
	
//Controllers
var GET = {
	loginPageCtrl:function(req,res){
		res.render("login" );
	},
	dashboardPageCtrl:function(req,res){
		var data =  $F.dataParser(req.shared);
		var currentUser = $F.dataParser(req.user);
		res.render("panel", { backend: data, currentUser: currentUser });
	},
	postsPageCtrl:function(req,res){
		Posts.find({}, function(err, posts){
			if(posts !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"posts",posts);
				var currentUser = $F.dataParser(req.user);
				res.render("posts", { backend: data, currentUser: currentUser });
			}
		});
	},
	pagesPageCtrl:function(req,res){
		Pages.find({}, function(err, pages){
			if(pages !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"pages",pages);
				var currentUser = $F.dataParser(req.user);
				res.render("pages", { backend: data, currentUser: currentUser });
			}
		});
	},
	usersPageCtrl:function(req,res){
		Users.findOne({}, function(err, users){
			if(users !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"users",users);
				var currentUser = $F.dataParser(req.user);
				res.render("users", { backend: data, currentUser: currentUser });
			}
		});
	},
	configurationsPageCtrl:function(req,res){
		Configs.findOne({}, function(err, configs){
			if(configs !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"configs",configs);
				var currentUser = $F.dataParser(req.user);
				res.render("configs", { backend: data, currentUser: currentUser });
			}
		});
	}
};

var POST = {
	loginCtrl:function(req,res){
		//console.log("routes.js", req.session);
		res.json({ err:undefined });
	}
};



exports.GET = GET;
exports.POST = POST;