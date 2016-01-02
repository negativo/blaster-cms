//constructor for views locals.variables
var private = function (req,add) {
	this.dashboard = req.shared;
	this.user = req.user || {} ;
	this.help = [];
	for( prop in add){
		this[prop] = add[prop];
	}
	//help hold all prop name, useful for debug/dev 
	for(prop in this){
		if(this.hasOwnProperty(prop)) this.help.push(prop);
	}
}

var public = function (req,add) {
	this.shared = req.shared;
	this.user = req.user || {};
	this.help = [];
	for( prop in add){
		this[prop] = add[prop];
	}
	//help hold all prop name, useful for debug/dev 
	for(prop in this){
		if(this.hasOwnProperty(prop)) this.help.push(prop);
	}
}

module.exports.private = private; // new Render( { }, req )
module.exports.public = public; // new Render( { }, req )