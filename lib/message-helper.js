//constructor for views locals.variables
var Message = function (message, err) {
	this.message = message;
	this.err = err || null;
}


module.exports.message = Message; // new Render( { }, req )
