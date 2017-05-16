/**
 * Created by dongwanlong on 2016/9/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('helpCtrl', ['$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function ($window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {

            $scope.imageGropList = [];
            $scope.imageList = [];
            $scope.appList = [];
            $scope.ciList = [];
            $scope.imageGroupsLoading = true;
            $scope.imagesLoading = true;
            $scope.appsLoading = true;
            $scope.cisLoading = true;

            function refreshHelpInfo(){

                leEngineHttpService.doGet( leEngineConfig.urls.help_info.replace('{type}', leEngineConfig.sourceTypes.SourceTypeImageGroups)).then(function (data, status, headers, config) {
                    $scope.imageGroupsLoading = false;
                    if(data.data.Code===200){
                        $scope.imageGropList = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });

                leEngineHttpService.doGet( leEngineConfig.urls.help_info.replace('{type}', leEngineConfig.sourceTypes.SourceTypeImages)).then(function (data, status, headers, config) {
                    $scope.imagesLoading = false;
                    if(data.data.Code===200){
                        $scope.imageList = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });

                leEngineHttpService.doGet( leEngineConfig.urls.help_info.replace('{type}', leEngineConfig.sourceTypes.SourceTypeApps)).then(function (data, status, headers, config) {
                    $scope.appsLoading = false;
                    if(data.data.Code===200){
                        $scope.appList = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });

                leEngineHttpService.doGet( leEngineConfig.urls.help_info.replace('{type}', leEngineConfig.sourceTypes.SourceTypeCis)).then(function (data, status, headers, config) {
                    $scope.cisLoading = false;
                    if(data.data.Code===200){
                        $scope.ciList = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            refreshHelpInfo();
        }
    ]);
});