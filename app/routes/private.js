


module.exports = function(app,express){
	var passport      = require('passport'),
	multer            = require('multer'),
	uploader          = multer({ dest: app.locals.__root + '/uploads/' }),
	avatar            = multer({ dest: app.locals.__root + '/uploads/avatar'}),
	ruotesControllers = require('../controllers/private')(app),
	POST              = ruotesControllers.POST,
	GET               = ruotesControllers.GET;

	//GETS
	app.get('/admin/login'    , GET.loginPageCtrl );
	app.get('/admin/new-user' , GET.newUserCtrl );
	app.get('/admin/register' , GET.registerCtrl );
	//DISPLAY
	app.get('/admin/panel'          , GET.dashboardPageCtrl );
	app.get('/admin/posts'          , GET.postsPageCtrl );
	app.get('/admin/pages'          , GET.pagesPageCtrl );
	app.get('/admin/comments'       , GET.commentsPageCtrl );
	app.get('/admin/users'          , GET.usersPageCtrl );
	app.get('/admin/users/:id'      , GET.profileCtrl );
	app.get('/admin/configurations' , GET.configurationsPageCtrl );
	app.get('/admin/uploads'        , GET.fileBrowser )

	//VIEW WITH CRUD OPs
	// 	CREATE/EDIT
	app.get('/admin/new-post'      , GET.newPostCtrl );
	app.get('/admin/new-page'      , GET.newPageCtrl );
	app.get('/admin/edit-nav'      , GET.editNavigation );
	app.get('/admin/edit-theme'    , GET.editTheme );
	app.get('/admin/themes'        , GET.themesCtrl );
	app.get('/admin/edit-post/:id' , GET.editSinglePost );
	app.get('/admin/edit-page/:id' , GET.editSinglePage );
	// 	DELETE
	

	//POSTS	
	app.post('/admin/login'               , passport.authenticate('local'),  POST.loginCtrl );
	app.post('/admin/edit-post'           , POST.editSinglePost );
	app.post('/admin/edit-page'           , POST.editSinglePage );
	app.post('/admin/edit-nav'            , POST.editNavigation );
	app.post('/admin/edit-theme'          , POST.editTheme );
	app.post('/admin/themes'              , POST.themesCtrl );
	app.post('/admin/edit-configurations' , POST.editConfigurations );
	app.post('/admin/edit-user-profile'   , POST.editUserProfile );
	app.post('/admin/edit-user-password'  , POST.editUserPassword );
	app.post('/admin/edit-delete-user'    , POST.deleteUser );
	app.post('/admin/edit-comment'        , POST.editComment );
	app.post('/admin/register'            , POST.registerCtrl );
	app.post('/admin/upload'              , uploader.single('upload'), POST.uploadCtrl );
	app.post('/admin/upload/avatar/:id'   , avatar.single('avatar'), POST.avatarUpload );
	

}

