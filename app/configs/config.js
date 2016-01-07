var	dotenv = require('dotenv').load();
var fs 		  = require('fs');
var crypto = require('../lib/crypto');
var mongoose = require('mongoose');

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
	    app.use(morgan('dev'));
	};
	
	/**
	 * SETTINGS
	 */
	app.set('base_url',process.env.BASE_URL + ':' + locals.__port);
	app.set('theme',process.env.DEFAULT_THEME);
	app.set('view engine', 'ejs');
	app.set('views', locals.__root + '/views/' + locals.__theme);

	/**
	 * CHECK DB CONNECTION && INSTALLATION
	 */
	installer.check_database(app);


	

	$ee.emit('server_configured');
}
