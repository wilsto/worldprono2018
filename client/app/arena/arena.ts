'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('arena', {
        url: '/arena',
        template: '<arena></arena>'
      });
  });
