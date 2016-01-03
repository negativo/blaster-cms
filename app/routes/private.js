


module.exports = function(app,express){
	var passport      = require('passport'),
	multer            = require('multer'),
	uploader          = multer({ dest: app.locals.__root + '/uploads/' }),
	avatar            = multer({ dest: app.locals.__root + '/uploads/avatar'});
	
	var PrivateCtrl = require('../controllers/private')(app);
	var PageCtrl    = require("../controllers/page")(app);
	var PostCtrl    = require("../controllers/post")(app);
	var CommentCtrl = require("../controllers/comment")(app);
	var ApiCtrl     = require("../controllers/api")(app);
	var UserCtrl    = require("../controllers/user")(app);

	app.get('/admin',function(req,res){
		if(typeof req.user != 'undefined' && req.user.role !== 'guest'){
			res.redirect('/admin/panel');
		}
	});

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
	app.get('/admin/users'          , UserCtrl.index );
	app.get('/admin/users/:id'      , UserCtrl.show );

	/**
	 * COMMENTS
	 */
	app.get('/admin/comments'       , PrivateCtrl.comments );

	/**
	 * CONFIGURATION && CUSTOMIZATION
	 */
	app.get('/admin/configurations' , PrivateCtrl.configurations );
	app.get('/admin/navigation'     , PrivateCtrl.navigation );
	app.get('/admin/themes'         , PrivateCtrl.themes_index );
	app.get('/admin/custom-css'     , PrivateCtrl.edit_css );

	/**
	 * VIEWS
	 */
	app.get('/admin/login'          , PrivateCtrl.login );
	app.get('/admin/new-user'       , PrivateCtrl.newUser );
	app.get('/admin/register'       , PrivateCtrl.register );
	app.get('/admin/panel'          , PrivateCtrl.dashboard );
	app.get('/admin/uploads'        , PrivateCtrl.fileBrowser )
	
	
	app.post('/admin/login',
	  passport.authenticate('local', { successRedirect: '/admin/panel', failureRedirect: '/admin/login', failureFlash: true })
 	);

	//POSTS	
	// app.post('/admin/edit-user-profile'   , POST.editUserProfile );
	// app.post('/admin/edit-user-password'  , POST.editUserPassword );
	// app.post('/admin/edit-delete-user'    , POST.deleteUser );
	// app.post('/admin/edit-comment'        , POST.editComment );
	// app.post('/admin/register'            , POST.registerCtrl );
	// app.post('/admin/upload'              , uploader.single('upload'), POST.uploadCtrl );
	// app.post('/admin/upload/avatar/:id'   , avatar.single('avatar'), POST.avatarUpload );

}

