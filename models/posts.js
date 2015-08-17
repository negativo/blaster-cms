var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	// postedBy: {
 //        type: mongoose.Schema.Types.ObjectId,
 //        ref: 'User'
 //    },
	title:String,
	slug: String,
	body:String,
	template: { type: String, default: "post-template" },
	publishedBy:{
		user:String,
		date:{ type: Date, default: Date.now() }
	},
	status:String,
	type: { type:String, default: "post" },
	tags: Array
});

module.exports = mongoose.model("posts", PostSchema);
