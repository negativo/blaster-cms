/**
 * INDEXING ALL EXTENDED MODULE AND REQUIRING AFTER ALL THE CMS ONES
 * @param  {[type]} app [description]
 * @return {[type]}     [description]
 */
module.exports = function(app){

	var requireDirectory = require('require-directory');

	var visitor = function(obj) {
    obj(app);
  };
  return requireDirectory(module, {	visit: visitor	} );
	
}