var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var Page = new Schema({
	slug:{ type: String, default: 'sample-page' },
	title:{ type: String, default: 'Sample' },
	body:{ type: String, default: 'Hi I\'m a page :)' },
	publishedBy:{
		user:String,
		date:{ type: Date, default: Date.now() }
	},
	editedBy:{
		user:String,
		date:Date
	},
	template: { type: String, default: 'page-template' },
	status: { type:String, default:'published'},
	type: { type:String, default: 'page' }
});

module.exports = mongoose.model('pages', Page, 'pages');