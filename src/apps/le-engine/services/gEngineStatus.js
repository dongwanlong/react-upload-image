/**
 * Created by dongwanlong on 2016/4/13.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('gEngineStatus', ['leEngineHttpService','leEngineConfig','$q','WidgetService','$location','routes','Utility','LanguageService',function (leEngineHttpService,leEngineConfig,$q,WidgetService,$location,routes,Utility,LanguageService) {
        var service = {};
        service.nowMenuItemType = "parent";
        //信息全局状态
        service.mirror = {};
        service.mirror.username = "";
        service.mirror.mirrorId = "";
        service.mirror.title = "";
        service.mirror.tab = ""

        service.ci = {};
        service.ci.username = "";
        service.ci.mirrorId = "";
        service.ci.title = "";

        service.repertory = {};
        service.repertory.username = "";
        service.repertory.groupId = "";
        service.repertory.title = "";

        service.app = {};
        service.app.appId="";
        service.app.title = "";
        service.app.domainName = "";

        service.regionInfo = {
            regionList: [],
            region: null,
            regionName: ''
        };

        //获取权限列表
        service.getPermissions = function(type){
            var deferred = $q.defer();

            if(type=="image"){
                var url = leEngineConfig.urls.image_permissions.replace('{imageid}', service.mirror.mirrorId);
            }else if(type=="imagegroup"){
                var url = leEngineConfig.urls.imagegroup_permissions.replace('{imagegroupid}', service.repertory.groupId);
            }else if(type=="app"){//app
                var url = leEngineConfig.urls.app_permissions.replace('{appid}', service.app.appId);
            }else{//ci
                var url = leEngineConfig.urls.ci_permissions.replace('{ciid}', service.mirror.mirrorId);
            }
            leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                if (data.data.Code === 200 && data.data.Details) {
                    data.data.Details.Type = type;
                    deferred.resolve(data.data.Details);
                }else {
                    WidgetService.notifyWarning(data.data.Message);
                }
                deferred.resolve({Type:type});
            });
            return deferred.promise;
        }

        //获取当前语言
        service.getLang = function(){
            var url = $location.absUrl();
            var start = url.indexOf("?")+1;
            var end = url.indexOf("#");
            var arrayUrl = url.slice(start,end).split("=");
            return arrayUrl[1];
        }

        //路由解码
        service.decodeRouter = function(url,id,name,tab){
            var routerType = getRouterType(url);
            id = Utility.decodeUrl(id+"");

            if(routerType=="parent"){
            }else if(routerType=="repertorychild"){
                service.repertory.groupId = id;
                service.repertory.title = name;
            }else if(routerType=="mirrorchild"){
                service.mirror.mirrorId = id;
                service.mirror.title = name;
                if(tab)service.mirror.tab = tab;
            }else if(routerType=="appchild"){
                service.app.appId = id;
                service.app.title = name;
            }else if(routerType=="cichild"){
                service.mirror.mirrorId = id;
                service.mirror.title = Utility.decodeUrl(name);
            }else{}

            service.nowMenuItemType = routerType;
        };

        //路由编码
        service.encodeRouter = function(url,title,type){
            url = url.match(/[-a-z]*[^/]/)[0];

            if(type=="parent"){
            }else if(type=="mirrorchild"){
                if(url=="repertory-mirror-list") {
                    if(service.repertory.groupId!=-1 && service.repertory.groupId){
                        url = url+"/"+Utility.encodeUrl(service.repertory.groupId)+"/"+service.repertory.title;
                        title = LanguageService.sideMenuPage.mirrorList+ "  "+service.mirror.title;
                    }else {
                        url = "main-mirror-list";
                        title = LanguageService.sideMenuPage.mirrorList+ "  "+service.mirror.title;
                    }
                }else if(url=="mirror-tag"){
                    url = url+"/"+Utility.encodeUrl(service.mirror.mirrorId)+"/"+service.mirror.title+"/"+service.mirror.tab;
                } else{
                    url = url+"/"+Utility.encodeUrl(service.mirror.mirrorId)+"/"+service.mirror.title;
                }
            }else if(type=="repertorychild"){
                if(url=="main-repertory-list"){
                    title = LanguageService.sideMenuPage.repertoryList+ "  "+service.repertory.title;
                }else {
                   url = url + "/" + Utility.encodeUrl(service.repertory.groupId)+"/"+service.repertory.title;
                }
            }else if(type=="appchild"){
                if(url=="main-app-list-owner"){
                    title = LanguageService.sideMenuPage.appList+ "  "+service.app.title;
                }else{
                    url = url + "/" + Utility.encodeUrl(service.app.appId)+"/"+service.app.title;
                }
            }else if(type=="cichild"){
                if(url=="main-ci-list"){
                    title = LanguageService.sideMenuPage.ciList+ "  "+service.mirror.title;
                }else{
                    url = url + "/" + Utility.encodeUrl(service.mirror.mirrorId)+"/"+Utility.encodeUrl(service.mirror.title);
                }
            }else{}

            return {
                url:url,
                title:title
            };
        };

        //私有方法
        function getRouterType(url){
            url = url.match(/[-a-z]*[^/]/)[0];
            if(url=='main-help')return 'parent';
            for(var iOuter=0;iOuter<routes.length;++iOuter){
                if(!routes[iOuter].url){
                    for(var iInter=0;iInter<routes[iOuter].childLink.length;++iInter) {
                        if(url==routes[iOuter].childLink[iInter].url.match(/[-a-z]*[^/]/)[0]){
                            return routes[iOuter].childLink[iInter].type;
                        }
                    }
                }else{
                    if(url==routes[iOuter].url.match(/[-a-z]*[^/]/)[0]){
                        return routes[iOuter].type;
                    }
                }
            }
        }

        return service;
    }]);
});