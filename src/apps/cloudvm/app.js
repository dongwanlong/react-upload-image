/**
 * Created by jiangfei on 2015/7/21.
 */
define([
  'angular',
  'angular-animate',
  'angular-route',
  'angular-cookies',
  'ui-bootstrap',
  'ng-toaster',
  'ng-rzslider',
  './controllers/controllers',
  './directives/directives',
  '../common/services/services',
  '../common/directives/directives',
  '../common/filters/filters'
], function (angular) {
  var app = angular.module('myApp', [
    //angular
    'ngAnimate',
    'ngRoute',
    'ngCookies',
    'ui.bootstrap',
    'toaster',
    'rzModule',
    //app
    'app.controller',
    'app.directive',
    'common.service',
    'common.directive',
    'common.filter'
  ]);
  app.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.defaults.headers.post['Accept'] ='application/json, text/javascript, */*; q=0.01';
    $httpProvider.defaults.headers.post['Accept-Language'] ='zh-CN,zh;q=0.8,en;q=0.6';
    $httpProvider.defaults.headers.post['X-Requested-With'] ='XMLHttpRequest';
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
  app.run(['$route', '$rootScope', '$http', '$location', 'routes','Config', function ($route, $rootScope, $http, $location, routes,Config) {
    $rootScope.REGEX_MESSAGE = Config.REGEX_MESSAGE;
    $rootScope.EMPTY_TEXT = Config.EMPTY_TEXT;
  }]);

  return app;
});
