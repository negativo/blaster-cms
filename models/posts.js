var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title:String,
	slug: String,
	body:String,
	template: { type: String, default: "post-template" },
	publishedBy:{
		user:{ type: Schema.Types.ObjectId, ref:"User" },
		date:{ type: Date, default: Date.now() }
	},
	status:String,
	type: { type:String, default: "post" },
	//comments: { type: Schema.Types.ObjectId, ref:"comments" },
	tags: Array,
	comments:[{ type: Schema.ObjectId, ref:"Comment"}]
});

module.exports = mongoose.model("Post", PostSchema);
