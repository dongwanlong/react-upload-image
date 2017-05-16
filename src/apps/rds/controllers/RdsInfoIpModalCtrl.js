/**
 * Created by dongwanlong on 2016/4/26.
 */
/**
 * Created by dongwanlong on 2016/4/19.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoIpModalCtrl', ['rdsConfig','WidgetService','gRdsStatus','$scope','$modalInstance','transData', 'HttpService', function (rdsConfig, WidgetService,gRdsStatus, $scope, $modalInstance, transData, HttpService) {
        $scope.ipList = [];

        $scope.username = transData.username;
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }

        HttpService.doGet(rdsConfig.urls.rdsinfo_user_ip.replace('{dbId}',gRdsStatus.rdsInfo.rdsId).replace('{username}',transData.username)).then(function (data, status, headers, config) {
           $scope.ipList = data.data;
        });

    }]);

});
