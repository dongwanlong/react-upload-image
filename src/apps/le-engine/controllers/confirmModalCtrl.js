/**
 * Created by chenxiaoxiao3 on 2016/7/26.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('ConfirmModalCtrl', ['$scope', '$modalInstance', 'transData',function ( $scope, $modalInstance, transData) {
        $scope.confirmMessage=transData.message;
        $scope.title=transData.title;

        $scope.msgBoxType = transData.msgBoxType;

        function alertBoxHandle(){
            if($scope.msgBoxType=='alert'){
                $modalInstance.close(true);
            }else{
                $modalInstance.dismiss('cancel');
            }
        }

        $scope.closeModal=function(){
            alertBoxHandle();
        };
        $scope.ok = function () {
            $modalInstance.close(true);
        };
        $scope.cancel = function () {
            alertBoxHandle();
        };
    }]);
});