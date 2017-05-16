/**
 * Created by dongwanlong on 2016/11/14.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('ciHistorysListCtrl', ['initData','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus','Utility',
        function (initData,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus,Utility) {

            $scope.ciTagHistoryList = [];
            $scope.buildImagePermissions = initData['Build CI'];
            $scope.viewImageTagBuildHistoryPermissions = initData['Browse CI Tag BuildHistory List'];

            $scope.openCiTagCreateModal = function(size){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/mirror-tag-create.html',
                    controller:  'mirrorTagCreateCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                    }
                });
                modalInstance.result.then(function (resultData) {
                    var url = leEngineConfig.urls.ci_historys_create.replace('{ciid}', gEngineStatus.mirror.mirrorId).replace('{tag}',resultData.tag).replace('{buildtoken}',resultData.buildtoken).replace('{nocache}',resultData.nocache).replace('{mvncache}',resultData.mvncache);
                    leEngineHttpService.doPost(url).then(function (data, status, headers, config) {
                        if (data.data.data.Code === 200) {
                            // refreshCiHistoryList();
                            refreshCiHistoryList(true);
                        } else {
                            WidgetService.notifyWarning(data.data.data.Message);
                        }
                    });
                }, function () {
                });
            }

            function refreshCiHistoryList(forceRefresh) {
                if (!forceRefresh) {
                    var arrayDoing = $scope.ciTagHistoryList.filter(function (item) {
                        return item.BuildResult == 0;
                    });
                    if ($scope.ciTagHistoryList.length>0 && arrayDoing.length<=0) {
                        return;
                    }
                }
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.ci_historys_list.replace('{ciid}',gEngineStatus.mirror.mirrorId)).then(function (data, status, headers, config) {
                    $scope.isListLoading = false;
                    if(data.data.Code === 200){
                        if(data.data.Details){
                            $scope.ciTagHistoryList = data.data.Details;
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            var refresh = $interval(function(){
                refreshCiHistoryList();
            },10000);

            //打开日志
            $scope.openUniqueHistory = function(size,ciTagHistory) {
                var formData = {
                    "title":LanguageService.staticInformationPage.buildLog,
                    "UniqueIdentification":ciTagHistory.UniqueIdentification
                };
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/static-information.html',
                    controller:  'staticInformation',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return formData;
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                }, function () {
                });
            };

            $scope.autoCiTag = function(size){
                var formData = {
                    "title":LanguageService.staticInformationPage.historyDetail,
                    "ciid":gEngineStatus.mirror.mirrorId
                };
                var tipsFileName = 'mirror-auto-build-tips.html';
                var currentLang = gEngineStatus.getLang();
                if (currentLang=='en-us') {
                    tipsFileName = 'mirror-auto-build-tips-en-us.html'
                }
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/' + tipsFileName,
                    controller:  'staticInformation',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return formData;
                        }
                    }
                });
                modalInstance.result.then(function () {});
            };

            $scope.refreshList = function(){
                refreshCiHistoryList(true);
            }

            $scope.$on('$destroy', function() {
                if(refresh)$interval.cancel(refresh);
            });

            $scope.mouseHandle = function(type){
                if(type=="enter"){
                    $interval.cancel(refresh);
                }else{
                    refresh = $interval(refreshCiHistoryList,10000);
                }
            };

            // 获取ci detail 中 image path
            var mirrorPath = "";
            var getCiInfoImagePath = function(){
                return  leEngineHttpService.doGet(leEngineConfig.urls.ci_details.replace('{ciid}',gEngineStatus.mirror.mirrorId)).then(function (data, status, headers, config) {
                    // $scope.isListLoading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            mirrorPath = data.data.Details.Path;
                        }
                    } else {
                        // $scope.isListLoading = false;
                        // WidgetService.notifyWarning(data.data.Message);
                        console.log(data.data);
                    }
                    $scope.mirrorPath = mirrorPath;
                });
            }
            getCiInfoImagePath();

            refreshCiHistoryList();
        }
    ]);
});

