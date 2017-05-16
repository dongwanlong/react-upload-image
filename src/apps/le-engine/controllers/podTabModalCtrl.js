/**
 * Created by dongwanlong on 2016/9/6.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('podTabModalCtrl', ['$modalInstance','$scope','leEngineConfig','leEngineHttpService','transData','gEngineStatus','WidgetService',
        function ($modalInstance,$scope,leEngineConfig,leEngineHttpService,transData,gEngineStatus,WidgetService) {

            $scope.tabType = "info";
            $scope.podInfo = {};
            $scope.loading = true;

            $scope.viewAppPodInfoPermissions = transData.permissions['Browse App Pod Info'];
            $scope.viewAppPodLogPermissions = transData.permissions['Browse App Pod Log'];

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            //pod日志
            $scope.getPodLog = function(){
                var url = leEngineConfig.urls.pod_log.replace("{appid}", gEngineStatus.app.appId).replace("{cellid}", transData.cellId).replace("{podname}", transData.podName);
                leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.log = data.data.Details;
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            // $scope.refreshPodLog = function () {
            //     $scope.getPodLog();
            // };

            //pod详情
            $scope.getPodDetail = function() {
                var url = leEngineConfig.urls.pod_detail.replace("{versionid}", transData.apperId).replace("{podname}", transData.podName);
                leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.podInfo = data.data.Details;
                        $scope.detail = JSON.stringify(data.data.Details,undefined, 4);
                    } else {
                        //WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            $scope.getPodDetail();
            //$scope.getPodLog();

            $scope.getPodEvent = function(podEvent) {
                    $scope.loading = true;
                    $scope.eventList = [];

                    var refreshEventList = function () {
                        var requestUrl = leEngineConfig.urls.app_event_list.replace("{appid}",gEngineStatus.app.appId).replace("{limit}", 100).replace("{type}", "All").replace("{kind}", "Pod").replace("{name}", $scope.podInfo.metadata.name);
                        leEngineHttpService.doGet(requestUrl).then(function (data, status, headers, config) {
                            if (data.data.Code === 200) {
                                if (data.data.Details) {
                                    $scope.eventList = data.data.Details.Data;
                                }
                            }
                            else {
                                WidgetService.notifyWarning(data.data.Message);
                            }
                            $scope.loading = false;
                        });
                    };
                    refreshEventList();
            };

        }
    ]);
});