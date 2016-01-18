var fs = require('fs');
module.exports = function(app, $ee){
	
	/**
	 * watch for current theme file changes to update page/post custom template files in backend
	 */
	fs.watch( app.locals.__views + "/" , function(events){
		if(events){
			$ee.emit('configs_updated');
		}
	});
}