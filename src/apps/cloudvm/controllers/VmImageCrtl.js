/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {
  controllerModule.controller('VmImageCrtl', ['$scope','$interval','Config','$modal','HttpService','WidgetService','CurrentContext',
    function ($scope,$interval, Config,$modal,HttpService,WidgetService,CurrentContext) {
      $scope.searchName='';
      $scope.imageList = [];
      $scope.currentPage = 1;
      $scope.totalItems = 0;
      $scope.pageSize = 10;
      $scope.onPageChange = function () {
        refreshimageList();
      };

      $scope.doSearch = function () {
        refreshimageList();
      };

      $scope.isAllImgChecked=function(){
        var unCheckedImgs=$scope.imageList.filter(function(img){
          return img.checked===false || img.checked===undefined;
        });
        return unCheckedImgs.length==0;
      };
      $scope.checkAllimg=function(){
        if($scope.isAllImgChecked()){
          $scope.imageList.forEach(function(img){
            img.checked=false;
          });
        }
        else{
          $scope.imageList.forEach(function(img){
            img.checked=true;
          });
        }
      };
      $scope.checkimg = function (img) {
        img.checked = img.checked === true ? false : true;
      };
      var refreshimageList = function () {
          var queryParams = {
            region:CurrentContext.regionId,
            name:$scope.searchName,
            currentPage: $scope.currentPage,
            recordsPerPage: $scope.pageSize
          };
          $scope.isListLoading=true;
          HttpService.doGet(Config.urls.image_list, queryParams).then(function (data, status, headers, config) {
            $scope.isListLoading=false;
            $scope.imageList = data.data.data;
            $scope.totalItems = data.data.totalRecords;
          });
      };
      getCheckedImg=function(){
        return $scope.imageList.filter(function(item){
          return item.checked===true;
        });
      };
      refreshimageList();
    }
  ]);
});
