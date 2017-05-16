/**
 * Created by dongwanlong on 2016/4/29.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoResMonitorCtrl', ['$filter','gRdsStatus','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'rdsConfig', 'HttpService','WidgetService',
        function ($filter,gRdsStatus,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, rdsConfig, HttpService,WidgetService,CurrentContext) {

        $scope.monitorType = "comdml";
        $scope.timeType = "1";
        $scope.dbId = gRdsStatus.rdsInfo.rdsId;

        $scope.switchMonitorType = function(type){
            $scope.timeType = "1";
            $scope.monitorType = type;
        }

        $scope.switchTimeType = function(type){
            $scope.timeType = type;
        };

    }]);

});