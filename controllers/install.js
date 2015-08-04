var fs = require("fs");

module.exports = function(install){

	var blogConfig = {
		blogName:"jsDEN",
		author:"Simone Corsi"
	}
	blogConfig = JSON.stringify(blogConfig);

	var readConfig = function(object,callback){
		fs.readFile("blog.config", function(err,file){
			var j = JSON.parse(file);
			return callback(j);
		});
	}
	var createConfig = function(data){
		fs.open("blog.config","w",function(err){ if (err) throw err;})
		fs.writeFile("blog.config", data, function(err){
			if (err) throw err;
			console.log("installation ok")
		});
	}
	//check if blog-config.json exists if not create it
	//
	//HERE TO WORK, we automatic create blog.config with obbject above, but we should let user do it, the view is install.ejs do a form and work on it.
	return fs.exists(global.appRoot + "/blog.config", function (exists) {
		blogConfig = {};
		if (!exists) console.log();//createConfig(blogConfig);
			else readConfig(blogConfig,function(j){
				blogConfig = j;
				return install(exists);
			});
	});


}