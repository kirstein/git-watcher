module.exports = function(grunt) {
  grunt.initConfig({

    mochacli: {
      options: {
        globals     : [ 'should' ],
        reporter    : 'spec',
        growl       : true
      },

      all: {
        src: [ 'test/**/*.test.js' ]
      }
    },

    watch:{
      test : {
        files : [ 'src/*', 'test/*.test.js' ],
        tasks : [ 'test' ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-cli');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', [ 'mochacli' ]);
};
