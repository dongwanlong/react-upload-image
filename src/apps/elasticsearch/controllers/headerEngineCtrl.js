/**
 * Created by dongwanlong on 2016/6/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('HeaderRdsCtrl', ['$http','$routeParams','$rootScope','$scope', '$location','$window','HttpService','$rootScope','WidgetService','Config','gEsStatus',
        function ($http,$routeParams, $rootScope, $scope, $location, $window, HttpService, $rootScope, WidgetService,Config,gEsStatus) {

            $scope.curLang = getCurlLang();

            $scope.langList = ['zh-cn'];

            $scope.changeLanguage = function(lang){
                window.location.href = "/elasticsearch/?lang="+lang+"#"+$location.path();
            }

            function getCurlLang(){
                var url = $location.absUrl();
                var start = url.indexOf("?")+1;
                var end = url.indexOf("#");
                url = url.slice(start,end);
                var ar = url.split("=");
                return ar[1];
            }

        }
    ]);

});
