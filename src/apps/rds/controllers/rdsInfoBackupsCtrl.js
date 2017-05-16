/**
 * Created by dongwanlong on 2016/4/29.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('rdsInfoBackupsCtrl', ['$location','$modal','$interval','WidgetService','rdsConfig','gRdsStatus','$filter','$scope','HttpService', 'LanguageService',
        function ($location, $modal,$interval, WidgetService, rdsConfig, gRdsStatus, $filter, $scope, HttpService,LanguageService) {

        var buildBackupFile = function () {
            HttpService.doPost(rdsConfig.urls.rdsinfo_backup_file_export, {dbId: gRdsStatus.rdsInfo.rdsId})
                .success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        WidgetService.notifyInfo(LanguageService.RdsInfoBackupsPage.notifyExportBackupFileSuccess.replace('{time}', data.data.time).replace('{count}', data.data.num));
                    } else {
                        WidgetService.notifyError(data.msgs[0]);
                    }
                });
        }, isBackupFinished = function (backup) {
            return backup.status!=='BUILDING';
        };
        $scope.tabShow = "backupsList";
        $scope.backupList = [];
        $scope.isListLoading = false;
        $scope.backupSetInfo = {};
        $scope.currentPage=1;
        $scope.totalItems=0;
        $scope.pageSize=10;
        $scope.currentLang = getCurLang();

        function getCurLang(){
            var url = $location.absUrl();
            var start = url.indexOf("?")+1;
            var end = url.indexOf("#");
            url = url.slice(start,end);
            var ar = url.split("=");
            return ar[1];
        }

        var nowStr = $filter('date')(new Date(), 'yyyy-MM-dd');
        $scope.datetimeStart = "";
        $scope.datetimeEnd = "";
        $scope.findBackups = function(){
            if($scope.datetimeStart>$scope.datetimeEnd){
                WidgetService.notifyError(LanguageService.RdsInfoBackupsPage.tip);
                return;
            }
            refreshBackupsList();
        };

        $scope.isAllBackupChecked = function () {
            var unCheckedBackups = $scope.backupList.filter(function (backup) {
                return backup.checked === false || backup.checked === undefined;
            });
            return unCheckedBackups.length == 0;
        };
        $scope.checkAllBackup = function () {
            if ($scope.isAllBackupChecked()) {
                $scope.backupList.forEach(function (backup) {
                    backup.checked = false;
                });
            }
            else {
                $scope.backupList.forEach(function (backup) {
                    backup.checked = true;
                });
            }

        };
        $scope.checkBackup= function (backup) {
            backup.checked = backup.checked === true ? false : true;
        };

        $scope.pageChange = function(){
            refreshBackupsList();
        };

        $scope.exportBackup = function (size) {
            HttpService.doGet(rdsConfig.urls.rdsinfo_backup_file_info.replace('{dbId}', gRdsStatus.rdsInfo.rdsId))
                .then(function (data, status, headers, config) {
                    if (data.result === 1 && data.data === null) {//have not export in this day
                        buildBackupFile();
                    } else if(data.result === 1 && data.data.status ==='DUMPING'){
                        WidgetService.notifyInfo(LanguageService.RdsInfoBackupsPage.notifyExportBackupFileDoing);
                    } else if(data.result === 1 && data.data.status ==='SUCCESS'){
                            var modalInstance = $modal.open({
                                animation: $scope.animationsEnabled,
                                templateUrl: '/apps/rds/templates/rdsinfo-export-backup.html',
                                controller: 'RdsInfoExportBackupCtrl',
                                size: size,
                                backdrop: 'static',
                                keyboard: false,
                                resolve: {
                                    exportData : function () {
                                        return data.data;
                                    }
                                }
                            });

                            modalInstance.result.then(function (resultData) {
                                if (resultData && resultData.result === 1) {
                                    buildBackupFile();
                                }
                            }, function () {
                            });
                    }
                });
        };

        $scope.openBackupDoModal = function (size){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'BackupDoModalTpl',
                controller: 'RdsInfoDoBackupCtrl',
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
                    refreshBackupsList();
                }
            }, function () {
            });
        };

        var refreshBackupsList = function () {
            var queryParams = {
                dbId:gRdsStatus.rdsInfo.rdsId,
                startTime:$scope.datetimeStart,
                endTime:$scope.datetimeEnd,
                currentPage: $scope.currentPage,
                recordsPerPage: $scope.pageSize
            };
            $scope.isListLoading = true;
            HttpService.doGet(rdsConfig.urls.rdsinfo_backup_list, queryParams).then(function (data, status, headers, config) {
                $scope.isListLoading=false;
                $scope.backupList = data.data.data;
                $scope.totalItems = data.data.totalRecords;
                $scope.backupList.filter(function (backup) {
                    return !isBackupFinished(backup);
                }).forEach(function (backup) {
                    var detailUrl = rdsConfig.urls.rdsinfo_backup_detail;
                    var buildStatusInterval = $interval(function () {
                        HttpService.doGet(detailUrl, {id: backup.id, mclusterId: gRdsStatus.rdsInfo.mclusterId}).then(function (data) {
                            if (isBackupFinished(data.data)) {
                                backup.status = data.data.status;
                                $interval.cancel(buildStatusInterval);
                                refreshBackupsList();
                            }
                        });
                    }, 2000);
                });
            });
        };

        var refreshBackupsSetInfo = function () {
            HttpService.doGet(rdsConfig.urls.rdsinfo_baseinfo.replace('{dbId}',gRdsStatus.rdsInfo.rdsId), {}).then(function (data, status, headers, config) {

                var queryParams = {
                    mclusterId:data.data.mclusterId
                };
                HttpService.doGet(rdsConfig.urls.rdsinfo_backup_seting, queryParams).then(function (data, status, headers, config) {
                    if(data.result==1){
                        $scope.backupSetInfo = data.data;
                    }
                });

            });

        };
        refreshBackupsSetInfo();
        refreshBackupsList();

    }]);

    controllerModule.controller('RdsInfoDoBackupCtrl', ['$scope', '$modalInstance','WidgetService','CommonLanguageService','LanguageService', 'HttpService', 'rdsConfig', 'rdsInfo', function ($scope, $modalInstance,WidgetService,CommonLanguageService,LanguageService, HttpService, rdsConfig, rdsInfo) {

        $scope.backupType = 'increment';

        $scope.doBackup = function () {
            var url = $scope.backupType === 'increment' ? rdsConfig.urls.rdsinfo_backup_incr : rdsConfig.urls.rdsinfo_backup_full;
            HttpService.doPost(url, {mclusterId: rdsInfo.mclusterId})
                .success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        WidgetService.notifyInfo(LanguageService.RdsInfoBackupsPage.notifyDoBackupSuccess);
                        $modalInstance.close({
                            result:1
                        });
                    }
                    else{
                        WidgetService.notifyError(CommonLanguageService.error.requestError.replace('{errorMsg}',data.msgs[0]));
                    }
                });
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
});