/**
 * Created by jiangfei on 2015/7/21.
 */
define([
  'angular',
  'angular-animate',
  'angular-route',
  'ui-bootstrap',
  'ng-toaster',
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
  app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.get['X-Requested-With'] ='XMLHttpRequest';
    //disable IE ajax request caching  http://stackoverflow.com/questions/16098430/angular-ie-caching-issue-for-http
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    $httpProvider.defaults.transformRequest = function(data){
      if (data === undefined) {
        return data;
      }
      return $.param(data);
    };
  }]);
  app.run(['$route', '$rootScope', '$location', 'routes', function ($route, $rootScope, $location, routes) {

  }]);

  return app;
});
