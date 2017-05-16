/**
 * Created by dongwanlong on 2016/10/25.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('userSettingModalCtrl', ['transData','$scope','LanguageService','$modalInstance','Config','leEngineConfig','leEngineHttpService','WidgetService','$cookieStore','$q',
        function (transData,$scope,LanguageService,$modalInstance,Config,leEngineConfig,leEngineHttpService,WidgetService,$cookieStore,$q) {

            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.init = transData.init;

            var contentType = {headers:{'Content-Type':'application/json'}};
            var username = "";

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            function getUserName(){
                return leEngineHttpService.doGet("/user", {}).then(function (data, status, headers, config) {
                    if (data.result == 1) {
                        return data.data.Details.Name;
                    } else{
                       return "";
                    }
                });
            }

            getUserName().then(function(name){
                username = name;
                leEngineHttpService.doGet(leEngineConfig.urls.user_info.replace('{username}',username), {}).then(function (data, status, headers, config) {
                    if (data.data.Code == 200) {
                        $scope.userName = data.data.Details.Name;
                        $scope.userEmail = data.data.Details.Email;
                        $scope.userAccesssToken = data.data.Details.AccessToken;
                        $scope.userCanCreateApps = data.data.Details.CanCreateApps;
                        $scope.userCanCreateImageGroups = data.data.Details.CanCreateImageGroups;
                        $scope.userPhone = data.data.Details.Telephone;
                        $scope.userWeixin = data.data.Details.Weixin;
                        $scope.userQQ = data.data.Details.Qq;

                    } else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            });
            //ÐÞ¸Äuser
            $scope.settingUser = function(){

                var formData = {
                    "Telephone": $scope.userPhone,
                    "Weixin": $scope.userWeixin,
                    "Qq": $scope.userQQ
                };

                $scope.isFormSubmiting = true;
                leEngineHttpService.doPut(leEngineConfig.urls.user_info.replace('{username}',username), formData,contentType).then(function (data, status, headers, config) {
                    $scope.isFormSubmiting = false;
                    $modalInstance.close(data);
                });
            }

        }
    ]);
});