/**
 * Created by dongwanlong on 2016/7/6.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('pageCtrl', ['$rootScope','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'Config', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService',
        function ($rootScope,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, Config, leEngineHttpService,WidgetService,CurrentContext,LanguageService) {
            $scope.name = "page";
        }
    ]);
});