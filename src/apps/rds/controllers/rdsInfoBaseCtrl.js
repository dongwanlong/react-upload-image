/**
 * Created by dongwanlong on 2016/4/14.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('rdsInfoBaseCtrl', ['$modal', 'rdsConfig','$filter','gRdsStatus','HttpService','$scope', function ($modal, rdsConfig, $filter, gRdsStatus, HttpService, $scope) {

            $scope.rdsInfo = {};

            $scope.showOption = function(size){
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/rds/templates/rdsinfo-optioninfo.html',
                    controller: 'RdsInfoOptionInfoCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {};
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    if(resultData &&resultData.result===1){
                    }else{
                    }
                }, function () {
                });
            };

            var rdsGetNetAddr = function(dbInfo){
                var ips='';
                if(!dbInfo.containers)return ips;
                var containers = dbInfo.containers;
                for(var i= 0,len=containers.length;i<len;i++){
                    if(containers[i].type == "mclustervip"){
                        ips = ips+containers[i].ipAddr+' ';
                    }
                }
                return ips;
            }

            var refreshRdsInfo = function(){
                $scope.isloading = true;

                HttpService.doGet(rdsConfig.urls.rdsinfo_baseinfo.replace('{dbId}',gRdsStatus.rdsInfo.rdsId), {}).then(function (data, status, headers, config) {
                    $scope.isloading = false;

                    $scope.rdsInfo.dbName = data.data.dbName;

                    if(data.data.hcluster){
                        $scope.rdsInfo.availableRegion = data.data.hcluster.hclusterNameAlias;
                    };
                    $scope.rdsInfo.netAddr = rdsGetNetAddr(data.data);
                    $scope.rdsInfo.runningState = data.data.status;
                    $scope.rdsInfo.memorySize = data.data.memorySize;
                    $scope.rdsInfo.storageSize = data.data.storageSize;
                    $scope.rdsInfo.createTime = data.data.createTime;
                    $scope.rdsInfo.laterTime = data.data.createTime;
                });
            }

            refreshRdsInfo();
        }]);

});
