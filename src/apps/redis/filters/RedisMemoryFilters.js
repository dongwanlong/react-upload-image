/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.filter'], function (filterModule) {

    filterModule.filter('RedisMemoryFilters', [function () {
        return function (redis) {
            return (redis.memorySize * redis.memUsePercent).toFixed(2) + 'G/' + redis.memorySize.toFixed(2) + 'G';
        }
    }]);
});