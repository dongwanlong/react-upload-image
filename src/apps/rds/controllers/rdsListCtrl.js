/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('RdsListCtrl', ['gRdsStatus','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'rdsConfig', 'HttpService','WidgetService','CurrentContext','LanguageService',
        function (gRdsStatus,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, rdsConfig, HttpService,WidgetService,CurrentContext,LanguageService) {
            $scope.rdsList = [];
            $scope.searchName = "";

            $scope.regionId = CurrentContext.regionId;

            $scope.currentPage=1;
            $scope.totalItems=0;
            $scope.pageSize=10;

            $scope.listenList = [];
            $scope.listenTimer = null;
            $scope.timeOutCount = 0;

            $scope.pageChange = function(){
                refreshRdsList();
            };

            $scope.isAllRdsChecked = function () {
                var unCheckedRdss = $scope.rdsList.filter(function (rds) {
                    return rds.checked === false || rds.checked === undefined;
                });
                return unCheckedRdss.length == 0;
            };
            $scope.checkAllRds = function () {
                if ($scope.isAllRdsChecked()) {
                    $scope.rdsList.forEach(function (rds) {
                        rds.checked = false;
                    });
                }
                else {
                    $scope.rdsList.forEach(function (rds) {
                        rds.checked = true;
                    });
                }

            };
            $scope.checkRds= function (rds) {
                rds.checked = rds.checked === true ? false : true;
            };
            $scope.doSearch = function () {
                refreshRdsList();
            };

            $scope.openRdsCreateModal = function (size) {

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/rds/templates/rds-create-modal.html',
                    controller: 'RdsCreateModalCtrl',
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
                    if (resultData.result === 1) {
                        WidgetService.notifyInfo(LanguageService.rdsListPage.orderCreateSuccess);
                    }
                    else {
                        WidgetService.notifyError(resultData.msgs[0] || LanguageService.rdsListPage.orderCreateFail);
                    }
                    refreshRdsList(true);
                }, function () {
                });
            };

            var checkAllRdsListenEnd = function(){
                var isEnd = true;
                angular.forEach($scope.listenList, function(data){
                    if($scope.rdsList[data].progress_status>=1 && $scope.rdsList[data].progress_status<10){
                        isEnd = false;
                        return true;
                    }
                });
                return isEnd;
            }

            var refreshRdsCreateStatus = function() {
                if($scope.listenTimer)$interval.cancel($scope.listenTimer);
                $scope.listenList = [];
                angular.forEach($scope.rdsList, function(data, index){
                    if(data.status==2){
                        $scope.listenList.push(index);
                    }
                });

                if($scope.listenList.length>0) {

                    $scope.listenTimer = $interval(function () {

                        angular.forEach($scope.listenList, function (value) {
                            HttpService.doGet(rdsConfig.urls.rds_bulid.replace('{dbId}', $scope.rdsList[value].id), {}).then(function (data, status, headers, config) {
                                if ($scope.listenTimer != null) {//如果定时器关闭则不处理后续rds子状态请求回调函数
                                    $scope.rdsList[value].progress_status = data.data;

                                    //检查子状态是否全部更新完毕
                                    if (checkAllRdsListenEnd() == true) {
                                        $interval.cancel($scope.listenTimer);
                                        $scope.listenTimer = null;
                                        $scope.listenList = null;

                                        refreshRdsList(false);
                                    }
                                }
                            });
                        });
                    }, 2000);
                }
            }

            var refreshRdsList = function (isRefreshSubStatus) {
                    var queryParams = {
                        areaId: CurrentContext.regionId,
                        dbName: $scope.searchName,
                        currentPage: $scope.currentPage,
                        recordsPerPage: $scope.pageSize
                    };
                    $scope.isListLoading = true;
                    HttpService.doGet(rdsConfig.urls.rds_list, queryParams).then(function (data, status, headers, config) {
                        $scope.isListLoading=false;
                        $scope.rdsList = data.data.data;
                        $scope.totalItems = data.data.totalRecords;

                        if(isRefreshSubStatus){
                            refreshRdsCreateStatus();
                        }
                    });
            };
            //console.log(gRdsStatus);
            refreshRdsList(true);
        }
    ]);
});