(function(){
  'use strict';
  module.exports = function(grunt) {

    // Global Vars
    var _globalConfig = {
      docsDir: 'docs',
      lessDir: 'less/',
      cssDir: 'css/',
      jsDir: 'js/',
      iconsDir: 'assets/icoMoon/SVG/'
    };

    // Project configuration.
    grunt.initConfig({
      // Global Vars
      _globalConfig: _globalConfig,
      pkg: grunt.file.readJSON('package.json'),  
      
      // Removes build directory files
      clean: {
        css: ['<%= _globalConfig.cssDir %>build/*.css','<%= _globalConfig.cssDir %>release/*.css'],
      },
      // Less Compiler
      less: {
        options: {
          ieCompat: true,
          sourceMap: true,
          sourceMapBasepath: '<%= _globalConfig.lessDir %>',
          outputSourceFiles: true
        },
        build: {
          files: {
            '<%= _globalConfig.cssDir %><%= pkg.name %>.css': '<%= _globalConfig.lessDir %><%= pkg.name %>.less'
          }
        },
//        release: {
//          options: {
//              
//          },
//          files: {
//            
//          }
//        }
      },
      // Auto Prefix
      autoprefixer: {
        options: {
          browsers: ['last 2 versions', 'ie 8', 'ie 9']
        },
        single_file: {
            src: '<%= _globalConfig.cssDir %><%= pkg.name %>.css',
            dest: '<%= _globalConfig.cssDir %>build/<%= pkg.name %>.css'
        },
      },
      //CSS minification               
      cssmin: {
        options: {
          shorthandCompacting: false,
          roundingPrecision: -1,
          keepSpecialComments: 0
        },
        target: {
          files: {
            '<%= _globalConfig.cssDir %>release/<%= pkg.name %>-min.css': '<%= _globalConfig.cssDir %>build/<%= pkg.name %>.css'
          }
        }
      },
      svgmin: {
        options: {
          plugins: [
            {
              removeViewBox: false
            }, {
              removeUselessStrokeAndFill: false
            }, {
              cleanupIDs: false
            }
          ]
        },
        dist: {
          files: {
            'img/svg-icons.min.svg': 'img/svg-icons.svg'
          }
        }
      },
      svgstore: {
        options: {
          prefix: 'Icon-',
          cleanup: ['fill','viewbox']
        },
        default: {
          files: {
            'img/svg-icons.svg': ['<%= _globalConfig.iconsDir %>*.svg'],
          },
        },
      },
      watch: {
        css: {
          // Watches LESS file changes then triggers LESS compile
          files: ['<%= _globalConfig.lessDir %>*.less'],
          tasks: ['less', 'autoprefixer','cssmin','styledown']
        },
        svg: {
          files: ['<%= _globalConfig.iconsDir %>*.svg'],
          tasks: ['svgstore','svgmin']
        },
      },
      styledown: {
        build: {
          files: {
            'docs/styleguide/index.html': ['<%= _globalConfig.cssDir %>build/<%= pkg.name %>.css']
          },
          options: {
            sg_css: null,
            sg_js: null,
            css: '../../<%= _globalConfig.cssDir %>release/<%= pkg.name %>-min.css',
            title: 'Effort-{LESS} Framework Docs'
          }
        },
      },  
    });
    
    // Load Plugins Found in package.json
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // Grunt Tasks
    grunt.registerTask('default', ['clean','watch']);
    grunt.registerTask('up', [
      'clean',
      'less',
      'autoprefixer',
      'cssmin',
      'styledown',
      'watch'
    ]);
    grunt.registerTask('prepsvg',['svgstore','svgmin']);
  };
}());