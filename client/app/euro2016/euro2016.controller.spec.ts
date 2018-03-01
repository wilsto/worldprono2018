'use strict';

describe('Component: WorlCup2018Component', function () {

  // load the controller's module
  beforeEach(module('worldProno2018App'));

  var WorlCup2018Component, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    WorlCup2018Component = $componentController('WorlCup2018Component', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
