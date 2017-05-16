/**
 * Created by chenxiaoxiao3 on 2016/7/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('activityCtrl', ['initData','$scope','$modal', 'leEngineConfig', 'leEngineHttpService','WidgetService','LanguageService','gEngineStatus',
        function (initData,$scope,$modal,leEngineConfig, leEngineHttpService,WidgetService,LanguageService,gEngineStatus) {
            //dev
            $scope.activityList = [];
            $scope.activityDayList = [];
            $scope.currentPage=1;
            $scope.totalItems=0;
            $scope.pageSize=10;

            var sourceId = 0;
            var sourceType = 0;
            var requestUrl = "";


            function initActivityCtrl(){
                if(initData.Type==="imagegroup"){
                    sourceType = leEngineConfig.sourceTypes.SourceTypeImageGroups;
                    sourceId = gEngineStatus.repertory.groupId;
                    // requestUrl = leEngineConfig.urls.repertory_activity_list.replace("{imagegroupid}", sourceId).replace("{pageindex}", $scope.currentPage).replace("{pagecap}", $scope.pageSize);
                    requestUrl = leEngineConfig.urls.repertory_activity_list.replace("{imagegroupid}", sourceId).replace("{pagecap}", $scope.pageSize);
                    $scope.viewActiveList = initData['Browse ImageGroup Activity List'];
                }else if(initData.Type==="image"){
                    sourceType = leEngineConfig.sourceTypes.SourceTypeImages;
                    sourceId = gEngineStatus.mirror.mirrorId;
                    // requestUrl = leEngineConfig.urls.mirror_activity_list.replace("{imageid}", sourceId).replace("{pageindex}", $scope.currentPage).replace("{pagecap}", $scope.pageSize);
                    requestUrl = leEngineConfig.urls.mirror_activity_list.replace("{imageid}", sourceId).replace("{pagecap}", $scope.pageSize);
                    $scope.viewActiveList = initData['Browse Image Activity List'];
                }else if(initData.Type==="app"){
                    sourceType = leEngineConfig.sourceTypes.SourceTypeApps;
                    sourceId = gEngineStatus.app.appId;
                    // requestUrl = leEngineConfig.urls.app_activity_list.replace("{appid}", sourceId).replace("{pageindex}", $scope.currentPage).replace("{pagecap}", $scope.pageSize);
                    requestUrl = leEngineConfig.urls.app_activity_list.replace("{appid}", sourceId).replace("{pagecap}", $scope.pageSize);
                    $scope.viewActiveList = initData['Browse App Activity List'];
                }else if(initData.Type==="ci"){
                    sourceType = leEngineConfig.sourceTypes.SourceTypeCis;
                    sourceId = gEngineStatus.mirror.mirrorId;
                    // requestUrl = leEngineConfig.urls.ci_activity_list.replace("{ciid}", sourceId).replace("{pageindex}", $scope.currentPage).replace("{pagecap}", $scope.pageSize);
                    requestUrl = leEngineConfig.urls.ci_activity_list.replace("{ciid}", sourceId).replace("{pagecap}", $scope.pageSize);
                    $scope.viewActiveList = initData['Browse CI Activity List'];
                }else{}
            }

            function getActivityDayList(){
                $scope.activityDayList = [];
                var newArray = $scope.activityList.map(function(item){
                    return (new Date(item.CreatedAt)).toDateString();
                });
                newArray = unique(newArray);
                newArray.forEach(function(itemDay){
                    var array = $scope.activityList.filter(function(itemActivity){
                        return itemDay === (new Date(itemActivity.CreatedAt)).toDateString();
                    });
                    $scope.activityDayList.push(array);
                });
            }

            function unique(array){
                if(!array || array.length<=0)return [];
                var reArr=[];
                reArr[0]=array[0];
                for(var i=1;i<array.length;i++){
                    if(array.indexOf(array[i])==i){
                        reArr.push(array[i]);
                    }
                }
                return reArr;
            }

            function refreshActivityList() {
                $scope.isListLoading = true;
                if(sourceId && sourceId != "-1"){
                    leEngineHttpService.doGet(requestUrl.replace("{pageindex}", $scope.currentPage)).then(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            $scope.isListLoading = false;
                            if (data.data.Details) {
                                $scope.activityList = $scope.activityList.concat(data.data.Details.Data);
                                $scope.currentPage++;
                                $scope.totalItems = data.data.Details.Total;
                                getActivityDayList();
                            }
                        } else {
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                 }else{
                     WidgetService.notifyWarning(LanguageService.activityListPage.errorInfo);
                 }

            };

            $scope.scrollCallBack = function(){
                if($scope.isListLoading || $scope.activityList.length >= $scope.totalItems)return;
                refreshActivityList();
            }

            $scope.formatObjStr = function(str){
                var jsonStr = (new Function("return " + str))();
                return JSON.stringify(jsonStr, undefined, 4);
            }

            $scope.showDetails = function(obj){
                var formData = {
                    "title":LanguageService.staticInformationPage.activityTitle,
                    "Data":obj
                };
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/static-information.html',
                    controller:  'staticInformation',
                    size: 'large',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return formData;
                        }
                    }
                });
                modalInstance.result.then(function () {});
            };

            $scope.getActivityType= function(str){
                str = str.toLowerCase();
                if(str.indexOf("create")!=-1){
                    return "create";
                }else if(str.indexOf("edit")!=-1){
                    return "edit";
                }else if(str.indexOf("delete")!=-1 || str.indexOf("leave")!=-1){
                    return "delete";
                }else{
                    return "create";
                }
            };

            initActivityCtrl();
            refreshActivityList();
        }
    ]);
});