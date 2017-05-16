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
                if(!value.childLink){
                    setRoute(value);
                }else{
                    angular.forEach(value.childLink, function (childValue) {
                        setRoute(childValue);
                    });
                }
            });

            setRoute({
                url: '/main-help/',
                title: 'help',
                icon: 'iconfont icon-cloudnet',
                config: {
                    templateUrl: '/apps/le-engine/views/help.html'
                }
            });

            $routeProvider.otherwise({redirectTo: '/main-app-list-owner'});
        },
        getRoutes = function () {
            return[
                /*******************父菜单*******************/
                //应用管理
                {
                    type:'parent',
                    title: 'appManger',
                    icon:'iconfont iconfont-md icon-tasks',
                    open:true,
                    childLink:[
                        //我创建的app
                        {
                            type:'parent',
                            title: 'appListOwner',
                            url: '/main-app-list-owner',
                            icon:'iconfont iconfont-sm icon-hand-paper-o',
                            config: {
                                templateUrl: '/apps/le-engine/views/app-list.html',
                                controller:"appListCtrl",
                                resolve:{
                                    initData:function(){
                                        return {
                                            type:'owner'
                                        }
                                    }
                                }
                            }
                        },
                        //我参与的app
                        {
                            type:'parent',
                            title: 'appListJoin',
                            url: '/main-app-list-join',
                            icon:'iconfont iconfont-sm icon-puzzle-piece',
                            config: {
                                controller:"appListCtrl",
                                templateUrl: '/apps/le-engine/views/app-list.html',
                                resolve:{
                                    initData:function(){
                                        return {
                                            type:'join'
                                        }
                                    }
                                }
                            }
                        },
                        //所有app
                        {
                            type:'parent',
                            title: 'appListAll',
                            url: '/main-app-list-all',
                            icon:'iconfont iconfont-sm icon-th',
                            config: {
                                templateUrl: '/apps/le-engine/views/app-list.html',
                                controller:"appListCtrl",
                                resolve:{
                                    initData:function(){
                                        return {
                                            type:'all'
                                        }
                                    }
                                }
                            }
                        }
                    ]
                },
                //代码构建
                {
                    type:'parent',
                    title: 'mirrorCreate',
                    url: '/main-ci-list',
                    icon:'iconfont iconfont-md icon-cloudimage',
                    config: {
                        templateUrl: '/apps/le-engine/views/ci-list.html',
                        controller:"ciListCtrl",
                        resolve:{
                            initData:function(){
                                return {}
                            }
                        }
                    }
                },
                //镜像管理
                {
                    type:'parent',
                    title: 'mirrorManger',
                    icon:'iconfont iconfont-md icon-folder',
                    open:true,
                    childLink:[
                        //仓库
                        {
                            type:'parent',
                            title: 'repertoryList',
                            url: '/main-repertory-list',
                            icon:'iconfont iconfont-sm icon-cube',
                            config: {
                                templateUrl: '/apps/le-engine/views/repertory-list.html',
                                controller:"repertoryListCtrl"
                            }
                        },
                        //镜像
                        {
                            type:'parent',
                            title: 'mirrorList',
                            url: '/main-mirror-list',
                            icon:'iconfont icon-gg',
                            config: {
                                templateUrl: '/apps/le-engine/views/mirror-list.html',
                                controller:"mirrorListCtrl",
                                resolve:{
                                    initData:function(){
                                        return {};
                                    }
                                }
                            }
                        }
                    ]
                },
                /*******************仓库子菜单*******************/
                //返回 父菜单 仓库列表
                {
                    type:'repertorychild',
                    url: '/main-repertory-list',
                    title: 'repertoryList',//return
                    icon:'iconfont icon-arrow-left',
                    config: {
                        controller:"repertoryListCtrl",
                        templateUrl: '/apps/le-engine/views/repertory-list.html',
                        resolve:{
                            initData:function(){
                                return {
                                    type:'all'
                                }
                            }
                        }
                    }
                },
                //仓库下镜像列表
                {
                    type:'repertorychild',
                    title: 'mirrorList',
                    icon:'iconfont icon-shearicon',
                    url: '/repertory-mirror-list/:id/:name',
                    config: {
                        controller:"mirrorListCtrl",
                        templateUrl: '/apps/le-engine/views/mirror-list.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("imagegroup");
                            }]
                        }
                    }
                },
                //仓库动态
                {
                    type:'repertorychild',
                    url: '/repertory-activity/:id/:name',
                    title: 'activityList',
                    icon:'iconfont icon-dongtai',
                    config: {
                        controller:"activityCtrl",
                        templateUrl: '/apps/le-engine/views/activity.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("imagegroup");
                            }]
                        }
                    }
                },
                //仓库成员
                {
                    type:'repertorychild',
                    url: '/repertory-member/:id/:name',
                    title: 'memberList',
                    icon:'iconfont icon-user1',
                    config: {
                        controller:"memberListCtrl",
                        templateUrl: '/apps/le-engine/views/member.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("imagegroup");
                            }]
                        }
                    }
                },
                //仓库预览
                {
                    type:'repertorychild',
                    url: '/repertory-preview/:id/:name',
                    title: 'repertoryPreview',
                    icon:'iconfont icon-attentionfill',
                    config: {
                        controller:"repertoryPreviewCtrl",
                        templateUrl: '/apps/le-engine/views/repertory-preview.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("imagegroup");
                            }]
                        }
                    }
                },
                /*******************CI子菜单*******************/
                //返回 父菜单 CI列表
                {
                    type:'cichild',
                    url: '/main-ci-list',
                    title: 'mirrorList',//return
                    icon:'iconfont icon-arrow-left',
                    config: {
                        templateUrl: '/apps/le-engine/views/ci-list.html',
                        controller:"ciListCtrl",
                        resolve:{
                            initData:function(){
                                return {}
                            }
                        }
                    }
                },
                //构建CI日志
                {
                    type:'cichild',
                    url: '/ci-historys/:id/:name',
                    title: 'ciLog',
                    icon:'iconfont icon-clouddisk',
                    config: {
                        controller:"ciHistorysListCtrl",
                        templateUrl: '/apps/le-engine/views/ci-history-list.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("ci");
                            }]
                        }
                    }
                },
                //动态
                {
                    type:'cichild',
                    url: '/ci-activities/:id/:name',
                    title: 'activityList',
                    icon:'iconfont icon-dongtai',
                    config: {
                        controller:"activityCtrl",
                        templateUrl: '/apps/le-engine/views/activity.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("ci");
                            }]
                        }
                    }
                },
                //成员
                {
                    type:'cichild',
                    url: '/ci-member/:id/:name',
                    title: 'memberList',
                    icon:'iconfont icon-user1',
                    config: {
                        controller:"memberListCtrl",
                        templateUrl: '/apps/le-engine/views/member.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("ci");
                            }]
                        }
                    }
                },
                //预览
                {
                    type:'cichild',
                    url: '/ci-preview/:id/:name',
                    title: 'preview',
                    icon:'iconfont icon-attentionfill',
                    config: {
                        controller:"mirrorPreviewCtrl",
                        templateUrl: '/apps/le-engine/views/mirror-preview.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("ci");
                            }]
                        }
                    }
                },

                /*******************镜像子菜单*******************/
                //返回 父菜单 镜像列表
                {
                    type:'mirrorchild',
                    url: '/repertory-mirror-list/:id/:name',
                    title: 'mirrorList',//return
                    icon:'iconfont icon-arrow-left',
                    config: {
                        controller:"mirrorListCtrl",
                        templateUrl: '/apps/le-engine/views/mirror-list.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("imagegroup");
                            }]
                        }
                    }
                },
                //构建镜像日志
                {
                    type:'mirrorchild',
                    url: '/mirror-tag/:id/:name/:tab',
                    title: 'createLog',
                    icon:'iconfont icon-clouddisk',
                    config: {
                        controller:"mirrorTagCtrl",
                        templateUrl: '/apps/le-engine/views/mirror-tag.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("image");
                            }]
                        }
                    }
                },
                //镜像动态
                {
                    type:'mirrorchild',
                    url: '/mirror-activities/:id/:name',
                    title: 'activityList',
                    icon:'iconfont icon-dongtai',
                    config: {
                        controller:"activityCtrl",
                        templateUrl: '/apps/le-engine/views/activity.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("image");
                            }]
                        }
                    }
                },
                //镜像成员
                {
                    type:'mirrorchild',
                    url: '/mirror-member/:id/:name',
                    title: 'memberList',
                    icon:'iconfont icon-user1',
                    config: {
                        controller:"memberListCtrl",
                        templateUrl: '/apps/le-engine/views/member.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("image");
                            }]
                        }
                    }
                },
                //预览
                {
                    type:'mirrorchild',
                    url: '/mirror-preview/:id/:name',
                    title: 'preview',
                    icon:'iconfont icon-attentionfill',
                    config: {
                        controller:"mirrorPreviewCtrl",
                        templateUrl: '/apps/le-engine/views/mirror-preview.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions("image");
                            }]
                        }
                    }
                },
                /*******************应用子菜单*******************/
                //返回 父菜单 APP列表
                {
                    type:'appchild',
                    url: '/main-app-list-owner',
                    title: 'appList',
                    icon:'iconfont icon-arrow-left',
                    config: {
                        controller:"appListCtrl",
                        templateUrl: '/apps/le-engine/views/app-list.html',
                        resolve:{
                            initData:function(){
                                return {
                                    type:'owner'
                                }
                            }
                        }
                    }
                },
                //服务
                {
                    type:'appchild',
                    url: '/app-cell/:id/:name',
                    title: 'appCell',
                    icon:'iconfont icon-service',
                    config: {
                        templateUrl: '/apps/le-engine/views/app-cell.html',
                        controller:"appCellCtrl",
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //监控
                {
                    type:'appchild',
                    url: '/app-monitor/:id/:name',
                    title: 'appMonitor',
                    icon:'iconfont icon-monitor',
                    config: {
                        templateUrl: '/apps/le-engine/views/app-monitor.html',
                        controller:"appMonitorCtrl",
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //监控
                {
                    type:'appchild',
                    url: '/app-alert/:id/:name',
                    title: 'appAlert',
                    icon:'iconfont icon-icon1',
                    config: {
                        templateUrl: '/apps/le-engine/views/app-alert.html',
                        controller:"appAlertCtrl",
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //应用成员
                {
                    type:'appchild',
                    url: '/app-member/:id/:name',
                    title: 'memberList',
                    icon:'iconfont icon-user1',
                    config: {
                        controller:"memberListCtrl",
                        templateUrl: '/apps/le-engine/views/member.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //负载均衡
                {
                    type:'appchild',
                    url: '/app-slb/:id/:name',
                    title: 'appSlb',
                    icon:'iconfont icon-slb',
                    config: {
                        controller:"appSlbCtrl",
                        templateUrl: '/apps/le-engine/views/app-slb.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //APP动态
                {
                    type:'appchild',
                    url: '/app-activities/:id/:name',
                    title: 'activityList',
                    icon:'iconfont icon-dongtai',
                    config: {
                        controller:"activityCtrl",
                        templateUrl: '/apps/le-engine/views/activity.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //预览
                {
                    type:'appchild',
                    url: '/app-preview/:id/:name',
                    title: 'appPreview',
                    icon:'iconfont icon-attentionfill',
                    config: {
                        controller:"appPreviewCtrl",
                        templateUrl: '/apps/le-engine/views/app-preview.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                },
                //事件
                {
                    type:'appchild',
                    url: '/app-event/:id/:name',
                    title: 'appEvent',
                    icon:'iconfont icon-xinfeng',
                    config: {
                        controller:"appEventCtrl",
                        templateUrl: '/apps/le-engine/views/app-event.html',
                        resolve:{
                            initData:['gEngineStatus',function(gEngineStatus){
                                return gEngineStatus.getPermissions('app');
                            }]
                        }
                    }
                }
            ];
        };

    app.constant('routes', getRoutes());
    app.config(['$routeProvider', 'routes',routeConfigurator]);

});

