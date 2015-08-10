var mongoose = require("mongoose");
	fs = require("fs"),
	Q = require("q"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Page = require("../models/pages"),	
	__root = global.appRoot,
	crypto = require("../library/crypto");


var that = module.exports = {
	shared: {
		isInstalled: false,
		db_link:"",
		db_status:"",
		user:{
			admin:"",
			_id:""
		},
		header:{
			title:"Blog",
			admin:function(){ return that.shared.user.admin; }
		},
		footer:{},
		local:{}
	},
	sharedUpdate:function(newShared){ return that.shared = newShared; },
	isInstalled: function(){ return that.shared.isInstalled; },
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
			var deferred = Q.defer();
			mongoose.connect(mongo.link,function(err){
				//RESOLVE PROMISE
				if (err) deferred.reject({ err: err, status: 400 });
				if(!err) {
					deferred.resolve({ err: null, status: 200 });
					//if connection is right save link to reuse later
					that.shared.db_link = crypto.encrypt(mongo.link);
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
		var mongoLink = crypto.decrypt(that.shared.db_link);

		//var P = { message:"", err:[] }
		var saveBlogData = function(){
			that.shared.user.admin = cms.username;
			that.shared.header.title = cms.title;
			that.shared.isInstalled = true;
			//console.log("functions.js", that);
			new Configs(that.shared)
					.save(function(err){
						console.log("functions.js blog data saving: ", err);
						fs.writeFileSync(__root + "/bin/config.json", JSON.stringify(that.shared) );
						deferred.resolve({message:"User&Blog Created", error:err});
					})
		};
		mongoose.disconnect();
		console.log("functions.js", that.shared.db_link);
		mongoose.connect("mongodb://localhost:27017/"+cms.title,function(err){
			if(!err) console.log("functions.js", " connected to mongoDB");
				else deferred.reject({error : err});


			User.findOne({"username":cms.username},function(err,user){
				if(user == null) {
					//console.log("functions.js", user,"non esiste");
					new User({username:cms.username, password:crypto.encrypt(cms.password), admin:true}).save(function(err,user){
						if(err === null) {
							that.shared.user._id = user._id;
							//REFACTOR THIS REFACTOR THIS REFACTOR THIS <<<<<<<<<<<<<<<
							new Post({title:String,
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
	syncConfig: function(configs,$ee){
		var link = that.db_link;
		//remove and save 
		Configs.find().remove().exec();
		new Configs(configs).save(function(err,item){
			if(err) console.log("functions.js updating configs error:", err);
				$ee.emit("configs_updated",configs);
				console.log("functions.js item:", item);
		});
	}
}
//testing post parameters
//curl -i -X POST -H 'Content-Type: application/json' -d '{"title": "jsDEN","username":"Neofrascati","password":"Stratomerder1290"}' http://localhost:9001/install/blog