var mongoose = require("mongoose");
var crypto   = require("../lib/crypto");
var Q        = require('q');
var Message  = require("../lib/message-helper").message;

var Schema = mongoose.Schema;

var UserSchema = new Schema({
	username             : String,
	password             : { type:String, select:false },
	name                 : { type:String, default:"" },
	email                : { type:String, default:"" },
	avatar               : { type:String, default: require('../configs/globals').admin_assets + "dummy-user.png" },
	createdOn            : { type: Date, default: Date.now() },
	role                 : { type:String, default:'guest' },
	admin                : { type:Boolean, default:false },
	master               : { type:Boolean, default:false },
	resetToken					 : { type:String }, //expires after 30min
	resetTokenCreated		 : { type:Date },
});

/**
 * HOOKS
 */
UserSchema.pre('save',function(next){
	// hash password if saving to db or skip
	var user = this;
	
	if (user.isModified('password')) {
		user.password = crypto.bcrypt.encrypt(user.password);
	}

	if (user.isModified('email')) {
		user.email = user.email.toLowerCase();
	}

	next();
});

UserSchema.post('remove',function(){
  var media = this;
  process.emit('user_removed');
});

/**
 * INSTANCE METHODS
 */

UserSchema.methods.comparePassword = function(candidatePassword) {
	/**
	 * Compare string password with hashed in database
	 * @param  {String} candidatePassword
	 * @return {boolean}
	 */
  return crypto.bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateResetToken = function(cb) {
	this.resetToken = require('bcrypt').genSaltSync(24);
	this.resetTokenCreated = Date.now();
	return this.save(cb);
};

/**
 * [isTokenExpired description]
 * @return false if not expired
 */
UserSchema.methods.isTokenExpired = function() {
	var now = Date.now();
	var difference = process.env.RESET_TOKEN_EXPIRES_IN; // 30 min
	return (Date.now() >= ( this.resetTokenCreated.getTime() + difference*60000)) ;
};


/**
 * MODEL METHODS
 */

UserSchema.statics.change_password = function(user_id, old_password, new_password) {
	/**
	 * Change user password
	 * @param  {String} user_id      
	 * @param  {String} old_password 
	 * @param  {String} new_password 
	 * @return {Promise}              
	 */
	var deferred = Q.defer();
	this.findById( user_id, { password:1 }, function(err,user){
		if(user) {
			if( user.comparePassword(old_password) ){
				user.password = new_password;
				user.save(function(err,saved){
					console.log("functions.js :47", err, saved);
					if (err === null) deferred.resolve("Password changed");
					if (err !== null) deferred.reject("error while saving " + err);
				});
			}else{
				deferred.reject("current password incorrect ");
			};
		}
		if(err) {
			deferred.reject("user not found " + err);
		}
	});
	return deferred.promise;
};

UserSchema.statics.register_new = function(new_user) {
	var deferred = Q.defer();
	var UserModel = this;

	this.findOne({ "username": new_user.username },function(err, user){
		if(user) return res.send( new Message(null, "User Exists") );
		new UserModel({ 
			username: new_user.username, 
			password: new_user.password,
			role:"guest"
		})
		.save(function(err,user){
			if ( err === null ) return deferred.resolve(new Message("User Created!"));
			return deferred.reject( new Message(null, "Error saving user, try again!") );
		});
	});
	
	return deferred.promise;
};


/**
 * DELETE USER
 * purge: destroy every user content and account
 * deleteAdminInherit: remove user but admin inherit his content
 */
UserSchema.statics.purge = function(user_id) {
	var Post     = require("../models/posts");
	var Page     = require("../models/pages");
	var Comment  = require("../models/comments");
	var User     = require("../models/user");
	var Media    = require("../models/media");

	var user_to_delete;

	return (function(){
		var deferred = Q.defer();
		User.findById( user_id, function(err,user){
			if(err) return deferred.reject(err);
			if( user && (!user.admin || !user.role == 'admin') ){
				deferred.resolve(user);
			}else{
				deferred.reject("Can't delete an admin");
			}
		})
		return deferred.promise;
	})()
	.then(function(user){
		user_to_delete = user;

		return Q.all([
			Media.find({ 'owner': user_id }),
			Comment.find({ 'user': user_id }),
			Post.find({ 'publishedBy.user': user_id }),
			Page.find({ 'publishedBy.user': user_id }),
		]);
	})
	.then(function(data){
		var the_promises = [];
		
		data[0].forEach(function(media){
			the_promises.push(media.remove());
		});
		data[1].forEach(function(comments){
			the_promises.push(comments.remove());
		});
		data[2].forEach(function(post){
			the_promises.push(post.remove());
		});
		data[3].forEach(function(page){
			the_promises.push(page.remove());
		});

		return Q.all(the_promises);
	})
	.then(function(data){
		return user_to_delete.remove();
	});
};

UserSchema.statics.deleteAdminInherit = function(user_id) {
	var Post     = require("../models/posts");
	var Page     = require("../models/pages");
	var Comment  = require("../models/comments");
	var User     = require("../models/user");
	var Media    = require("../models/media");

	var admin_id;

	var the_promises = [];

	var user_to_delete;

	var changeMediaOwner = function(medias){
		medias.forEach(function(media){
			media.owner = admin_id;
			the_promises.push(media.save());
		});
	}

	var changeCommentOwner = function(comments){
		comments.forEach(function(comment){
			the_promises.push(comment.remove());
		});
	}

	var changePostOwner = function(posts){
		posts.forEach(function(post){
			post.publishedBy.user = admin_id;
			the_promises.push(post.save());
		});
	}

	var changePageOwner = function(pages){
		pages.forEach(function(page){
			page.publishedBy.user = admin_id;
			the_promises.push(page.save());
		});
	}

	return (function(){
		var deferred = Q.defer();
		User.findById( user_id, function(err,user){
			if(err) return deferred.reject(err);
			if( user && (!user.admin || !user.role == 'admin') ){
				deferred.resolve(user);
			}else{
				deferred.reject("Can't delete an admin");
			}
		})
		return deferred.promise;
	})()
	.then(function(user){
		user_to_delete = user;

		return Q.all([
			Media.find({ 'owner': user_id }),
			Comment.find({ 'user': user_id }),
			Post.find({ 'publishedBy.user': user_id }),
			Page.find({ 'publishedBy.user': user_id }),
		]);
	})
	.then(function(data){
		var deferred = Q.defer();

		User.findOne({ "admin": true}, function(err, admin){
			if(err) deferred.reject(err);
			return deferred.resolve({ admin:admin, datas: data});
		});

		return deferred.promise;
	})
	.then(function(data){
		admin_id    = data.admin._id;
		var media   = data.datas[0];
		var comment = data.datas[1];
		var post    = data.datas[2];
		var page    = data.datas[3];

		changeMediaOwner(media);
		changeCommentOwner(comment);
		changePostOwner(post);
		changePageOwner(page);

		return Q.all(the_promises);
	})
	.then(function(data){
		return user_to_delete.remove();
	});
};


module.exports = mongoose.model("User", UserSchema);

