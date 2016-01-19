var	dotenv = require('dotenv').load();
var fs 		  = require('fs');
var crypto = require('../lib/crypto');
var mongoose = require('mongoose');
var ejs_mate = require("ejs-mate");

module.exports = function(app, express, $ee){
	var locals = app.locals;
	var installer = require('../lib/installer');
	
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
	 * HELPERS FUNCTIONS
	 */
	app.locals.scripts = [];
	app.locals.renderScripts =  function (all) {
		app.locals.scripts = [];
		if (all != undefined) {
			return all.map(function(script) {
				return '<script src="/admin/assets/js/' + script + '"></script>';
			}).join('\n ');
		}else {
			return '';
		}
	};

	$ee.emit('server_configured');
}
