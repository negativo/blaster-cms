module.exports = function(app,extend){
	var fs = require('fs');
	
	/**
	 * watch for current theme file changes to update page/post custom template files in backend
	 */
	fs.watch( app.locals.__views + "/" , function(events){
		if(events){
			process.emit('configs_updated');
		}
	});
}