module.exports = function(app){

	var toSlug = require('to-slug-case'),
	fs 				 = require("fs"),
	$utils     = require("../lib/utils")(app),
	User       = require("../models/user"),
	Config     = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments"),
	Render     = require("../lib/render-helper").public;

	return {
		edit:function(req,res){
			Config.findOne({}, function(err, configs){
				configs.title = req.body.siteTitle;
				configs.subtitle = req.body.subtitle;
				configs.links = [];
				configs.links = req.body.links;
				configs.home = req.body.home;
				configs.save(function(err){
					if(!err) {
						//req.logout();
						res.send("success");
					}
				});
			});
		},
		edit_nav:function(req,res){
			Config.findOne({}, function(err, configs){
				configs.navigation = req.body.links;
				if (configs.navigation === undefined ) {
					configs.navigation = []; 
				}else{
					for (var i = 0; i < configs.navigation.length; i++) {
						var p = /\/page\//;
						if ( !configs.navigation[i].link.match(p) ) {
							configs.navigation[i].link = "/page/"+configs.navigation[i].link;
						}
					};
				};
				configs.save();
				res.send("success");
			});
		},
		edit_themes:function(req,res){
			Config.findOne(function(err,configs){
				configs.theme = req.body.theme;
				configs.save(function(err){
					if(!err) return res.send("success");
					res.send("error")
				});
			});
		},
		edit_css: function(req,res){
			console.log("configuration.js :56", "CUSTOM CSS REQUEST");
			fs.exists(app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css", function(exists){
				if(!exists){
					fs.open(app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css","w",function(err){
						fs.writeFile(app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css", req.body.css , function(err){
							if(err) return res.send(err);
							res.send("success");
						});
					});
				}else{
					fs.writeFile(app.locals.__root + "/views/"+ app.get('theme') +"/css/custom.css", req.body.css , function(err){
						if(err) return res.send(err);
						res.send("success");
					});
				}
			});
		}
	};

}
