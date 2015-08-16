var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	fs = require("fs"),
	Users = require("../models/user"),
	Configs = require("../models/configs"),
	Posts = require("../models/posts"),
	Pages = require("../models/pages"),
	toSlug = require('to-slug-case');

var base_url = global.base_url;
	
//Controllers
var GET = {
	loginPageCtrl:function(req,res){
		//clean req shared before sending.
		var data = req.shared;
			data.title = req.shared.title + " Login";
		for (prop in data) if( prop !== "title") delete data[prop];
		data =  $F.dataParser(data,"class","login-page");
		var currentUser = $F.dataParser({});
		res.render("login", { backend: data, currentUser: currentUser } );
	},
	dashboardPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Dashboard";
		var data =  $F.dataParser(req.shared);
		var currentUser = $F.dataParser(req.user);
		res.render("panel", { backend: data, currentUser: currentUser });
	},
	postsPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Posts";
		Posts.find({},{ body:0 }, function(err, posts){
			if(posts !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"posts",posts);
				var currentUser = $F.dataParser(req.user);
				res.render("posts", { backend: data, currentUser: currentUser });
			}
		});
	},
	pagesPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Pages";
		Pages.find({},{ content:0 }, function(err, pages){
			if(pages !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"pages",pages);
				var currentUser = $F.dataParser(req.user);
				res.render("pages", { backend: data, currentUser: currentUser });
			}
		});
	},
	usersPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Users";
		Users.find({},{ password:0 }, function(err, users){
			if(users !== null && req.isAuthenticated() ) {
				var data =  $F.dataParser(req.shared,"users",users);
				var currentUser = $F.dataParser(req.user);
				res.render("users", { backend: data, currentUser: currentUser });
			}
		});
	},
	configurationsPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Configurations";
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
		req.shared.title = req.shared.title + " New Post";
			var data =  $F.dataParser(req.shared);
			var currentUser = $F.dataParser(req.user);
			res.render("editor", { backend: data, currentUser: currentUser, editor: "post" });
	},
	newPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " New Page";
			Configs.findOne({},{ siteTemplate:1 }, function(err, templates){
				if(templates === null) return;
				var data =  $F.dataParser(req.shared,"templates",["test","test2"]);
				var currentUser = $F.dataParser(req.user);
				res.render("editor", { backend: data, currentUser: currentUser, editor: "page" });
			});
	},
	editSinglePost:function(req,res){
		if( req.params.id ){
			var postId = req.params.id;
			Posts.findById( postId ,function(err,singlePost){
				console.log("private-request.js", singlePost );
				req.shared.title = singlePost.title + " edit";
				var data =  $F.dataParser(req.shared);
				var currentUser = $F.dataParser(req.user);
				res.render("editor", { backend: data, currentUser: currentUser, editor:"post", single: singlePost });
			});
		}
	},	
	editSinglePage:function(req,res){
		req.shared.title = req.shared.title + " Configurations";
		if( req.params.id ){
			var pageId = req.params.id;
			Pages.findById( pageId ,function(err,singlePage){
				console.log("private-request.js", singlePage );
				req.shared.title = singlePage.title + " edit";
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
	editSinglePost:function(req,res){
		console.log("private-request.js", req.body);
		var postId = req.body.id;
		Posts.findById( postId ,function(err,singlePost){
			console.log("private-request.js", singlePost );
			singlePost.title = req.body.title;
			singlePost.body = req.body.body;
			singlePost.slug = toSlug(req.body.title);
			singlePost.save(function(err){
				if (err) throw err;
				res.send(200);
			});
		});
	},
	editSinglePage:function(req,res){
		console.log("private-request.js", req.body);
		var pageId = req.body.id;
		Pages.findById( pageId ,function(err,singlePage){
			console.log("private-request.js", singlePage );
			singlePage.title = req.body.title;
			singlePage.content = req.body.body;
			singlePage.slug = toSlug(req.body.title);
			singlePage.save(function(err){
				if (err) throw err;
				res.send(200);
			});
		});
	}
};



exports.GET = GET;
exports.POST = POST;