/**
 * Created by dongwanlong on 2016/8/3.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('esListCtrl', ['esConfig','$interval','$scope','HttpService','CurrentContext','$modal','WidgetService','LanguageService',
        function (esConfig,$interval,$scope,HttpService,CurrentContext,$modal,WidgetService,LanguageService) {

            $scope.searchName = "";
            $scope.currentPage=1;
            $scope.totalItems=0;
            $scope.pageSize=10;
            $scope.esList = [];
            $scope.esTimerList = [];

            clearTimerList();

            $scope.pageChange = function(){
                refreshEsList();
            }
            $scope.isAllEsChecked = function () {
                var unCheckedEs = $scope.esList.filter(function (es) {
                    return es.checked === false || es.checked === undefined;
                });
                return unCheckedEs.length == 0;
            };
            $scope.checkAllEs = function () {
                if ($scope.isAllEsChecked()) {
                    $scope.esList.forEach(function (es) {
                        es.checked = false;
                    });
                }
                else {
                    $scope.esList.forEach(function (es) {
                        es.checked = true;
                    });
                }

            };
            $scope.checkEs= function (es) {
                es.checked = es.checked === true ? false : true;
            };
            $scope.doSearch = function () {
                refreshEsList();
            };

            var getCheckedUser = function(){
                return $scope.esList.filter(function(item){
                    return item.checked===true;
                });
            };

            $scope.openEsCreateModal = function (size) {
                var modalInstance = $modal.open({
                    animation: false,
                    templateUrl: '/apps/elasticsearch/template/es-create-modal.html',
                    controller: 'esCreateModalCtrl',
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
                        WidgetService.notifyInfo(LanguageService.esListPage.orderCreateSuccess);
                    }
                    else {
                        WidgetService.notifyError(resultData.msgs[0] || LanguageService.esListPage.orderCreateFail);
                    }
                    refreshEsList();
                }, function () {
                });
            };

            function refreshEsList() {
                var queryParams = {
                    region: CurrentContext.regionId,
                    esName: $scope.searchName,
                    currentPage: $scope.currentPage,
                    recordsPerPage: $scope.pageSize
                };
                $scope.isListLoading = true;
                HttpService.doGet(esConfig.urls.es_list, queryParams).then(function (data, status, headers, config) {
                    $scope.isListLoading=false;
                    $scope.esList = data.data.data;
                    $scope.totalItems = data.data.totalRecords;

                    clearTimerList();

                    $scope.esList.filter(function(item){
                        if(item.status==='BUILDDING'){
                            var timer = $interval(function(){
                                HttpService.doGet(esConfig.urls.es_case_info.replace('{id}',item.id), {}).then(function (data, status, headers, config) {
                                    item.status = data.data.status;
                                    if(item.status!='BUILDDING'){
                                        $interval.cancel(timer);
                                        $scope.esTimerList = $scope.esTimerList.filter(function(item){
                                            return item!=timer;
                                        });
                                        if($scope.esTimerList.length<=0){
                                            refreshEsList();
                                        }
                                    }
                                });
                            }, 3000);
                            $scope.esTimerList.push(timer);
                        }
                        return true;
                    });
                });
            };

            function clearTimerList(){
                $scope.esTimerList.forEach(function(item){
                    if(item)$interval.cancel(item);
                });
                $scope.esTimerList = [];
            };

            $scope.$on('$destroy', function() {
                clearTimerList();
            })

            refreshEsList();
        }
    ]);

});