var fs = require("fs");

module.exports = function (app, $ee) {
	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;

	return function(req,res,next){
		if (app.locals.isInstalled){
			Configs.findOne({},function(err,configs){
				if(err){
					console.log('middlewares.js :76', err);
				}

				app.locals.__theme = configs.theme || 'basic'; //theme
				req.theme          = configs.theme || ''; //theme
				req.shared         = configs || {}; // configurations
				req.shared.site    = configs.title || 'CMS'; //site tite
				req.navigation     = configs.navigation || []; // navigation links
				req.links          = configs.links || []; // social links
				
				//get page&posts templates
				fs.readdir(__root + '/views/' + app.locals.__theme ,function(err, list){
					if(err){
						console.log('middlewares.js :85', err);
					}
					var pageTemplates = [];
					var postTemplates = [];
					var pagePattern = /-page-template.ejs/i
					var postPattern = /-post-template.ejs/i
					for (var i = 0; i < list.length; i++) {
						if ( list[i].match(pagePattern) ) {
							pageTemplates.push( list[i].replace(/.ejs/g,'') );
						};
						if ( list[i].match(postPattern) ) {
							postTemplates.push( list[i].replace(/.ejs/g,'') );
						};
					};
					req.pageTemplates = pageTemplates;
					req.postTemplates = postTemplates;
					fs.readdir(__root + '/views/',function(err, list){
						req.avaible_themes = list;
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