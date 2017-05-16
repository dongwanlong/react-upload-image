/**
 * Created by chenxiaoxiao3 on 2016/7/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('createMemberModalCtrl', ['$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService','CurrentContext','LanguageService',
        function ($window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,CurrentContext,LanguageService) {
            var data=[];
            var contentType = {headers:{'Content-Type':'application/json'}};
            for(var i = 0,len = transData.length;i<len;i++){
                data.push(new ModelService.SelectModel(transData[i].Name,transData[i].Id));
            }
            $scope.searchName = "";
            $scope.memberLinkTypeList = data;
            var memberLinkTypeTmpList = data;
            $scope.memberAuthTypeList = [
                new ModelService.SelectModel(LanguageService.common.auth.Guest,4),
                new ModelService.SelectModel(LanguageService.common.auth.Reporter,3),
                new ModelService.SelectModel(LanguageService.common.auth.Developer,2),
                new ModelService.SelectModel(LanguageService.common.auth.Master,1)
            ];
            $scope.memberAuthTypeNow = $scope.memberAuthTypeList[0];

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.doSearch = function(e){
                if (e) {
                    var keycode = window.event?e.keyCode:e.which;
                    if(keycode==13){
                        e.preventDefault();
                    }
                } else {
                    $scope.memberLinkTypeList = memberLinkTypeTmpList.filter(function(item){
                        return item.text.indexOf($scope.searchName)!=-1;
                    });
                }
            };

            $scope.deleteCheckUser = function(user){
                $scope.memberLinkTypeNow = $scope.memberLinkTypeNow.filter(function(item){
                    return item.value!=user.value;
                });
            }

            $scope.createMember = function(){

                var formData=[];
                for(var i = 0,len = $scope.memberLinkTypeNow.length;i<len;i++){
                    formData.push($scope.memberLinkTypeNow[i].value);
                }

                var data = {
                    "AccessLevel":$scope.memberAuthTypeNow.value,
                    "UserIds":formData
                };

                var requestUrl = '';
                if (transData.sourceType == leEngineConfig.sourceTypes.SourceTypeImageGroups) {
                    requestUrl = leEngineConfig.urls.imagegroup_member_add.replace('{imagegroupid}', transData.sourceId);
                } else if (transData.sourceType == leEngineConfig.sourceTypes.SourceTypeImages) {
                    requestUrl = leEngineConfig.urls.image_member_add.replace('{imageid}', transData.sourceId);
                } else if (transData.sourceType == leEngineConfig.sourceTypes.SourceTypeApps) {
                    requestUrl = leEngineConfig.urls.app_member_add.replace('{appid}', transData.sourceId);
                }else if(transData.sourceType == leEngineConfig.sourceTypes.SourceTypeCis){
                    requestUrl = leEngineConfig.urls.ci_member_add.replace('{ciid}', transData.sourceId);
                }else{}

                leEngineHttpService.doPost(requestUrl,data,contentType).success(function(data,status,headers,config){
                    if (data.data.Code != 200) {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                    $modalInstance.close({});
                });
            };


        }
    ]);

});