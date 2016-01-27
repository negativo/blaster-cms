module.exports = function(app, extend){
	//var	dotenv = require('dotenv').load();
	var express   = require('express');
	var ejs_mate  = require("ejs-mate");
	var locals    = app.locals;
	var installer = require(app.locals.__app + '/lib/installer');
	
	locals.debug_mode_on = process.env.DEBUG_MODE_ON;
	if (process.env.DEBUG_MODE_ON==='false') {
			//disable logging
	    console = console || {};
	    console.log = function(){};
	} else{
		var morgan = require('morgan');
		// show only errors
		app.use(morgan('dev', {
			skip: function(req,res){ return res.statusCode < 400; }
		}));
	};
	
	/**
	 * SETTINGS
	 */
	app.set('theme',process.env.DEFAULT_THEME);
	app.set('base_url',process.env.BASE_URL + ':' + locals.__port);
	app.engine('ejs', ejs_mate);
	app.set('view engine', 'ejs');
	app.set('views', locals.__root + '/themes/' + app.get('theme') );


	/**
	 * CHECK DB CONNECTION && INSTALLATION
	 */
	installer.check_database(app);

	/**
	 * FRONTEND PUSH SCRIPTS FUNCTION
	 */
	app.locals.scripts = [];
	app.locals.renderScripts =  function (all) {
		app.locals.scripts = [];
		if (all != undefined) {
			return all.map(function(script) {
				return '<script src="/admin/assets/js/modules/' + script + '"></script>';
			}).join('\n ');
		}else {
			return '';
		}
	};

	/**
	 * UTILs functions for front end
	 */
	app.locals.utils = (function(){
		String.prototype.capitalize = function() {
		    return this.charAt(0).toUpperCase() + this.slice(1);
		}
	})();


	process.emit('server_configured');
}
