define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('podMonitorModalCtrl', ['$filter','transData','$modalInstance','$scope','leEngineConfig','leEngineHttpService','transData','gEngineStatus','WidgetService','LanguageService','$interval',
        function ($filter,transData,$modalInstance,$scope,leEngineConfig,leEngineHttpService,transData,gEngineStatus,WidgetService,LanguageService,$interval) {

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.refreshTag = true;
            $scope.timeType = 'real';
            var timer = null;
            $scope.title = LanguageService.langPodMonitorModal.titleName+':'+ transData.Name+' ';
            $scope.titleOthers = LanguageService.langPodMonitorModal.titleIp+':'+ transData.PodIP+'  '
            + LanguageService.langPodMonitorModal.titleRuntime+':'+ $filter('durationFilter')(transData.ContainerRunTime)+' ';

            $scope.monitorCpu = {
                monitorType:'pod',
                charId:'chart-cpu-pod',
                subType:'cpu',
                appId:gEngineStatus.app.appId,
                podName:transData.Name
            };

            $scope.monitorMemory = {
                monitorType:'pod',
                charId:'chart-memory-pod',
                subType:'memory',
                appId:gEngineStatus.app.appId,
                podName:transData.Name
            };

            $scope.monitorNetwork = {
                monitorType:'pod',
                charId:'chart-network-pod',
                subType:'network',
                appId:gEngineStatus.app.appId,
                podName:transData.Name
            };

            $scope.loadingNetwork = true;
            $scope.loadingCpu = true;
            $scope.loadingMemory = true;

            $scope.switchTimeType = function(type){
                $scope.timeType = type;
                if($scope.timeType==='real' && timer){
                    timer = $interval(function(){
                        $scope.refreshTag = !$scope.refreshTag;
                    },1000*30);
                }else{
                    $interval.cancel(timer);
                }
            }

            timer = $interval(function(){
                $scope.refreshTag = !$scope.refreshTag;
            },1000*30);

        }
    ]);
});