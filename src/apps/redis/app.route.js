/**
 * Created by dongwanlong on 2016/4/6.
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
            $routeProvider.otherwise({redirectTo: '/es-list'});
        },
        getRoutes = function () {
            return[{
                        url: '/:regionName/redis-dashboard',
                        title: 'esView',
                        icon:'iconfont icon-clouddashboard',
                        config: {
                            templateUrl: '/apps/redis/views/redis-dashboard.html',
                            resolve:{
                                currentRegionPromise:function(RedisUtility){
                                    return RedisUtility.getCurrentRegionPromise();
                                }
                            }
                        }
                    }, {
                        url: '/:regionName/redis-list',
                        title: 'esList',
                        icon:'iconfont icon-gce',
                        config: {
                            templateUrl: '/apps/redis/views/redis-list.html',
                            resolve:{
                                currentRegionPromise:function(RedisUtility){
                                    return RedisUtility.getCurrentRegionPromise();
                                }
                            }
                        }
                    }, {
                        url: '/:regionName/redis-detail/:redisId/back',
                        title: 'back',
                        icon:'iconfont icon-arrow-left',
                        config: {
                            redirectTo : function($routeParams){
                                return '/:regionName/redis-list'.replace(':regionName',$routeParams['regionName']);
                            }
                        }
                    }, {
                        url: '/:regionName/redis-detail/:redisId',
                        title: 'caseInfo',
                        icon:'iconfont icon-gce',
                        config: {
                            templateUrl: '/apps/redis/views/redis-detail.html',
                            resolve:{
                                currentRegionPromise:function(RedisUtility){
                                    return RedisUtility.getCurrentRegionPromise();
                                }
                            }
                        }
                    }];
        };

    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes',routeConfigurator]);

});

