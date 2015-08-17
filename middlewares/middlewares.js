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
	app.use("/admin/", express.static(global.appRoot + "/private") );
	app.use("/admin/:sub/:sub2", express.static(global.appRoot + "/private") );
	app.use("/admin/:sub/:sub2/:sub3", express.static(global.appRoot + "/private") );
	app.use("/admin/:sub/:sub2/:sub3/:sub4", express.static(global.appRoot + "/private") );
	app.use("/admin/:sub/:sub2/:sub3/:sub4/:sub5", express.static(global.appRoot + "/private") );
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
				req.shared.site = cfg.title;
				//req.templates = cfg.templates;
				req.theme = cfg.theme;
				delete req.shared.db_link;
				delete req.shared.__v;
				delete req.shared._id;
				delete req.shared.templates;
				//get all template files and attach it, get it on the backend
				fs.readdir("./views/template",function(err, list){
					var pageTemplate = [];
					var postTempalte = [];
					var pagePattern = /-page-template.ejs/i
					var postPattern = /-post-template.ejs/i
					for (var i = 0; i < list.length; i++) {
						if ( list[i].match(pagePattern) ) {
							pageTemplate.push( list[i].replace(/.ejs/g,"") );
						};
						if ( list[i].match(postPattern) ) {
							postTempalte.push( list[i].replace(/.ejs/g,"") );
						};
					};
					req.pageTemplates = pageTemplate;
					req.postTempaltes = postTempalte;
				$ee.emit("configs_updated", cfg, "Configuration has been attached to requestes");
				next();			
				});
			});
		}
		if(req.method === 'GET' && !app.get("mongo_db") ) { 
			app.set("views", __root + "/views/installer" );
			res.render("install"); 
		};		
	});

	//find templates

	// Change view folder public frontend
	// change configs template on mongo to change template if you have others
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
		//console.log("middlewares.js", "PREREDIRECT >>> ", global.preRedirect);
		res.redirect("/admin/login");
    });

	app.use(function(req,res,next){
		if (req.method === "GET" ) req.shared.isLoggedIn = req.isAuthenticated();
		next();
	});


}