//constructor for views locals.variables
var private = function (req,add) {
	this.user = req.user || {} ;
	for( prop in add){
		this[prop] = add[prop];
	}
}

var public = function (req,add) {
	this.user = req.user || {};
	for( prop in add){
		this[prop] = add[prop];
	}
}

module.exports.private = private; // new Render( { }, req )
module.exports.public = public; // new Render( { }, req )