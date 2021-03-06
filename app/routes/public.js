
module.exports = function(app,extend){
	/**
	 * CONTROLLERS
	 */
	var PageCtrl   = require( app.locals.__app + '/controllers/page')(app);
	var PostCtrl   = require( app.locals.__app + '/controllers/post')(app);
	var PublicCtrl = require( app.locals.__app + '/controllers/public')(app);
	var ApiCtrl    = require( app.locals.__app + '/controllers/api')(app);

	extend.routes.public(app);
	
	app.get('/', PublicCtrl.home_index );
	app.get('/page/:page', PageCtrl.show );
	app.get('/post/:post', PostCtrl.show );
	app.get('/404', PublicCtrl.not_found_page );
	
	app.get('/logout',function(req,res){
		req.logout();
		res.redirect('/');
	});

	app.post('/search', PublicCtrl.search_term );

}

