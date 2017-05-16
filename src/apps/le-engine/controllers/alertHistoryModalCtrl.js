/**
 * Created by dongwanlong on 2016/9/6.
 */
/**
 * Created by chenxiaoxiao3 on 2016/8/15.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('alertHistroyModalCtrl', ['$scope','transData','$modalInstance',
        function ($scope,transData,$modalInstance) {
            $scope.alertHistory = transData;

            $scope.closeModal = function () {
               $modalInstance.dismiss('cancel');
            };

        }]);
});