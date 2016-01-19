var mongoose = require("mongoose");
var User = require("./user");
var Post = require("./posts");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
	comment:String,
	date: { type: Date, default: Date.now() },
	user:{ type: Schema.Types.ObjectId, ref:"User" },
	post_id:{ type: Schema.Types.ObjectId, ref:"Post" },
	comments: [{ type: Schema.Types.ObjectId, ref:"Comment" }]
});

CommentSchema.post('remove',function(){
  process.emit('comment_removed');
});

module.exports = mongoose.model( "Comment", CommentSchema );
