/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('repertoryListCtrl', ['Utility','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (Utility,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce,leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.pageSize=10;

            $scope.repertoryType = "owner";

            $scope.repertoryListOwer = [];
            $scope.totalItemsOwer = 0;
            $scope.currentPageOwer = 1;
            $scope.searchNameOwer = "";

            $scope.repertoryListJoin = [];
            $scope.totalItemsJoin = 0;
            $scope.currentPageJoin = 1;
            $scope.searchNameJoin = "";

            $scope.repertoryListAll = [];
            $scope.totalItemsAll = 0;
            $scope.currentPageAll = 1;
            $scope.searchNameAll = "";

            var contentType = {headers:{'Content-Type':'application/json'}};
            var repertoryList=[];

            $scope.openRepertoryCreateModal = function (size) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/repertory-create-modal.html',
                    controller: 'repertoryCreateModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        region: function () {
                            return CurrentContext.regionId;
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    refreshRepertoryList('owner');
                    refreshRepertoryList('join');
                    refreshRepertoryList('all');
                }, function () {
                });
            };
            $scope.doSearch = function (e) {
                if (e) {
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        refreshRepertoryList($scope.repertoryType);
                    }
                } else {
                    refreshRepertoryList($scope.repertoryType);
                }
            };

            $scope.pageChange = function(){
                refreshRepertoryList($scope.repertoryType);
            };

            var refreshRepertoryList = function (type) {
                $scope.isListLoading = true;
                if(type=='owner'){
                    var currentPage = $scope.currentPageOwer;
                    var searchName = $scope.searchNameOwer;
                }else if(type=='join'){
                    var currentPage = $scope.currentPageJoin;
                    var searchName = $scope.searchNameJoin;
                }else if(type=='all'){
                    var currentPage = $scope.currentPageAll;
                    var searchName = $scope.searchNameAll;
                }else{}

                var requestRepertoryUrl = leEngineConfig.urls.repertory_list.replace("{type}",type).replace("{pageindex}",currentPage).replace("{pagecap}",$scope.pageSize);
                if (searchName) {
                    requestRepertoryUrl = leEngineConfig.urls.repertory_search.replace("{type}",type).replace("{pageindex}",currentPage).replace("{pagecap}",$scope.pageSize).replace("{key}",searchName);
                }
                leEngineHttpService.doGet(requestRepertoryUrl).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            if(type=='owner'){
                                $scope.repertoryListOwer = data.data.Details.Data;
                                $scope.totalItemsOwer = data.data.Details.Total;
                            }else if(type=='join'){
                                $scope.repertoryListJoin = data.data.Details.Data;
                                $scope.totalItemsJoin = data.data.Details.Total;
                            }else if(type=='all'){
                                $scope.repertoryListAll = data.data.Details.Data;
                                $scope.totalItemsAll = data.data.Details.Total;
                            }else{}
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            $scope.encoded = function(id){
                return Utility.encodeUrl(id+"");
            };

            refreshRepertoryList('owner');
            refreshRepertoryList('join');
            refreshRepertoryList('all');

        }
    ]);
});
function Repertory(name,state,created){
    this.name=name;
    this.state=state;
    this.created=created;
}

