var fs = require("fs");
var __root = global.appRoot;
var mongoose = require("mongoose");
module.exports = {

	init:function(){
		if (this.isInstalled()) {
			//is installed
		}else{
			//is not installed
		}
	},
	isInstalled: function(){
		fs.exists(__root + "/blog.config", function(exists){
			console.log(exists);
		})
	},
	install:function(data){
		mongoose.connect(data.mongoDB+"/"+data.blogName,function(err){
			if(err) console.log(err);
			var Blog = mongoose.model("blog",{});

			var entry = new Blog(data);
			entry.save(function(err){
				if(err) console.log(err)
			});
		})
	}

}//endmodule