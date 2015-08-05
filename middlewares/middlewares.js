var path = require("path");
var bodyParser = require("body-parser");
var install = require("../controllers/install");
var fs = require("fs");

module.exports = function(app,express){
	//check if installed if not redirect
	//set static content folder
	app.use( express.static(global.appRoot + "/public") );
	app.use(bodyParser());

	app.use(function(req,res,next){
		//get env variables
		fs.exists(global.appRoot + "/blog.config",function(exists){
			if(exists) {
				fs.readFile(global.appRoot + "/blog.config","utf-8",function(err,file){
					if (err) throw err;
					var o = JSON.parse(file);
					process.env.BLOG_NAME = o.title; 
					process.env.AUTHOR = o.author; 
				});
			}
		});
		next();
	});

}