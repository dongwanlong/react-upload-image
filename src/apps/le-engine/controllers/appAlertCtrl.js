/**
 * Created by dongwanlong on 2016/11/29.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('appAlertCtrl', ['initData', '$location', '$q', '$scope', '$modal', 'leEngineConfig', 'leEngineHttpService', 'WidgetService', 'LanguageService', 'gEngineStatus', 'Utility', '$interval', 'CommonLanguageService',
        function (initData, $location, $q, $scope, $modal, leEngineConfig, leEngineHttpService, WidgetService, LanguageService, gEngineStatus, Utility, $interval, CommonLanguageService) {

            var contentType = { headers: { 'Content-Type': 'application/json' } };
            $scope.permissions = {};
            $scope.tabType = "alertRule";
            $scope.alertRuleItemListObj = {
                itemList: [],
                isListLoading: false,
                totalItems: 0,
                currentPage: 1,
                pageSize: 10,
                pageChange: function (e) {
                    refreshList();
                }
            };

            //操作权限
            $scope.createAppAlertPower = initData['Create App Alert'];
            $scope.editAppAlertPower = initData['Edit App Alert'];
            $scope.removeAppAlertPower = initData['Remove App Alert'];

            $scope.alertHistoryItemListObj = {
                itemList: [],
                isListLoading: false,
                totalItems: 0,
                currentPage: 1,
                pageSize: 10,
                pageChange: function (e) {
                    refreshList();
                }
            };

            $scope.datetimeOption = {
                startDate:format(new Date(new Date()-24*60*60*1000*30)),
                endDate:new Date(),
            }
            $scope.searchRuleName = '';
            $scope.datetimeStart = format(new Date(new Date()-24*60*60*1000*30));
            $scope.datetimeEnd = format(new Date());
            $scope.currentLang = gEngineStatus.getLang();
            $scope.searchAlertHistory = function () {
                getItemListObj().currentPage = 1;
                refreshList();
            };

            $scope.switchTab = function (type) {
                $scope.tabType = type;
                $scope.datetimeStart = format(new Date(new Date()-24*60*60*1000*30));
                $scope.datetimeEnd = format(new Date());
                $scope.searchRuleName = '';
                getItemListObj().currentPage = 1;
                refreshList();
            };

            $scope.openAlertSettingModal = function (alertData) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/apps/le-engine/template/alert-setting-modal.html',
                    controller: 'AlertSettingCtrl',
                    size: 'large',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return null;
                        }
                    }
                });

                modalInstance.result.then(function (data) {
                    leEngineHttpService.doPost(leEngineConfig.urls.app_alert_create.replace('{appid}', gEngineStatus.app.appId), data, contentType)
                        .then(function (data, status, headers, config) {
                            if (data.data.data.Code != 200) {
                                WidgetService.notifyWarning(data.data.data.Message);
                            } else {
                                WidgetService.notifySuccess(CommonLanguageService.langPrimary.create + CommonLanguageService.langPrimary.success);
                            }
                            refreshList();
                        });
                }, function () {
                });
            }

            $scope.enable = function (alertRule) {
                alertRule.Enable = true;
                setAlertRule(alertRule).then(function (data) {
                    if (data.data.data.Code != 200) {
                        WidgetService.notifyWarning(data.data.data.Message);
                    } else {
                        WidgetService.notifySuccess(CommonLanguageService.langPrimary.enable + CommonLanguageService.langPrimary.success);
                    }
                    refreshList();
                });
            };

            $scope.disable = function (alertRule) {
                alertRule.Enable = false;
                setAlertRule(alertRule).then(function (data) {
                    if (data.data.data.Code != 200) {
                        WidgetService.notifyWarning(data.data.data.Message);
                    } else {
                        WidgetService.notifySuccess(CommonLanguageService.langPrimary.disable + CommonLanguageService.langPrimary.success);
                    }
                    refreshList();
                });
            };

            //删除App
            $scope.deleteRule = function (size, item) {
                var checkedRules = getCheckedRule();
                if (checkedRules.length !== 1 && !item) {
                    WidgetService.notifyWarning(LanguageService.langAlertListPage.selectTip);
                    return;
                }

                var deleteItem = checkedRules[0];
                if (item) deleteItem = item;

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
                                message: LanguageService.langAlertListPage.ruleDeleteTip + deleteItem.Name + "?",
                                title: LanguageService.langAlertListPage.deleteAlert
                            }
                        }

                    }
                });

                modalInstance.result.then(function () {
                    leEngineHttpService.doDelete(leEngineConfig.urls.app_alert_delete.replace('{appid}', gEngineStatus.app.appId).replace('{alertid}', deleteItem.Id),
                        contentType
                    ).then(function (data) {
                        if (data.data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.data.Message);
                        } else {
                            WidgetService.notifySuccess(CommonLanguageService.langPrimary.delete + CommonLanguageService.langPrimary.success);
                        }
                        refreshList();
                    });
                }, function () {
                });
            }

            $scope.edit = function (alertRule) {
                alertRule = angular.copy(alertRule);
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/apps/le-engine/template/alert-setting-modal.html',
                    controller: 'AlertSettingCtrl',
                    size: 'large',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return alertRule;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    data.Id = alertRule.Id;
                    setAlertRule(data).then(function (data) {
                        if (data.data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.data.Message);
                        } else {
                            WidgetService.notifySuccess(CommonLanguageService.langPrimary.edit + CommonLanguageService.langPrimary.success);
                        }
                        refreshList();
                    });
                }, function () {
                });
            };

            $scope.isErrorMetricSelected = function (item) {
                return item.AlertType === 'event' || item.AlertType === 'container_restart';
            };

            $scope.openAlertHistroyDetailModal = function (alertHistroy) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: '/apps/le-engine/template/alert-history-modal.html',
                    controller: 'alertHistroyModalCtrl',
                    size: 'medium',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return alertHistroy;
                        }
                    }
                });
            };

            function format(date) {
                var day = date.getDate();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                day = day<10?'0'+day:day;
                month = month<10?'0'+month:month;
                return year+'-'+month+'-'+day;
            }

            function refreshList() {
                var url, ItemListObj = getItemListObj();
                if ($scope.tabType === 'alertRule') {
                    url = buildAlertRuleListUrl();
                } else if ($scope.tabType === 'alertHistory') {
                    url = buildAlertHistoryListUrl();
                }
                ItemListObj.isListLoading = true;
                ItemListObj.itemList = [];
                leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                    ItemListObj.isListLoading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details && data.data.Details.Data) {
                            if ($scope.tabType === 'alertRule') {
                                data.data.Details.Data.forEach(function (item) {
                                    item.NoticeParams = JSON.parse(item.NoticeParams);
                                });
                            }
                            ItemListObj.itemList = data.data.Details.Data;
                            ItemListObj.totalItems = data.data.Details.Total;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function buildAlertRuleListUrl() {
                if(!$scope.searchRuleName){
                    return leEngineConfig.urls.app_alert_rules.replace('{appid}', gEngineStatus.app.appId).replace("{pageindex}", $scope.alertRuleItemListObj.currentPage).replace("{pagecap}", $scope.alertRuleItemListObj.pageSize);
                }else{
                    return leEngineConfig.urls.app_alert_search_rules.replace('{appid}', gEngineStatus.app.appId)
                    .replace("{pageindex}", $scope.alertRuleItemListObj.currentPage)
                    .replace("{pagecap}", $scope.alertRuleItemListObj.pageSize)
                    .replace("{name}", $scope.searchRuleName);
                }
            }

            function buildAlertHistoryListUrl() {
                return alertHistoryUrl = leEngineConfig.urls.app_alert_history.replace('{appid}', gEngineStatus.app.appId).replace("{pageindex}", $scope.alertHistoryItemListObj.currentPage).replace("{pagecap}", $scope.alertHistoryItemListObj.pageSize)
                    .replace("{starttime}", getTime($scope.datetimeStart, '')).replace("{endtime}", getTime($scope.datetimeEnd, ' 23:59:59'))
                    .replace("{name}", $scope.searchRuleName);
                function getTime(time, postfixTime) {
                    return time ? parseInt(new Date((time + postfixTime).replace('-', '/')).getTime() / 1000) : 0;
                }
            }
            
            function getItemListObj() {
                return $scope[$scope.tabType + 'ItemListObj'];
            }

            function setAlertRule(alertRule) {
                return leEngineHttpService.doPut(leEngineConfig.urls.app_alert_update.replace('{appid}', gEngineStatus.app.appId).replace('{alertid}', alertRule.Id),
                    alertRule,
                    contentType
                );
            }

            gEngineStatus.getPermissions('app')
                .then(function (data) {
                    $scope.permissions = data;
                });

            $scope.checkRule = function (rule) {
                $scope.alertRuleItemListObj.itemList.forEach(function (item) {
                    if (item.Id == rule.Id) {
                        item.checked = !item.checked;
                    } else {
                        item.checked = false;
                    }
                });
            }

            function getCheckedRule() {
                return $scope.alertRuleItemListObj.itemList.filter(function (item) {
                    return item.checked === true;
                });
            }

            refreshList();

        }]);
});