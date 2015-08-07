var install = require("../controllers/install");

module.exports = function(){

	installCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", req.render);
			}
			 else {
				res.render("home", req.render);
			 }
		});	
	}

	homeCtrl = function(req,res){
		install.isInstalled().then(function(ex){
			if(!ex) { 
			 	res.render("install", req.render);
			}
			 else {
				res.render("home", req.render);
			 }
		});
	}

}