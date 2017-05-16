/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {
  controllerModule.controller('VmRouterCtrl', ['$scope','$interval','$modal', 'Config','Utility', 'HttpService','WidgetService','CurrentContext',
    function ($scope,$interval,$modal, Config,Utility, HttpService,WidgetService,CurrentContext) {

      $scope.routerList = [];

      $scope.currentPage = 1;
      $scope.totalItems = 0;
      $scope.pageSize = 10;
      $scope.operationBtn={};
      var operationArry=[];
      $scope.onPageChange = function () {
        refreshRouterList();
      };

      $scope.doSearch = function () {
        refreshRouterList();
      };

      $scope.openVmRouterCreateModal = function (size) {
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'VmRouterCreateModalTpl',
          controller: 'VmRouterCreateModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            refreshRouterList();
          }
        }, function () {
        });
      };

      $scope.isAllRouterChecked=function(){
        var unCheckedRouters=$scope.routerList.filter(function(router){
          return router.checked===false || router.checked===undefined;
        });
        return unCheckedRouters.length==0;
      };
      $scope.checkAllRouter=function(){
        if($scope.isAllRouterChecked()){
          $scope.routerList.forEach(function(router){
            router.checked=false;
          });
        }
        else{
          $scope.routerList.forEach(function(router){
            router.checked=true;
          });
        }

      };
      $scope.checkRouter = function (router) {
        router.checked = router.checked === true ? false : true; 
      };

      $scope.editRouter = function(){
        var checkedRouters=getCheckedRouter();
        if(checkedRouters.length !==1){
          WidgetService.notifyWarning('请选中一个路由器');
          return;
        }
        openVmRouterEditModal('500',{
          region:checkedRouters[0].region,
          routerId: checkedRouters[0].id,
          routerName: checkedRouters[0].name,
          publicNetworkGatewayEnable : checkedRouters[0].publicNetworkGatewayEnable,
          publicNetworkId:checkedRouters[0].carrier?checkedRouters[0].carrier.id:null
        });
      }

      $scope.associateSubnet = function(){
        var checkedRouters=getCheckedRouter();
        if(checkedRouters.length !==1){
          WidgetService.notifyWarning('请选中一个路由器');
          return;
        }
        associateSubnetModal('500',{
          region:checkedRouters[0].region,
          routerId: checkedRouters[0].id,
          routerName: checkedRouters[0].name
        });
      }

      $scope.removeSubnet = function(){
        var checkedRouters=getCheckedRouter();
        if(checkedRouters.length !==1){
          WidgetService.notifyWarning('请选中一个路由器');
          return;
        }
        console.log(checkedRouters[0].subnets);
        if(checkedRouters[0].subnets.length === 0){
          WidgetService.notifyWarning("选择的路由未关联子网");
          return;
        }
        removeSubnetModal('500',{
          region:checkedRouters[0].region,
          routerId: checkedRouters[0].id,
          routerName: checkedRouters[0].name,
          subnets:checkedRouters[0].subnets
        });
      }

      $scope.deleteRouter = function(){
        var checkedRouters=getCheckedRouter();
        if(checkedRouters.length !==1){
          WidgetService.notifyWarning('请选中一个路由器');
          return;
        }
        var data={
          region:checkedRouters[0].region,
          routerId: checkedRouters[0].id
        };
        var modalInstance = WidgetService.openConfirmModal('删除路由器','确定要删除路由器（'+checkedRouters[0].name+'）吗？');
        modalInstance.result.then(function (resultData) {
          if(!resultData) return resultData;
          WidgetService.notifyInfo('删除路由器执行中...');
          checkedRouters[0].status='DELETEING';
          HttpService.doPost(Config.urls.router_delete, data).success(function (data, status, headers, config) {
            if(data.result===1){
              checkedRouters[0].status='DELETED';
              modalInstance.close(data);
              WidgetService.notifySuccess('删除路由器成功');
              refreshRouterList();
            }
            else{
              WidgetService.notifyError(data.msgs[0]||'删除路由器失败');
            }
          });
        }, function () {
        });
      };
      $scope.functionDisable = function(){
        WidgetService.notifyWarning('此功能尚未开放,敬请期待...');
      }

      var refreshRouterList = function () {
        operationArry=[];
            var queryParams = {
              name: $scope.searchRouterName,
              currentPage: $scope.currentPage,
              recordsPerPage: $scope.pageSize
            };
          $scope.isListLoading=true;
            HttpService.doGet(Config.urls.router_list, queryParams).then(function (data, status, headers, config) {
              if(!Utility.isServiceReady('serviceStatus5')){
                WidgetService.notifyWarning('服务未完全创建，请刷新试试看！');
              }
              $scope.isListLoading=false;
              $scope.routerList = data.data.data;
              $scope.totalItems = data.data.totalRecords;

            });
          },
          getCheckedRouter=function(){
            return $scope.routerList.filter(function(item){
              return item.checked===true;
            });
          },
          openVmRouterEditModal = function (size,data) {
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'VmRouterEditModalTpl',
              controller: 'VmRouterEditModalCtrl',
              size: size,
              backdrop: 'static',
              keyboard: false,
              resolve: {
                routerInfo: function () {
                  return data;
                }
              }
            });

            modalInstance.result.then(function (resultData) {
              if(resultData &&resultData.result===1){
                refreshRouterList();
              }
            }, function () {
            });
          },
          associateSubnetModal = function (size,data) {
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'AssociateSubnetModalTpl',
              controller: 'AssociateSubnetModalCtrl',
              size: size,
              backdrop: 'static',
              keyboard: false,
              resolve: {
                routerInfo: function () {
                  return data;
                }
              }
            });

            modalInstance.result.then(function (resultData) {
              if(resultData &&resultData.result===1){
                refreshRouterList();
              }
            }, function () {
            });
          },
          removeSubnetModal = function (size,data) {
            var modalInstance = $modal.open({
              animation: $scope.animationsEnabled,
              templateUrl: 'RemoveSubnetModalTpl',
              controller: 'RemoveSubnetModalCtrl',
              size: size,
              backdrop: 'static',
              keyboard: false,
              resolve: {
                routerInfo: function () {
                  return data;
                }
              }
            });

            modalInstance.result.then(function (resultData) {
              if(resultData &&resultData.result===1){
                refreshRouterList();
              }
            }, function () {
            });
          };
        var watchStateChange=function(){
          var productInfo={
            'type':'router',
            'state':'status',
            'other':['subnets'],
            'operations':['create','bindsubnet','edit','removesubnet','delete']
          }
          $scope.$watch(function(){
            return $scope.routerList.map(function(obj) {
              return obj.checked;
            }).join(";");
          },function(){
            var operationArraycopy=Utility.setOperationBtns($scope,$scope.routerList,productInfo,operationArry,Config);
            var operaArraytemp=productInfo.operations;
            for(var k in operaArraytemp){
              $scope.operationBtn[operaArraytemp[k]]=operationArraycopy[k]
            }
          });
        }
      refreshRouterList();
      watchStateChange();
    }
  ]);

});
