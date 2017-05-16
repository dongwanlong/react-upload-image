/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./app.service'], function (serviceModule) {
    serviceModule.factory('RedisHttpService', ['$http', '$q', '$window', 'WidgetService', '$location',
        function ($http) {
            var service = {};

            service.doGet = function (url, data, option) {
                return $http.get(url, angular.extend({params: data}, option));
            };

            return service;
        }]);
});