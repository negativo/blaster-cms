var install = require("../controllers/install");
var shared = require("../configs/functions").shared;

module.exports = function(){

	homeCtrl = function(req,res){
		res.render("home", req.shared);
	}

}