/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RedisCreateModalCtrl', ['RedisConfig','CommonLanguageService','Config', 'HttpService', 'RedisHttpService', 'WidgetService', 'RedisCurrentContext', 'ModelService', '$scope', '$modalInstance', '$timeout', '$window', '$sce', '$httpParamSerializerJQLike', '$modal',
        function (RedisConfig, CommonLanguageService, Config, HttpService, RedisHttpService, WidgetService, RedisCurrentContext, ModelService, $scope, $modalInstance, $timeout, $window, $sce, $httpParamSerializerJQLike, $modal) {

            var langPrimary = CommonLanguageService.langPrimary;
            var initAZSelector = function () {
                    RedisHttpService.doGet(RedisConfig.urls.redis_AZ_list.replace('{regionId}', RedisCurrentContext.currentRegion.id), {}).then(function (data, status, headers, config) {
                        $scope.AZList = data.data.map(function (item) {
                            return new ModelService.SelectModel(item.name, item.id);
                        });
                        if ($scope.AZList.length > 0) {
                            $scope.selectedAZ = $scope.AZList[0];
                        }
                    });
                },
                initRedisConfigSelector = function () {
                    RedisHttpService.doGet(RedisConfig.urls.redis_config_list, {}).then(function (data, status, headers, config) {
                        $scope.configFileList = data.data.map(function (item) {
                            return new ModelService.SelectModel(item.name, item.id);
                        });
                        if ($scope.configFileList.length > 0) {
                            $scope.selectedConfigFile = $scope.configFileList[0];
                        }
                    });
                };
            $scope.redisName = "";
            $scope.REGEX = angular.extend({}, Config.REGEX, RedisConfig.REGEX);
            $scope.AZList = [];
            $scope.configFileList = [];
            $scope.memorySize = 4;
            $scope.passwordModel = {
                passwordMode: 'now',
                newPassword: '',
                confirmPassword: ''
            };

            $scope.typeList = [
                new ModelService.SelectModel('RedisCluster', 'RedisCluster')
            ];
            $scope.selectedType = $scope.typeList[0];

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.createRedis = function(){

                var formData = {
                    name: $scope.redisName,
                    type: $scope.selectedType.value,
                    memorySize: $scope.memorySize,
                    configId: $scope.selectedConfigFile.value,
                    regionId: RedisCurrentContext.currentRegion.id,
                    azId: $scope.selectedAZ.value,
                    password: $scope.passwordModel.passwordMode === 'now' ? $scope.passwordModel.confirmPassword : ''
                };

                HttpService.doPost(RedisConfig.urls.redis_create, formData).success(function (data, status, headers, config) {
                    if (status === 200) {
                        WidgetService.notifyInfo(langPrimary.create + langPrimary.success);
                        $modalInstance.close(true);
                    } else{
                        WidgetService.notifyError(langPrimary.create + langPrimary.failure);
                    }
                });
            };

            initAZSelector();
            initRedisConfigSelector();

        }]);

});
