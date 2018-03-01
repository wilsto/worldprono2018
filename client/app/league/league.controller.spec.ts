'use strict';

describe('Component: LeagueComponent', function () {

  // load the controller's module
  beforeEach(module('worldProno2018App'));

  var LeagueComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    LeagueComponent = $componentController('LeagueComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
