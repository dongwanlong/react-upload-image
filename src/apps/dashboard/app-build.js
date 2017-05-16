/**
 * Created by jiangfei on 2015/7/21.
 */
define([
  'angular',
  './controllers/controllers',
  '../common/services/services',
  '../common/directives/directives',
  './directives/directives',
  '../common/filters/filters'
], function (angular) {
  var app = angular.module('myApp', [
    //angular
    'ngAnimate',
    'ngRoute',
    'ui.bootstrap',
    'toaster',
    //app
    'app.controller',
    'common.service',
    'common.directive',
    'app.directive',
    'common.filter'
  ]);

  app.run(['$route', '$rootScope', '$location', 'routes', function ($route, $rootScope, $location, routes) {

  }]);

  return app;
});
