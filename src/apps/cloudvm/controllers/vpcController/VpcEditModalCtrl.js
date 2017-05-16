/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('VpcEditModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window', 'vpcInfo',
    function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window, vpcInfo) {
    $scope.vpcEdit = {
      name:vpcInfo.name
    };

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.editVpc = function () {
      if (!$scope.vpc_edit_form.$valid) return;
      var data = {
        region:vpcInfo.region,
        networkId:vpcInfo.vpcId,
        name: $scope.vpcEdit.name
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.vpc_edit, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'编辑VPC成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'编辑VPC失败');
        }
      });
    };
  }]);

});
