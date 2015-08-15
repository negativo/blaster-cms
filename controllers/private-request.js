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
		Pages.find({},{ content:0 }, function(err, pages){
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
	newPostCtrl:function(req,res){
			var data =  $F.dataParser(req.shared);
			var currentUser = $F.dataParser(req.user);
			res.render("editor", { backend: data, currentUser: currentUser, editor: "post" });
	},
	newPageCtrl:function(req,res){
			Configs.findOne({},{ siteTemplate:1 }, function(err, templates){
				if(templates === null) return;
				var data =  $F.dataParser(req.shared,"templates",["test","test2"]);
				var currentUser = $F.dataParser(req.user);
				res.render("editor", { backend: data, currentUser: currentUser, editor: "page" });
			});
	},
	editSinglePage:function(req,res){
		if( req.params.id ){
			var pageId = req.params.id;
			Pages.findById( pageId ,function(err,singlePage){
				console.log("private-request.js", singlePage );
				var data =  $F.dataParser(req.shared);
				var currentUser = $F.dataParser(req.user);
				res.render("editor", { backend: data, currentUser: currentUser, editor:"page", single: singlePage });
			});
		}
	}
};

var POST = {
	loginCtrl:function(req,res){
		//console.log("routes.js", req.session);
		res.json({ err:undefined });
	},
	editSinglePage:function(req,res){
		console.log("private-request.js", req.body);
		var pageId = req.body.id;
		Pages.findById( pageId ,function(err,singlePage){
			console.log("private-request.js", singlePage );
			singlePage.title = req.body.title;
			singlePage.content = req.body.body;
			singlePage.save(function(err){
				if (err) throw err;
				res.send(200);
			});
		});
	}
};



exports.GET = GET;
exports.POST = POST;