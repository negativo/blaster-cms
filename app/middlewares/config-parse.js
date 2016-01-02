var fs = require("fs");

module.exports = function (app, $ee) {
	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
	
	app.locals.templates = {
		post:[],
		page:[],
	};

	return function(req,res,next){
		if (app.locals.isInstalled){
			Configs.findOne({},function(err,configs){
				if(err){
					console.log('middlewares.js :76', err);
				}

				app.settings.theme = configs.theme || 'basic'; //theme

				//req.theme          = configs.theme || ''; //theme
				req.shared         = configs || {}; // configurations
				req.shared.site    = configs.title || 'CMS'; //site tite
				req.navigation     = configs.navigation || []; // navigation links
				req.links          = configs.links || []; // social links
				
				//get page&posts templates
				fs.readdir(__root + '/views/' + app.get('theme') ,function(err, list){
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

					fs.readdir(__root + '/views/',function(err, list){
						app.locals.templates.theme = list;
						console.log("config-parse.js :48", app.locals);
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