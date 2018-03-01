'use strict';

angular.module('worldProno2018App')
  .config(function ($stateProvider) {
    $stateProvider
      .state('euro2016', {
        url: '/euro2016',
        template: '<euro-2016></euro-2016>'
      });
  });
