var express = require("express"),
	app 	= express(),
	Q = require("q"),
	$F = require("../configs/functions"),
	fs = require("fs"),
	Configs = require("../models/configs"),
	Posts = require("../models/posts"),
	Pages = require("../models/pages"),
	Users = require("../models/user"),
	Comments = require("../models/comments"),
	toSlug = require('to-slug-case'),
	Render = require("../lib/render-helper").private,
	Message = require("../lib/message-helper").message;

	
var base_url = global.base_url;

	
//Controllers
var GET = {
	views:{},
	crud:{},
	//VIEWS
	loginPageCtrl:function(req,res){
		for (prop in req.shared) if( prop !== "title") delete req.shared[prop];
		req.shared.title = req.shared.title + " Login";
		req.shared.class = "login-page";
		res.render("login", new Render(req, {}) );

	},
	dashboardPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Dashboard";
		req.shared.class = "dashboard-home";
		var getPages = function(){
			return Posts.find({});
		};
		var getPosts = function(){
			return Pages.find({});
		};
		var getComments = function(){
			return Comments.find({});
		};
		var getUsers = function(){
			return Users.find({});
		};
		Q.all([getPages(),getPosts(),getComments(), getUsers()])
		.then(function(data){
			res.render("panel", 
				new Render(req, { postsNum: data[0].length, pagesNum: data[1].length, commentsNum: data[2].length, usersNum:data[3].length }) 
			);
		});
	},
	postsPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Posts";
		req.shared.class = "dashboard-posts";
		Posts.find({},{ body:0 }, function(err, posts){
			if(posts !== null && req.isAuthenticated() ) {
				res.render("posts", new Render(req, { posts: posts }) );
			}
		}).populate("publishedBy.user",{password:0}).sort({ "publishedBy.date": -1 });
	},
	pagesPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Pages";
		req.shared.class = "dashboard-pages";
		Pages.find({},{ body:0 }, function(err, pages){
			if(pages !== null && req.isAuthenticated() ) {
				res.render("pages", new Render(req, { pages: pages }) );
			}
		});
	},
	commentsPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Comments";
		req.shared.class = "dashboard-comments";
		function getPosts(){
			return Posts.find({});
		};
		function getComments(){
			return Comments.find({}).populate("user");
		};
		Q.all([getPosts(),getComments()])
		.then(function(data){
			console.log("private-request.js :49", data);
			res.render("comments", 
				new Render(req, { posts: data[0], comments: data[1] })
			);
		});
	},
	usersPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Users";
		req.shared.class = "dashboard-users";
		Users.find({},{ password:0 }, function(err, users){
			if(users !== null && req.isAuthenticated() ) {
				res.render("users", new Render(req, { users: users }) );
			};
		});
	},
	profileCtrl:function(req,res){
		var userId = req.params.id;
		Users.findById( userId, {password:0}, function(err, profile){
			if(profile !== null && req.isAuthenticated() ) {
				req.shared.title = profile.username + " Profile";
				req.shared.class = profile.username.toLowerCase() + "-profile";
				res.render("profile", new Render(req, { profile: profile }) );
			};
		});

	},
	configurationsPageCtrl:function(req,res){
		req.shared.title = req.shared.title + " Configurations";
		req.shared.class = "dashboard-configurations";
		Configs.findOne({},{ db_link:0, templates:0 }, function(err, configs){
			if(configs !== null && req.isAuthenticated() ) {
				Pages.find({},{ body:0 },function(err, pages){
					res.render("configs", new Render(req, { configs:configs, pages: pages }) );
				});
			}
		});
	},
	//CREATE/EDIT
	newPostCtrl:function(req,res){
		req.shared.title = req.shared.title + " New Post";
			req.shared.class = "new-post";
			res.render("editor", new Render(req, { editor: "post", templates:req.postTemplates }) );
	},
	editSinglePost:function(req,res){
		if( req.params.id ){
			var postId = req.params.id;
			Posts.findById( postId ,function(err,singlePost){
				console.log("private-request.js", singlePost );
				req.shared.title = singlePost.title + " edit";
				req.shared.class = "edit-post";
				res.render("editor", new Render(req, { editor: "post", single: singlePost, templates:req.postTemplates }) );
			}).populate("publishedBy.user",{password:0});;
		}
	},	
	newPageCtrl:function(req,res){
			req.shared.title = req.shared.title + " New Page";
			req.shared.class = "new-page";
			Configs.findOne({},{ siteTemplate:1 }, function(err, templates){
				if(templates === null) return;
				res.render("editor", new Render(req, { editor: "page", templates:req.pageTemplates }) );
			});
	},
	editSinglePage:function(req,res){
		if( req.params.id ){
			var pageId = req.params.id;
			Pages.findById( pageId ,function(err,singlePage){
				console.log("private-request.js", singlePage );
				req.shared.title = singlePage.title + " edit";
				req.shared.class = "edit-page";
				res.render("editor", new Render(req, { editor: "page", single: singlePage, templates:req.pageTemplates }) );
			});
		}
	},
	editNavigation:function(req,res){
		req.shared.title = req.shared.title + " Navigation";
		req.shared.class = "edit-navigation";
		Configs.findOne({},{ db_link:0, templates:0 }, function(err, configs){
			Pages.find({},{ slug:1, title:1 },function(err,pages){
				if(configs !== null && req.isAuthenticated() ) {
					res.render("edit-nav", new Render(req, { pages: pages, navigation:configs.navigation }) );
				};
			});
		});
	},
	editTheme:function(req,res){
		fs.readFile(global.appRoot + "/views/template/css/custom.css", "utf-8", function(err,file){
			req.shared.title = req.shared.title + " Theme Edit";
			req.shared.class = "edit-theme";
			res.render("edit-theme", new Render(req, { css:file }) );
		});
	},
	themesCtrl:function(req,res){
		fs.readFile(global.appRoot + "/views/template/css/custom.css", "utf-8", function(err,file){
			req.shared.title = req.shared.title + " Choose themes";
			req.shared.class = "choose-themes";
			res.render("themes", new Render(req, { themes: req.avaible_themes }) );
		});
	},
	newUserCtrl:function(req,res){
		req.shared.title = req.shared.title + " Add new user";
		req.shared.class = "new-user-page";
		res.render("new-user", new Render(req) );
	},
	registerCtrl:function(req,res){
		req.shared.title = "Register to " + req.shared.title;
		req.shared.class = "register-page";
		res.render("register", new Render(req) );
	}
};

