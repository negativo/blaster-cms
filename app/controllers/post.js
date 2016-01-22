module.exports = function(app){

	var User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),
	Comment = require("../models/comments");

	return {
		index: function (req, res) {
			Post.find({},function(err,posts){
				if(err) res.json({err:"not found"});
				res.json(posts);
			});	
		},
		index_admin: function (req, res) {	
			res.locals.pagename = " Posts";
			res.locals.bodyclass = "dashboard-posts";
			Post.find({},{ body:0 }, function(err, posts){
				if(posts !== null && req.isAuthenticated() ) {
					res.render("posts", { posts: posts });
				}
			}).sort({ "publishedBy.date": -1 });
		},
		index_public: function (req, res) {	
		},
		show: function (req, res) {
			var slug = req.params.post;
			Post.findBySlug( slug, function(err,post){
				if(post === null) return res.redirect("/404");

				res.locals.pagetitle = post.title + " - " + app.locals.sitename;
				res.render( post.template, { post: post, comments: post.comments });
			});
		},
		create:function(req,res){
			res.locals.pagename  = " New Post";
			res.locals.bodyclass = "new-post";
			res.locals.isNew = true;

			res.render("editor", { editor: "post", templates: app.locals.templates.post } );
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
					res.render("editor", { editor: "post", single: singlePost, templates: app.locals.templates.post });
				});
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