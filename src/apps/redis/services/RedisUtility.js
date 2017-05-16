/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('RedisUtility', ['$q','$route', '$interval', 'RedisCurrentContext',
        function ($q,$route, $interval, RedisCurrentContext) {
            var service = {};

            service.regionNameChangeHandler = function (callback) {
                if(RedisCurrentContext.regionList.length){
                    callback();
                } else{
                    var timer = $interval(function () {
                        if(RedisCurrentContext.regionList.length){
                            $interval.cancel(timer);
                            callback();
                        }
                    }, 100);
                }
            };

            service.getCurrentRegionPromise = function () {
                var deferred = $q.defer();
                service.regionNameChangeHandler(function(){
                    RedisCurrentContext.currentRegion = RedisCurrentContext.regionList.filter(function(region){
                        return region.regionName === $route.current.params.regionName;
                    })[0];
                    deferred.resolve(true);
                });
                return deferred.promise;
            };

            return service;
        }]);
});
