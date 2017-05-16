/**
 * Created by jiangfei on 2015/7/22.
 */
define(['app'],function (app) {
  'use strict';

  var routeConfigurator = function ($routeProvider, routes) {
      var setRoute = function (routeConfig) {
          $routeProvider.when(routeConfig.url, routeConfig.config);
      };
      angular.forEach(routes, function (value, key) {
        setRoute(value);
      });
      $routeProvider.otherwise({redirectTo: '/dashboard'});
    },
    getRoutes = function () {
      return [
        {
          url: '/dashboard',
          title: '概览',
          config: {
            templateUrl: '/apps/dashboard/views/dashboard.html'
          }
        }
      ];
    };

  app.constant('routes', getRoutes());

  app.config(['$routeProvider', 'routes', routeConfigurator]);

});
