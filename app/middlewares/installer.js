var fs = require("fs");


module.exports = function (app) {
	/**
	 * CHECK IF CMS IS INSTALLED IF NOT INSTALL IT
	 */
	var CMS_INSTALLER = {
		check: function(req,res,next){
			var that = this;
			fs.readFile( app.locals.__configs , "utf-8", function(err,file){
				if (typeof file !== 'undefined' && file.length > 0) {
					app.locals.isInstalled = true;
					next();
				}else{
					CMS_INSTALLER.install(req,res,next);
				}
			});	
		},
		install:function(req,res,next){
			if( req.method === 'GET' && !app.locals.isInstalled && !(/^\/install/.test(req.url)) ) { 
				return res.redirect("install"); 
			};	
			next();
		}
	};

	return CMS_INSTALLER;
}