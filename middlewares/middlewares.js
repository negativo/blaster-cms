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
	// app.use( express.static(global.appRoot + "/CMS_API") );
	//app.use("/pages", express.static(global.appRoot + "/public") );
	app.use("/admin", express.static(global.appRoot + "/private") );
	app.use(cookieParser());
	app.use(bodyParser());
	//logins
	require("../lib/login-strategy")(passport,$ee);
	app.use(session({ secret: 'WeGonnaConqueryTheFuckinWorldISwearIt' }));
	app.use(passport.initialize());
	app.use(passport.session());




	app.use(function(req,res,next){
		//if blog is installed load global configs
		var getData = function(){
			var deferred = Q.defer();
			fs.readFile(__root + "/bin/config.json","utf-8",function(err,file){
				if (req.method === "POST") { next(); };
				if(req.method === 'GET' && file.length <= 0) { 
					res.render("../install", {title:"CMS Installation"}); 
				}
				if(file.length > 0) { 
					Configs.findOne({},function(err,configs){
						var $c = JSON.stringify(configs);
							$c = JSON.parse($c);
						global.theme = $c.theme;
						if (err) deferred.reject({error:"Can't retrieve data from DB"});
						if (configs) deferred.resolve(configs);
					});
				}
				//if it's not installed install it.
			});
			return deferred.promise;			
		}
		//retrieve data
		getData()
		.then(function(data){
			var supp = JSON.stringify(data);
			//contain posts and pages and website info
			req.shared = JSON.parse(supp);
			//contain templates choice
			req.templates = req.shared.templates;
			delete req.shared.db_link;
			delete req.shared.__v;
			delete req.shared._id;
			//set template config object
			next();
		})
		.fail(function(data){
			console.log("middlewares.js REJECT", data);
			//req.shared.error = err;
			next();
		});
		//check if user is logged
		//	tobedone
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

}