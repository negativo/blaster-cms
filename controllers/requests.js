var express = require("express"),
	app 	= express(),
	$F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages");

	
//Controllers
var GET = {
	homeCtrl: function(req,res){
		Post.find({},function(err,posts){
			var data =  $F.dataParser(req.shared,"posts",posts);
			res.render(req.templates["home-template"], { viewData: data })
		});
	},
	pageCtrl:function (req, res) {
		var slug = req.params.page.toString();	
		Page.findOne({ "slug": slug },function(err,page){
			//console.log("requests.js", page,err);
			if(page === null) res.redirect("/404")
			var data =  $F.dataParser(req.shared,"page",page);
			res.render(req.templates["page-template"], { viewData: data } );

		});
	},
	postCtrl:function (req, res) {
		var title = req.params.title;
		Post.findOne({ "title": title },function(err,post){
			//console.log("requests.js", page,err);
			if(post === null) res.redirect("/404")
			var data =  $F.dataParser(req.shared,"post",post);
			res.render(req.templates["post-template"], { viewData: data } );
		});
	},
	loginCtrl:function(req,res){
		res.render("login" );
	},
	dashboardCtrl:function(req,res){
		var data =  $F.dataParser(req.shared);
		var currentUser = $F.dataParser(req.user);
		res.render("panel", { backend: data, currentUser: currentUser });
	}
};

var POST = {
	loginCtrl:function(req,res){
		//console.log("routes.js", req.session);
		res.json({ err:undefined });
	},
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
	create:{
		post:function(req,res){
			console.log("routes.js", "/create/post request");
			console.log("POST DATA: ", req.body);
			var post = req.body;
			new Post({
				title: post.title,
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
			new Page({
				slug:"sample-page"+r,
				template:"page-template",
				title:"Sample",
				content:"Hi I'm page "+r+ " :)",
				publishedBy:{
					date:Date.now()
				},
				status:"published"
			}).save();
			res.send("pagecreate"+r);	
		}
	}
};

//REMOVE RANDOM GENERATED PAGE
//AND POSTS AFTER TESTING END


exports.GET = GET;
exports.POST = POST;