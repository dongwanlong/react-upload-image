/**
 * Created by dongwanlong on 2016/6/23.
 */
define(['angular'],function(angular){
    var modular = angular.module('common.language', []);
    modular.factory('CommonLanguageService', ['$modal',
        function ($modal) {
            var service = {
                "langPrimary":{
                    "name":"name",
                    "type":"type",
                    "title":"title",
                    "creteTime":"crete time",
                    "creteUser":"crete user",
                    "operation":"operation",
                    "detail":"detail",
                    "affect":"affect",
                    "basicInfo":"basicInfo",
                    "content":"content",
                    "status":"status",
                    "noDataHint":"no data",
                    "error":"error",
                    "unknown":"unknown",
                    "average":"Average",
                    "times": "once",
                    "sms": "sms",
                    "voice": "voice",
                    "email": "email",
                    "edit": "edit",
                    "enable": "enable",
                    "disable": "disable",
                    "delete":"delete",
                    "time": "time",
                    "search": "search",
                },
                "langDuration": {
                    "days": "days",
                    "hours": "hours",
                    "minutes": "minutes"
                },
                "services":{
                    NAME: 'The name must be 2-128 characters, letters or numbers to support Chinese and () () _-, by letters or at the beginning of Chinese',
                    NAME_KEYPAIR: 'The name must be 2-128 characters, letters and numbers to support _-, with small letters at the beginning',
                    PASSWORD: '8-30 characters, including the size of the write letters and numbers, do not support special symbols',
                    IP:"Please enter the correct IP format,.IP can increase the number of the number of the IP segment access authorization, such as 192.168.19.3 or 192.168.19.%",
                    PHONE:"Please enter the correct mobile phone format"
                },
                "directives":{
                },
                "filters":{
                },
                "pagination":{
                    "total":"total ",
                    "nums":" counts",
                    "perPage":"per page "
                },
                "error": {
                    "requestError": "request error��{errorMsg}"
                }
            };

            return service;
        }]);
    return modular;
});