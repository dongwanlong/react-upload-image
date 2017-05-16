/**
 * Created by chenxiaoxiao3 on 2016/8/10.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appCellCtrl', ['$interval','initData','$q','$scope','$modal', 'leEngineConfig', 'leEngineHttpService','WidgetService','LanguageService','gEngineStatus','Utility',
        function ($interval,initData,$q,$scope,$modal, leEngineConfig, leEngineHttpService ,WidgetService,LanguageService,gEngineStatus,Utility) {

            $scope.appId = gEngineStatus.app.appId;
            $scope.servicesName = "";
            $scope.isDomainName = true;
            //cell
            $scope.cellList = [];
            $scope.currentCellId = "";
            $scope.currentCellIndex = "";
            //version
            $scope.apperList = [];
            $scope.currentPage=1;
            $scope.pageSize=10;

            var contentType = {headers:{'Content-Type':'application/json'}};
            var serviceInfo = {};

            function getCheckedApper(){
                return $scope.apperList.filter(function(item){
                    return item.checked===true;
                });
            };

            //刷新cell列表
            function refreshCellList(){
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.app_cell_list.replace("{appid}",$scope.appId)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            $scope.cellList = data.data.Details;
                            $scope.cellList.forEach(function(item){
                                item.servicesName = "";
                            });
                            if($scope.cellList.length>0){
                                $scope.currentCellId = $scope.cellList[0].Id;
                                cellIdReady();
                                $scope.refreshApperList($scope.currentCellId);
                            }
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            //刷新版本实例列表
            function refreshPodList(apper){
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.pod_list.replace("{versionid}",apper.Id)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            apper.podList = data.data.Details;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            //刷新服务状态
            function refreshServicesStatus(){
                var url = leEngineConfig.urls.services.replace("{appid}",$scope.appId).replace("{cellid}",$scope.currentCellId);
                leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                    if (data.data.Code == 200) {
                        if(data.data.Details && data.data.Details.length>0) {
                            serviceInfo = data.data.Details[0];
                            $scope.cellList[$scope.getCellIndexById($scope.currentCellId)].servicesName = data.data.Details[0].metadata.name;
                        } else{
                            $scope.cellList[$scope.getCellIndexById($scope.currentCellId)].servicesName = "";
                        }
                    }
                });
            }

            function cellIdReady(){
                refreshServicesStatus();
            }

            function refreshAppInfo(){
                leEngineHttpService.doGet(leEngineConfig.urls.app_edit.replace('{appid}', gEngineStatus.app.appId)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        if(data.data.Details.DomainName){
                            $scope.isDomainName = true;
                        }else {
                            $scope.isDomainName = false;
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function refreshPermissions(){
                $scope.deployAppPermissions = initData['Deploy App'];
                $scope.viewAppCellsPermissions = initData['Browse App Cell List'];
                $scope.viewAppEventsPermissions = initData['Browse App Events'];
                $scope.removeAppVersionPermissions = initData['Remove App Version'];
                $scope.createAppServicePermissions = initData['Create App Service'];
                $scope.removeAppServicePermissions = initData['Remove App Service'];
                $scope.viewAppVersionListPermissions = initData['Browse App Version List'];
                $scope.viewAppVersionInfoPermissions = initData['Browse App Version Info'];
                $scope.viewAppServiceInfoPermissions = initData['Browse App Service Info'];
                $scope.viewAppPodsPermissions = initData['Browse App Pod List'];
                $scope.eidtAppVersionPermissions = initData['Edit App Version'];
                $scope.removePodPermissions = initData['Deploy App'];
            }

            //切换cell
            $scope.switchCell = function(id){
                $scope.currentCellId = id;
                $scope.refreshApperList();
                refreshServicesStatus();
            }

            //打开apper信息对话框
            $scope.openApperInfo = function(size,apperId){
                if(!$scope.viewAppVersionInfoPermissions)return;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/apper-info-modal.html',
                    controller: 'apperInfoModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                id:apperId,
                                cellId:$scope.currentCellId
                            };
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                }, function () {
                });
            };

            //打开pod实例对话框
            $scope.openPodInfo = function(size,apper,pod){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/pod-tab-modal.html',
                    controller: 'podTabModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                cellId:$scope.currentCellId,
                                apperId:apper.Id,
                                podName:pod.Name,
                                permissions:initData
                            };
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                }, function () {
                });
            }

            //创建Apper对话框
            $scope.createApper = function(size){

                if ($scope.apperList) {
                    var apperId = $scope.apperList[0].Id;
                } else {
                    var apperId = null;
                }

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/apper-setting-modal.html',
                    controller: 'apperSettingCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                handleType:"create",
                                cellId:$scope.currentCellId,
                                apperId: apperId
                            };
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    $scope.refreshApperList($scope.currentCellId);
                }, function () {
                });
            }

            //创建Services
            $scope.createServices = function(){
                var url = leEngineConfig.urls.services.replace("{appid}",$scope.appId).replace("{cellid}",$scope.currentCellId);
                leEngineHttpService.doPost(url).then(function (data, status, headers, config) {
                    if (data.data.data.Code === 200) {
                        WidgetService.notifySuccess(LanguageService.apperListPage.createServicesSuccessTip);
                        refreshServicesStatus();
                    } else {
                        WidgetService.notifyWarning(data.data.data.Message);
                    }
                });
            }

            //关闭Services
            $scope.closeServices = function(size){
                var confirmMessage = LanguageService.apperListPage.closeServicesMessage;
                var confirmTitle = LanguageService.apperListPage.closeServicesBtn;

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
                    var url = leEngineConfig.urls.services_delete.replace("{appid}",$scope.appId).replace("{cellid}",$scope.currentCellId).replace("{servicename}",$scope.cellList[$scope.getCellIndexById($scope.currentCellId)].servicesName);
                    leEngineHttpService.doDelete(url).then(function (data, status, headers, config) {
                        if (data.status === 200) {
                            WidgetService.notifySuccess(LanguageService.apperListPage.deleteServicesSuccessTip);
                            refreshServicesStatus();
                        }
                        else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }, function () {
                });
            };

            //打开查看Services信息对话框
            $scope.viewServices = function(size){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/services-info-modal.html',
                    controller: 'servicesInfoModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                info:serviceInfo,
                                cellId:$scope.currentCellId,
                            };
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                }, function () {
                });
            }

            //删除apper
            $scope.deleteApper = function(size){
                var checkedAppers = getCheckedApper();
                if(checkedAppers.length !== 1){
                    WidgetService.notifyWarning(LanguageService.apperListPage.selectTip);
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
                                message:LanguageService.apperListPage.deleteApperMessage,
                                title:checkedAppers[0].Name
                            }
                        }

                    }
                });

                modalInstance.result.then(function () {
                    var url = leEngineConfig.urls.apper_delete.replace("{versionid}", checkedAppers[0].Id);
                    leEngineHttpService.doDelete(url).then(function (data, status, headers, config) {
                        if(data.data.data.Code===200){
                            WidgetService.notifySuccess(LanguageService.apperListPage.apperDeleteSuccessTip);
                            $scope.refreshApperList();
                        }else{
                            WidgetService.notifyError(data.data.data.Message);
                        }
                    });
                }, function () {
                });
            }

            //设置pod数量
            $scope.setPodCount = function(size){
                var checkedAppers = getCheckedApper();
                if(checkedAppers.length !== 1){
                    WidgetService.notifyWarning(LanguageService.apperListPage.selectTip);
                    return;
                }

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/pod-count-setting-modal.html',
                    controller: 'podCountSettingModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return checkedAppers[0];
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    if (resultData.data.data.Code === 200) {
                        $scope.refreshApperList();
                    } else {
                        WidgetService.notifyError(resultData.data.data.Message);
                    }
                }, function () {
                });
            };

            //删除pod
            $scope.deletePod = function(size, pod){
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
                                message:LanguageService.apperListPage.deletePodMessage,
                                title:pod.Name
                            }
                        }

                    }
                });

                modalInstance.result.then(function () {
                    var url = leEngineConfig.urls.pod_delete.replace('{appid}', gEngineStatus.app.appId).replace('{podname}',pod.Name).replace('{cellid}',$scope.currentCellId);
                    leEngineHttpService.doDelete(url).then(function (data, status, headers, config) {
                        if(data.data.data.Code===200){
                            WidgetService.notifySuccess(LanguageService.apperListPage.podDeleteSuccessTip);
                            $scope.refreshApperList();
                        }else{
                            WidgetService.notifyError(data.data.data.Message);
                        }
                    });
                }, function () {
                });
            }

            $scope.checkApper= function (apper) {
                $scope.apperList.forEach(function (item) {
                    if(item.Id==apper.Id){
                        item.checked = !item.checked;
                    }else{
                        item.checked = false;
                    }
                });
            };

            $scope.getApperLength = function(){
                return $scope.apperList.filter(function(item){
                    return item.CellId;
                }).length();
            };

            $scope.encoded = function(id){
                return Utility.encodeUrl(id+"");
            };

            $scope.switchPodBtn = function(apper){
                apper.open = !apper.open;
                if(apper.open){
                   refreshPodList(apper);
                }
            }

            //刷新版本列表
            $scope.refreshApperList = function(cellId){
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.apper_list.replace("{appid}",$scope.appId).replace("{cellid}",$scope.currentCellId).replace("{pageindex}",0).replace("{pagecap}",10)).then(function (data, status, headers, config) {
                    $scope.isListLoading=false;
                    if (data.data.Code === 200) {
                        if(data.data.Details) {
                            $scope.apperList = data.data.Details.Data;
                            $scope.totalItems = data.data.Details.Total;
                            if ($scope.apperList) {
                                $scope.apperList.forEach(function(item){
                                    refreshPodList(item);
                                });
                            }
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            $scope.getCellIndexById = function(id){
                var cellIndex = 0;
                $scope.cellList.filter(function(item,index){
                    if(item.Id==id){
                        cellIndex = index;
                    }
                    return true;
                });
                return cellIndex;
            }

            refreshAppInfo();
            refreshCellList();
            refreshPermissions();

            var timer = $interval(function(){
                if(!$scope.apperList || $scope.apperList.length<=0)return;
                $scope.apperList.forEach(function(item){
                    if(item.open){
                        refreshPodList(item);
                    }
                });
            },5*1000);

            $scope.$on("$destroy",function(){
                $interval.cancel(timer);
            });
        }]);
});