/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {

  controllerModule.controller('VmIPcreateModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window', 'region',
    function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window, region) {
    Utility.getRzSliderHack($scope)();
    $scope.networkBandWidth=2;
    $scope.ipName = '';
    $scope.ipCount = 1;
    $scope.carrierList='';
    $scope.selectedCarrier = null;
    $scope.allFloatipBuyPeriods = Config.allBuyPeriods;
    $scope.floatipBuyPeriod = $scope.allFloatipBuyPeriods[0];
    $scope.totalPrice='';
    HttpService.doGet('/osn/network/public/list',{'region':region}).then(function(data) {
      $scope.carrierList=data.data;
    });
    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.selectCarrier = function (carrier) {
      $scope.selectedCarrier = carrier;
    };
    $scope.isSelectedCarrier = function (carrier) {
      return $scope.selectedCarrier = carrier;
    };
    $scope.createIP = function () {
      var data = {
        'region':region,
        name: $scope.ipName,
        publicNetworkId:$scope.selectedCarrier.id,
        bandWidth: $scope.networkBandWidth,
        count:$scope.ipCount,
        order_time: $scope.floatipBuyPeriod.toString(),
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.floatip_buy, {paramsData:JSON.stringify(data),displayData:buildDisplayData()}).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          $window.location.href = '/payment/'+data.data+'/4';
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'创建公网IP失败');
          $scope.isFormSubmiting=false;
        }
      });
    };

    $scope.$watch(function(){
      return [
        $scope.ipCount,
        $scope.networkBandWidth,
        $scope.floatipBuyPeriod].join('_');
    }, function (value) {
      if ($scope.ipCount && $scope.networkBandWidth && $scope.floatipBuyPeriod) {
        setFloatipPrice();
      }
    });


    var setFloatipPrice=function(){
      var data={
        region: region,
        order_time: $scope.floatipBuyPeriod.toString(),
        order_num: $scope.ipCount.toString(),
        os_broadband:$scope.networkBandWidth.toString()
      };
        $scope.isCalculatingPrice=true;
      HttpService.doPost(Config.urls.floatip_calculate_price,data).success(function (data, status, headers, config) {
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
        data.push(['带宽',$scope.networkBandWidth+'Mbps'].join('/:'));
        return data.join('/;');
      };


  }]);

});
