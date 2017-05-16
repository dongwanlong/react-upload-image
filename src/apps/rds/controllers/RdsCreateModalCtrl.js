/**
 * Created by dongwanlong on 2016/4/7.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsCreateModalCtrl', ['gRdsStatus','Config','LanguageService','$filter','rdsConfig', 'HttpService', 'WidgetService', 'Utility', 'CurrentContext', 'ModelService', '$scope', '$modalInstance', '$timeout', '$window', '$sce', '$httpParamSerializerJQLike', '$modal', 'region',
        function (gRdsStatus, Config, LanguageService, $filter, rdsConfig, HttpService, WidgetService, Utility, CurrentContext, ModelService, $scope, $modalInstance, $timeout, $window, $sce, $httpParamSerializerJQLike, $modal, region) {


            $scope.activeFlow = 1;

            $scope.rdsName = "";

            $scope.isRdsCanBuy = false;

            $scope.rdsLinkTypeList = [new ModelService.SelectModel(LanguageService.rdsCreateModalPage.longLink,0),new ModelService.SelectModel(LanguageService.rdsCreateModalPage.shortLink,1)];
            $scope.rdsLinkTypeNow = $scope.rdsLinkTypeList[0];

            $scope.rdsUsableAreaList = [];
            $scope.rdsUsableAreaNow = '';

            $scope.rdsUserMangerCreateList = [new ModelService.SelectModel(LanguageService.rdsCreateModalPage.create,1),new ModelService.SelectModel(LanguageService.rdsCreateModalPage.noCreate,0)];
            $scope.rdsUserMangerCreateNow = $scope.rdsUserMangerCreateList[0];


            $scope.rdsSqltypeList = [new ModelService.SelectModel("MYSQL",0)];
            $scope.rdsSqltypeNow = $scope.rdsSqltypeList[0];

            $scope.rdsStorageSpaceList = [
                new ModelService.SelectModel("10GB",10*1024*1024*1024)
            ];
            $scope.rdsStorageSpaceNow = $scope.rdsStorageSpaceList[0];

            $scope.rdsMemoryList = [
                new ModelService.SelectModel("4GB",4*1024*1024*1024)
            ];
            $scope.rdsMemoryNow = $scope.rdsMemoryList[0];

            $scope.rdsBuyTimeList = [new ModelService.SelectModel("1 "+LanguageService.rdsCreateModalPage.year,0)];
            $scope.rdsBuyTimeNow = $scope.rdsBuyTimeList[0];

            $scope.REGEX = angular.extend({}, Config.REGEX, rdsConfig.REGEX);
            //对话框页面切换
            $scope.tabPage1ToPage2 = function (event) {
                event.preventDefault();
                if (!$scope.rds_create_form.rds_name.$valid) {
                    return;
                }
                $scope.activeFlow = 2;
            };
            $scope.tabPage2ToPage1 = function (event) {
                event.preventDefault();
                $scope.activeFlow = 1;
            };
            $scope.tabPage2ToPage3 = function (event) {
                event.preventDefault();
                $scope.activeFlow = 3;
            };
            $scope.tabPage3ToPage2 = function (event) {
                event.preventDefault();
                $scope.activeFlow = 2;
            };

            var setVmPrice = function () {
                //var data = {
                //    //region: region,
                //    //order_time: $scope.vmBuyPeriod.toString(),
                //    //order_num: $scope.vmCount.toString(),
                //    //os_broadband: $scope.vmNetworkType == 'primary' && $scope.vmNetworkPublicIpModel == 'now' ? $scope.networkBandWidth.toString() : '0',
                //    //volumeType: $scope.selectedVmDiskType.name,
                //    //volumeSize: $scope.dataDiskVolume.toString(),
                //    //cpu_ram: $scope.selectedVmCpu + '_' + $scope.selectedVmRam,
                //};
                //calculatePriceData = data;
                //$scope.isCalculatingPrice = true;
                //HttpService.doPost(Config.urls.vm_calculate_price, data).success(function (data, status, headers, config) {
                //    $scope.isCalculatingPrice = false;
                //    if (data.result === 1) {
                //        $scope.isRdsCanBuy = false;
                //        //$scope.vmTotalPrice = data.data;
                //    }
                //    else {
                //        WidgetService.notifyError(data.msgs[0] || '计算价格失败');
                //    }
                //});
            };

            //$scope.$watch(function () {
            //    return [
            //        $scope.rdsUsableAreaNow.text,
            //        $scope.rdsStorageSpaceNow.text,
            //        $scope.rdsMemoryNow.text,
            //        $scope.rdsSqltypeNow.text,
            //        $scope.rdsUserMangerCreate,
            //        $scope.rdsLinkType,
            //        $scope.rdsBuyTimeNow,
            //        $scope.rdsBuyCount
            //    ].join('_');
            //}, function (value) {
            //        setVmPrice();
            //});

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.createRds = function(){

                var formData = {
                    "dbName":$scope.rdsName,     //RDS名
                    "linkType":$filter('rdsLinkTypeFilter')($scope.rdsLinkType),      //链接类型 长链接 0    短链接 1
                    "engineType":0,       //存错引擎 InnDB 0
                    "hclusterId":$scope.rdsUsableAreaNow.value,      //测试集群ID
                    "isCreateAdmin":$scope.rdsUserMangerCreateNow.value,  //是否创建默认管理账户
                    "storageSize":$scope.rdsStorageSpaceNow.value,  //存储空间
                    "memorySize":$scope.rdsMemoryNow.value     //内存
                };

                HttpService.doPost(rdsConfig.urls.rds_list, formData).success(function (data, status, headers, config) {
                    $scope.isCalculatingPrice = false;
                    $modalInstance.close(data);
                });
            }
            var refreshRdshcluster = function(){
                HttpService.doGet(Config.urls.hcluster_list.replace('{areaId}', CurrentContext.regionId).replace('{type}',"rds"), {}).then(function (data, status, headers, config) {
                    if(data.result==1){
                        $scope.rdsUsableAreaList = data.data.map(function(item){
                            return new ModelService.SelectModel(item.hclusterNameAlias, item.id);
                        });
                    }
                });
            }

            refreshRdshcluster();

        }]);

});
