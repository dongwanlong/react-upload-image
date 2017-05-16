/**
 * Created by dongwanlong on 2016/4/27.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoIpAlertCtrl', ['Config','rdsConfig','$modal','$filter', 'gRdsStatus','$scope','$modalInstance','transData', 'HttpService', function ( Config,rdsConfig, $modal, $filter, gRdsStatus, $scope, $modalInstance, transData, HttpService) {
        $scope.type = transData.type;
        $scope.ip = transData.ip;

        $scope.REGEX = angular.extend({}, Config.REGEX, rdsConfig.REGEX);

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.addGlobalIp = function(){
            $modalInstance.close({
                result:1,
                handleIp:$scope.ip,
                handleType:$scope.type
            });
        };

        $scope.RemoveGlobalIp = function(){
            $modalInstance.close({
                result:1,
                handleIp:$scope.ip,
                handleType:$scope.type
            });
        }

    }]);

});