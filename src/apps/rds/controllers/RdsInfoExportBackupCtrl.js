/**
 * Created by dongwanlong on 2016/4/27.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoExportBackupCtrl', ['$scope','$modalInstance', 'exportData', function ( $scope, $modalInstance, exportData) {

        $scope.backupFileUrl = exportData.url;
        $scope.backupTime = exportData.startTime;
        $scope.rebuild = function(){
            $modalInstance.close({
                result:1
            });
        };

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        };

    }]);

});