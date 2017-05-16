/**
 * Created by dongwanlong on 2016/4/11.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('SideMenuCtrl', ['leEngineHttpService','Utility','$routeParams','$scope', '$location', 'routes','$modal','$window','WidgetService','gEngineStatus','LanguageService','leEngineConfig',
        function (leEngineHttpService,Utility,$routeParams, $scope, $location, routes, $modal,$window,WidgetService,gEngineStatus,LanguageService,leEngineConfig) {

            $scope.sideMenuItems = routes;
            $scope.linkRepertoryStatus = gEngineStatus;

            Translate();

            function Translate(){
                for(langItem in $scope.sideMenuPage) {
                    for (routesItem in routes) {
                        if(routes[routesItem].title==langItem) {
                            routes[routesItem].title = $scope.sideMenuPage[langItem];
                        }
                        if(routes[routesItem].state){routes[routesItem].state=false;}
                        if(routes[routesItem].childLink){
                            for (childLinkItem in routes[routesItem].childLink) {
                                if(routes[routesItem].childLink[childLinkItem].title==langItem) {
                                    routes[routesItem].childLink[childLinkItem].title = $scope.sideMenuPage[langItem];
                                }
                            }
                        }

                    }
                }
                $scope.sideMenuItems = routes;
            }

            $scope.repaireUrl = function(obj){
                var resultObj = gEngineStatus.encodeRouter(obj.url,obj.title,obj.type);
                if(resultObj.title)obj.title = resultObj.title;
                return resultObj.url;
            };

            $scope.isSideMenuActive = function (sideMenuItem) {
                if(!sideMenuItem.url)return false;
                var arrayPath = $location.path().match(/[-a-z]*[^/]/);
                var arrayMenu = sideMenuItem.url.match(/[-a-z]*[^/]/);

                if (arrayMenu && arrayPath && arrayPath.length > 0 && arrayMenu.length > 0) {
                    return arrayPath[0] == arrayMenu[0];
                }
                return false;
            };

            $scope.isChildLink = function(sideMenuItem){
                if(sideMenuItem.childLink){
                    return true;
                }else{
                    return false;
                }
            };

        }
    ]);

});
