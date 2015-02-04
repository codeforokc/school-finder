// Karma configuration
// Generated on Tue Feb 03 2015 07:37:26 GMT-0600 (Central Standard Time)

module.exports = function(config) {
  config.set({

    basePath: '',

    frameworks: ['mocha', 'chai', 'chai-as-promised'],

    files: [
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/leaflet/dist/leaflet.js',
      'node_modules/angular-leaflet-directive/dist/angular-leaflet-directive.js',
      'app/app.js',
      'app/**/*.js',
      'tests/**/*_spec.js'
    ],

    exclude: [
      '**/*gulp*.js'
    ],

    preprocessors: {
    },

    reporters: ['nyan'],

    client: {
      mocha: {
        reporter: 'html',
        timeout: 10000,
        slow: 300
      }
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'Firefox', 'IE'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
