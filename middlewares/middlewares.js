var path = require("path");
var Q 	= require("q");
var bodyParser = require("body-parser");
var fs = require("fs");
var __root = global.appRoot;
var $F = require("../configs/functions"),
	$S = $F.shared;
var Configs = require("../models/configs");

module.exports = function(app,express,$ee){
	//set static content folder	
	app.use( express.static(global.appRoot + "/public") );
	//global checks
	app.use(bodyParser());
	// attach shared object in al req
	// app.use(function(req,res,next){
	// 	req.shared = $S;
	// 	next();
	// });
	app.use(function(req,res,next){
		//if blog is installed load global configs
		var getData = function(){
			var deferred = Q.defer();
			fs.readFile(__root+"/bin/config.json","utf-8",function(err,file){
				if (req.method === "POST") { next(); };
				if(req.method === 'GET' && file.length <= 0) { 
					res.render("../install", {title:"CMS Installation"}); 
				}
				if(file.length > 0) { 
					Configs.findOne({},function(err,configs){
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
			req.shared = JSON.parse(supp);
			delete req.shared.db_link;
			delete req.shared.__v;
			delete req.shared._id;
			//console.log("middlewares.js PROMISE", data);
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
}


//