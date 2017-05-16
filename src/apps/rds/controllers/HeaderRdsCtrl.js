/**
 * Created by dongwanlong on 2016/6/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('HeaderRdsCtrl', ['CurrentContext','Config','$routeParams','LanguageService','gRdsStatus','$scope', '$location','$window','HttpService','WidgetService','rdsConfig',
        function (CurrentContext, Config, $routeParams, LanguageService, gRdsStatus, $scope, $location, $window, HttpService, WidgetService,rdsConfig) {
            //µÿ”Ú
            $scope.regionList = [];
            $scope.regionName = "";
            $scope.regionId = CurrentContext.regionId;

            //”Ô—‘
            $scope.langList = ['zh-cn','en-us'];
            $scope.currentLang = getLang();

            $scope.changeLanguage = function(lang){
                window.location.href = "/rds/?lang="+lang+"#"+$location.path();
            };

            $scope.changeArea = function(id){
                CurrentContext.regionId = id;
                $scope.regionId = id;
                $scope.regionName = getAreaName($scope.regionId);
            };

            function getLang(){
                var url = $location.absUrl();
                var start = url.indexOf("?")+1;
                var end = url.indexOf("#");
                var arrayUrl = url.slice(start,end).split("=");
                return arrayUrl[1];
            }

            HttpService.doGet(Config.urls.area_list, {}).then(function (data, status, headers, config) {
                if(data.result==1){
                    $scope.regionList = data.data;
                    if(!$scope.regionId){
                        $scope.regionId = $scope.regionList[0].id;
                    }
                    $scope.regionName = getAreaName($scope.regionId);
                }
            });
            
            function getAreaName(id){
                var array = $scope.regionList.filter(function(item){
                    return item.id==id;
                });
                if(array.length===1)return array[0].name;
                return "";
            }
        }
    ]);

});
