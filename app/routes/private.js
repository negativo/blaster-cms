


module.exports = function(app,express){
	var passport      = require('passport');
	
	var PrivateCtrl = require('../controllers/private')(app);
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl     = require("../controllers/api")(app);
	var UserCtrl    = require("../controllers/user")(app);
	var MediaCtrl   = require("../controllers/media")(app);
	var ConfCtrl    = require("../controllers/configuration")(app);

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
	app.get('/admin/panel'                  , PrivateCtrl.dashboard );

	/**
	 * POSTS
	 */
	app.get('/admin/posts'                  , PostCtrl.index_admin );
	app.get('/admin/post'                   , PostCtrl.create );
	app.get('/admin/post/:id'               , PostCtrl.edit );

	/**
	 * PAGES
	 */
	app.get('/admin/pages'                  , PageCtrl.index_admin );
	app.get('/admin/page'                   , PageCtrl.create );
	app.get('/admin/page/:id'               , PageCtrl.edit );

	/**
	 * USERS
	 */
	app.get('/admin/users'                  , admin, UserCtrl.index );
	app.get('/admin/users/:id'              , guest, UserCtrl.show );
	app.get('/admin/user'			              , admin, UserCtrl.create );

	
	app.get('/admin/register'               , PrivateCtrl.register );
	app.get('/admin/reset-password'         , PrivateCtrl.resetPassword );

	/**
	 * MEDIA
	 */

	app.get('/admin/media'                  , MediaCtrl.index );

	/**
	 * COMMENTS
	 */
	app.get('/admin/comments'               , CommentCtrl.index_admin );

	/**
	 * CONFIGURATION && CUSTOMIZATION
	 */
	app.get('/admin/configurations'         , admin, ConfCtrl.index_configurations );
	app.get('/admin/navigation'             , admin, ConfCtrl.index_nav );
	app.get('/admin/themes'                 , admin, ConfCtrl.index_themes );
	app.get('/admin/custom-css'             , admin, ConfCtrl.index_custom_css );

	/**
	 * LOGIN
	 */
	app.get('/admin/login'          , PrivateCtrl.login );
	app.post('/admin/login',
	  passport.authenticate('local', { successRedirect: '/admin/panel', failureRedirect: '/admin/login', failureFlash: true })
 	);
	

}

