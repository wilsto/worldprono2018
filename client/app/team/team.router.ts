'use strict';

angular.module('worldProno2018App.teams')
    .config(function($stateProvider) {
        $stateProvider
            .state('team', {
                url: '/team',
                templateUrl: 'app/team/team.html',
                controller: 'TeamController',
                controllerAs: 'vm'
            });
    });
