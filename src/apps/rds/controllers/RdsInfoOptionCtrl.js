/**
 * Created by dongwanlong on 2016/4/20.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('RdsInfoOptionCtrl', ['Config','rdsConfig','WidgetService','$modal','$filter', 'gRdsStatus','$scope','$modalInstance','transData', 'HttpService', 'LanguageService',function (Config, rdsConfig, WidgetService, $modal, $filter, gRdsStatus, $scope, $modalInstance, transData, HttpService,LanguageService) {


        $scope.ipList = [];
        $scope.usedIpList = [];
        $scope.dbUsername = transData.username;
        $scope.dbName = gRdsStatus.rdsInfo.rdsName;
        $scope.handleType = transData.handleType;
        $scope.handleId = transData.handleId;
        $scope.remark = !transData.descn?"":transData.descn;

        $scope.max_queries  = "";
        $scope.newPassword = "";
        $scope.confirmPassword = "";
        $scope.REGEX = angular.extend({}, Config.REGEX, rdsConfig.REGEX);

        $scope.clickIpItem = function(item){
            item.checked = !item.checked;
        }

        $scope.ipMove = function(option){

            if(option=="add"){
                var lateIpList = [];
                var addIpList = [];
                angular.forEach($scope.ipList, function(item, index) {
                    if (item.checked) {
                        item.checked = false;
                        addIpList.push(item);
                    }else{
                        lateIpList.push(item);
                    }
                });
                $scope.ipList = lateIpList;
                $scope.usedIpList = $scope.usedIpList.concat(addIpList);
            }
            if(option=="remove"){
                var lateIpList = [];
                var addIpList = [];
                angular.forEach($scope.usedIpList, function(item, index) {
                    if (item.checked) {
                        addIpList.push(item);
                    }else{
                        lateIpList.push(item);
                    }
                });
                $scope.usedIpList = lateIpList;
                $scope.ipList = $scope.ipList.concat(addIpList);
            }
        }

        $scope.setAllWrite = function(){
            var type = getAllType();

            if(type==-1){
                type = 3;
            }else{
                type++;
                type = type>3?1:type;
            }

            setAllType(type);
        }

        var setAllType = function(type){
            angular.forEach($scope.usedIpList, function(item, index) {
                item.type = type;
            });
        }

        var getAllType = function(){
            if($scope.usedIpList.length<=0){return -1;}
            var tmp = $scope.usedIpList[0].type;
            angular.forEach($scope.usedIpList, function(item, index) {
                if(tmp!=item.type){
                    tmp = -1;
                    return true;
                }
            });
            return tmp;
        }

        var getIpsStr = function(){
            var ips = "";
            angular.forEach($scope.usedIpList, function(item, index) {
                ips += item.addr + ",";
            });
            return ips;
        };

        var getTypesStr = function(){
            var types = "";
            angular.forEach($scope.usedIpList, function(item, index) {
                types += item.type + ",";
            });
            return types;
        };

        $scope.submit = function(){

            if($scope.usedIpList.length==0){
                WidgetService.notifyError(LanguageService.RdsInfoOptionPage.unSelectIpTip);
                return;
            }

            if($scope.handleType==0){

                var dataModify = {
                    "dbId" : gRdsStatus.rdsInfo.rdsId,
                    "username":$scope.dbUsername,
                    "maxConcurrency":$scope.max_queries,
                    "readWriterRate":"2:1",
                    "ips":getIpsStr(),
                    "types":getTypesStr()
                };

                $scope.isFormSubmiting = true;
                HttpService.doPost(rdsConfig.urls.rdsinfo_user_modify.replace('{username}',$scope.username), dataModify).success(function (data, status, headers, config) {
                    $scope.isFormSubmiting = false;
                    $modalInstance.close(data);
                });
            }else{

                var userNameList = transData.userList.filter(function(item){
                    return item.username==$scope.dbUsername;
                });

                if(userNameList.length>0){
                    WidgetService.notifyError(LanguageService.RdsInfoOptionPage.userExistTip);
                    return;
                }

                var dataCreate = {
                    "dbId" : gRdsStatus.rdsInfo.rdsId,
                    "username":$scope.dbUsername,
                    "readWriterRate":"2:1",
                    "maxConcurrency":$scope.max_queries,
                    "password":$scope.newPassword,
                    "descn": $filter('gReconvertFilter')($scope.remark),
                    "ips":getIpsStr(),
                    "types":getTypesStr()
                }
                $scope.isFormSubmiting = true;
                HttpService.doPost(rdsConfig.urls.rdsinfo_user_create, dataCreate).success(function (data, status, headers, config) {
                    $scope.isFormSubmiting = false;
                    $modalInstance.close(data);
                });
            }

        }

        var username = "null"
        if($scope.handleType==0){
            username = transData.username;
            $scope.max_queries = transData.maxConcurrency;
        }

        var refreshIpList = function() {
            HttpService.doGet(rdsConfig.urls.rdsinfo_user_ip.replace('{dbId}',gRdsStatus.rdsInfo.rdsId).replace('{username}',username)).then(function (data, status, headers, config) {
                angular.copy($filter('filter')(data.data,{used:0}),$scope.ipList);
                angular.copy($filter('filter')(data.data,{used:1}),$scope.usedIpList);
                angular.forEach($scope.ipList, function(item, index) {
                    item.type = 3;
                });
            });
        }

        $scope.closeModal = function() {
            $modalInstance.dismiss('cancel');
        }

        $scope.openIpAlert = function(size, type, ip){
            if(type=="add"){
                openIpAlertModal(size, type, ip);
            }else{
                if($scope.ipList.length<=1){
                    WidgetService.notifySuccess(LanguageService.RdsInfoOptionPage.nullIpTip);
                    return;
                }

                var formData = {
                    dbId:gRdsStatus.rdsInfo.rdsId,
                    ip:ip
                };

                HttpService.doPost(rdsConfig.urls.rdsinfo_user_ip_check,formData).success(function (data, status, headers, config) {
                    if (data.data) {
                        WidgetService.notifySuccess(LanguageService.RdsInfoOptionPage.usingIpTip);
                    }
                    else {
                        openIpAlertModal(size, type, ip);
                    }
                });

            }
        }

        function openIpAlertModal(size, type, ip){
            var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: '/apps/rds/templates/rdsinfo-ipalert.html',
                controller: 'RdsInfoIpAlertCtrl',
                size: size,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    transData: function () {
                        return {
                            type:type,
                            ip:ip
                        };
                    }
                }
            });

            modalInstance.result.then(function (resultData) {
                if(resultData && resultData.result===1){

                    if(resultData.handleType=='add'){
                        if(isExistIpDbList(resultData.handleIp)){
                            WidgetService.notifyError(LanguageService.RdsInfoOptionPage.ipExistTip);
                            return;
                        }
                        addGlobalIp(resultData.handleIp);
                    }else{
                        deleteGlobalIp(resultData.handleIp);
                    }

                }
            }, function () {
            });
        }

        //删除白名单IP
        function deleteGlobalIp(handleIp){
            var data = {
                dbId:gRdsStatus.rdsInfo.rdsId,
                ips:getUpdataIpList('remove', handleIp)
            };
            HttpService.doPost(rdsConfig.urls.rdsinfo_user_ip_modify, data).success(function (data, status, headers, config) {
                if (data.result === 1) {
                    $scope.ipList = $scope.ipList.filter(function(item){
                        return item.addr != handleIp;
                    });
                    WidgetService.notifySuccess(LanguageService.RdsInfoOptionPage.ipDeleteSuccessTip);
                }
                else {
                    WidgetService.notifyError(LanguageService.RdsInfoOptionPage.ipDeleteFaildTip);
                }
            });
        }

        //增加白名单IP
        function addGlobalIp(handleIp){
            var data = {
                dbId:gRdsStatus.rdsInfo.rdsId,
                ips:getUpdataIpList('add', handleIp)
            };

            HttpService.doPost(rdsConfig.urls.rdsinfo_user_ip_modify, data).success(function (data, status, headers, config) {
                if (data.result === 1) {
                    $scope.ipList.push({
                        checked:false,
                        type:3,
                        used:0,
                        addr:handleIp
                    });

                    WidgetService.notifySuccess(LanguageService.RdsInfoOptionPage.ipAddSuccessTip);
                } else {
                    WidgetService.notifyError(LanguageService.RdsInfoOptionPage.ipAddFaildTip);
                }
            });
        }

        var isExistIpDbList = function (newIp) {

            var ipAddrList = $scope.ipList.filter(function(item){
                return item.addr==newIp;
            });
            var usedIpAddrList = $scope.usedIpList.filter(function(item){
                return item.addr==newIp;
            });

            if(ipAddrList.length>0 || usedIpAddrList.length>0)return true;
            return false;
        }

        var getUpdataIpList = function(handleType,handleTypeIp){
            var updateIpList = [];
            angular.forEach($scope.ipList, function(item, index) {
                updateIpList.push(item.addr);
            });
            angular.forEach($scope.usedIpList, function(item, index) {
                updateIpList.push(item.addr);
            });
            if(handleType=='add'){
                updateIpList.push(handleTypeIp);
            }else{
                angular.forEach(updateIpList, function(item, index) {
                    if(handleTypeIp==item){
                        updateIpList.splice(index,1);
                        return updateIpList.join(',');
                    }
                });
            }
            return updateIpList.join(',');
        }

        refreshIpList();
    }]);

});