/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('SubnetEditModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window', 'subnetInfo',
    function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window, subnetInfo) {
    $scope.subnetEdit = {
      name:subnetInfo.name
    };

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.editSubnet = function () {
      if (!$scope.subnet_edit_form.$valid) return;
      var data = {
        region:subnetInfo.region,
        subnetId:subnetInfo.subnetId,
        name: $scope.subnetEdit.name,
        gatewayIp:subnetInfo.gatewayIp,
        enableDhcp:false
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.subnet_edit, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'编辑子网成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'编辑子网失败');
        }
      });
    };
  }]);

});
