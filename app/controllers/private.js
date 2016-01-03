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

			fs.readdir(global.appRoot + '/uploads', function(err, files){
				callback(files);
			});
		},


		editNavigation: function(req,res){
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

		editTheme: function(req,res){
			fs.readFile(global.appRoot + "/views/template/css/custom.css", "utf-8", function(err,file){
				app.locals.pagename = " Theme Edit";
				app.locals.bodyclass = "edit-theme";
				res.render("edit-theme", new Render(req, { css:file }) );
			});
		},

		themesCtrl: function(req,res){
			fs.readFile(global.appRoot + "/views/template/css/custom.css", "utf-8", function(err,file){
				app.locals.pagename = " Choose themes";
				app.locals.bodyclass = "choose-themes";
				res.render("themes", new Render(req, { themes: req.avaible_themes }) );
			});
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

		
	// POST.editConfigurations = function(req,res){
	// 	console.log("private-request.js", req.body);
	// 	Configs.findOne({}, function(err, configs){
	// 		configs.title = req.body.siteTitle;
	// 		configs.subtitle = req.body.subtitle;
	// 		configs.links = [];
	// 		configs.links = req.body.links;
	// 		configs.home = req.body.home;
	// 		configs.save(function(err){
	// 			if(!err) {
	// 				//req.logout();
	// 				res.send("success");
	// 			}
	// 		});
	// 	});
	// }
	
	// POST.editNavigation = function(req,res){
	// 	console.log("private-request.js :206 >>>>", req.body);
	// 	Configs.findOne({}, function(err, configs){
	// 		configs.navigation = req.body.links;
	// 		if (configs.navigation === undefined ) {
	// 			configs.navigation = []; 
	// 		}else{
	// 			for (var i = 0; i < configs.navigation.length; i++) {
	// 				var p = /\/page\//;
	// 				if ( !configs.navigation[i].link.match(p) ) {
	// 					configs.navigation[i].link = "/page/"+configs.navigation[i].link;
	// 				}
	// 			};
	// 		};
	// 		configs.save();
	// 		res.send("success");
	// 	});
	// }
	
	// POST.editUserProfile = function(req,res){
	// 	//{id: "55d0dd911a5f1c41564a2734", username: "Neofrascati", name: "", email: "", role: "admin"}
	// 	var profile = req.body;
	// 	console.log("private-request.js :230", profile);
	// 	Users.findById( profile.id,function(err,user){
	// 		user.username = profile.username;
	// 		user.name = profile.name;
	// 		user.email = profile.email;
	// 		user.role = profile.role;
	// 		user.save(function(err){
	// 			console.log("private-request.js :229", err);
	// 			if(err === null ) res.send("success");
	// 				else res.send("error")
	// 			req.logout();
	// 		});
	// 		req.logout();
	// 	});
	// }
	
	// POST.editUserPassword = function(req,res){
	// 	//oldPwd, newPwd, CheckPwd
	// 	var pwd = req.body;
		
	// 	User.change_password(pwd.id, pwd.oldPwd, pwd.newPwd)
	// 		.then(function(changePwd){
	// 			if(changePwd){
	// 				req.logout();
	// 				res.send({ message:changePwd, err:false})
	// 			}else{
	// 				res.send({ message:changePwd, err:true});
	// 			}
	// 		})
	// 		.fail(function(err){
	// 			res.send({ message:err, err:true})
	// 		});
	// }
	
	// POST.deleteUser = function(req,res){
	// 	//console.log("private-request.js :291", req.body);
	// 	var user = req.body;
	// 	User.findById( user.id, function(err, user){
	// 		if (err === null) {
	// 			if (user.role === "admin") return res.send(new Message(null,"Can't delete an Admin"))
	// 			user.remove(function(err){
	// 				if (err === null) res.send(new Message("User deleted!"));
	// 			});
	// 		}
	// 	});
	// }
	
	// POST.editTheme = function(req,res){	
	// 	fs.exists(global.appRoot + "/views/template/css/custom.css", function(exists){
	// 		if(!exists){
	// 			fs.open(global.appRoot + "/views/template/css/custom.css","w",function(err){
	// 				fs.writeFile(global.appRoot + "/views/template/css/custom.css", req.body.css , function(err){
	// 					if(err) return res.send(err);
	// 					res.send("success");
	// 				});
	// 			});
	// 		}else{
	// 			fs.writeFile(global.appRoot + "/views/template/css/custom.css", req.body.css , function(err){
	// 				if(err) return res.send(err);
	// 				res.send("success");
	// 			});
	// 		}
	// 	});
	// }

	// POST.themesCtrl = function(req,res){
	// 	Configs.findOne(function(err,configs){
	// 		configs.theme = req.body.theme;
	// 		configs.save(function(err){
	// 			if(!err) return res.send("success");
	// 			res.send("error")
	// 		});
	// 	});
	// }

	// POST.editComment = function(req,res){
	// 	var comment = req.body;
	// 	console.log("private-request.js :316", comment);
	// 	if( comment.action === "delete" ){
	// 		Comments.findById( comment.id ).remove(function(err){
	// 			Posts.findById( comment.post_id, function(err,post){
	// 				if (post.comments.indexOf(comment.id) > -1) {
	// 				    post.comments.splice(post.comments.indexOf(comment.id), 1);
					    
	// 				};
	// 				post.save(function(err){
	// 					if(err === null) res.send("success");
	// 				})
	// 			});
	// 		});
	// 	}else if ( comment.action === "update" ){
	// 		Comments.findById( comment.id, function(err,updateComment){
	// 			updateComment.comment = comment.body;
	// 			updateComment.save(function(err){
	// 				console.log("private-request.js :324", err);
	// 				if(err === null ) return res.send("success");
	// 			})
	// 		});
	// 	}
	// }
	
	// POST.registerCtrl = function(req,res){
	// 	var register = req.body;
		
	// 	new_user = register;
		
	// 	User
	// 		.register_new(new_user)
	// 		.then(function(message){ return res.send(message) })
	// 		.fail(function(message){ return res.send(message) });
	// }

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