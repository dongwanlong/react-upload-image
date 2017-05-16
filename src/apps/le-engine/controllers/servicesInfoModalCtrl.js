/**
 * Created by dongwanlong on 2016/9/7.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('servicesInfoModalCtrl', ['gEngineStatus','transData','leEngineConfig','$rootScope','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'Config', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','$modalInstance',
        function (gEngineStatus,transData,leEngineConfig,$rootScope,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, Config, leEngineHttpService,WidgetService,CurrentContext,LanguageService,$modalInstance) {

            var currentUpstream = transData.info.metadata.labels.upstream;
            $scope.servicesInfo = transData.info;
            $scope.detail = JSON.stringify($scope.servicesInfo,undefined,4);
            $scope.tabType = "serviceInfo";
            $scope.slbInfoIpsList = [];
            $scope.slbInfo = {};

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            function getSlbList(slbInfo){
                if(!slbInfo.Upstreams || !currentUpstream)return [];
                var upstreamsArray = slbInfo.Upstreams.filter(function(item){
                    // return item.Name===slbInfo.Domain;
                    return item.Name===currentUpstream;
                });
                if(upstreamsArray.length<=0 || !upstreamsArray[0].Cells)return [];

                var cellsArray = upstreamsArray[0].Cells.filter(function(item){
                    return item.CellId==transData.info.metadata.labels.cellid;
                });
                if(cellsArray.length<=0 || !cellsArray[0].ServerIps)return [];

                return cellsArray[0].ServerIps;
            };


            var refreshServiceDomain = function () {
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.app_slb_log.replace('{appid}',gEngineStatus.app.appId), {}).then(function (data, status, headers, config) {
                    $scope.isListLoading=false;
                    if(data.data.Code===200){
                        $scope.slbInfoIpsList = getSlbList(data.data.Details);
                        $scope.slbInfo = data.data.Details;
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };
            refreshServiceDomain();

        }
    ]);
});