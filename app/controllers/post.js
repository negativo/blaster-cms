module.exports = function(app){

	var User = require("../models/user"),
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
				res.locals.pagetitle = post.title + " - " + app.locals.sitename;
				Comment.populate(post.comments,[{ path:"user", model:"User" }], function(err,posts){
					console.log("public-request.js :55", posts);
					res.render( post.template, new Render(req, { post:post, comments: post.comments }) );
				});
			});
		},
		create:function(req,res){
			res.locals.pagename  = " New Post";
			res.locals.bodyclass = "new-post";
			res.locals.isNew = true;
			res.render("editor", new Render(req, { editor: "post", templates: app.locals.templates.post }) );
		},
		store:function(req,res){
			console.log("post.js :40", req.body);
			var post = req.body;
			new Post({
				title: post.title || "Post Title",
				body: post.body || "Post Body",
				template: post.template || "post-template",
				publishedBy:{
					user: req.user.id,
					date:Date.now()
				},
				tags: post.tags || [],
				status:"Published"
			}).save(function(err){
				console.log("post.js :53", err);
			});
			res.send("success");	
		},
		destroy:function(req,res){
			res.send("");
		},
		edit:function(req,res){
			if( req.params.id ){
				var postId = req.params.id;
				Post.findById( postId ,function(err,singlePost){
					console.log("private-request.js", singlePost );
					res.locals.pagename = " " + singlePost.title + " edit";
					res.locals.bodyclass = "edit-post";
					res.locals.isNew = false;
					res.render("editor", new Render(req, { editor: "post", single: singlePost, templates: app.locals.templates.post }) );
				}).populate("publishedBy.user",{password:0});;
			}
		},
		update:function(req,res){
			console.log("post.js :69", "Updating post");
			var postId = req.body.id,
					post   = req.body;
			Post.findById( postId ,function(err,singlePost){
				singlePost.title = post.title;
				singlePost.body = post.body;
				singlePost.publishedBy.user = req.user.id;
				singlePost.template = post.template || "post-template",
				singlePost.tags = post.tags;
				singlePost.save(function(err){
					if (err) throw err;
					res.send(200);
				});
			});
		},
	};

}