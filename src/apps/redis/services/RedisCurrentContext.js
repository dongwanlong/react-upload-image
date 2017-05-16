/**
 * Created by dongwanlong on 2016/4/13.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('RedisCurrentContext', function () {
        var service = {};

        service.regionList = [];
        service.currentRegion = null;
        service.redisId = null;

        return service;
    });
});