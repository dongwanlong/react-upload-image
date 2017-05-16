define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appPreviewCtrl', ['initData','$location','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (initData,$location,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {

            $scope.appInfo = {};

            $scope.viewAppPermissions = initData['Browse App'];
            $scope.deleteAppPermissions = initData['Remove App'];
            $scope.editAppPermissions = initData['Edit App'];

            $scope.settingApp = function(size, data, type) {
                data.handleType = type;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/app-setting-modal.html',
                    controller:  'appSettingCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return data;
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    refreshAppInfo();
                }, function () {
                });
            };

            //删除镜像
            $scope.deleteApp = function(size,appInfo){
                var confirmMessage = LanguageService.appPreviewPage.deleteAppMessage;
                var confirmTitle = LanguageService.appPreviewPage.deleteAppTitle;
                if (appInfo.Name) {
                    confirmTitle = confirmTitle;
                    confirmMessage = confirmMessage + appInfo.Name + "?";
                }

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/confirm-modal.html',
                    controller: 'ConfirmModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                "title":confirmTitle,
                                "message":confirmMessage
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    var requestUrl = leEngineConfig.urls.app_delete.replace("{appid}",appInfo.Id);
                    leEngineHttpService.doDelete(requestUrl,{},{headers:{'Content-Type':'application/json'}}).then(function (data, status, headers, config) {
                        if (data.data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.data.Message);
                        }else{
                            $location.path('/main-app-list-all');
                        }
                    });
                }, function () {
                });
            };

            function refreshAppInfo(){
                leEngineHttpService.doGet(leEngineConfig.urls.app_edit.replace('{appid}', gEngineStatus.app.appId)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        if(data.data.Details){
                            $scope.appInfo = data.data.Details;
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            //获取应用权限列表
            function getPermissions(){
                leEngineHttpService.doGet(leEngineConfig.urls.app_permissions.replace('{appid}', gEngineStatus.app.appId)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        gEngineStatus.app.permissions = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            refreshAppInfo();
        }
    ]);
});
