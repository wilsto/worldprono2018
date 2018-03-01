/// <reference path="../../typings/tsd.d.ts" />
'use strict';

angular.module('worldProno2018App')
    .config(function($stateProvider) {
        $stateProvider
            .state('main', {
                url: '/',
                template: '<main></main>'
            });
    });

;
(function() {

    $(document).on('mouseup',function(e) {
        var container = $('.login');
        // if the target of the click isn't the container...
        // ... nor a descendant of the container
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.hide();
        }
    });

}());
