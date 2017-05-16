/**
 * Created by dongwanlong on 2016/7/28.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('mirrorSettingCtrl', ['$rootScope','$filter','Config','$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function ($rootScope,$filter,Config,$window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.handleType = transData.handleType;
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.mirrorCreateDesc = $rootScope.REGEX_MESSAGE.NAME_MIRROR_NAME;
            $scope.ownershipTypes = [
                new ModelService.SelectModel($filter('visibility')(0), 0),
                new ModelService.SelectModel($filter('visibility')(1), 1)
            ];
            var contentType = {headers:{'Content-Type':'application/json'}};

            if ($scope.handleType == "edit") {
                $scope.mirrorName = transData.data.Name;
                $scope.mirrorDescribe = transData.data.Description;
                $scope.selectedOwnershipType = transData.data.VisibilityLevel === 1
                    ? $scope.ownershipTypes[1] : $scope.ownershipTypes[0];
            } else {
                $scope.selectedOwnershipType = $scope.ownershipTypes[0];
            }

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            //获取输入数据
            $scope.settingMirror = function () {
                var formData = {
                    "Name": $scope.mirrorName,
                    "Description": $scope.mirrorDescribe,
                    'VisibilityLevel': $scope.selectedOwnershipType.value
                };

                if ($scope.handleType == "edit") {
                    var url = leEngineConfig.urls.mirror_edit.replace('{imageid}', transData.data.Id);
                    leEngineHttpService.doPut(url, formData, contentType).success(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            if (data.data.Details) {
                                WidgetService.notifySuccess(LanguageService.common.services.MODIFY_SUCCESS);
                                $modalInstance.close(formData);
                            }
                        } else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                } else {
                    var url = leEngineConfig.urls.mirror_create.replace('{imageGroupId}', gEngineStatus.repertory.groupId);
                    leEngineHttpService.doPost(url, formData, contentType).success(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            if (data.data.Details) {
                                $modalInstance.close(formData);
                                WidgetService.notifySuccess(LanguageService.mirrorCreateModalPage.mirrorCreateSuccessTip);
                            }
                        } else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }
            };

        }]);

});