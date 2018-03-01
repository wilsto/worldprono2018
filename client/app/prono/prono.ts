'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('prono', {
                url: '/prono',
                template: '<prono></prono>'
            })
            .state('pronoUser', {
                url: '/prono/:userId',
                template: '<prono></prono>'
            });
    });
