'use strict';

angular.module('worldProno2018App', [
  'worldProno2018App.auth',
  'worldProno2018App.admin',
  'worldProno2018App.constants',
  'worldProno2018App.teams',
  'worldProno2018App.matchs',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'angular.filter',
  'pascalprecht.translate',
  'ngBootbox',
  'flow',
  'chart.js',
  'ngTouch',
  'zumba.angular-waypoints'
])
  .config(function($urlRouterProvider, $locationProvider, $translateProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $translateProvider.useUrlLoader('/api/traductions/loader');
    $translateProvider.preferredLanguage(navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2) || 'en');
    // Enable escaping of HTML
    //$translateProvider.useSanitizeValueStrategy('sanitize');

  })

  .config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
      $httpProvider.defaults.headers.get = {};
    }

    // Answer edited to include suggestions from comments
    // because previous version of code introduced browser-related errors

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
  }])
  .run(function($rootScope, $touch) {
    $rootScope.language = navigator.language.substring(0, 2) || navigator.userLanguage.substring(0, 2) || 'en';
    $touch.ngClickOverrideEnabled(true);
  });
