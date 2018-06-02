'use strict';
(function() {

  class WorlCup2018Component {
    constructor() {
      this.message = 'Hello';
    }
  }

  angular.module('worldProno2018App')
    .component('euro2016', {
      templateUrl: 'app/euro2016/euro2016.html',
      controller: WorlCup2018Component
    });

})();
