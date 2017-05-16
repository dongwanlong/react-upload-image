/**
 * Created by dongwanlong on 2016/4/18.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('rdsInfoUserMangerCtrl', ['CurrentContext','$modal','WidgetService', 'rdsConfig','$filter','gRdsStatus','HttpService','$scope', 'LanguageService',function (CurrentContext, $modal, WidgetService, rdsConfig, $filter, gRdsStatus, HttpService, $scope,LanguageService) {

        $scope.rdsUserList = [];

        $scope.pageChange = function(){
            refreshRdsUserList();
        };
        $scope.createUser = function(size){

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-option.html',
                controller: 'RdsInfoOptionCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return {
                            handleType:1,
                            userList:$scope.rdsUserList
                        };
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                    refreshRdsUserList();
                    WidgetService.notifyInfo(LanguageService.RdsinfoUsermangerPage.rdsCreateSuccessTip);
                }else{
                    WidgetService.notifyError(resultData.msgs[0] || LanguageService.RdsinfoUsermangerPage.rdsCreateFailedTip);
                }
            }, function () {
            });
        }
        $scope.isAllUserChecked = function () {
            var unCheckedUsers = $scope.rdsUserList.filter(function (user) {
                return user.checked === false || user.checked === undefined;
            });
            return unCheckedUsers.length == 0;
        };
        $scope.checkAllUser = function () {
            if ($scope.isAllUserChecked()) {
                $scope.rdsUserList.forEach(function (user) {
                    user.checked = false;
                });
            }
            else {
                $scope.rdsUserList.forEach(function (user) {
                    user.checked = true;
                });
            }

        };
        $scope.checkUser= function (user) {
            user.checked = user.checked === true ? false : true;
        };

        var getCheckedUser = function(){
            return $scope.rdsUserList.filter(function(item){
                return item.checked===true;
            });
        };

        $scope.ipUserVisit = function(size){
            var checkedUsers = getCheckedUser();
            if(checkedUsers.length !== 1){
                WidgetService.notifyWarning(LanguageService.RdsinfoUsermangerPage.selectTip);
                return;
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-ip.html',
                controller: 'RdsInfoIpModalCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return checkedUsers[0];
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                }
            }, function () {
            });
        }

        $scope.resetPassWord = function(size){
            var checkedUsers = getCheckedUser();
            if(checkedUsers.length !== 1){
                WidgetService.notifyWarning(LanguageService.RdsinfoUsermangerPage.selectTip);
                return;
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-resetpassword.html',
                controller: 'RdsInfoResetPassWordModalCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return checkedUsers[0];
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                }
            }, function () {
            });
        }

        $scope.modifyRemark = function(size){
            var checkedUsers = getCheckedUser();
            if(checkedUsers.length !== 1){
                WidgetService.notifyWarning(LanguageService.RdsinfoUsermangerPage.selectTip);
                return;
            }

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-remark.html',
                controller: 'RdsInfoRemarkCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return checkedUsers[0];
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                    refreshRdsUserList();
                    WidgetService.notifyInfo(LanguageService.RdsinfoUsermangerPage.markModifySuccessTip);
                }else{
                    WidgetService.notifyError(resultData.msgs[0] || LanguageService.RdsinfoUsermangerPage.markModifyFailedTip);
                }
            }, function () {
            });
        }

        $scope.modifyOption = function(size){
            var checkedUsers = getCheckedUser();
            if(checkedUsers.length !== 1){
                WidgetService.notifyWarning(LanguageService.RdsinfoUsermangerPage.selectTip);
                return;
            }
            checkedUsers[0].handleType = 0;
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-option.html',
                controller: 'RdsInfoOptionCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return checkedUsers[0];
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                    refreshRdsUserList();
                    WidgetService.notifyInfo(LanguageService.RdsinfoUsermangerPage.rdsModifySuccessTip);
                }else{
                    WidgetService.notifyError(resultData.msgs[0] || LanguageService.RdsinfoUsermangerPage.rdsModifyFailedTip);
                }
            }, function () {
            });
        }

        $scope.deleteUser = function(size){
            var checkedUsers = getCheckedUser();
            if(checkedUsers.length !== 1){
                WidgetService.notifyWarning(LanguageService.RdsinfoUsermangerPage.selectTip);
                return;
            }
            checkedUsers[0].handleType = 0;

            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-deleteuser.html',
                controller: 'RdsInfoDeleteUserCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return checkedUsers[0];
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData &&resultData.result===1){
                    HttpService.doDelete(rdsConfig.urls.rdsinfo_user_delete.replace('{dbId}',gRdsStatus.rdsInfo.rdsId).replace('{username}',checkedUsers[0].username) , {}).then(function (data, status, headers, config) {
                        if(data.data && data.data.result==1){
                            refreshRdsUserList();
                            WidgetService.notifySuccess(LanguageService.RdsinfoUsermangerPage.rdsDeleteSuccessTip);
                        }else{
                            WidgetService.notifyError(LanguageService.RdsinfoUsermangerPage.rdsDeleteFailedTip);
                        }
                    });
                }
            }, function () {
            });
        }

        var refreshRdsUserList = function(){
            $scope.isloading = true;
            HttpService.doGet(rdsConfig.urls.rdsinfo_user_list.replace('{dbId}',gRdsStatus.rdsInfo.rdsId),{}).then(function (data, status, headers, config) {
                $scope.isloading = false;
                $scope.rdsUserList = data.data;
            });
        }

        refreshRdsUserList();
    }]);

    controllerModule.controller('RdsInfoIpVisitModalCtrl', ['$scope', '$modal','transData',
        function($scope,$modal,transData){

        }]);

});
