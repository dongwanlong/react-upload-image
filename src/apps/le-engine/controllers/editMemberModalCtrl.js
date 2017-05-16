/**
 * Created by chenxiaoxiao3 on 2016/7/26.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('editMemberModalCtrl', ['$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function ($window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {
            $scope.memberAuthTypeList =[
                new ModelService.SelectModel(LanguageService.common.auth.Master,1),
                new ModelService.SelectModel(LanguageService.common.auth.Developer,2),
                new ModelService.SelectModel(LanguageService.common.auth.Reporter,3),
                new ModelService.SelectModel(LanguageService.common.auth.Guest,4),
            ];
            $scope.memberAuthTypeNow = $scope.memberAuthTypeList[transData.AccessLevel-1];
            $scope.closeModal = function (){
                $modalInstance.dismiss('cancel');
            }
            $scope.editMember = function(){
                $modalInstance.close($scope.memberAuthTypeNow.value);
            }

        }]);

});