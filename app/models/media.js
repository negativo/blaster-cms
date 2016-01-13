var fs = require("fs");
var mongoose = require("mongoose");
var path = require("path");
var __root = path.join( __dirname, "../../");

var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	filename:String,
	path:String,
	tags:[{ type: Array, default:"media"} ],
});


// Model's Methods
MediaSchema.statics.all = function (callback) {
  return this.find({ }, callback);
}

MediaSchema.statics.removeMedia = function (id, callback) {

  return this.findById(id, function(err, media){
  	if(err) console.log("media.js :19", err);
  	fs.unlink( __root + media.path, function(err){
  		if(err) console.log("media.js :23", err);
  		media.remove(callback);
  	})
  })
}

module.exports = mongoose.model("Media", MediaSchema);


