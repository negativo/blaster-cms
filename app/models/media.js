var fs = require("fs");
var mongoose = require("mongoose");
var path = require("path");
var __root = path.join( __dirname, "../../");

var Schema = mongoose.Schema;

var MediaSchema = new Schema({
	filename:String,
	path:String,
  uploadedOn: { type:Date, default: Date.now() },
  owner: { type: Schema.Types.ObjectId, ref:"User" },
	tags:[{ type: Array, default:"media"} ],
});

MediaSchema.pre('remove',function(next){
  var media = this;
  fs.unlink( __root + media.path, function(err){
    if(err) return next();
    media.remove();
    next();  
  });
});

MediaSchema.post('remove',function(){
  process.emit('media_removed');
});


// Model's Methods
MediaSchema.statics.all = function (callback) {
  return this.find({ }, callback);
}

MediaSchema.statics.getUserMedia = function (userId, callback) {
  var User = require('./user');
  var Media = this;

  User.findById( userId, function(err, user){
    if(user.role === 'admin') return Media.find({ }).populate('owner').exec(callback);
    return Media.find({ owner: userId }).populate('owner').exec(callback);
  });
}

MediaSchema.statics.removeMedia = function (id, callback) {

  return this.findById(id, function(err, media){
  	if(err) console.log("media.js :19", err);
  	fs.unlink( __root + media.path, function(err){
  		if(err) console.log("media.js :23", err);
  		media.remove(callback);
  	});
  })
}

module.exports = mongoose.model("Media", MediaSchema);


