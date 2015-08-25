var path = require("path");
	Q 	= require("q"),
	bodyParser = require("body-parser"),
	fs = require("fs"),
	__root = global.appRoot,
	$F = require("../configs/functions"),
	Configs = require("../models/configs"),
	cookieParser = require("cookie-parser"),
	session = require("express-session"),
	passport = require("passport"),
	mongoose = require("mongoose");



module.exports = function(app,express,$ee){

	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	app.use( express.static(__root + "/installer/assets") );

	app.use("/uploads",express.static(global.appRoot + "/uploads") );
	app.use("/avatar",express.static(global.appRoot + "/uploads/avatar") );
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
	console.log("middlewares.js :32", app.get("mongo_db") );
	//dev purpose should be actived only after installation
	app.use(session({ 
		secret: 'WeGonnaConqueryTheFuckinWorldISwearIt',
		cookie:{ maxAge: 36000000 } //change the session after dev 
	}));		
	// app.use(session({ 
	// 	secret: 'WeGonnaConqueryTheFuckinWorldISwearIt',
	// 	store: require('mongoose-session')(mongoose),
	// 	cookie:{ maxAge: 36000000 } //change the session after dev 
	// }));
	app.use(passport.initialize());
	app.use(passport.session());


	app.use(function(req,res,next){
		if(req.method === 'POST') { 
			
			next(); 
		} 
		if(req.method === 'GET' && !app.get("mongo_db") ) { 
			app.set("views", __root + "/installer" );
			res.render("install"); 
		};	
		next();
	})

	app.use(function(req,res,next){
		Configs.findOne({},function(err,configs){
			if(!configs) return next();
				global.theme = configs.theme || "basic";
				req.shared = configs || {};
				req.shared.site = configs.title || "CMS";
				req.theme = configs.theme || "";
				req.navigation = configs.navigation || [];
				req.links = configs.links || [];
			
			//get all template files and attach it, get it on the backend
			fs.readdir("./views/template",function(err, list){
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
				fs.readdir("./views/",function(err, list){
					req.avaible_themes = list;
					$ee.emit("configs_updated", configs, "Configuration has been attached to requestes");
					next();			
				});
			});
		});	

	});
	
	//switch views folder dinamically
	app.use(function(req,res,next){
		var p = /\/admin/;
		console.log("middlewares.js :99", req.url.match(p) );
		if( req.url.match(p) ) {
			app.set("views", __root + "/admin" )
			next();
		}else{
			app.use( express.static(__root + "/views/" + global.theme) );
			app.set("views", __root + "/views/" + global.theme );
			next();
		}
	});

	//redirect to login if no authenticated and accessing admin areas
	app.use("/admin", function(req,res,next){
		console.log("middlewares.js :106", req.url);
		if(req.url !== "/login" && req.method === "GET" && !req.isAuthenticated() ) return res.redirect("login"); 
		next();
	})

    //with this you get login status in frontend
	app.use(function(req,res,next){
		if (req.method === "GET" && req.shared ) req.shared.isLoggedIn = req.isAuthenticated() || false;
		next();
	});



}