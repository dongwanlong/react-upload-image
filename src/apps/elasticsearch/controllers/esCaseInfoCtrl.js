/**
 * Created by dongwanlong on 2016/8/8.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('esCaseInfoCtrl', ['$scope','gEsStatus','esConfig','HttpService',
        function ($scope, gEsStatus, esConfig, HttpService) {

            $scope.isloading = true;
            $scope.ipListStr = "";

            HttpService.doGet(esConfig.urls.es_case_info.replace('{id}',gEsStatus.esInfo.esId), {}).then(function (data, status, headers, config) {
                $scope.isloading = false;
                $scope.esInfo = data.data;
                gEsStatus.esInfo.esName = data.data.esName;
                data.data.esContainers.forEach(function(item){
                    $scope.ipListStr += item.ipAddr+" : 9200     ";
                });
            });

        }]);

});
