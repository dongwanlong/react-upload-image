/**
 * Created by dongwanlong on 2016/11/10.
 */
/**
 * Created by dongwanlong on 2016/7/28.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('ciSettingModalCtrl', ['$rootScope','Config','$window','$q','$scope','$location','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function ($rootScope,Config,$window,$q,$scope,$location,$modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.handleType = transData.handleType;
            $scope.isEdit = transData.handleType == 'edit';
            $scope.ciCreateDesc = $rootScope.REGEX_MESSAGE.TIP_GIT;
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.compileOptions = [new ModelService.SelectModel(LanguageService.ciSettingModalPage.noCompile, false), new ModelService.SelectModel(LanguageService.ciSettingModalPage.compile, true)];
            $scope.currentCompile = $scope.compileOptions[0];
            $scope.compileEnvOptions = [new ModelService.SelectModel(LanguageService.ciSettingModalPage.compileEnv, true), new ModelService.SelectModel(LanguageService.ciSettingModalPage.noCompileEnv, false)];
            $scope.currentCompileEnv = $scope.compileEnvOptions[0];
            $scope.repertoryList = [];
            $scope.currentRepertory = {};
            $scope.rootImageList = [];
            $scope.currentRootImage = {};
            $scope.rootImageTagList = [];
            $scope.currentRootImageTag = {};


            var contentType = {headers: {'Content-Type': 'application/json'}};

            if ($scope.isEdit) {
                var imageStrList = transData.data.CompileImage.split(':');
                var pathImage = imageStrList.length == 2 ? imageStrList[0] : '';
                var tagImage = imageStrList.length == 2 ? imageStrList[1] : '';
            }

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.setCreateName = function(){
                if($scope.ciMirror){
                    $scope.ciCreateName = $scope.currentRepertory.text + "/" + $scope.ciMirror;
                }
            };

            $scope.$watch('currentRootImage.value',function(newValue,oldValue){
                if(oldValue && $scope.currentRootImage.relatedOption && $scope.currentRootImage.relatedOption.Description){
                    $scope.ciCreateDesc=$scope.currentRootImage.relatedOption.Description;
                    getMirrorTag();
                }
            });

            $scope.settingCi = function(){
                if(!$scope.isEdit){
                    createCi();
                }else{
                    editCi();
                }
            }

            function createCi(){
                var formData = {
                    Name:$scope.ciCreateName,
                    Description:$scope.ciDescription,
                    ImageGroupId:$scope.currentRepertory.value,
                    ImageName:$scope.ciMirror,
                    Git:$scope.ciGit.trim(),
                    Branch:$scope.ciBranch.trim(),
                    DockerFilePath:$scope.ciDockerfilepath.trim(),
                    CompileEnable:$scope.currentCompile.value,
                    CompileFilePath:!$scope.ciCompilefilepath?"":$scope.ciCompilefilepath.trim(),
                    CompileImage:$scope.currentCompileEnv.value?($scope.currentRootImage.text+":"+$scope.currentRootImageTag.text):$scope.compileImage,
                    UseLeengineImage:$scope.currentCompileEnv.value
                };

                leEngineHttpService.doPost(leEngineConfig.urls.ci_create,formData,contentType).success(function (data, status, headers, config) {
                    if (data.data.Code === 200 && data.data.Details) {
                        WidgetService.notifySuccess(LanguageService.ciSettingModalPage.ciCreateSuccessTip);
                        $modalInstance.close();
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function editCi(){
                var formData = {
                    Description:$scope.ciDescription,
                    DockerFilePath:$scope.ciDockerfilepath.trim(),
                    CompileEnable:$scope.currentCompile.value,
                    CompileFilePath:$scope.ciCompilefilepath.trim(),
                    CompileImage:$scope.currentCompileEnv.value?($scope.currentRootImage.text+":"+$scope.currentRootImageTag.text):$scope.compileImage,
                    UseLeengineImage:$scope.currentCompileEnv.value
                };
                leEngineHttpService.doPut(leEngineConfig.urls.ci_edit.replace('{ciid}',gEngineStatus.mirror.mirrorId),formData,contentType).success(function (data, status, headers, config) {
                    if (data.data.Code === 200 && data.data.Details) {
                        WidgetService.notifySuccess(LanguageService.common.services.MODIFY_SUCCESS);
                        $modalInstance.close();
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function getOwnerRepertoryList(){
                return leEngineHttpService.doGet(leEngineConfig.urls.repertory_list.replace("{type}","owner").replace("{pageindex}",0).replace("{pagecap}",0)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        if(data.data.Details && data.data.Details.Data) {
                            data.data.Details.Data.forEach(function(item){
                                $scope.repertoryList.push(new ModelService.SelectModel(item.Name,item.Id));
                            });
                            if($scope.repertoryList.length>0){
                                $scope.currentRepertory = $scope.repertoryList[0];
                            }
                        }
                    }
                });
            }

            function getRootMirrorList(){
                return leEngineHttpService.doGet(leEngineConfig.urls.mirror_list.replace("{imageGroupId}",-1).replace("{type}","root").replace("{pageindex}",0).replace("{pagecap}",0)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        if(data.data.Details && data.data.Details.Data) {
                            data.data.Details.Data.forEach(function(item){
                                $scope.rootImageList.push(new ModelService.SelectModel(item.Path,item.Id,{Description:item.Description}));
                            });
                            var arrayRootImage = $scope.rootImageList.filter(function(item){
                                return item.text===pathImage;
                            });
                            if(arrayRootImage.length>0){
                                $scope.currentRootImage = arrayRootImage[0];
                            }else{
                                $scope.currentRootImage = $scope.rootImageList[0];
                            }
                        }
                    }
                });
            }

            function getMirrorTag(){
                return leEngineHttpService.doGet(leEngineConfig.urls.mirror_tag_list.replace("{imageid}",$scope.currentRootImage.value).replace("{list}","valid")).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        if(data.data.Details) {
                            $scope.rootImageTagList = [];
                            data.data.Details.forEach(function(item){
                                $scope.rootImageTagList.push(new ModelService.SelectModel(item.Name,item.Id));
                            });
                            $scope.currentRootImageTag = $scope.rootImageTagList.filter(function(item){
                                return item.text===tagImage;
                            })[0];
                            if(!$scope.currentRootImageTag){
                                $scope.currentRootImageTag = $scope.rootImageTagList[0];
                            }
                        }
                    }
                });
            }

            getRootMirrorList().then(getMirrorTag).then(getOwnerRepertoryList).then(function(){
                    if($scope.handleType=="edit"){

                        $scope.ciGit = transData.data.Git;
                        $scope.ciBranch = transData.data.Branch;
                        $scope.ciDescription = transData.data.Description;

                        $scope.ciMirror = transData.data.ImageName;
                        $scope.ciCreateName = transData.data.Name;
                        $scope.ciDockerfilepath = transData.data.DockerFilePath;
                        $scope.currentCompile = $scope.compileOptions.filter(function(item){
                            return item.value===transData.data.CompileEnable;
                        })[0];

                        $scope.compileImage = transData.data.CompileImage;
                        $scope.ciCompilefilepath = transData.data.CompileFilePath;

                        $scope.currentCompileEnv = $scope.compileEnvOptions.filter(function(item){
                            return item.value===transData.data.UseLeengineImage;
                        })[0];
                    }
            });

        }]);

});