var mongoose = require("mongoose");
var User = require("./user");
var Post = require("./posts");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment:String,
	date: { type: Date, default: Date.now() },
	user:{ type: Schema.Types.ObjectId, ref:"User" },
	post_id:{ type: Schema.Types.ObjectId, ref:"Post" },
	reply: [{ type: Schema.Types.ObjectId, ref:"Comment" }]
});



module.exports = mongoose.model( "Comment", CommentSchema );
