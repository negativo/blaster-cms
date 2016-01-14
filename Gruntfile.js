module.exports = function(grunt) {
 grunt.initConfig({

 	/**
 	 * COMPIPLE LESS
 	 */
  less: {
    theme_dev: {
      options: {
        paths: ['themes/basic/css']
      },
      files: [{
			  expand: true,
				cwd: 'themes/basic/less',
				src: ['main.less'],
				dest: 'themes/basic/css',
				ext: '.css'
			}]
    },
    admin_backend: {
      options: {
        paths: ['admin/assets/css']
     	},
      files: [{
				expand: true,
				cwd: 'admin/assets/less',
				src: ['*.less'],
				dest: 'admin/assets/css',
				ext: '.css'
			}]
    },
  },

  /**
   * MINIFY
   */
	cssmin: {
	  basic_theme: {
	    files: [{
	    	      expand: true,
	    	      cwd: 'themes/basic/css',
	    	      src: ['*.css', '!*.min.css'],
	    	      dest: 'themes/basic/css',
	    	      ext: '.min.css'
	    	    }]
	  },
	  backend: {
	  	files: [{
	  		      expand: true,
	  		      cwd: 'admin/assets/css',
	  		      src: ['*.css', '!*.min.css'],
	  		      dest: 'admin/assets/css',
	  		      ext: '.min.css'
	  		    }]
	  }
	},
	
	/**
	 * WATCHERS
	 */
	watch:{
		script:{
			files:['themes/basic/less/*.less','admin/assets/less/*.less'],
			tasks:["less","cssmin"],
			options:{
				spawn:false,
				livereload:true
			}
		},
		ejs:{
			files:['themes/basic/*.ejs','admin/*.ejs','themes/basic/partials/*.ejs','admin/partials/*.ejs'],
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
 grunt.registerTask('default', ['less', 'cssmin']);
};