define(['angular',
      'src/apps/cloudvm/controllers/ConfirmModalCtrl',
      'angularMocks'],
    function(angular, Utility) {
        describe('ConfirmModalCtrl.test', function () {
            beforeEach(module('app.controller'));

            var $controller;

            beforeEach(inject(function (_$controller_) {
                // The injector unwraps the underscores (_) from around the parameter names when matching
                $controller = _$controller_;
            }));

            it('$scope.confirmMessage should equal to message', function () {
                var $scope = {};
                var controller = $controller('ConfirmModalCtrl', {
                    $scope: $scope,
                    $modalInstance: {},
                    message: 'test1',
                    title: {}
                });
                expect($scope.confirmMessage).toEqual('test1');
            });
        });
    }
);