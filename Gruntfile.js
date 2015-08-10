module.exports = function(grunt) {
 grunt.initConfig({

     less: {
         development: {
             options: {
                 paths: ["public/css"]
             },
             files: [{
					expand: true,
					cwd: 'public/less',
					src: ['*.less'],
					dest: 'public/css',
					ext: '.css'
			}]
         },
         production: {
             options: {
                 paths: ["public/css"],
                 cleancss: true
             },
             files: [{
					expand: true,
					cwd: 'public/less',
					src: ['*.less'],
					dest: 'public/css',
					ext: '.css'
			}]
         }
     },

	cssmin: {
	  target: {
	    files: [{
	      expand: true,
	      cwd: 'public/css',
	      src: ['*.css', '!*.min.css'],
	      dest: 'public/css',
	      ext: '.min.css'
	    }]
	  }
	},
	
	watch:{
		script:{
			files:["public/less/*.less"],
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