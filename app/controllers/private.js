module.exports = function(app){

	var Q    = require("q"),
	fs       = require("fs"),
	Configs  = require("../models/configs"),
	Posts    = require("../models/posts"),
	Pages    = require("../models/pages"),
	Users    = require("../models/user"),
	Comments = require("../models/comments");
	

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
				res.render("dashboard", { postsNum: data[0], pagesNum: data[1], commentsNum: data[2], usersNum:data[3] });
			});
		},
		posts: function(req,res){
			app.locals.pagename = " Posts";
			app.locals.bodyclass = "dashboard-posts";
			Posts.find({},{ body:0 }, function(err, posts){
				if(posts !== null && req.isAuthenticated() ) {
					res.render("posts", { posts: posts });
				}
			}).populate("publishedBy.user",{password:0}).sort({ "publishedBy.date": -1 });
		},
		pages: function(req,res){
			app.locals.pagename = " Pages";
			app.locals.bodyclass = "dashboard-pages";
			Pages.find({},{ body:0 }, function(err, pages){
				if(pages !== null && req.isAuthenticated() ) {
					res.render("pages", { pages: pages });
				}
			});
		},
		login: function(req,res){
			app.locals.pagename = " Login";
			app.locals.bodyclass = "login-page";
			res.render("login", { error: req.flash('error') });
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
				res.render("comments", { posts: promise[0], comments: promise[1] });
			});
		},


		configurations: function(req,res){
			app.locals.pagename = " Configurations";
			app.locals.bodyclass = "dashboard-configurations";
			Configs.findOne({},{ db_link:0, templates:0 }, function(err, configs){
				if(configs !== null && req.isAuthenticated() ) {
					Pages.find({},{ body:0 },function(err, pages){
						res.render("configurations", { configs:configs, pages: pages });
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
						res.render("navigation", { pages: pages, navigation:configs.navigation });
					};
				});
			});
		},

		edit_css: function(req,res){
			fs.readFile( app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css", "utf-8", function(err,file){
				app.locals.pagename = " Theme Edit";
				app.locals.bodyclass = "edit-theme";
				res.render("custom-css", { css:file });
			});
		},

		themes_index: function(req,res){
			app.locals.pagename = " Choose themes";
			app.locals.bodyclass = "choose-themes";
			res.render("themes", { themes: req.avaible_themes });
		},

		newUser: function(req,res){
			app.locals.pagename = " Add new user";
			app.locals.bodyclass = "new-user-page";
			res.render("new-user");
		},

		register: function(req,res){
			app.locals.pagename = "Register to " + app.locals.sitename;
			app.locals.bodyclass = "register-page";
			res.render("register");
		},

		resetPassword:function(req,res){
			res.locals.pagename = "Reset Password ";
			res.locals.bodyclass = "login-page";
			res.locals.error = req.flash('error');
			res.locals.info = req.flash('info');
			
			res.render('reset-password');
		},

	};

}