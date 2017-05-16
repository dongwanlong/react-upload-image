/**
 * Created by dongwanlong on 2016/4/29.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoSqlAuditCtrl', ['$location','$modal','WidgetService','rdsConfig','gRdsStatus','$filter','$scope','HttpService', 'LanguageService',function ($location, $modal, WidgetService, rdsConfig, gRdsStatus, $filter, $scope, HttpService,LanguageService) {

        var refreshSqlAuditList = function () {
            var queryParams = {
                dbId: gRdsStatus.rdsInfo.rdsId,
                currentPage: $scope.currentPage,
                recordsPerPage: $scope.pageSize
            };
            $scope.isListLoading = true;
            HttpService.doGet(rdsConfig.urls.rdsinfo_sql_audit_list.replace('{type}',$scope.tabShow), queryParams).then(function (data, status, headers, config) {
                $scope.isListLoading=false;
                $scope.sqlAuditList = data.data.data;
                $scope.totalItems = data.data.totalRecords;
            });
        };

        $scope.tabShow = 'DML';
        $scope.switchTabToDML = function(){
            $scope.tabShow = 'DML';
            $scope.currentPage = 1;
            refreshSqlAuditList();
        };
        $scope.switchTabToDDL = function(){
            $scope.tabShow = 'DDL';
            $scope.currentPage = 1;
            refreshSqlAuditList();
        };

        $scope.sqlAuditList = [];
        $scope.isListLoading = false;
        $scope.currentPage=1;
        $scope.totalItems=0;
        $scope.pageSize=10;

        $scope.pageChange = function(){
            refreshSqlAuditList();
        };

        $scope.openSqlAuditModal = function (size){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'RdsInfoSqlAuditModalTpl',
                controller: 'RdsInfoSqlAuditModalCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    rdsInfo: function () {
                        return gRdsStatus.rdsInfo;
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                    refreshSqlAuditList();
                }
            }, function () {
            });
        };

        $scope.openSqlAuditDetailModal = function (sqlAuditInfo,size){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'RdsInfoSqlAuditDetailModalTpl',
                controller: 'RdsInfoSqlAuditDetailModalCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    sqlAuditInfo: function () {
                        return sqlAuditInfo;
                    }
                }
            });
        };

        refreshSqlAuditList();

    }]);

    controllerModule.controller('RdsInfoSqlAuditModalCtrl', ['$scope', '$modalInstance','WidgetService','CommonLanguageService','LanguageService', 'HttpService', 'rdsConfig', 'rdsInfo', function ($scope, $modalInstance,WidgetService,CommonLanguageService,LanguageService, HttpService, rdsConfig, rdsInfo) {

        var cacheId = null;

        $scope.sqlType = 'DML';
        $scope.title = '';
        $scope.sql = '';
        $scope.isSqlValid = false;
        $scope.isExecuteFail = false;
        $scope.sqlMetas = [];
        $scope.errorMsgExecuteSql = '';
        $scope.errorMsgAnalyseSql = '';

        $scope.analyseSql = function () {
            if(!$scope.title){
                $scope.errorMsgAnalyseSql = LanguageService.langRdsInfoSqlAuditPage.errorMsgTitleInvalid;
                return;
            }
            HttpService.doPost(rdsConfig.urls.rdsinfo_sql_analyse.replace('{type}',$scope.sqlType), {title:$scope.title,dbId: rdsInfo.rdsId,sql:$scope.sql})
                .success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        $scope.isSqlValid = true;
                        cacheId = data.data.cacheId;
                        $scope.sqlMetas = data.data.sqlMetas;
                    }
                    else{
                        $scope.errorMsgAnalyseSql = CommonLanguageService.error.requestError.replace('{errorMsg}', data.msgs[0]);
                    }
                });
        };

        $scope.executeSql = function () {
            //统一以title作为sql验证的唯一标识
            HttpService.doPost(rdsConfig.urls.rdsinfo_sql_execute.replace('{type}',$scope.sqlType), {dbId: rdsInfo.rdsId, cacheId: cacheId, title: $scope.title})
                .success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        WidgetService.notifyInfo(LanguageService.langRdsInfoSqlAuditPage.notifySqlExecuteSuccess);
                        $modalInstance.close({
                            result:1
                        });
                    }
                    else{
                        $scope.isExecuteFail = true;
                        $scope.errorMsgExecuteSql = CommonLanguageService.error.requestError.replace('{errorMsg}', data.msgs[0]);
                    }
                });
        };

        $scope.sendToDBA = function () {
            HttpService.doPost(rdsConfig.urls.rdsinfo_sql_to_DBA.replace('{type}',$scope.sqlType), {dbId: rdsInfo.rdsId, cacheId: cacheId, title: $scope.title})
                .success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        WidgetService.notifyInfo(LanguageService.langRdsInfoSqlAuditPage.notifySqlSendToDBASuccess);
                        $modalInstance.close({
                            result:1
                        });
                    }
                    else{
                        WidgetService.notifyError(CommonLanguageService.error.requestError.replace('{errorMsg}', data.msgs[0]));
                    }
                });
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);

    controllerModule.controller('RdsInfoSqlAuditDetailModalCtrl', ['$scope', '$modalInstance', 'HttpService', 'WidgetService', 'rdsConfig', 'LanguageService', 'CommonLanguageService', 'sqlAuditInfo',
        function ($scope, $modalInstance, HttpService, WidgetService,rdsConfig, LanguageService, CommonLanguageService, sqlAuditInfo) {

            var getSqlAuditDetailInfo = function () {
                HttpService.doGet(rdsConfig.urls.rdsinfo_sql_audit_detail.replace('{type}', sqlAuditInfo.dbSqlType).replace('{sqlId}', sqlAuditInfo.sqlId), {dbId: sqlAuditInfo.dbId}).then(function (data, status, headers, config) {
                    $scope.sqlAuditDetailInfo = data.data;
                    $scope.sqlType = $scope.sqlAuditDetailInfo.dbSqlType;
                });
            };

            $scope.sendToDBA = function () {
                HttpService.doPost(rdsConfig.urls.rdsinfo_sql_to_DBA.replace('{type}', $scope.sqlType), {
                    dbId: $scope.sqlAuditDetailInfo.dbId,
                    cacheId: $scope.sqlAuditDetailInfo.sqlAnalysisResult.cacheId,
                    title: $scope.sqlAuditDetailInfo.title
                }).success(function (data, status, headers, config) {
                        if (data.result === 1) {
                            WidgetService.notifyInfo(LanguageService.langRdsInfoSqlAuditPage.notifySqlSendToDBASuccess);
                            getSqlAuditDetailInfo();
                        }
                        else {
                            WidgetService.notifyError(CommonLanguageService.error.requestError.replace('{errorMsg}', data.msgs[0]));
                        }
                    });
            };

            $scope.sqlAuditDetailInfo = null;
            $scope.sqlType = '';

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            getSqlAuditDetailInfo();
        }]);
});