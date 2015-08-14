var path = require("path");
	Q 	= require("q"),
	bodyParser = require("body-parser"),
	fs = require("fs"),
	__root = global.appRoot,
	$F = require("../configs/functions"),
	Configs = require("../models/configs"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	passport = require("passport");

module.exports = function(app,express,$ee){

	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	app.use( express.static(__root + "/views/installer/assets") );
	app.use("/admin", express.static(global.appRoot + "/private") );
	//parsers
	app.use(bodyParser());
	//logins
	require("../lib/login-strategy")(passport,$ee);
	app.use(cookieParser());
	app.use(session({ secret: 'WeGonnaConqueryTheFuckinWorldISwearIt' }));
	app.use(passport.initialize());
	app.use(passport.session());


	app.use(function(req,res,next){
		//console.log("middlewares.js >>> IS MONGO OK?", app.get("is_installed"));
		if (req.method === "POST") { next(); }
		if(req.method === 'GET' && app.get("mongo_db") ) { 
			Configs.findOne({},function(err,configs){
				var cfg = JSON.stringify(configs);
					cfg = JSON.parse(cfg);
				global.theme = cfg.theme;
				req.shared = cfg;
				req.templates = cfg.templates;
				req.theme = cfg.theme;
				delete req.shared.db_link;
				delete req.shared.__v;
				delete req.shared._id;
				$ee.emit("configs_updated", cfg, "Configuration has been reloaded");
				next();			
			});
		}
		if(req.method === 'GET' && !app.get("mongo_db") ) { 
			app.set("views", __root + "/views/installer" );
			res.render("install"); 
		};		
	});

	// Change view folder public frontend
	// change configs template on mongo to change template if you have others
	// SE SCAPOCCIANO RIMETTILI PRIMA DEL CHECK AL DB TUTTI E TRE
	app.use("/*",function(req,res,next){
		app.use( express.static(__root + "/views/" + global.theme) );
		app.set("views", __root + "/views/" + global.theme );
		next();
	});


    //specific route check if user is logged to avoid curl req to the server
    app.use("/admin", function(req,res,next){
		app.set("views", __root + "/admin");
    	if (req.url === "/login") return next();
		if(req.session && req.user && req.isAuthenticated() ) return next();
		res.redirect("/admin/login");
    });

	app.use(function(req,res,next){
		if (req.method === "GET" ) req.shared.isLoggedIn = req.isAuthenticated();
		next();
	});

}