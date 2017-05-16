/**
 * Created by dongwanlong on 2016/9/8.
 */
/**
 * Created by chenxiaoxiao3 on 2016/8/8.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('appSlbCtrl', ['initData','LanguageService','gEngineStatus','$scope','$location','$modal','leEngineHttpService','leEngineConfig','WidgetService','Utility',
        function (initData,LanguageService,gEngineStatus,$scope,$location,$modal,leEngineHttpService,leEngineConfig,WidgetService,Utility) {

            $scope.tabType = 'list';
            $scope.currentPage=1;
            $scope.totalItems=0;
            $scope.pageSize=10;
            $scope.slbList = [];
            $scope.slbDetails = {};

            $scope.DomainInfoPermissions = initData['Browse App Domain Info'];
            $scope.DomainStatusPermissions = initData['Browse App Domain Status'];

            $scope.pageChange = function(){
                refreshSlbList();
            }

            
            //Log
            $scope.refreshSlbLog = function() {
                var url = leEngineConfig.urls.app_slb_log.replace("{appid}", gEngineStatus.app.appId);
                leEngineHttpService.doGet(url).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.log = data.data.Details.Config;
                        $scope.slbDetails = data.data.Details;
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            //list
            $scope.refreshSlbList = function () {
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.slb_list.replace('{appid}',gEngineStatus.app.appId), {}).then(function (data, status, headers, config) {
                    $scope.isListLoading=false;
                    if(data.data.Code===200){
                        $scope.slbInfo = data.data.Details;
                        $scope.slbList = data.data.Details.Status;
                        $scope.totalItems = data.data.Details.Status.length;
                    }else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            function showTipsModal(app){
                var confirmMessage = "[" + app.Name + "]" + LanguageService.slbListPage.noDomainNameMessage;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/confirm-modal.html',
                    controller: 'ConfirmModalCtrl',
                    size: 'small',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                "title":"Tips",
                                "message":confirmMessage,
                                "msgBoxType":"alert"
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    var resultAppId = Utility.encodeUrl(app.Id+"");
                    $location.path('/app-cell/'+ resultAppId +'/' + app.Name);
                }, function () {
                });
            };

            function refreshAppInfo(){
                leEngineHttpService.doGet(leEngineConfig.urls.app_edit.replace('{appid}', gEngineStatus.app.appId)).then(function (data, status, headers, config) {
                    if(data.data.Code === 200){
                        if(data.data.Details.DomainName){
                            $scope.refreshSlbLog();
                            $scope.refreshSlbList();
                        }else {
                            showTipsModal(data.data.Details);
                        }
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            refreshAppInfo();

        }]);

});
