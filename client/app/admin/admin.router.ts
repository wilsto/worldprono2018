'use strict';

angular.module('worldProno2018App.admin')
    .config(function($stateProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin',
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                authenticate: 'admin'
            });
    });
