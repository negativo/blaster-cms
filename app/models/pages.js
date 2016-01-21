var mongoose = require('mongoose');
var toSlug = require('to-slug-case');

var Schema = mongoose.Schema;

var PageSchema = new Schema({
	slug:{ type: String, default: 'sample-page' },
	title:{ type: String, default: 'Sample' },
	body:{ type: String, default: 'Hi I\'m a page :)' },
	template: { type: String, default: 'page-template' },
	status: { type:String, default:'published'},
	type: { type:String, default: 'page' }
});


PageSchema.pre('save',function(next){
	var page = this;
	if(page.isModified('title')){
		page.slug = toSlug(page.title);
	}
	next();
});

PageSchema.post('remove',function(){
  process.emit('page_removed');
});

PageSchema.statics.setup = function(callback){
	process.emit('page_setup');
	var Page = this;
	new Page({}).save(callback);
}


module.exports = mongoose.model('Page', PageSchema );