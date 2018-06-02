/// <reference path="../../typings/tsd.d.ts" />
'use strict';

(function() {

 class MainController {

  menu = [{
   name: 'Home',
   href: '/',
   section: '',
   ngclick: '',
   class: 'active',
   a_class: 'active'
  }, {
   name: 'Prono',
   href: '/prono',
   section: '',
   ngclick: '',
   class: 'nothing',
   a_class: 'nothing'
  }, {
   name: 'Arena',
   href: '/arena',
   section: '',
   ngclick: '',
   class: 'nothing',
   a_class: 'nothing'
  }, {
   name: 'WorlCup2018',
   href: '/news',
   section: '',
   ngclick: '',
   class: 'nothing',
   a_class: 'nothing'
  }];

  constructor($http, $scope, Auth) {
   this.$http = $http;
   this.isLoggedIn = Auth.isLoggedIn;
   this.isAdmin = Auth.isAdmin;
   this.getCurrentUser = Auth.getCurrentUser;
  }

  $onInit() {
   // calcul du nombre de café
   var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
   var firstDate = new Date(2016, 3, 10);
   var secondDate = new Date();
   var diffDays = Math.round((secondDate.getTime() - firstDate.getTime()) / (oneDay));
   this.coffecup = diffDays * 6;

   // calcul du nombre de prono
   this.$http.get('/api/pronos/count').then(responseProno => {
    this.pronoCount = responseProno.data;

    // mise à jour des compteurs
    var counters = $('#ep2016-counters');
    if (counters.length > 0) {

     setTimeout(function() {
      counters.find('.js-counter').countTo({
       formatter: function(value, options) {
        return value.toFixed(options.decimals);
       }
      });
     }, 400);

    }
   });

   // calcul du nombre de league
   this.$http.get('/api/leagues/count').then(responseLeague => {
    this.leagueCount = responseLeague.data;
   });

   this.$http.get('/api/users/count').then(response => {
    this.playersNb = response.data;
   });

   var mvp = document.getElementById('myViewPort');
   mvp.setAttribute('content', 'width=device-width, initial-scale=1');
  }

  $onDestroy() {
   var mvp = document.getElementById('myViewPort');
   mvp.setAttribute('content', 'width=device-width');
  }

  mobilecheck() {
   return (/Mobi|Tablet|iPad|iPhone/.test(navigator.userAgent));
  }

 }

 angular.module('worldProno2018App')
  .component('main', {
   templateUrl: 'app/main/main.html',
   controller: MainController,
   controllerAs: 'vm'
  });

})();
