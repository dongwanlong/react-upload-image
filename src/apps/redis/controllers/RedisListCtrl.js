/**
 * Created by dongwanlong on 2016/8/3.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('RedisListCtrl', ['RedisConfig','$interval','$scope','RedisHttpService','HttpService','RedisCurrentContext','$modal','WidgetService','CommonLanguageService',
        function (RedisConfig,$interval,$scope,RedisHttpService,HttpService,RedisCurrentContext,$modal,WidgetService,CommonLanguageService) {

            var langPrimary = CommonLanguageService.langPrimary;
            var refreshList = function () {
                    var queryParams = {
                        regionId: RedisCurrentContext.currentRegion.id,
                        esName: $scope.searchName,
                        currentPage: $scope.currentPage,
                        recordsPerPage: $scope.pageSize
                    };
                    $scope.isListLoading = true;
                    RedisHttpService.doGet(RedisConfig.urls.redis_list, queryParams).then(function (data, status, headers, config) {
                        $scope.isListLoading = false;
                        $scope.itemList = data.data.data;
                        $scope.totalItems = data.data.totalRecords;
                        //
                        //clearTimerList();
                        //
                        //$scope.esList.filter(function (item) {
                        //    if (item.status === 'BUILDDING') {
                        //        var timer = $interval(function () {
                        //            HttpService.doGet(RedisConfig.urls.es_case_info.replace('{id}', item.id), {}).then(function (data, status, headers, config) {
                        //                item.status = data.data.status;
                        //                if (item.status != 'BUILDDING') {
                        //                    $interval.cancel(timer);
                        //                    $scope.esTimerList = $scope.esTimerList.filter(function (item) {
                        //                        return item != timer;
                        //                    });
                        //                    if ($scope.esTimerList.length <= 0) {
                        //                        refreshEsList();
                        //                    }
                        //                }
                        //            });
                        //        }, 3000);
                        //        $scope.esTimerList.push(timer);
                        //    }
                        //    return true;
                        //});
                    });
                },
                clearTimerList = function () {
                    $scope.esTimerList.forEach(function (item) {
                        if (item)$interval.cancel(item);
                    });
                    $scope.esTimerList = [];
                };

            $scope.currentContext = RedisCurrentContext;
            $scope.searchName = "";
            $scope.currentPage=1;
            $scope.totalItems=0;
            $scope.pageSize=10;
            $scope.itemList = [];
            $scope.esTimerList = [];

            $scope.pageChange = function(){
                refreshList();
            };
            $scope.isAllItemChecked = function () {
                var unCheckedItem = $scope.itemList.filter(function (item) {
                    return item.checked === false || item.checked === undefined;
                });
                return unCheckedItem.length == 0;
            };
            $scope.checkAllItem = function () {
                if ($scope.isAllItemChecked()) {
                    $scope.itemList.forEach(function (item) {
                        item.checked = false;
                    });
                }
                else {
                    $scope.itemList.forEach(function (item) {
                        item.checked = true;
                    });
                }

            };
            $scope.checkItem= function (item) {
                item.checked = item.checked === true ? false : true;
            };

            $scope.getCheckedItems = function(){
                    return $scope.itemList.filter(function(item){
                        return item.checked===true;
                    });
            };

            $scope.start = function () {
                var checkedItems = $scope.getCheckedItems();

                RedisHttpService.doGet(RedisConfig.urls.redis_start.replace('{redisId}', checkedItems[0].id)).success(function (data, status, headers, config) {
                    if (data.start) {
                        WidgetService.notifySuccess(langPrimary.start + langPrimary.success);
                        refreshList();
                    }
                    else {
                        WidgetService.notifyError(langPrimary.start + langPrimary.failure);
                    }
                });
            };

            $scope.stop = function () {
                var checkedItems = $scope.getCheckedItems();

                RedisHttpService.doGet(RedisConfig.urls.redis_stop.replace('{redisId}', checkedItems[0].id)).success(function (data, status, headers, config) {
                    if (data.offline) {
                        WidgetService.notifySuccess(langPrimary.stop + langPrimary.success);
                        refreshList();
                    }
                    else {
                        WidgetService.notifyError(langPrimary.stop + langPrimary.failure);
                    }
                });
            };

            $scope.delete = function () {
                var checkedItems = $scope.getCheckedItems();

                HttpService.doDelete(RedisConfig.urls.redis_delete.replace('{redisId}', checkedItems[0].id)).success(function (data, status, headers, config) {
                    if (status===200) {
                        WidgetService.notifySuccess(langPrimary.delete + langPrimary.success);
                        refreshList();
                    } else {
                        WidgetService.notifyError(langPrimary.delete + langPrimary.failure);
                    }
                });
            };

            $scope.doSearch = function () {
                refreshList();
            };

            $scope.openRedisCreateModal = function (size) {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: '/apps/redis/template/redis-create-modal.html',
                    controller: 'RedisCreateModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false
                });

                modalInstance.result.then(function (result) {
                    if (result) {
                        refreshList();
                    }
                });
            };

            $scope.$on('$destroy', function() {
                clearTimerList();
            });

            refreshList();

            clearTimerList();
        }
    ]);

});