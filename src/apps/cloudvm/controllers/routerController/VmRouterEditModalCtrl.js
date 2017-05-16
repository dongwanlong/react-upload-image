/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('VmRouterEditModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window', 'routerInfo',
    function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window, routerInfo) {
    $scope.editRouterName = routerInfo.routerName;
    $scope.editEnablePublicNetworkGateway = routerInfo.publicNetworkGatewayEnable;

    if(routerInfo.publicNetworkGatewayEnable===false){
      getPublicNetworkId();
    }

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.editRouter = function () {
      if (!$scope.vm_router_edit_form.$valid) return;
      var data = {
        region:routerInfo.region,
        routerId:routerInfo.routerId,
        name: $scope.editRouterName,
        enablePublicNetworkGateway: $scope.editEnablePublicNetworkGateway,
        publicNetworkId:routerInfo.publicNetworkId
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.router_edit, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'编辑路由器成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'编辑路由器失败');
        }
      });
    };

    function getPublicNetworkId() {
      HttpService.doGet(Config.urls.network_public_list,{region:routerInfo.region}).then(function (data, status, headers, config) {
        routerInfo.publicNetworkId = data.data[0].id;
      });
    };


  }]);

});
