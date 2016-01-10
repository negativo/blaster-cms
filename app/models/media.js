var fs = require("fs");
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	filename:String,
	path:String,
});


// STILL DOESN'T WORK
MediaSchema.post('save', function(media){
	// console.log("media.js :17", __root + media.path);
	// lwip.open( __root + media.path, function(err, image){

	// 		image.batch()
	// 		.scale(0.5)
	// 		.writeFile( "uploads/" + media.filename, function(err){
	// 			if(err) console.log("media.js :23", err);
	// 			clog
	// 		} );	
	// });
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


