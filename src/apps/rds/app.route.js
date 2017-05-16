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
            $routeProvider.otherwise({
                redirectTo:'/-1/rds-list'
            });
        },
        getRoutes = function () {
            return[
                    {
                        type:'parent',
                        url: '/:regionId/rds-dashboard',
                        title: 'rdsView',//RDS概览
                        icon:'iconfont icon-clouddashboard',
                        config: {
                            templateUrl: '/apps/rds/views/rds-dashboard.html'
                        }
                    },
                    {
                        type:'parent',
                        url: '/:regionId/rds-list',
                        title: 'rdsList',//RDS列表
                        icon:'iconfont icon-rds',
                        config: {
                            controller:'RdsListCtrl',
                            templateUrl: '/apps/rds/views/rds-list.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rds-list',
                        title: 'return',//return
                        icon:'iconfont icon-arrow-left',
                        config: {
                            controller:'RdsListCtrl',
                            templateUrl: '/apps/rds/views/rds-list.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rdsinfo-base/:id',
                        title: 'baseInfo',//基本信息
                        icon:'iconfont icon-rds',
                        config: {
                            templateUrl: '/apps/rds/views/rdsinfo-base.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rdsinfo-usermanger/:id',
                        title: 'userManger',//账号管理
                        icon:'iconfont icon-user1',
                        config: {
                            templateUrl: '/apps/rds/views/rdsinfo-usermanger.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rdsinfo-resmonitor/:id',
                        title: 'resMonitor',//系统资源监控
                        icon:'iconfont icon-monitor',
                        config: {
                            templateUrl: '/apps/rds/views/rdsinfo-resmonitor.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rdsinfo-save/:id',
                        title: 'backup',//恢复与备份
                        icon:'iconfont icon-shield',
                        config: {
                            templateUrl: '/apps/rds/views/rdsinfo-backups.html'
                        }
                    },
                    {
                        type:'child',
                        url: '/:regionId/rdsinfo-sql-audit/:id',
                        title: 'sqlAudit',
                        icon:'iconfont icon-attention',
                        config: {
                            templateUrl: '/apps/rds/views/rdsinfo-sql-audit.html'
                        }
                    }
                ];
        };

    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes',routeConfigurator]);

});

