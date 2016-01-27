exports.init = function(app,express){

	process.title = process.env.NODE_TITLE;

	/**
	 * GET EXTENDs
	 * in /extends
	 */
	var extend = require(app.locals.__root + "/extends")();

	/**
	 * EVENTS
	 */
	require(app.locals.__app + "/configs/events")(app, extend);

	/**
	 * CONFIG & STARTUPS
	 */
	require(app.locals.__app + "/configs/config")(app, extend);

	/**
	 * ROUTINES
	 */
	require(app.locals.__app + "/configs/routines")(app,extend);


	/**
	 * MIDDLEWARES GLOBALS
	 */
	require(app.locals.__app + "/middlewares/middlewares")(app,extend);

	/**
	 * ROUTES
	 */
	require(app.locals.__app + "/routes/public")(app,extend), 	// Public
	require(app.locals.__app + "/routes/private")(app,extend),	// Private
	require(app.locals.__app + "/routes/api")(app,extend);			// API
	

	/**
	 * START SERVER
	 */
	
	app.listen(app.locals.__port, function(){
		console.log("Server up on port: " + String(app.locals.__port).inverse.green);
	});	

}