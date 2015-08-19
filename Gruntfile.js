module.exports = function(grunt) {
 grunt.initConfig({

     less: {
         development: {
             options: {
                 paths: ['views/template/css']
             },
             files: [{
					expand: true,
					cwd: 'views/template/less',
					src: ['*.less'],
					dest: 'views/template/css',
					ext: '.css'
			}]
         },
         backend: {
             options: {
                 paths: ['private/css']
             },
             files: [{
					expand: true,
					cwd: 'private/less',
					src: ['*.less'],
					dest: 'private/css',
					ext: '.css'
			}]
         },
         production: {
             options: {
                 paths: ['views/template/css'],
                 cleancss: true
             },
             files: [{
					expand: true,
					cwd: 'views/template/less',
					src: ['*.less'],
					dest: 'views/template/css',
					ext: '.css'
			}]
         }
     },

	cssmin: {
	  target: {
	    files: [{
	      expand: true,
	      cwd: 'views/template/css',
	      src: ['*.css', '!*.min.css'],
	      dest: 'views/template/css',
	      ext: '.min.css'
	    },
		{
	      expand: true,
	      cwd: 'private/css',
	      src: ['*.css', '!*.min.css'],
	      dest: 'private/css',
	      ext: '.min.css'
	    }]
	  }
	},
	
	
	watch:{
		script:{
			files:['views/template/less/*.less','private/less/*.less'],
			tasks:["less","cssmin"],
			options:{
				spawn:false,
				livereload:true
			}
		},
		ejs:{
			files:['views/template/*.ejs','private/*.ejs','views/template/partials/*.ejs','private/partials/*.ejs'],
			tasks:["less","cssmin"],
			options:{
				spawn:false,
				livereload:true
			}
		}
	}   
 });

 //load tasks
 grunt.loadNpmTasks('grunt-contrib-less');
 grunt.loadNpmTasks('grunt-contrib-cssmin');
 grunt.loadNpmTasks('grunt-contrib-watch');

 //register
 grunt.registerTask('default', ['less','cssmin']);
};