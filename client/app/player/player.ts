'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('player', {
        url: '/player',
        template: '<player></player>'
      });
  });
