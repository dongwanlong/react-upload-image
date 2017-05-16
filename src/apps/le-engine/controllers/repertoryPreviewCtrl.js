define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('repertoryPreviewCtrl', ['initData','$window','$q','$scope','$location','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (initData,$window,$q,$scope,$location,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {

            $scope.repertoryInfo = {};

            $scope.viewImageGroupPermissions = initData['Browse ImageGroup'];
            $scope.deleteImageGroupPermissions = initData['Remove ImageGroup'];
            $scope.editImageGroupPermissions = initData['Edit ImageGroup'];

            $scope.editRepertory = function(size,checkedRepertory){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/repertory-edit-modal.html',
                    controller:  'repertoryEditModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return checkedRepertory;
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    refreshRepertoryInfo(true);
                }, function () {
                });
            };

            function refreshRepertoryInfo(){
                leEngineHttpService.doGet(leEngineConfig.urls.repertory_single.replace('{imagegroupid}', gEngineStatus.repertory.groupId)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        if(data.data.Details){
                            $scope.repertoryInfo = data.data.Details;
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            refreshRepertoryInfo();

            //删除镜像仓库
            $scope.deleteRepertory = function(size,repertory){
                var confirmMessage = LanguageService.repertoryPreviewPage.deleteRepertoryMessage;
                var confirmTitle = LanguageService.repertoryPreviewPage.deleteRepertoryTitle;
                if (repertory.Name) {
                    confirmTitle = confirmTitle;
                    confirmMessage = confirmMessage + repertory.Name + "?";
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
                    var requestUrl = leEngineConfig.urls.repertory_single.replace("{imagegroupid}",repertory.Id);
                    leEngineHttpService.doDelete(requestUrl,{},{headers:{'Content-Type':'application/json'}}).then(function (data, status, headers, config) {
                        if (data.data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.data.Message);
                        }else{
                            $location.path('/main-repertory-list-all');
                        }
                    });
                }, function () {
                });
            };

        }
    ]);
});
