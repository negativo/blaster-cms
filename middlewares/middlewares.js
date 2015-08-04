var path = require("path");

module.exports = function(app,express){
	//set static content folder
	app.use( express.static(global.appRoot + "/public") );
}