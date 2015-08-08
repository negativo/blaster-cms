var mongoose = require("mongoose");
	fs = require("fs"),
	Q = require("q"),
	User = require("../models/user.js"),
	Configs = require("../models/configs.js"),
	__root = global.appRoot,
	crypto = require("../library/crypto");


var that = module.exports = {
	shared: {
		isInstalled: false,
		db_link:"",
		admin:"",
		header:{
			title:"Blog",
			admin:function(){ return that.shared.admin; }
		},
		footer:{},
		local:{},
	},
	isInstalled: function(){ return that.shared.isInstalled; },
	connectDatabase:function(){},
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
	installation:function(blog){
		console.log("functions.js a:", blog);
		var deferred = Q.defer();
		var mongoLink = crypto.decrypt(that.shared.db_link);

		//var P = { message:"", err:[] }
		var saveBlogData = function(){
			that.shared.admin = blog.username;
			that.shared.header.title = blog.title;
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
		mongoose.connect("mongodb://localhost:27017/"+blog.title,function(err){
			if(!err) console.log("functions.js", " connected to mongoDB");
				else deferred.reject({error : err});


			User.findOne({"username":blog.username},function(err,user){
				if(user == null) {
					//console.log("functions.js", user,"non esiste");
					new User({username:blog.username, password:crypto.encrypt(blog.password), admin:true}).save(function(err){
						if(err === null) {
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
	syncConfig: function(configs){
		mongoose.disconnect();
		mongoose.connect(crypto.decrypt(configs.db_link),function(err){console.log("functions.js syncConfigs", err);});
		Configs.findOne({ "db_link": that.db_link},function(err,entry){
			new Configs(configs).save(function(err){
				if(err) console.log("functions.js updating configs error:", err);
				else {
					that.shared = config;
					console.log("functions.js updating configs OK");
				}
			});
		});

	}
}
//testing post parameters
//curl -i -X POST -H 'Content-Type: application/json' -d '{"title": "jsDEN","username":"Neofrascati","password":"Stratomerder1290"}' http://localhost:9001/install/blog