module.exports = function(app){

	var fs 				 = require("fs"),
	User        = require(app.locals.__app + "/models/user"),
	Config      = require(app.locals.__app + "/models/configs"),
	Post        = require(app.locals.__app + "/models/posts"),
	Page        = require(app.locals.__app + "/models/pages"),
	Comment     = require(app.locals.__app + "/models/comments");

	return {
		index_configurations: function(req,res){
			res.locals.pagename = " Configurations";
			res.locals.bodyclass = "dashboard-configurations";
			Config.findOne({},{ db_link:0, templates:0 }, function(err, configs){
				if(configs !== null && req.isAuthenticated() ) {
					Page.find({},{ body:0 },function(err, pages){
						res.render("configurations", { configs:configs, pages: pages });
					});
				}
			});
		},
		index_nav: function(req,res){
			res.locals.pagename = " Navigation";
			res.locals.bodyclass = "edit-navigation";
			Config.findOne({},{ db_link:0, templates:0 }, function(err, configs){
				Page.find({},{ slug:1, title:1 },function(err,pages){
					if(configs !== null && req.isAuthenticated() ) {
						res.render("navigation", { pages: pages, navigation:configs.navigation });
					};
				});
			});
		},
		index_custom_css: function(req,res){
			fs.readFile( app.locals.__root + "/themes/"+ app.get('theme') +"/css/custom.css", "utf-8", function(err,file){
				res.locals.pagename = " Theme Edit";
				res.locals.bodyclass = "edit-theme";
				res.render("custom-css", { css:file });
			});
		},
		index_themes: function(req,res){
			res.locals.pagename = " Choose themes";
			res.locals.bodyclass = "choose-themes";
			res.render("themes", { themes: req.avaible_themes });
		},
		edit:function(req,res){
			Config.findOne({}, function(err, configs){
				configs.title = req.body.siteTitle;
				configs.subtitle = req.body.subtitle;
				configs.links = [];
				configs.links = req.body.links;
				configs.home = req.body.home;
				configs.analytics = req.body.analytics;
				configs.save(function(err){
					if(!err) {
						process.emit('configs_updated');
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
				configs.save(function(){
					process.emit('configs_updated');
					res.send("success");
				});
			});
		},
		edit_themes:function(req,res){
			Config.findOne(function(err,configs){
				configs.theme = req.body.theme;
				configs.save(function(err){
					if(err) return res.send("error");
					process.emit('configs_updated');
					res.send("success")
				});
			});
		},
		edit_css: function(req,res){
			console.log("configuration.js :56", "CUSTOM CSS REQUEST");
			console.log("configuration.js :91", req.body);
			fs.exists(app.locals.__root + "/themes/"+ app.get('theme') +"/css/custom.css", function(exists){
				if(!exists){
					fs.open(app.locals.__root + "/themes/"+ app.get('theme') +"/css/custom.css","w",function(err){
						fs.writeFile(app.locals.__root + "/themes/"+ app.get('theme') +"/css/custom.css", req.body.css , function(err){
							if(err) return res.send(err);
							process.emit('configs_updated');
							res.send("success");
						});
					});
				}else{
					fs.writeFile(app.locals.__root + "/themes/"+ app.get('theme') +"/css/custom.css", req.body.css , function(err){
						if(err) return res.send(err);
						process.emit('configs_updated');
						res.send("success");
					});
				}
			});
		}
	};

}
