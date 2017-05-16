/**
 * Created by jiangfei on 2015/7/22.
 */
define(['app'], function (app) {
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
                    icon: 'iconfont icon-clouddashboard',
                    config: {
                        templateUrl: '/apps/cloudvm/views/dashboard.html'
                    }
                },
                {
                    url: '/vm',
                    title: '云主机',
                    icon: 'iconfont icon-cloudhost',
                    config: {
                        templateUrl: '/apps/cloudvm/views/virtual-machine.html'
                    }
                },
                {
                    url: '/vm-disk',
                    title: '云硬盘',
                    icon: 'iconfont icon-clouddisk',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-disk.html'
                    }
                },
                {
                    url: '/vm-vpc',
                    title: '私有网络',
                    icon: 'iconfont icon-cloudnet',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-vpc.html'
                    }
                },
                {
                    url: '/vm-floatIP',
                    title: '公网IP',
                    icon: 'iconfont icon-cloudfloatip',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-floatIP.html'
                    }
                },
                {
                    url: '/vm-router',
                    title: '路由器',
                    icon: 'iconfont icon-cloudroute',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-router.html'
                    }
                },
                {
                    url: '/vm-snapshot',
                    title: '快照',
                    icon: 'iconfont icon-cloudsnap',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-snapshot.html'
                    }
                }, {
                    url: '/vm-image',
                    title: '镜像',
                    icon: 'iconfont icon-cloudimage',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-image.html'
                    }
                }, {
                    url: '/vm-keypair',
                    title: '密钥',
                    icon: 'iconfont icon-cloudkeypair',
                    config: {
                        templateUrl: '/apps/cloudvm/views/vm-keypair.html'
                    }
                }];
        };

    app.constant('routes', getRoutes());

    app.config(['$routeProvider', 'routes', routeConfigurator]);

});
