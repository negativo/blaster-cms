var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	fs = require("fs"),
	Users = require("../models/user"),
	Configs = require("../models/configs"),
	Posts = require("../models/posts"),
	Pages = require("../models/pages");

var base_url = global.base_url;
	
//Controllers
var GET = {
	loginPageCtrl:function(req,res){
		//clean req shared before sending.
		var data = req.shared;
		for (prop in data) if( prop !== "title") delete data[prop];
		data =  $F.dataParser(data,"class","login-page");
		var currentUser = $F.dataParser({});
		res.render("login", { backend: data, currentUser: currentUser } );
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
		Users.find({},{ password:0 }, function(err, users){
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
	},
	//CRUD
	editPostCtrl:function(req,res){
			var data =  $F.dataParser(req.shared);
			var currentUser = $F.dataParser(req.user);
			res.render("edit-post", { backend: data, currentUser: currentUser });
	},
	editPageCtrl:function(req,res){
			// search for -page-template.ejs suffixed file to use them as template
			// fs.readdir( __dirname + "/views/" + global.siteTemplate , function(err, files){
			// 	var r = /\-page-template.[0-9a-z]+$/i;
			// 	for (var i = 0; i < files.length; i++) {
			// 		var x = files[i].match(r);
			// 		console.log("server.js", x);
			// 	};	
			// });

			Configs.findOne({},{ siteTemplate:1 }, function(err, templates){
				if(templates === null) return;
				var data =  $F.dataParser(req.shared,"templates",templates);
				var currentUser = $F.dataParser(req.user);
				res.render("edit-page", { backend: data, currentUser: currentUser });
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