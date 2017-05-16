/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('mirrorListCtrl', ['initData','$window','$q','$scope','$interval','$modal','$timeout','$location','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus','Utility',
        function (initData,$window,$q,$scope,$interval,$modal,$timeout,$location,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus,Utility) {

            $scope.createImagePermissions = initData['Create Image In ImageGroup'];
            $scope.visLevelPrivate= leEngineConfig.visibilityLevel.Private;
            $scope.visLevelPublic= leEngineConfig.visibilityLevel.Public;

            $scope.mirrorType = "owner";

            $scope.mirrorList = [];
            $scope.pageSize = 10;
            $scope.currentPage = 1;
            $scope.itemCount = 0;
            $scope.searchName = '';

            var imageGroupId;
            //若没有确定的仓库ID，则imageGroupId默认设为-1
            if(gEngineStatus.repertory.groupId && gEngineStatus.repertory.groupId != ":id" && $location.path()!='/main-mirror-list'){
                imageGroupId = gEngineStatus.repertory.groupId;
            }else{
                imageGroupId = -1;
            }
            $scope.imageGroupId=imageGroupId;
            //切换tab
            $scope.switchMirrorType = function(type){
                $scope.mirrorType = type;
                $scope.currentPage = 1;
                $scope.searchName = '';
                $scope.doSearch();
            };

            $scope.doSearch = function (e) {
                if (e) {
                    var keycode = window.event ? e.keyCode : e.which;
                    if (keycode == 13) {
                        refreshMirrorList();
                    }
                } else {
                    refreshMirrorList();
                }
            };

            //分页
            $scope.pageChange = function(){
                refreshMirrorList();
            };

            //加载数据
            var refreshMirrorList = function () {
                var type = $scope.mirrorType;
                var requestRepertoryUrl = leEngineConfig.urls.mirror_list.replace("{type}",type).replace("{pageindex}",$scope.currentPage).replace("{pagecap}",$scope.pageSize).replace('{imageGroupId}',imageGroupId);
                if ($scope.searchName) {
                    requestRepertoryUrl = leEngineConfig.urls.mirror_search.replace("{type}",type).replace("{pageindex}",$scope.currentPage).replace("{pagecap}",$scope.pageSize).replace('{imageGroupId}',imageGroupId).replace('{key}',$scope.searchName);
                }
                $scope.isListLoading = true;
                leEngineHttpService.doGet(requestRepertoryUrl).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            $scope.mirrorList = data.data.Details.Data;
                            $scope.itemCount = data.data.Details.Total;
                        }
                    }else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            $scope.settingMirror = function(type, size, checkedMirror) {
                if (type=="edit") {//编辑镜像
                    leEngineHttpService.doGet(leEngineConfig.urls.mirror_details.replace('{imageid}', checkedMirror.Id)).then(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            if (data.data.Details) {
                                openSetting(size, data.data.Details, type);
                            }
                        } else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }else if(type=="create"){//修改镜像
                    if(imageGroupId === -1){
                        WidgetService.notifyWarning(LanguageService.mirrorListPage.errorCreate);
                    }else{
                        openSetting(size, {}, type);
                    }
                }else{
                }

            };

            $scope.encoded = function(id){
                return Utility.encodeUrl(id+"");
            };

            var openSetting = function (size, data, type) {
                    data.handleType = type;
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/apps/le-engine/template/mirror-setting-modal.html',
                        controller: 'mirrorSettingCtrl',
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
                        refreshMirrorList();
                    }, function () {
                    });
                },
                mirrorPermissionsCheck = function () {
                    if ($scope.imageGroupId == -1)return;
                    leEngineHttpService.doGet(leEngineConfig.urls.repertory_permissions.replace('{imagegroupid}', $scope.imageGroupId)).then(function (data, status, headers, config) {
                        if (data.data.Code === 200 && data.data.Details && data.data.Details['Create Image In ImageGroup']) {
                            $scope.createMonitorPermissions = true;
                        }
                    });
                };

            mirrorPermissionsCheck();
            refreshMirrorList();
        }
    ]);
});

