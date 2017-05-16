/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./app.service'], function (serviceModule) {
  serviceModule.factory('leEngineHttpService', ['$http','$q','$window','WidgetService','$location',
    function ($http,$q,$window,WidgetService,$location) {
      var service = {};

      service.doGet = function (url, data, option) {
        var deferred = $q.defer();
        $http.get(url, angular.extend({params: data}, option)).success(function (data, status, headers, config) {
          if (data.result === 1) {
            deferred.resolve(data);
          }else if(data.result === 2){
            service.doGet("/user/logout", {}).then(function (data, status, headers, config) {
              if (data.result == 1) {
                window.location.reload(true);
              }
            });
          } else {
            deferred.reject(data);
            if(!option || !option.disableGetGlobalNotify){
              WidgetService.notifyError(data.msgs[0] || '获取数据失败');
            }
          }
        });
        return deferred.promise;
      };

      service.doPost = function (url, data, option) {
        if(option && option.headers && option.headers['Content-Type']=='application/json'){
          option.transformRequest = function(data){
            return JSON.stringify(data);
          };
        }
        return $http.post(url, data, option);
      };


      service.doPut = function (url, data, option) {
        if(option && option.headers && option.headers['Content-Type']=='application/json'){
          option.transformRequest = function(data){
            return JSON.stringify(data);
          };
        }
        return $http.put(url, data, option);
      };

      service.doDelete = function (url, data, option) {
        return $http.delete(url, data, option);
      };

      return service;
    }]);
});