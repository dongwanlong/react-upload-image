/**
 * Created by dongwanlong on 2016/9/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('podCountSettingModalCtrl', ['$scope','Config','leEngineConfig','$modalInstance','transData','leEngineHttpService',
        function ($scope,Config,leEngineConfig,$modalInstance,transData,leEngineHttpService) {

            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.podCount = transData.PodCount;
            $scope.version = transData.Name;

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.changePodCount = function(){
                var url = leEngineConfig.urls.pod_count.replace("{versionid}",transData.Id).replace("{count}",$scope.podCount);
                $scope.isloading = true;
                leEngineHttpService.doPut(url).then(function (data, status, headers, config) {
                    $scope.isloading = false;
                    $modalInstance.close(data);
                });
            }
        }
    ]);
});