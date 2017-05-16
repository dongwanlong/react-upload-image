/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('AssociateSubnetModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance','$timeout','$window', 'routerInfo',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance,$timeout,$window, routerInfo) {
    $scope.associateRouterName = routerInfo.routerName;
    $scope.selectedSubnet = null;

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.associateSubnet = function () {
      var data = {
        region:routerInfo.region,
        routerId:routerInfo.routerId,
        subnetId:$scope.selectedSubnet && $scope.selectedSubnet.value
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.subnet_associate, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'关联子网成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'关联子网失败');
        }
      });
    };

    var initComponents = function () {
      initSubnetSelector();
    },initSubnetSelector = function () {
      $scope.isSubnetListLoading=true;
      HttpService.doGet(Config.urls.available_for_router_subnet_list,{region:routerInfo.region}).then(function (data, status, headers, config) {
        $scope.isSubnetListLoading=false;
        var vpcList = data.data;
        $scope.subnetList = [];
        for(var i= 0,len=vpcList.length;i<len;i++){
          (function(vpc){
            var subnets = vpc.subnets;
            for(var i= 0,len=subnets.length;i<len;i++){
              subnets[i].nameWithVpc = subnets[i].name+'('+vpc.name+')';
              $scope.subnetList.push(subnets[i]);
            }
          })(vpcList[i])
        }
        $scope.subnetListSelectorData=$scope.subnetList.map(function(subnet){
          return new ModelService.SelectModel(subnet.nameWithVpc,subnet.id);
        });
        $scope.selectedSubnet=$scope.subnetListSelectorData[0];
      });
    };
    initComponents();
  }]);

  controllerModule.controller('RemoveSubnetModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance','$timeout','$window', 'routerInfo',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance,$timeout,$window, routerInfo) {
    $scope.routerName = routerInfo.routerName;
    /*初始化已关联子网选择框--start*/
    $scope.subnetList = routerInfo.subnets;
    $scope.subnetListSelectorData=$scope.subnetList.map(function(subnet){
      return new ModelService.SelectModel(subnet.name,subnet.id);
    });
    $scope.selectedSubnet=$scope.subnetListSelectorData[0];
    /*初始化已关联子网选择框--end*/

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.removeSubnet = function () {
      var data = {
        region:routerInfo.region,
        routerId:routerInfo.routerId,
        subnetId:$scope.selectedSubnet.value
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.subnet_remove, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close({result:1});
          WidgetService.notifySuccess(data.msgs[0]||'解除关联子网成功');
        }
        else{
          $scope.isFormSubmiting=false;
          $modalInstance.dismiss('cancel');
          WidgetService.notifyError(data.msgs[0]||'解除关联子网失败');
        }
      });
    };
  }]);

});
