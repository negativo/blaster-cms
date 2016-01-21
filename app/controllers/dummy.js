module.exports = function(app){

	var User       = require("../models/user"),
	Configs    = require("../models/configs"),
	Post       = require("../models/posts"),
	Page       = require("../models/pages"),
	Comment    = require("../models/comments");

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