/**
 * Created by dongwanlong on 2016/8/4.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('esConfig', ['LanguageService',function (LanguageService) {

        var lang = LanguageService.common.services;

        var config = {};

        config.urls = {
            es_create:'/es',
            es_list:'/es',
            es_case_info:'/es/{id}'
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