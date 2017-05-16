/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {

  controllerModule.controller('VmKeypairCreateModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance', 'region',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance, region) {

    $scope.keypairName='';

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.createKeypair = function () {
      var createKeypairData = {
        region: region,
        name: $scope.keypairName
      };
      $scope.isFormSubmiting = true;
      HttpService.doGet(Config.urls.keypair_check, createKeypairData, {disableGetGlobalNotify: true}).then(function (data) {
        $modalInstance.close(createKeypairData);
      }, function (data) {
        if (data.result === 0) {
          WidgetService.notifyError(data.msgs[0] || '密钥名称验证失败');
          $scope.isFormSubmiting = false;
        }
      });

    };

  }]);

});
