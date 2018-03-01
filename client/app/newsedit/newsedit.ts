'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('newsedit', {
        url: '/newsedit',
        template: '<newsedit></newsedit>'
      });
  });
