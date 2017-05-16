/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('esCreateModalCtrl', ['esConfig','LanguageService','$filter','Config', 'HttpService', 'WidgetService', 'Utility', 'CurrentContext', 'ModelService', '$scope', '$modalInstance', '$timeout', '$window', '$sce', '$httpParamSerializerJQLike', '$modal', 'region',
        function (esConfig, LanguageService, $filter, Config, HttpService, WidgetService, Utility, CurrentContext, ModelService, $scope, $modalInstance, $timeout, $window, $sce, $httpParamSerializerJQLike, $modal, region) {

            $scope.esName = "";
            $scope.isEsCanBuy = false;
            $scope.REGEX = angular.extend({}, Config.REGEX, esConfig.REGEX);

            $scope.esMemorySizeList = [
                new ModelService.SelectModel("1GB",1073741824),
                new ModelService.SelectModel("2GB",2147483648),
                new ModelService.SelectModel("4GB",4294967296)
            ];
            $scope.esMemorySizeNow = $scope.esMemorySizeList[0];

            $scope.esStorageSizeList = [
                new ModelService.SelectModel("10GB",10737418240),
                new ModelService.SelectModel("20GB",21474836480),
                new ModelService.SelectModel("30GB",32212254720)
            ];
            $scope.esStorageSizeNow = $scope.esStorageSizeList[0];

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.createEs = function(){
                if(!$scope.esHcluster.value)return;

                var formData = {
                    "esName":$scope.esName,     //ES名
                    "descn":$scope.esMark,      //备注
                    "memorySize":$scope.esMemorySizeNow.value,   //内存大小
                    "nodeCount":$scope.esNodeCount,   //节点数
                    "storageSize":$scope.esStorageSizeNow.value,  //存储大小
                    "hclusterId":$scope.esHcluster.value  //物理机集群id
                };

                HttpService.doPost(esConfig.urls.es_create, formData).success(function (data, status, headers, config) {
                    $scope.isCalculatingPrice = false;
                    $modalInstance.close(data);
                });
            };

            function refreshEshcluster(){
                HttpService.doGet("/hcluster/es", {}).then(function (data, status, headers, config) {
                    if(data.result==1){
                        $scope.esHclusterList = data.data.map(function(item){
                            return new ModelService.SelectModel(item.hclusterNameAlias, item.id);
                        });
                        if($scope.esHclusterList.length>0){
                            $scope.esHcluster = $scope.esHclusterList[0];
                        }
                    }
                });
            }

            refreshEshcluster();

        }]);

});
