/**
 * Created by chenxiaoxiao3 on 2016/8/10.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appEventCtrl', ['$interval','initData','$q','$scope','$modal', 'leEngineConfig', 'leEngineHttpService','WidgetService','LanguageService','gEngineStatus','Utility',
        function ($interval,initData,$q,$scope,$modal, leEngineConfig, leEngineHttpService ,WidgetService,LanguageService,gEngineStatus,Utility) {

            $scope.viewAppEventsPermissions = initData['Browse App Events'];
            $scope.eventList = [];
            $scope.loading = true;
            var refreshEventList = function () {
                var requestUrl = leEngineConfig.urls.app_event_list.replace("{appid}",gEngineStatus.app.appId).replace("{limit}", 500).replace("{type}", "All").replace("{kind}", "All").replace("{name}", "");
                leEngineHttpService.doGet(requestUrl).then(function (data, status, headers, config) {
                    $scope.loading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            $scope.eventList =data.data.Details.Data;
                        }
                    }
                    else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            refreshEventList();
        }]);
});