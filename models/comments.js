var mongoose = require("mongoose");
var User = require("./user");
var Post = require("./posts");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment:String,
	date: { type: Date, default: Date.now() },
	user:{ type: Schema.Types.ObjectId, ref:"user" },
	post:{ type: Schema.Types.ObjectId, ref:"post" },
	reply: [{ type: Schema.Types.ObjectId, ref:"comment" }]
});

module.exports = mongoose.model( "comment", CommentSchema );
