var	dotenv   = require("dotenv").load(),
Configs      = require('../models/configs'),
fs           = require('fs'),
Q 	         = require('q'),
bodyParser   = require('body-parser'),
cookieParser = require('cookie-parser'),
session      = require('express-session'),
passport     = require('passport'),
mongoose     = require('mongoose'),
MongoStore	 = require('connect-mongo')(session);

module.exports = function(app,express, $ee){


	var installer   = require('./installer')(app).check,
			configParse = require('./config-parse')(app,$ee),
			viewSwitcher = require('./view-switch')(app);

	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
			
	// DEVO DISATTIVARE lA SESSIONE PRIMA DELL'INSTALLAZIONE
	app.__sessionOption = { 
		secret: process.env.SECRET,
		resave: true,
		saveUninitialized: false,
		//store: new MongoStore({ mongooseConnection: mongoose.connection }) || "",
		cookie:{ maxAge: 36000000 } //change the session after dev 
	};
	

	//set static content folder	
	app.use( express.static( __root + '/public') );
	app.use( express.static( __root + '/installer/assets') );

	//virtuals path to prepend
	app.use('/uploads' , express.static( __root + '/uploads') );
	app.use('/avatar'  , express.static( __root + '/uploads/avatar') );
	app.use('/private' , express.static( __root + '/private') );


	/**
	 * INSTALLATION CHECKS
	 */
	app.use(installer);

	//parsers
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	
	/**
	 * LOGIN STRATEGIES
	 */
	require(__app + '/lib/login-strategy')(passport,$ee);

	/**
	 * SESSION & LOGIN
	 */
	//app.use( session( app.__sessionOption )); // problem when installing because of session storage of mongo still uninitialized
	app.use( passport.initialize());
	app.use( passport.session());


	/**
	 * CONFIGURATION PARSE IN REQ && PARSE THEME STRUCTURE AND TEMPLATE
	 */
	app.use( configParse );
	
	/**
	 * SWITCH ADMIN & PUBLIC VIEW FOLDER DINAMICALLY
	 */
	app.use(viewSwitcher);

	//redirect to login if no authenticated and accessing admin areas
	app.use('/admin', function(req,res,next){
		if(req.url !== '/login' && req.method === 'GET' && !req.isAuthenticated() ) return res.redirect('/admin/login'); 
		next();
	})

  //with this you get login status in frontend
	app.use(function(req,res,next){
		if (req.method === 'GET' && req.shared ) req.shared.isLoggedIn = req.isAuthenticated() || false;
		next();
	});
	
}