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
            return[
                    {
                        type:'parent',
                        url: '/es-view',
                        title: 'esView',
                        icon:'iconfont icon-clouddashboard',
                        config: {
                            templateUrl: '/apps/elasticsearch/views/es-dashboard.html'
                        }
                    },
                    {
                        type:'parent',
                        url: '/es-list',
                        title: 'esList',
                        icon:'iconfont icon-gce',
                        config: {
                            templateUrl: '/apps/elasticsearch/views/es-list.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/es-list',
                        title: 'return',
                        icon:'iconfont icon-arrow-left',
                        config: {
                            templateUrl: '/apps/elasticsearch/views/es-list.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/es-case-info/:id',
                        title: 'caseInfo',
                        icon:'iconfont icon-gce',
                        config: {
                            templateUrl: '/apps/elasticsearch/views/es-case-info.html'
                        }
                    }
                ];
        };

    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes',routeConfigurator]);

});

