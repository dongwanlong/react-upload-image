/**
 * Created by dongwanlong on 2016/6/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('HeaderRedisCtrl', [ '$scope', 'RedisCurrentContext',
        function ($scope, RedisCurrentContext) {
            $scope.currentContext = RedisCurrentContext;
        }
    ]);

});
