
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('repertoryCreateModalCtrl', ['Config','$window','$q','$scope','$modalInstance','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function (Config,$window,$q,$scope, $modalInstance,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };
            var contentType = {headers:{'Content-Type':'application/json'}};
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.repertoryCreateDesc = LanguageService.common.services.NAME_LE_ENGINE

            $scope.createRepertory = function(){
                var formData = {
                    "Name": $scope.repertoryName,
                    "Description": $scope.repertoryDescribe
                };
                leEngineHttpService.doPost(leEngineConfig.urls.repertory_create, formData,contentType).success(function (data, status, headers, config) {
                    // $scope.isCalculatingPrice = false;
                    if (data.data.Code === 200) {
                        $modalInstance.close();
                        WidgetService.notifySuccess(LanguageService.repertoryListPage.repertoryCreateSuccessTip);
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });

            };
        }]);

});