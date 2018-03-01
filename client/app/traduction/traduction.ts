'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('traduction', {
                url: '/traduction',
                template: '<traduction></traduction>',
                authenticate: 'admin'
            });
    });
