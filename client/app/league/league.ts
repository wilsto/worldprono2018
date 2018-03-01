'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('league', {
        url: '/league',
        template: '<league></league>'
      });
  });
