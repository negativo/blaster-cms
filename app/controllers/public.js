module.exports = function(app){

	var toSlug = require('to-slug-case'),
	$utils = require("../lib/utils")(app),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments"),
	Render = require("../lib/render-helper").public;
	
	var handlers  = {};
	handlers.GET  = {};
	handlers.POST = {};
	
	var GET       = handlers.GET,
	POST          = handlers.POST;

	GET.fourOfourCtrl = function(req,res){
		app.locals.pagetitle = "404 - " + app.locals.sitename;
		res.render( "404" , new Render(req,{}) );
	}

	GET.homeCtrl = function(req,res){
		// //static homepage
		if (app.get('home') === "home-template"){
			Post.find({},function(err,posts){
				app.locals.pagetitle = "HOME" + " - " + app.locals.sitename;
				res.render( "home-template" , new Render(req, { posts:posts }) )
			}).sort({ "publishedBy.date": -1 }).populate("publishedBy.user",{ password:0 });
		}
		// Render chosen page as homepage 
		else{
			Page.findOne({ "_id": app.get('home') },function(err,page){
				if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
				app.locals.pagetitle = page.title + " - " + app.locals.pagetitle;
				res.render( page.template, new Render(req, { page:page }) );
			});
		}
	}

	GET.singlePageCtrl = function (req, res) {
		var slug = req.params.page.toString();	
		Page.findOne({ "slug": slug },function(err,page){
			console.log("requests.js", page,err);
			if(page === null && req.url !== "/favicon.ico" ) return res.redirect("/404");
			app.locals.pagetitle = page.title + " - " + app.locals.sitename;
			res.render( page.template, new Render(req, { page:page }) );
		});
	}

	GET.singlePostCtrl = function (req, res) {
		var slug = req.params.post;
		Post.findOne({ "slug": slug })
		.populate("publishedBy.user")
		.populate("comments")
		.exec(function(err,post){
			if(post === null) return res.redirect("/404");
			app.locals.pagetitle = post.title + " - " + app.locals.sitename;
			Comment.populate(post.comments,[{ path:"user", model:"User" }], function(err,posts){
				console.log("public-request.js :55", posts);
				res.render( post.template, new Render(req, { post:post, comments: post.comments }) );
			});
		});
	}

	GET.searchCtrl = function(req,res){
		console.log("public-request.js :67", req.body);
		res.render("search", new Render(req));
	}



	// POST REQ
	POST.searchCtrl = function(req,res){
		var searchExp = new RegExp(req.body.term, "i");
		Post.find({  $or: [{"title": searchExp}, {"body": searchExp}, {"tags": searchExp} ] }, function(err,post){
			res.render("search", new Render(req, { results: post }));
		});
	}

	POST.install = {
		mongo:function(req,res){
			console.log("requests.js MONGOLINK", req.body);
			//check if err is null in frontend
			$utils.checkDatabase(req.body)
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
			$utils.installation(req.body)
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
	POST.create = {
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

	return handlers;
}
