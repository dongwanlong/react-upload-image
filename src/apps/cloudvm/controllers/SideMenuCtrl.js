/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('SideMenuCtrl', ['$scope', '$location', 'routes',
        function ($scope, $location, routes) {
            $scope.sideMenuItems = routes;
            $scope.isSideMenuActive = function (sideMenuItem) {
                return sideMenuItem.url === $location.path();
            };
        }
    ]);

});
