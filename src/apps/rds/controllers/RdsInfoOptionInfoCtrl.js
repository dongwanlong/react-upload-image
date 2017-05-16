/**
 * Created by dongwanlong on 2016/4/29.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoOptionInfoCtrl', ['WidgetService','$modalInstance','rdsConfig','$filter','gRdsStatus','HttpService','$scope',function (WidgetService, $modalInstance, rdsConfig, $filter, gRdsStatus, HttpService, $scope) {

        $scope.code = "";

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }


        HttpService.doGet(rdsConfig.urls.rdsinfo_gbconfig.replace('{dbId}',gRdsStatus.rdsInfo.rdsId), {}).then(function (data, status, headers, config) {
            if(data.data && data.result===1){
                $scope.code = JSON.stringify(data.data,null,2);
            }
        });

    }]);

});
