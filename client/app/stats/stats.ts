'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('stats', {
        url: '/stats',
        template: '<stats></stats>'
      });
  });
