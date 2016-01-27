module.exports = function(app){

	var Q    = require("q"),
	fs       = require("fs"),
	Configs  = require( app.locals.__app + "/models/configs"),
	Posts    = require( app.locals.__app + "/models/posts"),
	Pages    = require( app.locals.__app + "/models/pages"),
	Users    = require( app.locals.__app + "/models/user"),
	Comments = require( app.locals.__app + "/models/comments");
	

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

		login: function(req,res){
			app.locals.pagename = " Login";
			app.locals.bodyclass = "login-page";
			res.render("login", { error: req.flash('error') });
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