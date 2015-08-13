var mongoose = require("mongoose");
	fs = require("fs"),
	Q = require("q"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),	
	__root = global.appRoot,
	crypto = require("../lib/crypto");


var that = module.exports = {
	shared: {
		db_link:"",
		admin:"",
		title:"",
		theme:"template",
		templates:{
					"home-template":"home-template",
					"page-template":"page-template",
					"post-template":"post-template"
		}
	},
	connectDatabase:function(URI,$ee){ 
		var options = { replset:{ socketOptions:{} }, server:{ socketOptions:{} } };
		options.replset.socketOptions = { keepAlive: 1 };
		options.server.socketOptions = { keepAlive: 1 };
		mongoose.connect(URI, options); 
		$ee.emit("mongo_global","mongo_global");
	},
	checkDatabase:function(mongo){
		//console.log("mongolink:",mongo);
		var testConnection = function(){
			console.log("functions.js", mongo);
			var deferred = Q.defer();
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
		console.log("functions.js a:", cms);
		var deferred = Q.defer();
		var mongoLink = that.shared.db_link;

		//var P = { message:"", err:[] }
		var saveBlogData = function(){
			that.shared.admin = cms.username;
			that.shared.title = cms.title;
			that.shared.db_link = crypto.encrypt(that.shared.db_link);
			//console.log("functions.js", that);
			new Configs(that.shared)
					.save(function(err){
						console.log("functions.js blog data saving: ", err);
						fs.writeFileSync(__root + "/bin/config.json", JSON.stringify({ db_link: that.shared.db_link }) );
						deferred.resolve({message:"User&Blog Created", error:err});
					})
		};
		mongoose.disconnect();
		console.log("functions.js", that.shared.db_link);
		mongoose.connect(mongoLink,function(err){
			if(!err) console.log("functions.js", " connected to mongoDB");
				else deferred.reject({error : err});

			User.findOne({"username":cms.username},function(err,user){
				if(user == null) {
					//console.log("functions.js", user,"non esiste");
					new User({ username:cms.username, password:crypto.bcrypt.encrypt(cms.password), admin:true }).save(function(err,user){
						if(err === null) {
							//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
							new Post({
								title:"Sample-post",
								body:"Hello World!",
								publishedBy:{
									user:cms.username,
									date:Date.now()
								},
								status:"published"
							}).save();
							new Page({
								slug:"sample-page",
								template:"page-template",
								title:"Sample",
								content:"Hi I'm a page :)",
								publishedBy:{
									user:cms.user,
									date:Date.now()
								},
								status:"published"
							}).save();
							//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
							saveBlogData();
						}
						if(err !== null )deferred.reject({error:err, message:"Problem creating user"});
					});
				} else{
					//console.log("functions.js", user.username );
					//REJECT USER EXISTS
					deferred.reject({error:"User Exists", user: user.username});
				}
			});

		});
		return deferred.promise;
	},
	dataParser:function(original,name,add){
		//  DATA SENDER HELPER
		//	Pass original object from req.shared then 
		//	pass a string with the name of the property you want to add
		//	and then the data you want to add to the new property.
		//  var json = JSON.stringify(original);
		//  var cloned = JSON.parse(json);
		//  cloned[name] = add;
		//  return JSON.stringify(cloned);
		//  console.log("functions.js", Object.isExtensible(original));
		if( name && add ) original[name] = add;
		return JSON.stringify(original);

		
	}
}
