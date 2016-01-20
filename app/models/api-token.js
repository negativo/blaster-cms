var bcrypt   = require('bcrypt');
var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ApiTokenSchema = new Schema({
  token : { type:String, default: bcrypt.hashSync(bcrypt.genSaltSync(10),bcrypt.genSaltSync(10)) },
  type  : { type:String, default:"api"},
  user  : { type: Schema.Types.ObjectId, ref:"User" },
});


ApiTokenSchema.statics.findByUserId = function(user_id, callback){

  return this.find({ user: user_id}, function(err, token){
    if(err) return callback(err);
    return callback(null, token);
  });  
}

module.exports = mongoose.model("Token" , ApiTokenSchema);


