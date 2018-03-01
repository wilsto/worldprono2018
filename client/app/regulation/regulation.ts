'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('regulation', {
                url: '/regulation',
                template: '<regulation></regulation>'
            });
    });
