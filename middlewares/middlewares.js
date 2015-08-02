var path = require("path");

module.exports = function(app,express){
	//set static folder
	app.use( express.static(path.join(__dirname, "./app")) );
	
}