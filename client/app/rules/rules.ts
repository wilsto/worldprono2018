'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('rules', {
        url: '/rules',
        template: '<rules></rules>'
      });
  });
