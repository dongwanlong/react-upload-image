/**
 * Created by dongwanlong on 2016/8/4.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('RedisConfig', ['LanguageService',function (LanguageService) {

        var lang = LanguageService.common.services;

        var config = {};

        config.urls = {
            redis_create:'/redis',
            redis_list:'/redis',
            redis_region_list:'/redis/region',
            redis_AZ_list:'/redis/region/{regionId}/az',
            redis_config_list:'/redis/config',
            redis_detail:'/redis/{redisId}',
            redis_start:'/redis/{redisId}/start',
            redis_stop:'/redis/{redisId}/offline',
            redis_delete:'/redis/{redisId}',
            redis_password:'/redis/{redisId}/password',
        };

        config.REGEX = {
            NAME_ES:/^[a-zA-Z][a-zA-Z0-9_]{1,15}$/
        };

        config.REGEX_MESSAGE= {
            NAME_ES: lang.NAME_ES,
            MARK_ES:lang.MARK_ES
        };

        return config;
    }]);
});