var install = require("../controllers/install");

module.exports = function(){

	installCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", {
					title: req.render.header.title + " - Installation"
				});
			}
			 else {
				res.render("home", {
					title: req.render.header.title + " - Home"
				});
			 }
		});	
	}

	homeCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", {
					title: req.render.header.title + " - Installation"
				});
			}
			 else {
				res.render("home", {
					title: req.render.header.title + " - Home"
				});
			 }
		});
	}

}