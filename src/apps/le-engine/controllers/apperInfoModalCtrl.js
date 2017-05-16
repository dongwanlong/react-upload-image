/**
 * Created by dongwanlong on 2016/9/6.
 */
/**
 * Created by chenxiaoxiao3 on 2016/8/15.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('apperInfoModalCtrl', ['transData','Config','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus','$modalInstance',
        function (transData,Config,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus,$modalInstance) {
            $scope.tabType = "apperGeneral";
            $scope.apperInfo = {};
            $scope.envList = [];

            $scope.closeModal = function () {
               $modalInstance.dismiss('cancel');
            };

            function refreshAppInfo(){
                leEngineHttpService.doGet(leEngineConfig.urls.apper_detail.replace('{versionid}', transData.id).replace('{detail}', false)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        if(data.data.Details){
                            $scope.apperInfo = data.data.Details;
                            $scope.apperInfo.Env = $scope.apperInfo.Env.filter(function(item){
                                return leEngineConfig.REGEX.APPER_EVN.test(item.name);
                            });
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            refreshAppInfo();

            $scope.getAppDetail = function(apperDetail) {
                if (!apperDetail) {
                    leEngineHttpService.doGet(leEngineConfig.urls.apper_detail.replace('{versionid}', transData.id).replace('{detail}', true)).then(function (data, status, headers, config) {
                        if(data.data.Code === 200){
                            if(data.data.Details){
                                $scope.apperDetail = JSON.stringify(data.data.Details, undefined, 4);
                            }
                        }else{
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }
            };

            $scope.getRCEvent = function(rcEvent) {
                if (!rcEvent) {
                    $scope.eventList = [];

                    var refreshEventList = function () {
                        var requestUrl = leEngineConfig.urls.app_event_list.replace("{appid}",gEngineStatus.app.appId).replace("{limit}", 100).replace("{type}", "All").replace("{kind}", "ReplicationController").replace("{name}", $scope.apperInfo.Name);
                        leEngineHttpService.doGet(requestUrl).then(function (data, status, headers, config) {
                            // $scope.isListLoading = false;
                            if (data.data.Code === 200) {
                                if (data.data.Details) {
                                    $scope.eventList = data.data.Details.Data;
                                }
                            } else {
                                WidgetService.notifyWarning(data.data.Message);
                            }
                        });
                    };

                    refreshEventList();
                }

            };

        }]);

});