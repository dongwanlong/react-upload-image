/**
 * Created by chenxiaoxiao3 on 2016/8/22.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('editCodeCtrl', ['$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function ($window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {
            $scope.editTitle = transData.title;
            var type = transData.type;
            $scope.aceOption= {
                mode: "dockerfile",
                showGutter: true,
                useWrapMode : true,
             
            };
            if(transData.content!="" &&transData.content){
                $scope.mirrorCompile =transData.content;
            }

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.editCode = function(){
                if(!$scope.edit_code_form.mirror_compile.$valid){
                    $(".compile").addClass("ng-touched");
                    return
                }
                $modalInstance.close({"data":$scope.mirrorCompile,"type":transData.type});
            }
        }]);
});