var POST = {
	loginCtrl:function(req,res){
		res.redirect("/");
	},
	editSinglePost:function(req,res){
		console.log("private-request.js", req.body);
		var postId = req.body.id,
			post = req.body;
		Posts.findById( postId ,function(err,singlePost){
			console.log("private-request.js", singlePost );
			singlePost.title = post.title;
			singlePost.body = post.body;
			singlePost.slug = toSlug(post.title);
			singlePost.publishedBy.user = req.user.id;
			singlePost.template = post.template || "post-template",
			singlePost.tags = post.tags;
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
			singlePage.body = req.body.body;
			singlePage.publishedBy.user = req.user.id;
			singlePage.slug = toSlug(req.body.title);
			singlePage.template = req.body.template || "page-template",
			singlePage.save(function(err){
				if (err) throw err;
				res.send(200);
			});
		});
	},
	editConfigurations:function(req,res){
		console.log("private-request.js", req.body);
		Configs.findOne({}, function(err, configs){
			configs.title = req.body.siteTitle;
			configs.subtitle = req.body.subtitle;
			configs.links = [];
			configs.links = req.body.links;
			configs.home = req.body.home;
			console.log("private-request.js", req.body);
			configs.save(function(err){
				if(!err) {
					req.logout();
					res.send("success");
				}
				
			});
		});
		//res.send("success")
	},
	editNavigation:function(req,res){
		console.log("private-request.js :206 >>>>", req.body);
		Configs.findOne({}, function(err, configs){
			configs.navigation = req.body.links;
			if (configs.navigation === undefined ) {
				configs.navigation = []; 
			}else{
				for (var i = 0; i < configs.navigation.length; i++) {
					configs.navigation[i].link = "/page/"+configs.navigation[i].link;
				};
			};
			configs.save();
			res.send("success");
		});
	},
	editUserProfile:function(req,res){
		//{id: "55d0dd911a5f1c41564a2734", username: "Neofrascati", name: "", email: "", role: "admin"}
		var profile = req.body;
		console.log("private-request.js :230", profile);
		Users.findById( profile.id,function(err,user){
			user.username = profile.username;
			user.name = profile.name;
			user.email = profile.email;
			user.role = profile.role;
			user.save(function(err){
				console.log("private-request.js :229", err);
				if(err === null ) res.send("success");
					else res.send("error")
				req.logout();
			});
			req.logout();
		});
	},
	editUserPassword:function(req,res){
		//oldPwd, newPwd, CheckPwd
		var pwd = req.body;
		$F.changePwd( pwd.id, pwd.oldPwd, pwd.newPwd )
			.then(function(changePwd){
				if(changePwd){
					req.logout();
					res.send({ message:changePwd, err:false})
				}else{
					res.send({ message:changePwd, err:true});
				}
			})
			.fail(function(err){
				res.send({ message:err, err:true})
			});
	},
	deleteUser:function(req,res){
		console.log("private-request.js :291", req.body);
		var user = req.body;
		User.findById( user.id, function(err, user){
			if (err === null) {
				if (user.role === "admin") return res.send(new Message(null,"Can't delete an Admin"))
				user.remove(function(err){
					if (err === null) res.send(new Message("User deleted!"));
				});
			}
		});
	},
	editTheme:function(req,res){	
		fs.exists(global.appRoot + "/views/template/css/custom.css", function(exists){
			if(!exists){
				fs.open(global.appRoot + "/views/template/css/custom.css","w",function(err){
					fs.writeFile(global.appRoot + "/views/template/css/custom.css", req.body.css , function(err){
						if(err) return res.send(err);
						res.send("success");
					});
				});
			}else{
				fs.writeFile(global.appRoot + "/views/template/css/custom.css", req.body.css , function(err){
					if(err) return res.send(err);
					res.send("success");
				});
			}
		});
	},
	themesCtrl:function(req,res){
		Configs.findOne(function(err,configs){
			configs.theme = req.body.theme;
			configs.save(function(err){
				if(!err) return res.send("success");
				res.send("error")
			});
		});
	},
	editComment:function(req,res){
		var comment = req.body;
		console.log("private-request.js :316", comment);
		if( comment.action === "delete" ){
			Comments.findById( comment.id ).remove(function(err){
				Posts.findById( comment.post_id, function(err,post){
					if (post.comments.indexOf(comment.id) > -1) {
					    post.comments.splice(post.comments.indexOf(comment.id), 1);
					    
					};
					post.save(function(err){
						if(err === null) res.send("success");
					})
				});
			});
		}else if ( comment.action === "update" ){
			Comments.findById( comment.id, function(err,updateComment){
				updateComment.comment = comment.body;
				updateComment.save(function(err){
					console.log("private-request.js :324", err);
					if(err === null ) return res.send("success");
				})
			});
		}
	},
	registerCtrl:function(req,res){
		var register = req.body;
		User.findOne({ "username": register.username },function(err, user){
			if(user) return res.send(new Message(null, "User Exists") );
			$F.register(register)
			.then(function(message){ return res.send(message) })
			.fail(function(message){ return res.send(message) });
		})
		//res.send(req.body);
	},
	uploadCtrl:function(req,res,next){
		 res.send("got it");
	},
	avatarUpload:function(req,res){
		var userId = req.params.id;
		User.findById( userId, function(err,user){
			if(err) return res.send(new Message(null,"Error uploading"))
			user.avatar = "/user/" + req.file.filename;
			user.save();
			req.login(user,function(err){
				if (err) return next(err);
				res.redirect("/admin/users/"+user._id);
			});
		});
	}
};

exports.GET = GET;
exports.POST = POST;