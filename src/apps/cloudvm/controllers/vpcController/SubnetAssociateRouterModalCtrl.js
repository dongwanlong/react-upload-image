/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('AssociateRouterModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance','$timeout','$window', 'subnetInfo',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance,$timeout,$window, subnetInfo) {
    $scope.associateSubnetName=subnetInfo.subnetName;

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.associateRouter = function () {
      var data = {
        region:subnetInfo.region,
        subnetId:subnetInfo.subnetId,
        routerId:$scope.selectedRouter.value
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.subnet_associate, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'绑定路由器成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'绑定路由器失败');
        }
      });
    };

    var initComponents = function () {
      initRouterSelector();
    },initRouterSelector = function () {
      $scope.isRouterListLoading=true;
      HttpService.doGet(Config.urls.router_list,{region:subnetInfo.region}).then(function (data, status, headers, config) {
        $scope.isRouterListLoading=false;
        $scope.routerList =  data.data.data;
        $scope.routerListSelectorData=$scope.routerList.map(function(router){
          return new ModelService.SelectModel(router.name,router.id);
        });
        $scope.selectedRouter=$scope.routerListSelectorData[0];
      });
    };
    initComponents();
  }]);
/*

  controllerModule.controller('RemoveRouterModalCtrl', function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance,$timeout,$window, routerInfo) {
    $scope.routerName = routerInfo.routerName;
    /!*初始化已关联子网选择框--start*!/
    $scope.routerList = routerInfo.routers;
    $scope.routerListSelectorData=$scope.routerList.map(function(router){
      return new ModelService.SelectModel(router.name,router.id);
    });
    $scope.selectedRouter=$scope.routerListSelectorData[0];
    /!*初始化已关联子网选择框--end*!/

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.removeRouter = function () {
      var data = {
        region:routerInfo.region,
        routerId:routerInfo.routerId,
        routerId:$scope.selectedRouter.value
      };
      HttpService.doPost(Config.urls.router_remove, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'子网关联成功');
        }
        else{
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'子网关联失败');
        }
      });
    };
  });
*/

});
