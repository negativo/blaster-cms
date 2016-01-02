var mongoose = require("mongoose");
var User = require("./user");

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: { type: String, default: "Sample Post" },
	slug: { type: String, default: "sample-post" },
	body:{ type: String, default: "Hello World!" },
	status: { type: String, default: "published" },
	template: { type: String, default: "post-template" },
	type: { type:String, default: "post" },
	tags: Array,
	comments:[{ type: Schema.ObjectId, ref:"Comment"}],
	publishedBy:{
		user:{ type: Schema.Types.ObjectId, ref:"User"},
		date:{ type: Date, default: Date.now() }
	},
	meta:{
		postedBy:{ type: Schema.Types.ObjectId, ref:"User" },
		date:{ type: Date, default: Date.now() },
		tags:Array
	}
	//refactor to use meta insied of publishedBy 
	//when I have or someone have time to check all the reference..FML
});


// Model's Methods
PostSchema.statics.all = function (cb) {
  return this.find({ }, cb);
}

PostSchema.statics.getById = function (id, cb) {
  return this.find({ _id: id}, cb);
}

PostSchema.statics.getBySlug = function (slug, cb) {
  return this.find({ slug: slug}, cb);
}

module.exports = mongoose.model("Post", PostSchema);


