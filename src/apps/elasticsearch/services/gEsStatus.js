/**
 * Created by dongwanlong on 2016/4/13.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('gEsStatus', function () {
        var service = {};
        //菜单全局状态
        service.nowMenuItemType = "parent";

        //rds信息全局状态
        service.esInfo = {};
        service.esInfo.esId = "";
        service.esInfo.esName = "";

        return service;
    });
});