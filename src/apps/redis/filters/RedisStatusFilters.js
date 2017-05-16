/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.filter'], function (filterModule) {

    filterModule.filter('RedisStatusFilters', ['LanguageService','CommonLanguageService', function (LanguageService, CommonLanguageService) {
        return function (status) {
            return LanguageService.langRedisStatus[status] || CommonLanguageService.langPrimary.unknown;
        }
    }]);
});