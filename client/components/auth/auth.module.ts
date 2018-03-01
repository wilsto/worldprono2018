'use strict';

angular.module('worldProno2018App.auth', [
  'worldProno2018App.constants',
  'worldProno2018App.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
