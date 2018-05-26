// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['mocha', 'chai', 'sinon-chai', 'chai-as-promised', 'chai-things'],

    client: {
      mocha: {
        timeout: 5000 // set default mocha spec timeout
      }
    },

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'client/bower_components/angular/angular.js',
      'client/bower_components/Chart.js/Chart.js',
      'client/bower_components/angular-chart.js/dist/angular-chart.js',
      'client/bower_components/angular-touch/angular-touch.js',
      'client/bower_components/angular-resource/angular-resource.js',
      'client/bower_components/angular-cookies/angular-cookies.js',
      'client/bower_components/angular-sanitize/angular-sanitize.js',
      'client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'client/bower_components/angular-filter/dist/angular-filter.js',
      'client/bower_components/angular-translate/angular-translate.js',
      'client/bower_components/angular-translate-loader-url/angular-translate-loader-url.js',
      'client/bower_components/angular-ui-router/release/angular-ui-router.js',
      'client/bower_components/angular-validation-match/dist/angular-validation-match.min.js',
      'client/bower_components/waypoints/lib/noframework.waypoints.js',
      'client/bower_components/angular-waypoints/dist/angular-waypoints.js',
      'client/bower_components/jquery/dist/jquery.js',
      'client/bower_components/bootstrap/dist/js/bootstrap.js',
      'client/bower_components/lodash/dist/lodash.compat.js',
      'client/bower_components/jquery-countTo/jquery.countTo.js',
      'client/bower_components/jquery.easing/js/jquery.easing.js',
      'client/bower_components/bootbox.js/bootbox.js',
      'client/bower_components/bootbox/bootbox.js',
      'client/bower_components/ngBootbox/dist/ngBootbox.js',
      'client/bower_components/flow.js/dist/flow.js',
      'client/bower_components/ng-flow/dist/ng-flow.js',
      'client/bower_components/raty/lib/jquery.raty.js',
      'client/bower_components/ngRaty/ngraty.js',
      'client/bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'node_modules/socket.io-client/socket.io.js',
      '.tmp/app/app.js',
      '.tmp/{app,components}/**/*.module.js',
      '.tmp/{app,components}/**/*.js',
      '.tmp/test/**/*.js',
      'client/{app,components}/**/*.html'
    ],

    preprocessors: {
      '**/*.html': 'ng-html2js',
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/'
    },

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // reporter types:
    // - dots
    // - progress (default)
    // - spec (karma-spec-reporter)
    // - junit
    // - growl
    // - coverage
    reporters: ['spec'],

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
