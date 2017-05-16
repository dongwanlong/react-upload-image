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
        'ngSanitize',
        'ui.bootstrap',
        'toaster',
        'rzModule',
        //app
        'app.controller',
        'app.filter',
        'app.service',
        'app.directive',
        'common.service',
        'common.directive',
        'common.filter',
        'common.language',
        'app.language'
    ]);
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
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
    app.run(['rdsConfig','CommonLanguageService','LanguageService','HttpService','gRdsStatus','$route', '$rootScope', '$http', '$location', 'routes','Config', 'CurrentContext',function (rdsConfig,CommonLanguageService, LanguageService, HttpService, gRdsStatus, $route, $rootScope, $http, $location, routes,Config,CurrentContext) {
        $rootScope.REGEX_MESSAGE = angular.extend({}, Config.REGEX_MESSAGE, rdsConfig.REGEX_MESSAGE);
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

            if(future.params.regionId!=-1){
                CurrentContext.regionId = future.params.regionId;
            }else{
                if(!CurrentContext.regionId){
                    HttpService.doGet(Config.urls.area_list, {}).then(function (data, status, headers, config) {
                        if (data.result == 1) {
                            if (data.data.length > 0) {
                                CurrentContext.regionId = data.data[0].id;
                                $location.path("/" + data.data[0].id + "/rds-list");
                            }
                        }
                    });
                }else{
                    $location.path("/" + CurrentContext.regionId  + "/rds-list");
                }
            }

            if(futureUrl.indexOf("/rds-list")!=-1
                ||futureUrl.indexOf("/rds-dashboard")!=-1){
                    gRdsStatus.nowMenuItemType = "parent";
            }
            if(futureUrl.indexOf("/rdsinfo-base")!=-1
                ||futureUrl.indexOf("/rdsinfo-usermanger")!=-1
                ||futureUrl.indexOf("/rdsinfo-resmonitor")!=-1
                ||futureUrl.indexOf("/rdsinfo-save")!=-1
                ||futureUrl.indexOf("/rdsinfo-sql-audit")!=-1
                ){

                gRdsStatus.nowMenuItemType = "child";
                if(future.params.id){
                    gRdsStatus.rdsInfo.rdsId = future.params.id;
                    HttpService.doGet(rdsConfig.urls.rdsinfo_baseinfo.replace('{dbId}',gRdsStatus.rdsInfo.rdsId), {}).then(function (data, status, headers, config) {
                        gRdsStatus.rdsInfo.rdsName = data.data.dbName;
                        gRdsStatus.rdsInfo.mclusterId = data.data.mclusterId;
                    });
                }
            }
        });

    }]);

    return app;
});
