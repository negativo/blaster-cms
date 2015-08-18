var express = require("express"),
	app 	= express(),
	toSlug = require('to-slug-case'),
	$F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Render = require("../lib/render-helper").public;

	
//Controllers
var GET = {
	homeCtrl: function(req,res){
		//static homepage
		if (req.shared.home === "home-template"){
			Post.find({},function(err,posts){
				res.render( "home-template" , new Render(req, { posts:posts }) )
			}).sort({ "publishedBy.date": -1 }).populate("publishedBy.user",{ password:0 });
		}
		// Render chosen page as homepage 
		else{
			Page.findOne({ "_id": req.shared.home },function(err,page){
				if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
				req.shared.title = page.title + " - " + req.shared.title;
				res.render( page.template, new Render(req, { page:page }) );
			});
		}
	},
	singlePageCtrl:function (req, res) {
		var slug = req.params.page.toString();	
		Page.findOne({ "slug": slug },function(err,page){
			console.log("requests.js", page,err);
			if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
			req.shared.title = page.title + " - " + req.shared.title;
			res.render( page.template, new Render(req, { page:page }) );
		});
	},
	singlePostCtrl:function (req, res) {
		var slug = req.params.post;
		Post.findOne({ "slug": slug },function(err,post){
			if(post === null) return res.redirect("/404");
			req.shared.title = post.title + " - " + req.shared.title;
			res.render( post.template, new Render(req, { post:post }) );
		}).populate("publishedBy.user",{ password:0 });
	},
	allPostsCtrl:function(req,res){
		Post.find({}, function(err, posts){
			if(posts !== null) return res.status(200).send(posts);
			res.status(404).send("No posts found");
		});
	},
	allPagesCtrl:function(req,res){
		Page.find({}, function(err, pages){
			if(pages !== null) return res.status(200).send(pages);
			res.status(404).send("No pages found");
		});
	}
};

var POST = {
	install:{
		mongo:function(req,res){
			console.log("requests.js MONGOLINK", req.body);
			//check if err is null in frontend
			$F.checkDatabase(req.body)
				.then(function(promise){
					res.status(promise.status)
					res.send(promise);
				})
				.fail(function(err){
					console.log("requests.js MongoERROR:", err.err);
					res.status(err);
					res.send(err);
				});
		},
		cms:function(req,res){
			$F.installation(req.body)
				.then(function(promise){
					console.log("request.js install promise", promise);
					promise.isInstalled = true;
					res.send(promise);
				})
				.fail(function(err){
					console.log("request.js install promise", err);
					res.send(err);
				}); //if return err:null installation is ok
		}
	},//install methods
	// SAFE TO DELETE AFTER TESTINGS
	// >>
	create:{
		post:function(req,res){
			console.log("routes.js", "/create/post request");
			console.log("POST DATA: ", req.body);
			var post = req.body;
			new Post({
				title: post.title,
				slug: toSlug(post.title),
				body: post.body,
				publishedBy:{
					date:Date.now()
				},
				status:"Published"
			}).save();
			res.send("postcreated");	
		},
		page:function(req,res){
			console.log("routes.js", "create_page request");
			var r = Math.floor((Math.random() * 10) + 1);
			var page = req.body;
			new Page({
				slug:toSlug(page.title),
				template:"page-template",
				title: page.title,
				body: page.body,
				publishedBy:{
					date:Date.now()
				},
				status:"published"
			}).save();
			res.send("pagecreate"+r);	
		}
	}
};

exports.GET = GET;
exports.POST = POST;