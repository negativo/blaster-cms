module.exports = function(app){

	var User       = require(app.locals.__app + "/models/user"),
	Configs    = require(app.locals.__app + "/models/configs"),
	Post       = require(app.locals.__app + "/models/posts"),
	Page       = require(app.locals.__app + "/models/pages"),
	Comment    = require(app.locals.__app + "/models/comments");

	return {
		index: function (req, res) {
			res.send("show list");
		},
		show: function (req, res) {
			res.send("show single");
		},
		create:function(req,res){
			res.send("create view");
		},
		store:function(req,res){
			res.send("store single");
		},
		destroy:function(req,res){
			res.send("delete");
		},
		edit:function(req,res){
			res.send("edit view");
		},
		update:function(req,res){
			res.send("update");
		},
	};

}