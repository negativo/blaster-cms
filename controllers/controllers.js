var install = require("../controllers/install");

module.exports = function(){

	installCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", {
					title: process.env.BLOG_NAME + " - Installation"
				});
			}
			 else {
				res.render("home", {
					title: process.env.BLOG_NAME + " - Home"
				});
			 }
		});	
	}

	homeCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", {
					title: process.env.BLOG_NAME + " - Installation"
				});
			}
			 else {
				res.render("home", {
					title: process.env.BLOG_NAME + " - Home"
				});
			 }
		});
	}

}