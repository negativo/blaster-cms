module.exports = function(app){

	var toSlug = require('to-slug-case'),
	$utils = require("../lib/utils")(app),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments"),
	Render = require("../lib/render-helper").public;

	return {
		index: function (req, res) {
			Post.find({},function(err,posts){
				if(err) res.json({err:"not found"});
				res.json(posts);
			});			
		},
		show: function (req, res) {
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
		},
		create:function(req,res){
		},
		store:function(req,res){
			var post = req.body;
			new Post({
				title: post.title || "Post Title",
				slug: toSlug(post.title),
				body: post.body || "Post Body",
				template: post.template || "post-template",
				publishedBy:{
					user: req.user.id,
					date:Date.now()
				},
				tags: post.tags || [],
				status:"Published"
			}).save();
			res.send("success");	
		},
		destroy:function(req,res){
			res.send("");
		},
		edit:function(req,res){
			res.send("");
		},
		update:function(req,res){
			res.send("");
		},
	};

}