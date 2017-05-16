/**
 * Created by dongwanlong on 2016/4/29.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoRemarkCtrl', ['$filter','rdsConfig','WidgetService','gRdsStatus','$scope','$modalInstance','transData', 'HttpService', function ($filter,rdsConfig,WidgetService,gRdsStatus, $scope, $modalInstance, transData, HttpService) {

        $scope.username = transData.username;
        $scope.remark = $filter('gReconvertFilter')(transData.descn),
        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.changeRemark = function(){
            $scope.isFormSubmiting = true;
            var submitData = {
                username:transData.username,
                descn:$scope.remark,
                "dbId" : gRdsStatus.rdsInfo.rdsId,
            };
            HttpService.doPost(rdsConfig.urls.rdsinfo_user_descn.replace('{username}',transData.username),submitData).then(function (data, status, headers, config) {
                $scope.isFormSubmiting = false;
                $modalInstance.close(data.data);
            });
        };

    }]);

});