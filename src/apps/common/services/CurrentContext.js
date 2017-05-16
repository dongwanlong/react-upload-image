/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./common.service','jquery'],function (serviceModule,$) {
  serviceModule.factory('CurrentContext', [
    function () {
      var service = {};

      service.regionId=$('#region_id').val();
      service.allRegionData=null;

      return service;
    }]);
});