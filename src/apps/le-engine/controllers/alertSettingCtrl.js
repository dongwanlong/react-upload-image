/**
 * Created by jiangfei on 2016/8/16.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('AlertSettingCtrl', ['$filter','WidgetService','$scope', '$modalInstance', 'ModelService','LanguageService','CommonLanguageService','Config','leEngineConfig','gEngineStatus','transData',
        function ($filter,WidgetService, $scope, $modalInstance, ModelService, LanguageService, CommonLanguageService,Config, leEngineConfig,gEngineStatus,transData) {
            
            var alertNotifyOption = {
                sms: [], voice: [], email: []
            };
            var appId = gEngineStatus.app.appId;
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.alertMetricOptions = [
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.cpuRate, 'cpu_rate',leEngineConfig.alertMetricOptions.percent),
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.memoryUsage, 'memory_usage',leEngineConfig.alertMetricOptions.memory),
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.rxRate, 'rx_rate',leEngineConfig.alertMetricOptions.traffic),
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.txRate, 'tx_rate',leEngineConfig.alertMetricOptions.traffic),
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.errorEvent, 'event',leEngineConfig.alertMetricOptions.times),
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.containerRestart, 'container_restart',leEngineConfig.alertMetricOptions.times),
            ];

            $scope.alertClassOptions = [
                new ModelService.SelectModel(LanguageService.langAlertSettingModalPage.app, 'app'),
            ];
            $scope.alertClass = $scope.alertClassOptions[0];

            $scope.alertPeriodOptions = [
                new ModelService.SelectModel('3' + CommonLanguageService.langDuration.minutes, 3),
                new ModelService.SelectModel('5' + CommonLanguageService.langDuration.minutes, 5),
                new ModelService.SelectModel('10' + CommonLanguageService.langDuration.minutes, 10),
                new ModelService.SelectModel('15' + CommonLanguageService.langDuration.minutes, 15),
                new ModelService.SelectModel('30' + CommonLanguageService.langDuration.minutes, 30),
                new ModelService.SelectModel('1' + CommonLanguageService.langDuration.hours, 60),
            ];

            $scope.alertMethodOptions = [
                new ModelService.SelectModel(CommonLanguageService.langPrimary.average, 'mean'),
            ];

            $scope.alertOperatorOptions = [
                new ModelService.SelectModel('>', '>'),
                new ModelService.SelectModel('<', '<'),
                new ModelService.SelectModel('>=', '>='),
                new ModelService.SelectModel('<=', '<='),
            ];

            $scope.alertNotifyIntervalOptions = [
                new ModelService.SelectModel($filter('capitalize')(CommonLanguageService.langPrimary.times), 0),
                new ModelService.SelectModel('10' + CommonLanguageService.langDuration.minutes, 10),
                new ModelService.SelectModel('30' + CommonLanguageService.langDuration.minutes, 30),
                new ModelService.SelectModel('1' + CommonLanguageService.langDuration.hours, 60),
                new ModelService.SelectModel('6' + CommonLanguageService.langDuration.hours, 360),
                new ModelService.SelectModel('12' + CommonLanguageService.langDuration.hours, 720),
                new ModelService.SelectModel('24' + CommonLanguageService.langDuration.hours, 1440),
            ];

            $scope.allRoles = leEngineConfig.allRoles;

            $scope.isNotifyRoleChecked = function (role, method) {
                return alertNotifyOption[method].indexOf(role) > -1;
            };

            $scope.checkNotifyRole = function (role, method) {
                var index = alertNotifyOption[method].indexOf(role);
                if (index > -1) {
                    alertNotifyOption[method].splice(index, 1);
                } else {
                    alertNotifyOption[method].push(role);
                }
            };

            $scope.isErrorMetricSelected = function(){
                return $scope.alertMetric.value==='event' || $scope.alertMetric.value==='container_restart';
            };

            init();

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.doSubmit = function () {
                if(alertNotifyOption.email.length<=0 && alertNotifyOption.sms.length<=0 && alertNotifyOption.voice.length<=0){
                    WidgetService.notifyWarning(LanguageService.langAlertField.alertNotifyRequiredTip);
                    return;
                }

                sortalertNotifyOption(alertNotifyOption);

                var formData = {
                        Name: $scope.name,
                        AlertType: $scope.alertMetric.value,
                        Period: $scope.alertPeriod.value,
                        Method: $scope.alertMethod.value,
                        Operator: $scope.alertOperator.value,
                        Threshold: adapt($scope.alertThreshold),
                        Interval: $scope.alertNotifyInterval.value,
                        Enable: $scope.enable,
                        NoticeParams: alertNotifyOption
                    };
                $modalInstance.close(formData);
            };
            
            $scope.limitNumber = function(num, option){
                var max = option.max;
                var min = option.min;
                var limit = option.limit;
                num = num>max?max:(num<min?min:num);
                if(limit===0){
                    num = parseInt(num);
                }else{
                    num = Math.floor(num*Math.pow(10,limit))/Math.pow(10,limit);
                }
                $scope.alertThreshold = num;
            }

            function sortalertNotifyOption(alertNotifyOption) {
                alertNotifyOption.email.sort(sortByNotify);
                alertNotifyOption.sms.sort(sortByNotify);
                alertNotifyOption.voice.sort(sortByNotify);
                function sortByNotify(a, b){
                    var ar = ['Owner', 'Master', 'Developer', 'Reporter', 'Guest'];
                    return ar.indexOf(a) > ar.indexOf(b);
                }
            }

            function adapt(alertThreshold, edit) {
                if($scope.alertMetric.relatedOption.rate){
                    var limit = $scope.alertMetric.relatedOption.limit;
                    var rate = $scope.alertMetric.relatedOption.rate;
                    if(edit){
                        alertThreshold = Math.floor((alertThreshold/rate)*Math.pow(10,limit))/Math.pow(10,limit);
                    }else{
                        alertThreshold = parseInt(alertThreshold*rate);
                    }
                }
                return alertThreshold;
            }

            function init() {
                if (transData) {
                    $scope.isEdit = true;
                    $scope.name = transData.Name;
                    $scope.enable = transData.Enable;
                    $scope.alertMetric = $scope.alertMetricOptions.filter(function (alertMetricOption) {
                        return transData.AlertType === alertMetricOption.value;
                    })[0];
                    //transData of error metric has no Threshold alertPeriod alertOperator alertMethod value
                    $scope.alertThreshold = $scope.isErrorMetricSelected() ? 1 : adapt(transData.Threshold, true);
                    $scope.alertPeriod = $scope.isErrorMetricSelected() ? $scope.alertPeriodOptions[0] :
                        $scope.alertPeriodOptions.filter(function (alertPeriodOption) {
                            return transData.Period === alertPeriodOption.value;
                        })[0];
                    $scope.alertMethod = $scope.isErrorMetricSelected() ? $scope.alertMethodOptions[0] :
                        $scope.alertMethodOptions.filter(function (alertMethodOption) {
                            return transData.Method === alertMethodOption.value;
                        })[0];
                    $scope.alertOperator = $scope.isErrorMetricSelected() ? $scope.alertOperatorOptions[0] :
                        $scope.alertOperatorOptions.filter(function (alertOperatorOption) {
                            return transData.Operator === alertOperatorOption.value;
                        })[0];
                    $scope.alertNotifyInterval = $scope.alertNotifyIntervalOptions.filter(function(alertNotifyIntervalOption){
                        return transData.Interval===alertNotifyIntervalOption.value;
                    })[0];
                    
                    alertNotifyOption.sms = transData.NoticeParams.sms || [];
                    alertNotifyOption.voice = transData.NoticeParams.voice || [];
                    alertNotifyOption.email = transData.NoticeParams.email || [];
                } else {
                    $scope.isEdit = false;
                    $scope.name = '';
                    $scope.enable = true;
                    $scope.alertMetric = $scope.alertMetricOptions[0];
                    $scope.alertPeriod= $scope.alertPeriodOptions[2];
                    $scope.alertMethod= $scope.alertMethodOptions[0];
                    $scope.alertOperator = $scope.alertOperatorOptions[0];
                    $scope.alertNotifyInterval = $scope.alertNotifyIntervalOptions[0];
                }
            }
        }]);
});