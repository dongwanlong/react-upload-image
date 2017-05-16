/**
 * Created by dongwanlong on 2016/11/10.
 */
/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('ciListCtrl', ['initData','$window','$q','$scope','$location','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus','Utility',
        function (initData,$window,$q,$scope,$location,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus,Utility) {

            $scope.pageSize = 10;
            $scope.ciType = "owner";

            $scope.ciListOwer = [];
            $scope.totalItemsOwer = 0;
            $scope.currentPageOwer = 1;
            $scope.searchNameOwer = "";

            $scope.ciListJoin = [];
            $scope.totalItemsJoin = 0;
            $scope.currentPageJoin = 1;
            $scope.searchNameJoin = "";

            $scope.ciListAll = [];
            $scope.totalItemsAll = 0;
            $scope.currentPageAll = 1;
            $scope.searchNameAll = "";


            //分页
            $scope.pageChange = function(){
                refreshCiList('owner');
                refreshCiList('join');
                refreshCiList('all');
            };

            $scope.doSearch = function (e) {
                if (e) {
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        refreshCiList($scope.ciType);
                    }
                } else {
                    refreshCiList($scope.ciType);
                }
            };

            $scope.pageChange = function(){
                refreshCiList($scope.ciType);
            };

            function getOwnerRepertoryList(){
                return leEngineHttpService.doGet(leEngineConfig.urls.repertory_list.replace("{type}","owner").replace("{pageindex}",0).replace("{pagecap}",0)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        if(data.data.Details && data.data.Details.Data) {
                            return true;
                        }
                        return false;
                    }
                    return false;
                });
            }

            $scope.settingCi = function(type, size) {

                // no repository, go to create one first
                getOwnerRepertoryList().then(function(resp){

                    if (!resp) {
                        getTipsModal();
                    } else {
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
                                        handleType:type
                                    };
                                }
                            }
                        });
                        modalInstance.result.then(function () {
                            refreshCiList('owner');
                            refreshCiList('join');
                            refreshCiList('all');
                        }, function () {
                        });
                    }
                });

            };

            $scope.encoded = function(id){
                return Utility.encodeUrl(id+"");
            };

            function getTipsModal(){
                var confirmMessage = LanguageService.ciListPage.ciTipsCreateOrgMsg;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/confirm-modal.html',
                    controller: 'ConfirmModalCtrl',
                    size: 'small',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                "title":"",
                                "message":confirmMessage
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    $location.path('/main-repertory-list');
                }, function () {
                });

            }

            //加载数据
            var refreshCiList = function (type) {
                $scope.isListLoading = true;
                if(type == "all"){
                    var currentPage = $scope.currentPageAll;
                    var searchName = $scope.searchNameAll;
                }else if(type == "owner"){
                    var currentPage = $scope.currentPageOwer;
                    var searchName = $scope.searchNameOwer;
                }else{
                    var currentPage = $scope.currentPageJoin;
                    var searchName = $scope.searchNameJoin;
                }
                if (searchName) {
                    var requestUrl = leEngineConfig.urls.ci_search.replace("{type}",type).replace("{pageindex}",currentPage).replace("{pagecap}",$scope.pageSize).replace('{key}',searchName);
                }else{
                    var requestUrl = leEngineConfig.urls.ci_list.replace("{type}",type).replace("{pageindex}",currentPage).replace("{pagecap}",$scope.pageSize);
                }
                leEngineHttpService.doGet(requestUrl).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            if(type=='owner'){
                                $scope.ciListOwer = data.data.Details.Data;
                                $scope.totalItemsOwer = data.data.Details.Total;
                            }else if(type=='join'){
                                $scope.ciListJoin = data.data.Details.Data;
                                $scope.totalItemsJoin = data.data.Details.Total;
                            }else if(type=='all'){
                                $scope.ciListAll = data.data.Details.Data;
                                $scope.totalItemsAll = data.data.Details.Total;
                            }else{}
                        }
                    }else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });

            };

            refreshCiList('owner');
            refreshCiList('join');
            refreshCiList('all');

        }
    ]);
});

