/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./common.service'],function (serviceModule) {
  serviceModule.factory('ModelService', ['$modal','toaster',
    function ($modal,toaster) {
      var service = {};

      service.SelectModel=function(text,value,option){
        this.text=text;
        this.value=value;
        this.relatedOption = option||{};
      };

      return service;
    }]);
});