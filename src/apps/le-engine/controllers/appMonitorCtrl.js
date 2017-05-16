/**
 * Created by dongwanlong on 2016/11/29.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appMonitorCtrl', ['initData','$q','$scope','$modal', 'leEngineConfig', 'leEngineHttpService','WidgetService','LanguageService','gEngineStatus','Utility','$interval',
        function (initData,$q,$scope,$modal, leEngineConfig, leEngineHttpService,WidgetService,LanguageService,gEngineStatus,Utility,$interval) {

            $scope.monitorType = "app";
            $scope.timeType = "real";
            $scope.dockerList = [];
            $scope.refreshTag = true;
            $scope.isListLoading = true;
            $scope.loadingNetwork = true;
            $scope.loadingCpu = true;
            $scope.loadingMemory = true;

            var timer = null;

            $scope.monitorCpu = {
                monitorType:'app',
                charId:'chart-cpu',
                subType:'cpu',
                appId:gEngineStatus.app.appId
            };
            $scope.monitorMemory = {
                monitorType:'app',
                charId:'chart-memory',
                subType:'memory',
                appId:gEngineStatus.app.appId
            };
            $scope.monitorNetwork = {
                monitorType:'app',
                charId:'chart-network',
                subType:'network',
                appId:gEngineStatus.app.appId
            };

            $scope.switchTimeType = function(type){
                $scope.timeType = type;
                if($scope.timeType==='real' && timer){
                    timer = $interval(function(){
                        $scope.refreshTag = !$scope.refreshTag;
                    },1000*30);
                }else{
                    $interval.cancel(timer);
                }
            }

            $scope.openPodMonitor = function(size,pod){
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/apps/le-engine/template/pod-monitor-modal.html',
                    controller: 'podMonitorModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return pod;
                        }
                    }
                });

                modalInstance.result.then(function () {
                }, function () {
                });
            }

            function refreshDockerMonitorList(){
                leEngineHttpService.doGet(leEngineConfig.urls.pod_list_cell.replace('{appid}',gEngineStatus.app.appId).replace('{cellid}',-1)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            $scope.dockerList = data.data.Details;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            timer = $interval(function(){
                $scope.refreshTag = !$scope.refreshTag;
            },1000*30);

            refreshDockerMonitorList();

        }]);
});