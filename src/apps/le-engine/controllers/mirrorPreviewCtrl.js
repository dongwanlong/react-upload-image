/**
 * Created by chenxiaoxiao3 on 2016/7/18.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('mirrorPreviewCtrl', ['Utility','initData','$window','$q','$scope','$location','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (Utility,initData,$window,$q,$scope,$location,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.mirrorTagList = [];
            $scope.resType = initData.Type;
            var mirrorId = gEngineStatus.mirror.mirrorId;
            var contentType = {headers:{'Content-Type':'application/json'}};
            $scope.pageSize = 10;
            $scope.currentPage=1;
            var ci_details,confirmMessage,confirmTitle;

            if(initData.Type=="ci"){
                $scope.viewImagePermissions = true;
                $scope.deleteImagePermissions = initData['Delete CI'];
                $scope.editImagePermissions = initData['Edit CI'];
            }else{
                $scope.viewImagePermissions = initData['Browse Image'];
                $scope.deleteImagePermissions = initData['Delete Image'];
                $scope.editImagePermissions = initData['Edit Image'];
            }

            initTipMsg(initData.Type);

            function initTipMsg(type){
                if(type==='ci'){
                    ci_details = leEngineConfig.urls.ci_details.replace('{ciid}', mirrorId);
                    confirmMessage = LanguageService.mirrorPreviewListPage.deleteCreateCodeMessage;
                    confirmTitle = LanguageService.mirrorPreviewListPage.deleteCreateCodeTitle;
                }else{
                    ci_details = leEngineConfig.urls.mirror_details.replace('{imageid}', mirrorId);
                    confirmMessage = LanguageService.mirrorPreviewListPage.deleteMirrorMessage;
                    confirmTitle = LanguageService.mirrorPreviewListPage.deleteMirrorTitle;
                }
            }

            function refreshMirrorrPreviewList() {
                $scope.isListLoading = true;
                leEngineHttpService.doGet(ci_details).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading = false;
                        if (data.data.Details) {
                            $scope.name = data.data.Details.name;
                            $scope.Git = data.data.Details.Git;
                            $scope.Branch = data.data.Details.Branch;
                            $scope.BasicMirror = data.data.Details.Path;
                            $scope.build = data.data.Details.ParentImageTagId;
                            $scope.BuildFile = data.data.Details.BuildDockerFile;
                            $scope.StartFile = data.data.Details.StartContent;
                        }

                        $scope.mirrorInfo = data.data.Details;
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            $scope.editMirror = function(size) {
                if(initData.Type=="ci") {
                    editCi(size);
                }else{
                    editMirror(size);
                }
            };

            //删除镜像-CI
            $scope.deleteMirror = function(size,mirror){
                initTipMsg(initData.Type);
                if (mirror.Name) {
                    confirmTitle = confirmTitle;
                    confirmMessage = confirmMessage + mirror.Name + "?";
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
                    if(initData.Type=="ci"){
                        deleteCi(mirror);
                    }else{
                        deleteMirror(mirror);
                    }
                }, function () {
                });
            };
            //删除镜像
            function deleteMirror(mirror){
                var requestUrl = leEngineConfig.urls.mirror_delete.replace("{imageid}",mirror.Id);
                leEngineHttpService.doDelete(requestUrl,{},{headers:{'Content-Type':'application/json'}}).then(function (data, status, headers, config) {
                    if (data.data.data.Code != 200) {
                        WidgetService.notifyWarning(data.data.data.Message);
                    }else{
                        if(gEngineStatus.repertory.title && gEngineStatus.repertory.groupId){
                            var url = '/repertory-mirror-list/'+Utility.encodeUrl(gEngineStatus.repertory.groupId+"")+'/'+gEngineStatus.repertory.title;
                            $location.path(url);
                        }else{
                            $location.path('/main-mirror-list');
                        }
                    }
                });
            }
            //删除CI
            function deleteCi(mirror){
                var requestUrl = leEngineConfig.urls.ci_delete.replace("{ciid}",mirror.Id);
                leEngineHttpService.doDelete(requestUrl,{},{headers:{'Content-Type':'application/json'}}).then(function (data, status, headers, config) {
                    if (data.data.data.Code != 200) {
                        WidgetService.notifyWarning(data.data.data.Message);
                    }else{
                        $location.path('/main-ci-list');
                    }
                });
            }
            //编辑镜像
            function editMirror(size){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/mirror-setting-modal.html',
                    controller:  'mirrorSettingCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                handleType:"edit",
                                data:$scope.mirrorInfo
                            };
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    refreshMirrorrPreviewList();
                }, function () {
                });
            }
            //编辑CI
            function editCi(size){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/ci-setting-modal.html',
                    controller:  'ciSettingModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                handleType:"edit",
                                data:$scope.mirrorInfo
                            };
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    refreshMirrorrPreviewList();
                }, function () {
                });
            }

            refreshMirrorrPreviewList();
        }
    ]);
});