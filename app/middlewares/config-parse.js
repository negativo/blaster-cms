var fs = require("fs");
var Configs = require('../models/configs');

module.exports = function (app, $ee) {
	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
	
	return function(req,res,next){
		console.log("config-parse.js :9", "PARSING");
		app.locals.templates = {
			post:[],
			page:[],
		};
		if (app.get('is_installed')){
			Configs.findOne({},function(err,configs){
				if(err){
					console.log('middlewares.js :76', err);
				}

				/**
				 * SET GLOBAL APP VARIABLES
				 */
				app.settings.theme    = configs.theme || 'basic'; 
				app.locals.navigation = configs.navigation || [];
				app.locals.sitename   = configs.title || 'CMS';
				app.locals.subtitle   = configs.subtitle || '';
				app.locals.socials    = configs.links || ''; 
				app.set('home', configs.home || 'home-template');


				/**
				 * SCAN POST/PAGE TEMPLATES FILE
				 */
				fs.readdir(__root + '/themes/' + app.get('theme') ,function(err, list){
					if(err){
						console.log('middlewares.js :85', err);
					}

					var pagePattern = /-page-template.ejs/i;
					var postPattern = /-post-template.ejs/i;

					for (var i = 0; i < list.length; i++) {
						if ( list[i].match(pagePattern) ) {
							app.locals.templates.page.push( list[i].replace(/.ejs/g,'') );
						};
						if ( list[i].match(postPattern) ) {
							app.locals.templates.post.push( list[i].replace(/.ejs/g,'') );
						};
					};

					/**
					 * SCAN THEMES	
					 */
					fs.readdir(__root + '/themes/',function(err, list){
						app.locals.templates.theme = list;
						$ee.emit('configs_updated', configs, 'Configuration has been attached to requestes');
						next();			
					});
				});
			});	
		} else {
			next();
		}

	};//return

}