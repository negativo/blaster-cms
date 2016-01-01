var colors   = require('colors'),
Configs      = require("../models/configs"),
fs           = require("fs"),
Q 	         = require("q"),
bodyParser   = require("body-parser"),
cookieParser = require("cookie-parser"),
session      = require("express-session"),
passport     = require("passport"),
mongoose     = require("mongoose");


module.exports = function(app,express, $ee){

	var installer = require("./installer")(app);

	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;
			
	app.__sessionOption = { 
		secret: 'WeGonnaConqueryTheFuckinWorldISwearIt',
		store: require('mongoose-session')(mongoose),
		resave: true,
		saveUninitialized: true,
		cookie:{ maxAge: 36000000 } //change the session after dev 
	};
	
	/**
	 * INSTALLATION CHECKS
	 */
	app.use(installer.check);

	/**
	 * STATICS
	 */
	app.use( express.static( __root + "/public") );
	app.use( express.static(__root + "/installer/assets") );

	/**
	 * VIRTUAL PATH FOR STATICS
	 */
	app.use("/uploads" , express.static( __root + "/uploads") );
	app.use("/avatar"  , express.static( __root + "/uploads/avatar") );
	app.use("/private" , express.static( __root + "/private") );


	/**
	 * PARSERS
	 */
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	app.use(cookieParser());
	//logins
	require(__app + "/lib/login-strategy")(passport,$ee);


	/**
	 * SESSION & LOGIN
	 */
	app.use( function(req,res,next){
		session(app.__sessionOption);
		console.log("middlewares.js :62".red);
		next();
	});
	app.use( passport.initialize() );
	app.use( passport.session() );




	// set theme view folder
	app.use(function(req,res,next){
		if (app.locals.isInstalled){
			Configs.findOne({},function(err,configs){
					if(err){
						console.log("middlewares.js :76", err);
					}
					app.locals.__theme = configs.theme || "basic";
					req.shared = configs || {};
					req.shared.site = configs.title || "CMS";
					req.theme = configs.theme || "";
					req.navigation = configs.navigation || [];
					req.links = configs.links || [];
				
				//get page&posts templates
				fs.readdir(__root + "/views/" + app.locals.__theme ,function(err, list){
					if(err){
						console.log("middlewares.js :85", err);
					}
					var pageTemplates = [];
					var postTemplates = [];
					var pagePattern = /-page-template.ejs/i
					var postPattern = /-post-template.ejs/i
					for (var i = 0; i < list.length; i++) {
						if ( list[i].match(pagePattern) ) {
							pageTemplates.push( list[i].replace(/.ejs/g,"") );
						};
						if ( list[i].match(postPattern) ) {
							postTemplates.push( list[i].replace(/.ejs/g,"") );
						};
					};
					req.pageTemplates = pageTemplates;
					req.postTemplates = postTemplates;
					fs.readdir(__root + "/views/",function(err, list){
						req.avaible_themes = list;
						$ee.emit("configs_updated", configs, "Configuration has been attached to requestes");
						next();			
					});
				});
			});	
		} else {
			next();
		}

	});
	
	//switch views folder dinamically
	app.use(function(req,res,next){
		var p = /\/admin/;
		//console.log("middlewares.js :99", req.url.match(p) );
		if( req.url.match(p) ) {
			app.set("views", __root + "/admin" )
			next();
		}else{
			app.use( express.static(__root + "/views/" + app.locals.__theme) );
			app.set("views", __root + "/views/" + app.locals.__theme);
			next();
		}
	});

	//redirect to login if no authenticated and accessing admin areas
	app.use("/admin", function(req,res,next){
		//console.log("middlewares.js :106", req.url);
		if(req.url !== "/login" && req.method === "GET" && !req.isAuthenticated() ) return res.redirect("/admin/login"); 
		next();
	})

    //with this you get login status in frontend
	app.use(function(req,res,next){
		if (req.method === "GET" && req.shared ) req.shared.isLoggedIn = req.isAuthenticated() || false;
		next();
	});



}