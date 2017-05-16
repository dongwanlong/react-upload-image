/**
 * Created by dongwanlong on 2016/4/11.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('SideMenuCtrl', ['CurrentContext','$routeParams','gRdsStatus','$scope', '$location', 'routes','$window',
        function (CurrentContext, $routeParams, gRdsStatus, $scope, $location, routes, $window) {

            $scope.sideMenuItems = routes;
            $scope.linkGRdsStatus = gRdsStatus;

            Translate();

            function Translate(){
                for(langItem in $scope.sideMenuPage) {
                    for (routesItem in routes) {
                        if(routes[routesItem].title==langItem) {
                            routes[routesItem].title = $scope.sideMenuPage[langItem];
                        }
                    }
                }
                $scope.sideMenuItems = routes;
            }


            $scope.isSideMenuActive = function (sideMenuItem) {
                var arrayPath = $location.path().match(/rds[a-z-]*/);
                var arrayMenu = sideMenuItem.url.match(/rds[a-z-]*/);
                if (arrayMenu && arrayPath && arrayPath.length > 0 && arrayMenu.length > 0) {
                    return arrayPath[0] == arrayMenu[0];
                }
                return false;
            };

            $scope.repaireUrl = function(sideMenuItem){
                var url = sideMenuItem.url.match(/rds[a-z-]*/)[0];
                if(sideMenuItem.title=="return"){
                    url = "/"+CurrentContext.regionId+"/"+url;
                    return url;
                };
                if(sideMenuItem.type=="child") {
                    if(gRdsStatus.rdsInfo.rdsId && +CurrentContext.regionId){
                        url = "/"+CurrentContext.regionId+"/"+url+"/" + gRdsStatus.rdsInfo.rdsId;
                    }
                }else{
                    url = "/"+CurrentContext.regionId+"/"+url;
                }
                return url;
            };
        }
    ]);

});
