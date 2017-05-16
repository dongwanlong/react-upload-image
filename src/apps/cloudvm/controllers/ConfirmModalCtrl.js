/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {

  controllerModule.controller('ConfirmModalCtrl', ['$scope', '$modalInstance', 'message','title',function ( $scope, $modalInstance, message,title) {
    $scope.confirmMessage=message;
    $scope.title=title;
    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $modalInstance.close(true);
    };
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  }]);
});
