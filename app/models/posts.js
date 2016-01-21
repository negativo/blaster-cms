var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');
var autopopulate = require('mongoose-autopopulate');

var Schema = mongoose.Schema;

var PostSchema = new Schema({
	title: { type: String, default: "Sample Post" },
	slug: { type: String, default: "sample-post" },
	body:{ type: String, default: "Hello World!" },
	status: { type: String, default: "published" },
	template: { type: String, default: "post-template" },
	type: { type:String, default: "post" },
	tags: Array,
	comments:[{ type: Schema.ObjectId, ref:"Comment", autopopulate:true}],
	publishedBy:{
		user:{ type: Schema.Types.ObjectId, ref:"User", autopopulate:true },
		date:{ type: Date, default: Date.now() }
	}
}, {
  toObject: {
  virtuals: true
  },
  toJSON: {
  virtuals: true 
  }
});

/**
 * PLUGINS
 */
PostSchema.plugin(URLSlugs('title'));
PostSchema.plugin(autopopulate);

/**
 * MIDDLE
 */
PostSchema.pre('remove',function(next){
  var Comment = require("./comments")
  var post = this;

  post.comments.forEach(function(comment){
  	Comment.findById( comment._id, function(err, com){
  		console.log("posts.js :44", com);
  		if(!err && com){
  			com.remove();
  		}
  	});
  });

  next();
});

PostSchema.post('remove',function(){
  process.emit('post_removed');
});

/**
 * Virtuals
 */
PostSchema
	.virtual('comments_num')
	.get(function(){
		return this.comments.length;
	});

PostSchema.pre('save',function(next){
	var post = this;
	next();
});

PostSchema.statics.setup = function(userId, callback){
	process.emit('post_setup');
	var Post = this;
	new Post({ 
		publishedBy:{ user: userId }
	}).save(callback);
}

PostSchema.statics.all = function (cb) {
  return this.find({ }, cb);
}

PostSchema.statics.getById = function (id, cb) {
  return this.find({ _id: id}, cb);
}

PostSchema.statics.findBySlug = function (slug, callback) {

	return this.findOne({ "slug": slug }).exec(callback);

}

module.exports = mongoose.model("Post", PostSchema);


