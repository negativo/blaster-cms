var	dotenv = require('dotenv').load();
var fs 		  = require('fs');
var crypto = require('../lib/crypto');
var mongoose = require('mongoose');

module.exports = function(app, express, $ee){
	var locals = app.locals;
	var $utils = require('../lib/utils')(app);
	
	locals.debug_mode_on = process.env.DEBUG_MODE_ON;
	if (process.env.DEBUG_MODE_ON==='false') {
			//disable logging
	    console = console || {};
	    console.log = function(){};
	} else{
		var morgan = require('morgan');
	    app.use(morgan('dev'));
	};
	
	app.set('base_url',process.env.BASE_URL + ':' + locals.__port);
	app.set('theme',process.env.DEFAULT_THEME);
	app.set('view engine', 'ejs');
	app.set('views', locals.__root + '/views/' + locals.__theme);

	// installation check fired from event.js on mongo successfull connection
	mongoose.connect('mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_TABLE );

	$ee.emit('server_configured');
}
