/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./common.service'],function (serviceModule) {
  serviceModule.factory('WidgetService', ['$modal','toaster','$interval',
    function ($modal,toaster,$interval) {
      var service = {};

      service.openConfirmModal = function (title, message) {
        return $modal.open({
          templateUrl: '/apps/cloudvm/templates/confirm-modal.html',
          controller: 'ConfirmModalCtrl',
          size: 'small',
          resolve: {
            message:function(){
              return  message;
            },
            title:function(){
              return  title;
            }
          }
        });
      };

      service.notifyError=function(message){
        toaster.pop('error', null, message, 2000, 'trustedHtml');
      };
      service.notifyInfo=function(message){
        toaster.pop('info', null, message, 2000, 'trustedHtml');
      };
      service.notifySuccess=function(message){
        toaster.pop('success', null, message, 2000, 'trustedHtml');
      };
      service.notifyWarning=function(message){
        toaster.pop('warning', null, message, 4000, 'trustedHtml');
      };
      service.showSpin=function(message){
        $('body').append("<div class=\"spin\"></div>");
        $('body').append("<div class=\"far-spin\"></div>");
      };
      service.hideSpin=function(message){
        $('body').find('.spin').remove();
        $('body').find('.far-spin').remove();
      };

      return service;
    }]);
});