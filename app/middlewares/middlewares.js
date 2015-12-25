var path     		 = require("path"),
		Configs      = require("../models/configs"),
		fs           = require("fs"),
		Q 	         = require("q"),
		bodyParser   = require("body-parser"),
		cookieParser = require("cookie-parser"),
		session      = require("express-session"),
		passport     = require("passport"),
		mongoose     = require("mongoose");


module.exports = function(app,express, $ee){

	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;


	//set static content folder	
	app.use( express.static( __root + "/public") );
	app.use( express.static(__root + "/installer/assets") );

	//virtuals path to prepend
	app.use("/uploads" , express.static( __root + "/uploads") );
	app.use("/avatar"  , express.static( __root + "/uploads/avatar") );
	app.use("/private" , express.static( __root + "/private") );


	//parsers
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	//logins
	require(__app + "/lib/login-strategy")(passport,$ee);
	app.use(cookieParser());

	//don't store in db session
	app.use(session({ 
		secret: 'WeGonnaConqueryTheFuckinWorldISwearIt',
		cookie:{ maxAge: 36000000 } //change the session after dev 
	}));		
	//store session in db
	// app.use(session({ 
	// 	secret: 'WeGonnaConqueryTheFuckinWorldISwearIt',
	// 	store: require('mongoose-session')(mongoose),
	// 	resave: true,
 //    saveUninitialized: true,
	// 	cookie:{ maxAge: 36000000 } //change the session after dev 
	// }));
	app.use(passport.initialize());
	app.use(passport.session());

	// check if installed
	app.use(function(req,res,next){
		fs.readFile( app.locals.__configs , "utf-8", function(err,file){
			if (typeof file !== 'undefined' && file.length > 0) {
				app.locals.isInstalled = true;
				next();
			}else{
				next();
			}
		});	
	})

	app.use(function(req,res,next){
		if( req.method === 'GET' && !app.locals.isInstalled ) { 
			app.set("views", __root + "/installer" );
			return res.render("install"); 
		};	
		next();
	});

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
				
				//get all template files and attach it, get it on the backend
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
		console.log("middlewares.js :106", req.url);
		if(req.url !== "/login" && req.method === "GET" && !req.isAuthenticated() ) return res.redirect("/admin/login"); 
		next();
	})

    //with this you get login status in frontend
	app.use(function(req,res,next){
		if (req.method === "GET" && req.shared ) req.shared.isLoggedIn = req.isAuthenticated() || false;
		next();
	});

}