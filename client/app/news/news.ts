'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('news', {
                url: '/news',
                template: '<news></news>'
            });
    });
