/**
 * Created by dongwanlong on 2016/4/11.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('SideMenuCtrl', ['$routeParams','$rootScope','$scope', '$location', 'routes','$window','gEsStatus',
        function ($routeParams, $rootScope, $scope, $location, routes, $window,gEsStatus) {

            $scope.sideMenuItems = routes;
            $scope.linkGEsStatus = gEsStatus;

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
                return getPathWitdhOutParams(sideMenuItem.url) === getPathWitdhOutParams($location.path());
            };

            $scope.repaireUrl = function(url,type){
                if(type=="child") {
                    url = getPathWitdhOutParams(url);
                    if(gEsStatus.esInfo.esId){
                        url = url+"/"+gEsStatus.esInfo.esId;
                    }
                }
                return url;
            };

            var getPathWitdhOutParams = function(path){
                if(path.length<=2)return path;
                var endIndex = path.indexOf('/',1);
                if(endIndex==-1)return path;
                return path.substr(0,endIndex);
            }

        }
    ]);

});
