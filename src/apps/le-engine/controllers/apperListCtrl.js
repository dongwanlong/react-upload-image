/**
 * Created by chenxiaoxiao3 on 2016/8/15.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('apperListCtrl', ['Config','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (Config,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.appCellList = [];
            $scope.apperList = [];
            $scope.currentPage=1;
            var contentType = {headers:{'Content-Type':'application/json'}};
            $scope.pageSize=10;

            //打开对话框
            $scope.settingApper = function(type,size){
                if(type == 'create'){
                    openSetting(type,size,{});
                }
            }

            function openSetting(type,size,data){
                data.handleType = type;
                data.cellId = $scope.appCellListNow.value;
                var modalInstance = $modal.open({
                    animation:$scope.animationsEnabled,
                    size:size,
                    templateUrl: '/apps/le-engine/template/apper-setting-modal.html',
                    controller:  'apperSettingCtrl',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return data;
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    refreshApperList(true);
                }, function () {
                });
            }
            //获取容器下拉框数据
            function getApperList(){
                leEngineHttpService.doGet(leEngineConfig.urls.app_cell_list.replace("{appid}",gEngineStatus.app.appId)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            for(var i=0,len = data.data.Details.length;i < len;i++){
                                $scope.appCellList.push(new ModelService.SelectModel(data.data.Details[i].Name,data.data.Details[i].Id));
                            }
                            $scope.totalItems = data.data.Details.Total;
                            $scope.appCellListNow = $scope.appCellList[0];
                            refreshApperList();
                        }
                    }
                    else {
                        WidgetService.notifyWarning(data.data.Message);

                    }
                });
            }
            function refreshApperList(){
                leEngineHttpService.doGet(leEngineConfig.urls.apper_list.replace("{cellid}",$scope.appCellListNow.value).replace("{appid}",gEngineStatus.app.appId).replace("{pageindex}",$scope.currentPage).replace("{pagecap}",$scope.pageSize)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            $scope.apperList = data.data.Details.Data;
                            $scope.totalItems = data.data.Details.Total;

                        }
                    }
                    else {
                        WidgetService.notifyWarning(data.data.Message);

                    }
                });
            }
            //获取选择的Apper对象
            $scope.isAllApperChecked = function () {
                var unCheckedAppers = $scope.apperList.filter(function (apper) {
                    return apper.checked === false || apper.checked === undefined;
                });
                return unCheckedAppers.length == 0;
            };
            $scope.checkAllApper = function () {
                if ($scope.isAllApperChecked()) {
                    $scope.apperList.forEach(function (apper) {
                        apper.checked = false;
                    });
                }
                else {
                    $scope.apperList.forEach(function (apper) {
                        apper.checked = true;
                    });
                }
            };
            $scope.checkApper= function (apper) {
                apper.checked = apper.checked === true ? false : true;
            };
            var getCheckedApper = function(){
                var checkedApperList=[];
                $scope.apperList.filter(function(item){
                    if(item.checked){
                        checkedApperList.push(item);
                    };
                });
                return checkedApperList;
            };
            //删除Apper
            $scope.deleteApper = function(size){
                var Apper = getCheckedApper();
                if(Apper.length==1){
                    var obj = {
                        "type":"deleteApper",
                        "apper":Apper[0]
                    };
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/apps/le-engine/template/confirm-modal.html',
                        controller: 'ConfirmModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            transData: function () {
                                return obj;
                            }
                        }
                    });

                    modalInstance.result.then(function () {
                        leEngineHttpService.doDelete(leEngineConfig.urls.apper_delete.replace("{versionid}",Apper[0].Id),{},contentType).then(function (data, status, headers, config) {
                            if (data.data.data.Code != 200) {
                                WidgetService.notifyWarning(data.data.data.Message);
                            }else{
                                refreshApperList();
                            }
                        });
                    }, function () {
                    });
                }else{
                    WidgetService.notifyWarning(LanguageService.apperListPage.selectTip);
                }

            }

            getApperList();

        }]);

});