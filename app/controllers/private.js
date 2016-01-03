module.exports = function(app){

	var Q    = require("q"),
	$utils   = require("../lib/utils")(app),
	fs       = require("fs"),
	Configs  = require("../models/configs"),
	Posts    = require("../models/posts"),
	Pages    = require("../models/pages"),
	Users    = require("../models/user"),
	Comments = require("../models/comments"),
	toSlug   = require('to-slug-case'),
	Render   = require("../lib/render-helper").private,
	Message  = require("../lib/message-helper").message;
	

	return {
		dashboard: function(req,res){
			app.locals.pagename = " Dashboard";
			app.locals.bodyclass = "dashboard-home";
			var getPages = function(){
				return Posts.count({});
			};
			var getPosts = function(){
				return Pages.count({});
			};
			var getComments = function(){
				return Comments.count({});
			};
			var getUsers = function(){
				return Users.count({});
			};
			Q.all([getPages(),getPosts(),getComments(), getUsers()])
			.then(function(data){
				res.render("panel", 
					new Render(req, { postsNum: data[0], pagesNum: data[1], commentsNum: data[2], usersNum:data[3] }) 
				);
			});
		},
		posts: function(req,res){
			app.locals.pagename = " Posts";
			app.locals.bodyclass = "dashboard-posts";
			Posts.find({},{ body:0 }, function(err, posts){
				if(posts !== null && req.isAuthenticated() ) {
					res.render("posts", new Render(req, { posts: posts }) );
				}
			}).populate("publishedBy.user",{password:0}).sort({ "publishedBy.date": -1 });
		},
		pages: function(req,res){
			app.locals.pagename = " Pages";
			app.locals.bodyclass = "dashboard-pages";
			Pages.find({},{ body:0 }, function(err, pages){
				if(pages !== null && req.isAuthenticated() ) {
					res.render("pages", new Render(req, { pages: pages }) );
				}
			});
		},
		login: function(req,res){
			app.locals.pagename = " Login";
			app.locals.bodyclass = "login-page";
			res.render("login", new Render(req, { error: req.flash('error') }) );
		},
		comments: function(req,res){
			app.locals.pagename = " Comments";
			app.locals.bodyclass = "dashboard-comments";
			function getPosts(){
				return Posts.find({});
			};
			function getComments(){
				return Comments.find({}).populate("user");
			};
			Q.all([getPosts(),getComments()])
			.then(function(promise){
				//console.log("private-request.js :49", promise);
				res.render("comments", 
					// 0-posts 1-comments
					new Render(req, { posts: promise[0], comments: promise[1] })
				);
			});
		},


		configurations: function(req,res){
			app.locals.pagename = " Configurations";
			app.locals.bodyclass = "dashboard-configurations";
			Configs.findOne({},{ db_link:0, templates:0 }, function(err, configs){
				if(configs !== null && req.isAuthenticated() ) {
					Pages.find({},{ body:0 },function(err, pages){
						res.render("configs", new Render(req, { configs:configs, pages: pages }) );
					});
				}
			});
		},

		fileBrowser: function(req,res){
			function callback(items){
				res.render('file-browser', {files:items});	
			}

			fs.readdir(app.locals.__root + '/uploads', function(err, files){
				callback(files);
			});
		},


		navigation: function(req,res){
			app.locals.pagename = " Navigation";
			app.locals.bodyclass = "edit-navigation";
			Configs.findOne({},{ db_link:0, templates:0 }, function(err, configs){
				Pages.find({},{ slug:1, title:1 },function(err,pages){
					if(configs !== null && req.isAuthenticated() ) {
						res.render("edit-nav", new Render(req, { pages: pages, navigation:configs.navigation }) );
					};
				});
			});
		},

		edit_css: function(req,res){
			fs.readFile( app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css", "utf-8", function(err,file){
				app.locals.pagename = " Theme Edit";
				app.locals.bodyclass = "edit-theme";
				res.render("edit-theme", new Render(req, { css:file }) );
			});
		},

		themes_index: function(req,res){
			app.locals.pagename = " Choose themes";
			app.locals.bodyclass = "choose-themes";
			res.render("themes", new Render(req, { themes: req.avaible_themes }) );
		},

		newUser: function(req,res){
			app.locals.pagename = " Add new user";
			app.locals.bodyclass = "new-user-page";
			res.render("new-user", new Render(req) );
		},

		register: function(req,res){
			app.locals.pagename = "Register to " + app.locals.sitename;
			app.locals.bodyclass = "register-page";
			res.render("register", new Render(req) );
		},

	};


		


	// POST.uploadCtrl = function(req,res,next){
	// 	 res.send("<script> window.$('body').find('#cke_137_textInput') </script>");
	// }

	// POST.avatarUpload = function(req,res){
	// 	var userId = req.params.id;
	// 	User.findById( userId, function(err,user){
	// 		if(err) return res.send(new Message(null,"Error uploading"))
	// 		user.avatar = "/avatar/" + req.file.filename;
	// 		user.save();
	// 		res.redirect("/admin/users/"+user._id);
	// 	});
	// }

}