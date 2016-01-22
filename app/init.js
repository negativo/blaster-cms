exports.init = function(app,express){

	process.title = process.env.NODE_TITLE;

	/**
	 * EVENTS
	 */
	require(app.locals.__app + "/configs/events")(app);

	/**
	 * CONFIG & STARTUPS
	 */
	require(app.locals.__app + "/configs/config")(app, express);

	/**
	 * ROUTINES
	 */
	require(app.locals.__app + "/configs/routines")(app);


	/**
	 * MIDDLEWARES GLOBALS
	 */
	require(app.locals.__app + "/middlewares/middlewares")(app,express);

	/**
	 * ROUTES
	 */
	require(app.locals.__app + "/routes/public")(app,express), 	// Public
	require(app.locals.__app + "/routes/private")(app,express),	// Private
	require(app.locals.__app + "/routes/api")(app,express);			// API

	/**
	 * EXTENDs
	 * in /extends
	 */
	
	var extend = require(app.locals.__root + "/extends")(app);

	/**
	 * START SERVER
	 */
	
	app.listen(app.locals.__port, function(){
		console.log("Server up on port: " + String(app.locals.__port).inverse.green);
	});	


	app.get('/test',function(req,res){
		res.send("test");
	});

}