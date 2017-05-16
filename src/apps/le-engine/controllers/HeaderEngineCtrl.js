/**
 * Created by dongwanlong on 2016/6/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('HeaderEngineCtrl', ['$timeout','$cookies','$modal','$q','$http','LanguageService','$rootScope','$scope', '$location','$window','leEngineHttpService','$rootScope','WidgetService','leEngineConfig','gEngineStatus',
        function ($timeout,$cookies,$modal,$q,$http,LanguageService, $rootScope, $scope, $location, $window, leEngineHttpService, $rootScope, WidgetService,leEngineConfig,gEngineStatus) {

            $scope.userName = "";
            //语言
            $scope.langList = ['zh-cn','en-us'];
            $scope.currentLang = gEngineStatus.getLang();

            $scope.regionInfo = gEngineStatus.regionInfo;

            $scope.changeLanguage = function(lang){
                window.location.href = "/?lang="+lang+"#"+$location.path();
            };

            $scope.languageHref = function(lang){
                return "/?lang="+lang+"#"+$location.path();
            };

            leEngineHttpService.doGet("/user", {}).then(function (data, status, headers, config) {
                if (data.result == 1) {
                    $scope.userName = data.data.Details.Name;
                    gEngineStatus.mirror.username = data.data.Details.Name;
                    if(!data.data.Details.Telephone){
                        $scope.userSetting('large',true);
                    }
                } else{
                    leEngineHttpService.doGet("/user/logout", {}).then(function (data, status, headers, config) {
                        if (data.result == 1) {
                            window.location.reload(true);
                        }
                    });
                }
            });

            gEngineStatus.regionInfo.regionName = $location.host();
            leEngineHttpService.doGet(leEngineConfig.urls.region_list.replace('{boss}',false)).then(function (data, status, headers, config) {
                if (data.result == 1) {
                    gEngineStatus.regionInfo.regionList = data.data.Details;
                    gEngineStatus.regionInfo.region = gEngineStatus.regionInfo.regionList.filter(function(region){
                        return region.Address === $location.host();
                    })[0];
                }
            });

            //登出
            $scope.logout = function () {
                leEngineHttpService.doGet("/user/logout", {}).then(function (data, status, headers, config) {
                    if (data.result == 1) {
                        window.location.reload(true);
                    }
                });
            }

            //用户信息
            $scope.userSetting = function(size,init){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/user-setting-modal.html',
                    controller: 'userSettingModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {init:init};
                        }
                    }
                });

                modalInstance.result.then(function (data){
                    if (data.data.data.Code == 200) {
                        WidgetService.notifySuccess(LanguageService.userSettingModal.savingSuccessTip);
                    } else{
                        WidgetService.notifyWarning(data.data.data.Message);
                    }
                }, function () {
                });
            }

        }
    ]);

});
