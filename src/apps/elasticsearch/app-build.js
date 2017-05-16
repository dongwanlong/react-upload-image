/**
 * Created by jiangfei on 2015/7/21.
 */
define([
  'angular',
  'language',
  'common-language',
  './controllers/controllers',
  './filters/filters',
  './services/services',
  '../common/services/services',
  '../common/directives/directives',
  '../common/filters/filters'
], function (angular) {
  var app = angular.module('myApp', [
    //angular
    'ngAnimate',
    'ngRoute',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'toaster',
    //app
    'app.controller',
    'app.filter',
    'app.service',
    'common.service',
    'common.directive',
    'common.filter',
    'app.language',
    'common.language'
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
  app.run(['esConfig','CommonLanguageService','LanguageService','HttpService','gEsStatus','$route', '$rootScope', '$http', '$location', 'routes','Config', 'CurrentContext',function (esConfig, CommonLanguageService, LanguageService, HttpService,gEsStatus, $route, $rootScope, $http, $location, routes,Config,CurrentContext) {
    $rootScope.REGEX_MESSAGE = angular.extend({}, Config.REGEX_MESSAGE, esConfig.REGEX_MESSAGE);
    $rootScope.EMPTY_TEXT = Config.EMPTY_TEXT;

    for(var key in CommonLanguageService){
      $rootScope[key] =CommonLanguageService[key];
    }
    for(var key in LanguageService){
      $rootScope[key] =LanguageService[key];
    }

    $rootScope.$on('$routeChangeStart', function(evt, future, current ) {
      if(!future.$$route || !future.$$route.originalPath)return;
      var futureUrl = future.$$route.originalPath;
      if(futureUrl.indexOf("/es-list")!=-1
          ||futureUrl.indexOf("/es-dashboard")!=-1){
        gEsStatus.nowMenuItemType = "parent";
      }

      if(futureUrl.indexOf("/es-case-info")!=-1){
        gEsStatus.nowMenuItemType = "child";
        if(future.params.id){
          gEsStatus.esInfo.esId = future.params.id;
          HttpService.doGet(esConfig.urls.es_case_info.replace('{id}',gEsStatus.esInfo.esId), {}).then(function (data, status, headers, config) {
            gEsStatus.esInfo.esName = data.data.esName;
          });
        }
      }
    });

  }]);

  return app;
});
