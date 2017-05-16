
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('repertoryEditModalCtrl', ['$window','$q','$scope','$modalInstance','transData', '$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function ($window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce,  leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {

        $scope.editTitle = transData.Name;
        $scope.repertoryDescribe = transData.Description;
        var contentType = {headers:{'Content-Type':'application/json'}};
        $scope.closeModal = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.editRepertory = function(){
            var formData = {
                "Description": $scope.repertoryDescribe
            };
            leEngineHttpService.doPut(leEngineConfig.urls.repertory_single.replace('{imagegroupid}',transData.Id), formData,contentType).success(function (data, status, headers, config) {
                if (data.data.Code === 200) {
                    WidgetService.notifySuccess(LanguageService.common.services.MODIFY_SUCCESS);
                    $modalInstance.close();
                } else {
                    WidgetService.notifyWarning(data.data.Message);
                }
            });
        };


}]);

});
