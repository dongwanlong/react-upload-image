/**
 * Created by dongwanlong on 2016/8/8.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RedisDetailCtrl', ['$scope','$routeParams','RedisCurrentContext','RedisConfig','RedisHttpService',
        function ($scope,$routeParams, RedisCurrentContext, RedisConfig, RedisHttpService) {

            $scope.isloading = true;

            $scope.redisInfo = null;
            $scope.password = '';

            $scope.viewPassword = function(){
                RedisHttpService.doGet(RedisConfig.urls.redis_password.replace('{redisId}',$routeParams['redisId']), {}).then(function (data, status, headers, config) {
                    $scope.password = data.data.password;
                });
            };

            RedisHttpService.doGet(RedisConfig.urls.redis_detail.replace('{redisId}',$routeParams['redisId']), {}).then(function (data, status, headers, config) {
                $scope.isloading = false;
                $scope.redisInfo = data.data;
            });
        }]);
});
