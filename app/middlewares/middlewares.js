
module.exports = function(app,extend){
	var express = require('express');
	var	dotenv   = require("dotenv").load(),
	Configs      = require(app.locals.__app + '/models/configs'),
	fs           = require('fs'),
	csrf         = require('csurf'),
	Q            = require('q'),
	bodyParser   = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session      = require('express-session'),
	flash 			 = require("connect-flash"),
	passport     = require('passport'),
	mongoose     = require('mongoose'),
	MongoStore	 = require('connect-mongo')(session),
	mustBe 			 = require(app.locals.__app + '/middlewares/roles');

	var configParse = require(app.locals.__app + '/middlewares/config-parse')(app),
			viewSwitcher = require(app.locals.__app + '/middlewares/view-switch')(app);

	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
			
	/**
	 * SESSION OPTIONS
	 */
	app.__sessionOption = { 
		secret: process.env.SECRET,
		resave: true,
		saveUninitialized: false,
		store: new MongoStore({ mongooseConnection: mongoose.connection }),
		cookie:{ maxAge: 36000000 } //change the session after dev 
	};
	
	/**
	 * STATICS
	 */
	app.use( express.static( __root + '/public') );
	app.use( express.static( __root + '/installer/assets') );

	/**
	 * VIRTUAL PATHS FOR STATICS
	 */
	app.use('/uploads' , express.static( __root + '/uploads') );
	app.use('/avatar'  , express.static( __root + '/uploads/avatar') );
	app.use('/admin' , express.static( __root + '/admin') );


	/**
	 * PARSERs
	 */
	var csrfProtection = csrf({ cookie: true });
	app.use( bodyParser.urlencoded({ extended: true }) );
	app.use( bodyParser.json() );
	app.use( cookieParser() );
	
	/**
	 * LOGIN STRATEGIES
	 */
	require(__app + '/lib/login-strategy')(passport);

	/**
	 * SESSION & LOGIN
	 */
	app.use( session( app.__sessionOption )); // problem when installing because of session storage of mongo still uninitialized
	app.use( passport.initialize());
	app.use( passport.session());
	app.use( flash() );


	/**
	 * CONFIGURATION PARSE IN REQ && PARSE THEME STRUCTURE AND TEMPLATE
	 */
	app.use( configParse );
	
	/**
	 * SWITCH ADMIN & PUBLIC VIEW FOLDER DINAMICALLY
	 */
	app.use( viewSwitcher );

	//redirect to login if no authenticated and accessing admin areas
	app.use('/admin', function(req,res,next){
		if( !req.url.match(/\/(login|reset|register)/) && req.method === 'GET' && !req.isAuthenticated() ) return res.redirect('/admin/login'); 
		if( req.url.match(/\/(login|reset)/)  && req.method === 'GET' && req.isAuthenticated() ) return res.redirect('/admin/panel'); 
		next();
	});


  //with this you get login status in frontend && user logged
	app.use(function(req,res,next){
		if (req.method === 'GET' ) {
			app.locals.isAuthenticated = req.isAuthenticated() || false;
			res.locals.user = req.user || false;
		};
		next();
	});

	// add roles middleware on all /admin route except /login /reset-* and /user/:id
	app.use(/^\/admin\/[^login|reset|users|register].*/, mustBe('moderator')	);


	app.use('/login', function(req,res,next){
		res.redirect('/admin/login');
		next();
	});


	extend.middlewares.middlewares(app);

}