/**
 * Created by chenxiaoxiao3 on 2016/7/15.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('mirrorTagCreateCtrl', ['$window','$q','$scope','$modalInstance','$interval','$modal','$timeout','$httpParamSerializerJQLike','Config', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function ($window,$q,$scope,$modalInstance,$interval,$modal,$timeout,$httpParamSerializerJQLike,Config, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {

            $scope.mirrorTagList = [new ModelService.SelectModel("true",true),new ModelService.SelectModel("false",false)];
            $scope.mirrorTagListNow = $scope.mirrorTagList[1];
            $scope.mirrorTagMvncache = [new ModelService.SelectModel("true",true),new ModelService.SelectModel("false",false)];
            $scope.mirrorTagMvncacheNow = $scope.mirrorTagMvncache[0];
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.mirrorTag = "";
            var buildtoken = "";

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            function getCiDetial(){
                var deferred = $q.defer();
                $scope.isloading = true;
                leEngineHttpService.doGet( leEngineConfig.urls.ci_details.replace('{ciid}', gEngineStatus.mirror.mirrorId)).then(function (data, status, headers, config) {
                    $scope.isloading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            buildtoken = data.data.Details.BuildToken;
                            deferred.resolve();
                        }else {
                            WidgetService.notifyWarning(data.data.Message);
                            deferred.reject();
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                        deferred.reject();
                    }
                });
            }

            $scope.submitTag = function(){
                var data = {
                    "ciid":gEngineStatus.mirror.mirrorId,
                    "tag":$scope.mirrorTag,
                    "buildtoken":buildtoken,
                    "nocache":$scope.mirrorTagListNow.value,
                    "mvncache": $scope.mirrorTagMvncacheNow.value,
                };
                $modalInstance.close(data);
            };

            getCiDetial();
        }
    ]);
});
