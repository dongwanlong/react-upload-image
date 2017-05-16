/**
 * Created by dongwanlong on 2016/4/27.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoDeleteUserCtrl', ['WidgetService','gRdsStatus','$scope','$modalInstance','transData', 'HttpService', function (WidgetService,gRdsStatus, $scope, $modalInstance, transData, HttpService) {

        $scope.username = transData.username;

        $scope.removeUser = function(){
            $modalInstance.close({
                result:1
            });
        }

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }
    }]);

});