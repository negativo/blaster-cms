var $F = require("../configs/functions");
//Controllers

var GET = {
	homeCtrl: function(req,res){
		res.render("home", req.shared);
	}
};

var POST = {
	install:{
		mongo:function(req,res){
			//check if err is null in frontend
			$F.checkDatabase(req.body)
				.then(function(promise){
					res.status(promise.status)
					res.send(promise);
				})
				.fail(function(err){
					res.status(err);
					res.send(err);
				});
		},
		cms:function(req,res){
			$F.installation(req.body)
				.then(function(promise){
					console.log("request.js install promise", promise);
					res.send(promise);
				})
				.fail(function(err){
					console.log("request.js install promise", err);
					res.send(err);
				}); //if return err:null installation is ok
		}
	}//install methods
};


exports.GET = GET;
exports.POST = POST;