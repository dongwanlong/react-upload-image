/**
 * Created by dongwanlong on 2016/4/19.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoResetPassWordModalCtrl', ['Config','rdsConfig','WidgetService','gRdsStatus','$scope','$modalInstance','transData', 'HttpService', 'LanguageService',function (Config,rdsConfig, WidgetService,gRdsStatus, $scope, $modalInstance, transData, HttpService, LanguageService) {
        $scope.ipList = [];
        $scope.username = transData.username;
        $scope.newPassword='';
        $scope.confirmPassword='';
        $scope.REGEX = angular.extend({}, Config.REGEX, rdsConfig.REGEX);

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.changeRdsUserPassword = function(){
            var data={
                username:transData.username,
                dbId:gRdsStatus.rdsInfo.rdsId,
                password:$scope.confirmPassword
            };

            $scope.isFormSubmiting = true;
            HttpService.doPost(rdsConfig.urls.rdsinfo_user_security.replace('{username}',transData.username), data).success(function (data, status, headers, config) {
                $scope.isFormSubmiting = false;
                $modalInstance.close(data);
                $modalInstance.dismiss('cancel');

                if(data.result===1){
                    WidgetService.notifySuccess(LanguageService.RdsInfoResetPassWordModalPage.passwordModifyFailedTip);
                }
                else{
                    WidgetService.notifyError(data.msgs[0]||LanguageService.RdsInfoResetPassWordModalPage.passwordModifySuccessTip);
                }
            });
        }

    }]);

});
