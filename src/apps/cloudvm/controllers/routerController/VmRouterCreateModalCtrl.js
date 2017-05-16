/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {

  controllerModule.controller('VmRouterCreateModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window', 'region',
    function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window, region) {

    $scope.routerName = '';
    $scope.enablePublicNetworkGateway = 'true';
    $scope.publicNetworkId = '';
    $scope.allRouteBuyPeriods = Config.allBuyPeriods;
    $scope.routeBuyPeriod = $scope.allRouteBuyPeriods[0];

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.createRouter = function () {
      var data = {
        region:region,
        name: $scope.routerName,
        enablePublicNetworkGateway: $scope.enablePublicNetworkGateway,
        publicNetworkId:$scope.publicNetworkId,
        count:1,//为了给计费提供支持
        order_time: $scope.routeBuyPeriod.toString()
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.router_buy, {paramsData:JSON.stringify(data),displayData:buildDisplayData()}).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          $window.location.href = '/payment/'+data.data+'/5';
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'创建路由器失败');
          $scope.isFormSubmiting=false;
        }
      });
    };
    $scope.$watch('routeBuyPeriod', function (value) {
      if (value) {
        setRoutePrice();
      }
    });

    var initComponents = function () {
        initRouterTypeSelector();
      },
      initRouterTypeSelector = function () {
        HttpService.doGet(Config.urls.network_public_list,{region:region}).then(function (data, status, headers, config) {
          $scope.publicNetworkId = data.data[0].id;
        });
      },
      setRoutePrice=function(){
        var data={
          region: region,
          order_time: $scope.routeBuyPeriod.toString(),
          order_num: '1',
          os_router:'router'
        };
        $scope.isCalculatingPrice=true;
        HttpService.doPost(Config.urls.route_calculate_price,data).success(function (data, status, headers, config) {
          $scope.isCalculatingPrice=false;
          if(data.result===1){
            $scope.totalPrice=data.data;
          }
          else{
            WidgetService.notifyError(data.msgs[0]||'计算价格失败');
          }
        });
      },
      buildDisplayData=function(){
        var data=[];
        data.push(['公网网关',$scope.enablePublicNetworkGateway === 'true'? '开启':'关闭'].join('/:'));
        return data.join('/;');
      };

    initComponents();

  }]);

});
