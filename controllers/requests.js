var $F = require("../configs/functions"),
	User = require("../models/user"),
	Configs = require("../models/configs"),
	Post = require("../models/posts"),
	Pages = require("../models/pages");
//Controllers

var GET = {
	homeCtrl: function(req,res){
		var data = JSON.stringify(req.shared);
		//console.log("requests.js REQUEST OBJECT", { title: "data" } );
		res.render("home", { viewData: data });
	},
	pageCtrl:function (req, res) {
		//from /page/name-page to name-page
		var slug = req.url.replace("/pages","").substring(1).replace(/\//g, '-');
		console.log("requests.js", slug );
		Pages.findOne({ "slug": "sample-page"},function(err,page){
			var supp = JSON.stringify(req.shared);

			var data = JSON.parse(supp);
				data.page = page;
				data = JSON.stringify(data);

			res.render("page-template", { viewData: data } );

		});
	}
};

var POST = {
	install:{
		mongo:function(req,res){
			console.log("requests.js MONGOLINK", req.body);
			//check if err is null in frontend
			$F.checkDatabase(req.body)
				.then(function(promise){
					res.status(promise.status)
					res.send(promise);
				})
				.fail(function(err){
					console.log("requests.js MongoERROR:", err.err);
					res.status(err);
					res.send(err);
				});
		},
		cms:function(req,res){
			$F.installation(req.body)
				.then(function(promise){
					console.log("request.js install promise", promise);
					promise.isInstalled = true;
					res.send(promise);
				})
				.fail(function(err){
					console.log("request.js install promise", err);
					res.send(err);
				}); //if return err:null installation is ok
		}
	}//install methods
};


exports.GET = GET;
exports.POST = POST;