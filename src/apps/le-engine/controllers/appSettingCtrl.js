/**
 * Created by chenxiaoxiao3 on 2016/8/8.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('appSettingCtrl', ['Config','$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$rootScope','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (Config,$window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$rootScope,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {

            $scope.handleType = transData.handleType;
            $scope.appLinkMirrorList = [new ModelService.SelectModel(LanguageService.appSettingModalPage.notSet,0)];
            $scope.appLinkMirrorNow = $scope.appLinkMirrorList[0];
            getMirrorList();
            $scope.appCreateDesc = $rootScope.REGEX_MESSAGE.NAME_APP_NAMESPACE;
            $scope.initEmptyValue = '';
            $scope.lbClusterList = [new ModelService.SelectModel(LanguageService.appSettingModalPage.notSet,0)];
            $scope.lbClusterNow = $scope.lbClusterList[0];
            $scope.companyList = [];
            $scope.selectedCompany = null;
            getLoadBalanceClusterList();
            initCompanySelector();

            $scope.lbHttpsTypeList = [new ModelService.SelectModel(LanguageService.appSettingModalPage.disableHttps,0),new ModelService.SelectModel(LanguageService.appSettingModalPage.enableHttps,1)];
            $scope.lbHttpsTypeNow = $scope.lbHttpsTypeList[0];

            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.isHideDomain = false;

            var contentType = {headers:{'Content-Type':'application/json'}};

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            if( $scope.handleType=="edit"){
                console.log(transData);

                $scope.appName = transData.Name;
                $scope.appDescribe = transData.Description;
                if(transData.DomainName){
                    $scope.DomainName = transData.DomainName;
                    $scope.isHideDomain = true;
                }

                if(transData.Https == 0){
                    $scope.lbHttpsTypeNow = $scope.lbHttpsTypeList[0];
                }else{
                    $scope.lbHttpsTypeNow = $scope.lbHttpsTypeList[1];
                }

                if(transData.Port){$scope.Port = transData.Port;}

                url = leEngineConfig.urls.app_edit.replace('{appid}',transData.Id);
            }
            function getLoadBalanceClusterList(){
                leEngineHttpService.doGet(leEngineConfig.urls.slb_group_list).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            var len = data.data.Details.length;
                            var index = 0;
                            for(var i=0;i < len;i++){
                                if(data.data.Details[i].Id==transData.GroupId)index = i;
                                $scope.lbClusterList.push(new ModelService.SelectModel(data.data.Details[i].Name,data.data.Details[i].Id));
                            }

                            if($scope.handleType=="edit") {
                                $scope.lbClusterNow = $scope.lbClusterList[index+1];
                            }else{
                                $scope.lbClusterNow = $scope.lbClusterList[0];
                            }
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }
            function getMirrorList(){
                leEngineHttpService.doGet(leEngineConfig.urls.mirror_list.replace('{imageGroupId}',-1).replace('{type}','owner').replace('{pageindex}',0).replace('{pagecap}',1)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading=false;
                        if(data.data.Details) {
                            var len = data.data.Details.Data.length;
                            var index = 0;
                            if($scope.handleType=="edit"){
                                for(var i=0;i < len;i++){
                                    if(data.data.Details.Data[i].Id==transData.ImageId){
                                        $scope.appLinkMirrorList.push(new ModelService.SelectModel(data.data.Details.Data[i].Path,data.data.Details.Data[i].Id));
                                    }
                                    index = 1;
                                }
                            }else{
                                for(var i=0;i < len;i++){
                                    if(data.data.Details.Data[i].Id==transData.ImageId)index = i;
                                    $scope.appLinkMirrorList.push(new ModelService.SelectModel(data.data.Details.Data[i].Path,data.data.Details.Data[i].Id));
                                }
                            }
                            $scope.appLinkMirrorNow = $scope.appLinkMirrorList[index];
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function initCompanySelector() {
                if ($scope.handleType == "edit") {
                    $scope.companyList.push(new ModelService.SelectModel(transData.Company, 1));
                } else {
                    $scope.companyList.push(new ModelService.SelectModel(LanguageService.appSettingModalPage.notSet, ''));
                    leEngineHttpService.doGet(leEngineConfig.urls.company_list).then(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            if (data.data.Details) {
                                data.data.Details.forEach(function (item) {
                                    $scope.companyList.push(new ModelService.SelectModel(item.Name, item.Id));
                                });
                            }
                        } else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }
                $scope.selectedCompany = $scope.companyList[0];
            }
            $scope.createApp = function(){
                if(!$scope.app_create_form.$valid){
                    $(".appDescribe").addClass("ng-touched");
                    $(".appName").addClass("ng-touched");
                    return;
                }

                var formDataHttps = 0;
                var formDataPort = 0;
                var formDataGroupId = 0;
                var formDataGroupName = "";
                if ($scope.DomainName && $scope.lbClusterList.length) {
                    formDataHttps = parseInt($scope.lbHttpsTypeNow.value);
                    formDataPort = parseInt($scope.Port);
                    formDataGroupId = parseInt($scope.lbClusterNow.value);
                    formDataGroupName = $scope.lbClusterNow.text;
                }
                var formData = {
                    "Name": $scope.appName,
                    "Description": $scope.appDescribe,
                    "ImageId": parseInt($scope.appLinkMirrorNow.value),
                    "DomainName": $scope.DomainName,
                    "Https": formDataHttps,
                    "Port": formDataPort,
                    "GroupId": formDataGroupId,
                    "GroupName": formDataGroupName,
                };
                if($scope.handleType=="edit"){
                    leEngineHttpService.doPut(url,formData,contentType).success(function (data, status, headers, config) {
                        if(data.data.Code === 200){
                            if(data.data.Details){
                                WidgetService.notifySuccess(LanguageService.common.services.MODIFY_SUCCESS);
                                $modalInstance.close(formData);
                            }
                        }else{
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }else{
                    formData.CompanyId = $scope.selectedCompany.value;
                    leEngineHttpService.doPost(leEngineConfig.urls.app_create,formData,contentType).success(function (data, status, headers, config) {
                        if(data.data.Code === 200){
                            if(data.data.Details){
                                $modalInstance.close();
                                WidgetService.notifySuccess(LanguageService.appSettingModalPage.appCreateSuccessTip);
                            }
                        }else{
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }
            };

            $scope.updateDomain = function(){
                if(!$scope.showDomainSet){
                    $scope.DomainName = "";
                }
            }

        }]);

});
