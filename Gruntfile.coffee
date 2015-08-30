gruntFunction = (grunt) ->
 
    gruntConfig =
        pkg:
            grunt.file.readJSON 'package.json'
 
        coffee:
	        all:
            expand: true
            cwd: 'src'
            src: [ '**/*.coffee' ]
            dest: 'build'
            ext: '.js'

    grunt.initConfig gruntConfig
    grunt.loadNpmTasks 'grunt-contrib-coffee'
 
module.exports = gruntFunction
