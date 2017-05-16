define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('mirrorTagCtrl', ['initData','$window','$q','$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (initData,$window,$q,$scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.mirrorTagList = [];
            var contentType = {headers:{'Content-Type':'application/json'}};
            $scope.buildImagePermissions = initData['Build Image'];
            $scope.viewImageTagBuildHistoryPermissions = initData['Browse Image Tag BuildHistory List'];
            $scope.isListLoading = true;
            $scope.isPublic = gEngineStatus.mirror.tab==='public'?true:false;

            var mirrorPath = "";
            var userName = "";
            var accesstoken = "";
            var registryhost = "";

            $scope.refreshList = function(){$scope.isListLoading = true;refreshMirrorTagList()};

            var refreshMirrorTagList = function () {
                 leEngineHttpService.doGet(leEngineConfig.urls.mirror_tag_list.replace('{imageid}', gEngineStatus.mirror.mirrorId).replace('{list}',"all")).then(function (data, status, headers, config) {
                    $scope.isListLoading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            $scope.mirrorTagList = data.data.Details;
                            $scope.totalItems = data.data.Details.length;
                        }
                    } else {
                        $scope.isListLoading = false;
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            var getRegistryhost = function(){
                return leEngineHttpService.doGet('/registryhost').then(function (data, status, headers, config) {
                    $scope.isListLoading = false;
                    if(data.result==1){
                        registryhost = data.data.registryHost;
                    }
                });
            }

            var getUserDetail = function(){
                return leEngineHttpService.doGet("/user", {}).then(function (data, status, headers, config) {
                    if (data.result == 1) {
                        userName = data.data.Details.Name;
                        accesstoken = data.data.Details.AccessToken;
                    } else{
                        leEngineHttpService.doGet("/user/logout", {}).then(function (data, status, headers, config) {
                            if (data.result == 1) {
                                window.location.reload(true);
                            }
                        });
                    }
                });
            }

            var getMirrorInfo = function(){
                return  leEngineHttpService.doGet(leEngineConfig.urls.mirror_details.replace('{imageid}',gEngineStatus.mirror.mirrorId)).then(function (data, status, headers, config) {
                    $scope.isListLoading = false;
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            mirrorPath = data.data.Details.Path;
                            $scope.mirrorPath = mirrorPath;
                            $scope.VisibilityLevel = data.data.Details.VisibilityLevel;
                        }
                    } else {
                        $scope.isListLoading = false;
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            var timer = $interval(function(){
                var array = $scope.mirrorTagList.filter(function(item){
                    return !item.Valid;
                });
                if(array.length>0){
                    $scope.isListLoading = true;
                    refreshMirrorTagList();
                }
            },5000);

            $scope.$on('$destroy', function() {
                if(timer)$interval.cancel(timer);
            });

            $q.when(getRegistryhost()).then(getMirrorInfo).then(getUserDetail).then(function(){
                $scope.loginOperation = "docker login  -u " + userName + " -p "+accesstoken+" "+registryhost;
                $scope.pullOperation = "docker pull "+registryhost+"/"+mirrorPath;
            });

            refreshMirrorTagList();
        }
    ]);
});