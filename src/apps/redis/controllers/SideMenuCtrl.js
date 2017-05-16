/**
 * Created by dongwanlong on 2016/4/11.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('SideMenuCtrl', ['$routeParams','$scope', '$location', 'routes','$window','RedisCurrentContext',
        function ($routeParams, $scope, $location, routes, $window,RedisCurrentContext) {

            $scope.getSideMenuItems = function(){
                return routes.filter(function (route) {
                    var result = false,
                        isUrlIncludeRedisId = route.url.indexOf(':redisId') > -1;
                    if($routeParams['redisId']){
                        if(isUrlIncludeRedisId){
                            result = true;
                        }
                    }else{
                        if(!isUrlIncludeRedisId){
                            result = true;
                        }
                    }
                    return result;
                });
            };

            $scope.isSideMenuActive = function (sideMenuItem) {
                var result = $scope.getSideMenuItemPath(sideMenuItem) === $location.path();
                return result;
            };

            $scope.getSideMenuItemPath = function (sideMenuItem) {
                var result = sideMenuItem.url, routeParam;
                for (routeParam in  $routeParams) {
                    result = result.replace(':' + routeParam, $routeParams[routeParam]);
                }
                return result;
            };
        }
    ]);

});
