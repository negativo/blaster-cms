


module.exports = function(app,express){
	var passport      = require('passport');
	
	var PrivateCtrl = require('../controllers/private')(app);
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl     = require("../controllers/api")(app);
	var UserCtrl    = require("../controllers/user")(app);
	var MediaCtrl   = require("../controllers/media")(app);

	/**
	 * AUTHORIZATIONS
	 */
	var guest     = require('../middlewares/roles')('guest');
	var moderator = require('../middlewares/roles')('moderator');
	var admin     = require('../middlewares/roles')('admin');

	app.get('/admin',function(req,res){
		res.redirect('/admin/panel');
	});

	app.get('/admin/logout',function(req,res){
		req.logout();
		res.redirect('/admin/login');
	});

	// ADMIN PANEL
	app.get('/admin/panel'         , PrivateCtrl.dashboard );

	/**
	 * POSTS
	 */
	app.get('/admin/posts'         , PrivateCtrl.posts );
	app.get('/admin/new-post'      , PostCtrl.create );
	app.get('/admin/edit-post/:id' , PostCtrl.edit );

	/**
	 * PAGES
	 */
	app.get('/admin/pages'         , PrivateCtrl.pages );
	app.get('/admin/new-page'      , PageCtrl.create );
	app.get('/admin/edit-page/:id' , PageCtrl.edit );

	/**
	 * USERS
	 */
	//use should be able to modify his data, need to do it
	app.get('/admin/users'          , admin, UserCtrl.index );
	app.get('/admin/users/:id'      , UserCtrl.show );

	app.get('/admin/new-user'       , PrivateCtrl.newUser );
	app.get('/admin/register'       , PrivateCtrl.register );

	/**
	 * MEDIA
	 */

	app.get('/admin/media', MediaCtrl.index );

	/**
	 * COMMENTS
	 */
	app.get('/admin/comments'       , PrivateCtrl.comments );

	/**
	 * CONFIGURATION && CUSTOMIZATION
	 */
	app.get('/admin/configurations' , admin, PrivateCtrl.configurations );
	app.get('/admin/navigation'     , admin, PrivateCtrl.navigation );
	app.get('/admin/themes'         , admin, PrivateCtrl.themes_index );
	app.get('/admin/custom-css'     , admin, PrivateCtrl.edit_css );

	/**
	 * LOGIN
	 */
	app.get('/admin/login'          , PrivateCtrl.login );
	app.post('/admin/login',
	  passport.authenticate('local', { successRedirect: '/admin/panel', failureRedirect: '/admin/login', failureFlash: true })
 	);
	
	/**
	 * FILE BROWSER
	 */
	app.get('/admin/file-browser'        , PrivateCtrl.fileBrowser );
	

}

