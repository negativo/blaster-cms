module.exports = function(app){

	var toSlug = require('to-slug-case'),
	$utils     = require("../lib/utils")(app),
	User       = require("../models/user"),
	Configs    = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments"),
	Render     = require("../lib/render-helper").public,
	Message  = require("../lib/message-helper").message;

	return {
		index: function (req, res) {
			app.locals.pagename = " Users";
			app.locals.bodyclass = "dashboard-users";
			User.find({},{ password:0 }, function(err, users){
				if(users !== null && req.isAuthenticated() ) {
					res.render("users", new Render(req, { users: users }) );
				};
			});
		},
		show: function (req, res) {
			var userId = req.params.id;
			User.findById( userId, {password:0}, function(err, profile){
				if(profile !== null && req.isAuthenticated() ) {
					app.locals.pagename= profile.username + " Profile";
					app.locals.bodyclass = profile.username.toLowerCase() + "-profile";
					res.render("profile", new Render(req, { profile: profile }) );
				};
			});
		},
		create:function(req,res){
			res.send("create view");
		},
		store:function(req,res){
			var register = req.body;
			
			new_user = register;
			
			User
				.register_new(new_user)
				.then(function(message){ return res.send(message) })
				.fail(function(message){ return res.send(message) });
		},
		destroy:function(req,res){
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
		edit:function(req,res){
			res.send("edit view");
		},
		update:function(req,res){
			var profile = req.body;
			console.log("private-request.js :230", profile);
			User.findById( profile.id,function(err,user){
				user.username = profile.username;
				user.name = profile.name;
				user.email = profile.email;
				user.role = profile.role;
				user.save(function(err){
					if(!err) {
						res.send("success");
					}else{ 
						res.send("error");
					}
				});
			});
		},
		change_password:function(req,res){
			var pwd = req.body;
			User.change_password(pwd.id, pwd.oldPwd, pwd.newPwd)
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
		}
	};

}
