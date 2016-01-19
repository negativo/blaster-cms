module.exports = function(app){

	var Q      = require('q'),
	mail 			 = require('../lib/mail'),
	User       = require("../models/user"),
	Media       = require("../models/media"),
	Configs    = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments"),
	Message  = require("../lib/message-helper").message;

	return {
		index: function (req, res) {
			app.locals.pagename = " Users";
			app.locals.bodyclass = "dashboard-users";
			User.find({},{ password:0 }, function(err, users){
				if(users !== null && req.isAuthenticated() ) {
					res.render("users", { users: users });
				};
			});
		},
		show: function (req, res) {
			var userId = req.params.id;
			//only current user or admin can view this page
			if(req.user._id == userId || req.user.admin){
				User.findById( userId, {password:0}, function(err, profile){
					if(profile !== null && req.isAuthenticated() ) {
						app.locals.pagename= profile.username + " Profile";
						app.locals.bodyclass = profile.username.toLowerCase() + "-profile";
						res.render("profile", { profile: profile });
					};
				});
			}else{
				res.sendStatus(403);
			}
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
			var user_id = req.body.id;

			console.log("user.js :54", req.body);

			if(req.body.deleteUserData === 'true'){

				User
					.purge(user_id)
					.then(function(data){
						return res.send(new Message("User and his content deleted!"));
					})
					.catch(function(err){
						return res.send(new Message(null, err));
					});
			}else{
				User
					.deleteAdminInherit(user_id)
					.then(function(data){
						return res.send(new Message("User deleted, admin inherited page/post/medias!"));
					})
					.catch(function(err){
						return res.send(new Message(null, err));
					});
			}
			// var user = req.body;
			// User.findById( user.id, function(err, user){
			// 	if (!err) {
			// 		if (user.role === "admin") return res.send(new Message(null,"Can't delete an Admin"));
			// 		user.remove(function(err){
			// 			if (err === null) res.send(new Message("User deleted!"));
			// 		});
			// 	}
			// });
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

				// admin can't demote himself
				if(req.user.admin && profile.role != 'admin' && !(profile.id == req.user._id)){
					user.role = profile.role;
				}
				
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
		},
		reset_password_request:function(req,res){
			User.findOne( { email: req.body.email }, function(err, user){
				if(err) res.send(err);
				if(!user) {
					req.flash('error', 'No user with this email has been found.');
					res.redirect('/admin/reset-password');
				}
				if(!err && user) {
					user.generateResetToken(function(err, info){
						if(!err && info.resetToken) {
							mail.sendmail({
								to: user.email,
								link: app.get('base_url') + "/api/user/reset?token=" + info.resetToken + "&mail=" + info.email,
							}, function(err, info){
								if(err) res.send(err);
								req.flash('info', info); 
								res.redirect('/admin/reset-password');
							});
						}
					});
				}
			});
		},
		reset_token_check:function(req,res){
			User.findOne({ email: req.query.mail}, function(err,user){
				if(err) res.send(err);

				if( !user.resetToken) {
					return res.redirect('/');
				}

				if (user.isTokenExpired()){
					req.flash('error','Token is Expired, request a new one!');
					return res.redirect("/admin/reset-password");
				}

				res.locals.pagename  = "Reset Password";
				res.locals.bodyclass = "reset-page";
				res.locals._token    = req.query.token;
				res.locals._mail     = req.query.mail;

				res.render('reset-password-new');
			});
		},
		reset_password:function(req,res){
			var password = req.body.password;
			var mail = req.body.mail.toLowerCase();
	
			User.findOne({ email: mail}, function(err,user){
				if(err) res.send(err);

				if(!user.resetToken){
					return res.send({ err:"Password has been reset! Log In! ", message:null });
				}

				if (!user.isTokenExpired()){
					user.password = password;
					user.resetToken = undefined;
					user.resetTokenCreated = undefined;
					user.save(function(err){
						if(err) res.send(err);
						res.send({ err:null, message: 'Password changed! Login with your new password'});
					});
				}else{
					res.send({ err: 'Token is Expired, request a new one!', message:null });
				}
			});
		},
	};

}
