var mongoose = require("mongoose");
	fs = require("fs"),
	Q = require("q"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),	
	__root = global.appRoot,
	crypto = require("../lib/crypto"),
	Message = require("../lib/message-helper").message;


var that = module.exports = {
	shared: {
		db_link:"",
		isInstalled:false,
		admin:"",
		title:"",
		theme:"basic",
		home:"home-template"
	},
	connectDatabase:function(URI,$ee){ 
		var options = { replset:{ socketOptions:{} }, server:{ socketOptions:{} } };
		options.replset.socketOptions = { keepAlive: 1 };
		options.server.socketOptions = { keepAlive: 1 };
		mongoose.connect(URI, options); 
		$ee.emit("mongo_global","mongo_global");
	},
	checkPwd:function(userId, password){
		var deferred = Q.defer();
		User.findById( userId, function(err,user){
			if(!err) deferred.resolve(crypto.bcrypt.compare(password,user.password));
			if(err) deferred.reject(err);
		});
		return deferred.promise;
	},
	changePwd:function(userId, password, newPwd){
		var deferred = Q.defer();
		User.findById( userId, function(err,user){
			if(user) {
				if(crypto.bcrypt.compare(password,user.password)){
					user.password = crypto.bcrypt.encrypt(newPwd);
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
	},
	checkDatabase:function(mongo){
		//console.log("mongolink:",mongo);
		var testConnection = function(){
			var deferred = Q.defer();
			console.log("functions.js", mongo);
			mongoose.connect(mongo.link,function(err){
				//RESOLVE PROMISE
				if (err) deferred.reject({ err: err, status: 400 });
				if (!err) {
					deferred.resolve({ err: null, status: 200 });
					//if connection is right save link to reuse later
					that.shared.db_link = mongo.link;
				}
				mongoose.disconnect();
			});
			return deferred.promise;
		}
		return testConnection();		
	},
	installation:function(cms){
		var defferedInstall = Q.defer();
		var mongoLink = cms.mongo || that.shared.db_link;
		var cms = cms;

		mongoose.disconnect();
	
		function connect(cms){
			var deferred = Q.defer();
			mongoose.connect(mongoLink,function(err){
				deferred.resolve({ err:err })
			});
			return deferred.promise;
		}

		function createUser(prev){
			console.log("functions.js :92 <<<<<<<<<<<<<<< ", prev);
			var deferred = Q.defer();
			User.findOne({"username":cms.username},function(err,user){
				console.log("functions.js :95 >>>", err);
				if (err) deferred.reject({err:err, message:"error finding existing user"});
				if(!user) {
					new User({ username:cms.username, password:crypto.bcrypt.encrypt(cms.password), admin:true, role:"admin" })
					.save(function(err,user){
						if(err) deferred.reject({err:err, message:"error saving user"})
						//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
						new Post({
							title:"Sample post",
							slug:"sample-post",
							body:"Hello World!",
							publishedBy:{
								user:user._id,
							},
							status:"published"
						}).save();
						new Page({
							slug:"sample-page",
							title:"Sample",
							body:"Hi I'm a page :)",
							publishedBy:{
								user:cms.user,
							},
							status:"published"
						}).save();
						//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
						deferred.resolve({message:"User created", user: user});
					});
				} else{
					console.log("functions.js :126", "exists");
					deferred.reject({error:"User Exists", user: cms.username});
				}
			});
			return deferred.promise;
		}

		function saveBlogConf(prev){
			var deferred = Q.defer();
			console.log("functions.js :133 <<<<<<<<<<<<<<< ", prev);
			that.shared.admin = cms.username;
			that.shared.title = cms.title;
			that.shared.subtitle = cms.subtitle;
			that.shared.db_link = crypto.encrypt(that.shared.db_link);
			that.shared.isInstalled = true;
			new Configs(that.shared)
			.save(function(err){
				if (err) deferred.reject({err:err, message:"error saving configurations"})
				fs.writeFileSync(__root + "/bin/config.json", JSON.stringify({ db_link: that.shared.db_link }) );
				app.set("mongo_db", true);
				deferred.resolve({message:"User&Blog Created", error:err});
			});
			return deferred.promise;
		}

		return connect();
		//.then(createUser);
		// .then(saveBlogConf)
		// .catch(function(err){
		// 	console.log("functions.js :160", err);
		// })

	},
	register:function(newUser){
		var deferred = Q.defer();
		new User({ 
			username:newUser.username, 
			password:crypto.bcrypt.encrypt(newUser.password),  
			role:"guest"
		}).save(function(err,user){
			if ( err === null ) return deferred.resolve(new Message("User Created!"));
			return deferred.reject( new Message(null, "Error saving user, try again!") );
		});
		
		return deferred.promise;
	},
	dataParser:function(original,name,add){
		if(typeof original === "string" ){ 
			original = JSON.parse(original); 
			if( name && add ) original[name] = add;
		} else {
			if( name && add ) original[name] = add;
		}
		return JSON.stringify(original);
	}
}
