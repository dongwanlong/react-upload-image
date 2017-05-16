/**
 * Created by dongwanlong on 2016/4/6.
 */
define([
    'angular',
    'angular-animate',
    'angular-route',
    'angular-cookies',
    'angular-sanitize',
    'ui-bootstrap',
    'ng-toaster',
    'ng-rzslider',
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
        'rzModule',

        //app
        'app.controller',
        'app.filter',
        'app.service',
        'common.service',
        'common.directive',
        'common.filter',
        'common.language',
        'app.language'
    ]);
    app.config(['$httpProvider', function ($httpProvider) {

        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.headers.post['Accept'] ='application/json, text/javascript, */*; q=0.01';
        $httpProvider.defaults.headers.post['Accept-Language'] ='zh-CN,zh;q=0.8,en-us;q=0.5;en;q=0.3';
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
    app.run([ '$rootScope','$interval','$location','Config','RedisConfig','CommonLanguageService','LanguageService','RedisCurrentContext','RedisHttpService','RedisUtility',
        function ($rootScope,$interval,$location,Config, RedisConfig, CommonLanguageService, LanguageService,RedisCurrentContext, RedisHttpService,RedisUtility) {

        $rootScope.REGEX_MESSAGE = angular.extend({}, Config.REGEX_MESSAGE, RedisConfig.REGEX_MESSAGE);
        $rootScope.EMPTY_TEXT = Config.EMPTY_TEXT;

        for(var key in CommonLanguageService){
            $rootScope[key] =CommonLanguageService[key];
        }
        for(var key in LanguageService){
            $rootScope[key] =LanguageService[key];
        }

        RedisHttpService.doGet(RedisConfig.urls.redis_region_list, {}).then(function (data, status, headers, config) {
            RedisCurrentContext.regionList = data.data;
        });

        $rootScope.$on('$routeChangeStart', function (event, future, current) {
            if(!future.params.regionName){
                RedisUtility.regionNameChangeHandler(function(){
                    RedisCurrentContext.currentRegion = RedisCurrentContext.regionList[0];
                    $location.path('/:regionName/redis-list'.replace(':regionName',RedisCurrentContext.currentRegion.regionName));
                });
            }
            if (future.params.redisId) {
                RedisCurrentContext.redisId = future.params.redisId;
            }
        });
    }]);


    return app;
});
