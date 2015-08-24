installation:function(cms){
		var deferred = Q.defer();
		var mongoLink = that.shared.db_link;

		//var P = { message:"", err:[] }
		var saveBlogData = function(){
			that.shared.admin = cms.username;
			that.shared.title = cms.title;
			that.shared.subtitle = cms.subtitle;
			that.shared.db_link = crypto.encrypt(that.shared.db_link);
			that.shared.isInstalled = true;
			//console.log("functions.js", that);
			new Configs(that.shared)
					.save(function(err){
						console.log("functions.js blog data saving: ", err);
						fs.writeFileSync(__root + "/bin/config.json", JSON.stringify({ db_link: that.shared.db_link }) );
						deferred.resolve({message:"User&Blog Created", error:err});
						app.set("mongo_db", true);
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
					new User({ username:cms.username, password:crypto.bcrypt.encrypt(cms.password), admin:true, role:"admin" }).save(function(err,user){
						if(err === null) {
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