var express = require('express');

module.exports = function (app) {
	var __root = app.locals.__root,
			__app  = app.locals.__app,
			locals = app.locals;

	return function(req,res,next){
		var p = /\/admin/;
		if( req.url.match(p) ) {
			app.set('views', __root + '/admin' )
			next();
		}else{
			app.use( express.static(__root + '/themes/' + app.get('theme') ) );
			app.set('views', __root + '/themes/' + app.get('theme') );
			next();
		}
	};
}