'use strict';

describe('Component: RulesComponent', function () {

  // load the controller's module
  beforeEach(module('worldProno2018App'));

  var RulesComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    RulesComponent = $componentController('RulesComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
