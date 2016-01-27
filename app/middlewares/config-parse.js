
module.exports = function (app) {
	var fs = require("fs");
	var Configs = require( app.locals.__app + '/models/configs');
	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
	
	app.locals.templates = {
		post:[],
		page:[],
	};

	return function(req,res,next){
			
		if (app.get('is_installed') && (app.get('configs_parsed') <= app.get('configs_updated') || !app.get('configs_parsed')) ){
			console.log("Parsing configuration in request".blue);
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
						process.emit('configs_parsed', configs, 'Configuration has been attached to requestes');
						next();			
					});
				});
			});	
		} else {
			next();
		}

	};//return

}