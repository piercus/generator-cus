'use strict';

process.on('uncaughtException', function(err) {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
  console.error(err.stack);
  console.log(err);
  process.exit(1)
})

var fs = require('fs');
var rjs = require('requirejs');

rjs.config({
  baseUrl: '.'
});

module.exports = function(grunt) {

  require('grunt-requirejs-vows')(grunt);
  require('grunt-contrib-symlink')(grunt);

  var requirejsVowsConfig = JSON.parse(fs.readFileSync("./gruntfile/requirejs-vows.json"))
  for(var k in requirejsVowsConfig) if(requirejsVowsConfig.hasOwnProperty(k)){
    requirejsVowsConfig[k].options.rjsModule = rjs;
  }

  // Define the configuration for all the tasks
  grunt.initConfig({
    mkdir: {
      tmp: {
        options : {
          create: [
            'tmp'
          ]
        }
      },
    },
    moodAudacityLabels: {
      all: {}
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release %VERSION%',
        commitFiles: ['package.json'],
        createTag: true,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        metadata: '',
        regExp: false
      }
    },

    moodTemplate: {
      all: {}
    },

    // Test settings
    vows: {
      all: {
        options: {
          // String {spec|json|dot-matrix|xunit|tap}
          // defaults to 'dot-matrix'
          reporter: 'spec',
          // Boolean, defaults to false
          verbose: false,
          // Boolean, defaults to false
          silent: false,
          // Colorize reporter output,
          // boolean, defaults to true
          colors: true,
          // Run each test in its own
          // vows process, defaults to
          // false
          isolate: false,
          // String {plain|html|json|xml}
          // defaults to none
          coverage: 'json'
        },
        // String or array of strings
        // determining which files to include.
        // This option is grunt's 'full' file format.
        src: ['test/{,*/}*.js']
      }
    },

    clean: {
      tmp: ['tmp/*']
    },

    'requirejs-vows' : requirejsVowsConfig,
    gitpush: {
      tags: {
        options: {
          tags : true,
          force : true
        }
      }
    },
    gittag: {
       afterBump : {
         options: {
           tag : '0.0.x',
           force : true
         }
       }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-git');
  grunt.loadNpmTasks('grunt-mkdir');

  grunt.registerTask('release', ['bump-only', 'bump-commit', 'gittag:afterBump', 'gitpush:tags']);
  grunt.registerTask('test', ['requirejs-vows']);

};
