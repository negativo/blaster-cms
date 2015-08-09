var $F = require("../configs/functions");
	$S = $F.shared;

var ruotesControllers = require("../controllers/requests"),
	POST = ruotesControllers.POST,
	GET = ruotesControllers.GET;

module.exports = function(app,express){

	//GETs
	//	
	// DINAMIC ROUTING WORK IN PROGRESS
	// app.get('/pages/*', function (req, res) {
	//    Pages.find({ slug: req.url}, function (err, pageData) {
	//        res.render('page-template', {
	//            pageContent: pageData.content,
	//            pageTitle: pageData.title
	//        });
	//    });
	// });

	//POSTs
	app.post("/install/mongo", POST.install.mongo);
	app.post("/install/blog", POST.install.cms);

	app.post("/blog/post",function(req,res){
		res.send("ciao");	
	})
}