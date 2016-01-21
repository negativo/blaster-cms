var mongoose = require('mongoose');
var URLSlugs = require('mongoose-url-slugs');

var Schema = mongoose.Schema;

var PageSchema = new Schema({
	title:{ type: String, default: 'Sample Page' },
	slug:{ type: String, default: 'sample-page' },
	body:{ type: String, default: 'Hi I\'m a page :)' },
	template: { type: String, default: 'page-template' },
	status: { type:String, default:'published'},
	type: { type:String, default: 'page' }
});

/**
 * PLUGINS
 */
PageSchema.plugin(URLSlugs('title'));

PageSchema.pre('save',function(next){
	var page = this;
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