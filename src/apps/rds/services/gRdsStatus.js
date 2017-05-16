/**
 * Created by dongwanlong on 2016/4/13.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('gRdsStatus', function () {
        var service = {};
        //菜单全局状态
        service.nowMenuItemType = "parent";

        //rds信息全局状态
        service.rdsInfo = {};
        service.rdsInfo.rdsId = "";
        service.rdsInfo.rdsName = "";
        service.rdsInfo.curArea = "6";

        return service;
    });
});