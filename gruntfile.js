module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
	transport: {  
            options: {  
                paths: ['demos'] // where is the module, default value is ['sea-modules']  
            },  
            main: {  
                options: {  
                    idleading: ''  
                },  
                files: [  
                    {  
                        cwd: 'demos/bee4.12/js',  
                        src: '*.js',  
                        dest: 'demos/bee4.12/.build/js'  
                    }  
                ]  
            }  
        },
    concat: {
      options: {
        paths: [''],
        include: 'all'
      },
      foo: {
        options: {
          include: 'all'
        },
        files: [{
          expand: true,
          cwd: 'demos/bee4.12/.build/js',
          src: '*.js',
          dest: 'demos/bee4.12/build/js'
        }]
      }
    },
    uglify: {
      dynamic_mappings: {
        files: [{
          expand: true, 
          cwd: 'demos/bee4.12/build/js', 
          src: ['*.js'], 
          dest: 'demos/bee4.12/build/js', 
          ext: '.js'
        }]
      }
    },

	 clean:['demos/bee4.12/.build/js'],
	 
  });

  // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks('grunt-cmd-transport');
  grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
	  grunt.loadNpmTasks('grunt-contrib-clean');

  // 默认被执行的任务列表。
  grunt.registerTask('default', ['clean','transport','concat','uglify']);

};