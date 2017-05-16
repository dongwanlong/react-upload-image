/**
 * Created by chenxiaoxiao3 on 2016/8/8.
 */
/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appListCtrl', ['initData','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus','Utility',
        function (initData,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus,Utility) {

            $scope.appType = initData.type;
            $scope.appList = [];
            $scope.pageSize=10;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.searchName = "";

            var contentType = {headers:{'Content-Type':'application/json'}};

            //分页
            $scope.pageChange = function(){
                refreshAppList($scope.appType);
            };

            $scope.doSearch = function (e) {
                if (e) {
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        refreshAppList($scope.appType);
                    }
                } else {
                    refreshAppList($scope.appType);
                }
            };

            $scope.checkApp= function (app) {
                $scope.appList.forEach(function (item) {
                    if(item.Id==app.Id){
                        item.checked = !item.checked;
                    }else{
                        item.checked = false;
                    }
                });
            };

            function getCheckedApp(){
                return $scope.appList.filter(function(item){
                    return item.checked===true;
                });
            };

            //删除App
            $scope.deleteApp = function(size){
                var checkedApps = getCheckedApp();
                if(checkedApps.length !== 1){
                    WidgetService.notifyWarning(LanguageService.appListPage.selectTip);
                    return;
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
                                message:LanguageService.appListPage.appDeleteTip + checkedApps[0].Name + "?",
                                title:LanguageService.appListPage.appDelete
                            }
                        }

                    }
                });

                modalInstance.result.then(function () {
                    var url = leEngineConfig.urls.app_delete.replace("{appid}", checkedApps[0].Id);
                    leEngineHttpService.doDelete(url).then(function (data, status, headers, config) {
                        if(data.data.data.Code===200){
                            WidgetService.notifySuccess(LanguageService.appListPage.appDeleteSuccessTip);
                            refreshAppList();
                        }else{
                            WidgetService.notifyWarning(data.data.data.Message);
                        }
                    });
                }, function () {
                });
            }

            //加载数据
            var refreshAppList = function (type) {
                $scope.isListLoading = true;
                var requestAppUrl = leEngineConfig.urls.app_list.replace("{type}",initData.type).replace("{pageindex}",$scope.currentPage).replace("{pagecap}",$scope.pageSize);
                if ($scope.searchName) {
                    requestAppUrl = leEngineConfig.urls.app_search.replace("{type}",type).replace("{pageindex}",$scope.currentPage).replace("{pagecap}",$scope.pageSize).replace("{key}",$scope.searchName);
                }
                leEngineHttpService.doGet(requestAppUrl).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            $scope.totalItems = data.data.Details.Total;
                            $scope.appList = data.data.Details.Data;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);

                    }
                });
            };

            $scope.settingApp = function(type, size) {
                if(type=="create"){//创建应用
                        openSetting(size, {}, type);
                }else{
                }

            };
            //打开对话框
            var openSetting = function(size, data, type){
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
                    refreshAppList($scope.appType);
                }, function () {
                });
            };

            $scope.encoded = function(id){
                return Utility.encodeUrl(id+"");
            };

            refreshAppList($scope.appType);
        }
    ]);
});

