'use strict';

angular.module('worldProno2018App.matchs')
    .config(function($stateProvider) {
        $stateProvider
            .state('match', {
                url: '/match',
                templateUrl: 'app/match/match.html',
                controller: 'MatchController',
                controllerAs: 'vm'
            });
    });
