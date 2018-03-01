'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('leaguedetails', {
                url: '/leaguedetails/:id',
                template: '<leaguedetails></leaguedetails>'
            });
    });
