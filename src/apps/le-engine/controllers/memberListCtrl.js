/**
 * Created by chenxiaoxiao3 on 2016/7/21.
 */
define(['./app.controller'], function (controllerModule) {
    controllerModule.controller('memberListCtrl', ['initData','$window','$q','$scope','$location','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','WidgetService','CurrentContext','LanguageService','gEngineStatus',
        function (initData,$window,$q,$scope,$location,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce,leEngineConfig, leEngineHttpService,WidgetService,CurrentContext,LanguageService,gEngineStatus) {
            $scope.memberList=[];
            $scope.exitMembersPermissions = true;
            $scope.loading = true;
            var memberList = [];
            var sourceType;
            var contentType = {headers:{'Content-Type':'application/json'}};
            var sourceId;
            var type = gEngineStatus.mirror.title;
            $scope.userId = -1;

            if(initData.Type == "imagegroup"){
                sourceType = leEngineConfig.sourceTypes.SourceTypeImageGroups;
                sourceId = gEngineStatus.repertory.groupId;
                $scope.addMemberPermissions = initData['Add Member Into ImageGroup'];
                $scope.deleteMemberPermissions = initData['Delete Member From ImageGroup'];
                $scope.editMemberPermissions = initData['Set Member Permission For ImageGroup'];
                $scope.viewMembersPermissions = initData['Browse ImageGroup Member List'];
                var urlList = leEngineConfig.urls.imagegroup_member_list.replace('{imagegroupid}', sourceId);
                var urlEdit = leEngineConfig.urls.imagegroup_member_auth_edit.replace("{imagegroupid}",sourceId);
                var urlLeave = leEngineConfig.urls.imagegroup_member_leave.replace("{imagegroupid}",sourceId);
            }else if(initData.Type == "image"){
                sourceType = leEngineConfig.sourceTypes.SourceTypeImages;
                sourceId = gEngineStatus.mirror.mirrorId;
                $scope.addMemberPermissions = initData['Add Member Into Image'];
                $scope.deleteMemberPermissions = initData['Delete Member From Image'];
                $scope.editMemberPermissions = initData['Set Member Permission For Image'];
                $scope.viewMembersPermissions = initData['Browse Image Member List'];
                var urlList = leEngineConfig.urls.image_member_list.replace('{imageid}', sourceId);
                var urlEdit = leEngineConfig.urls.image_member_auth_edit.replace("{imageid}",sourceId);
                var urlLeave = leEngineConfig.urls.image_member_leave.replace("{imageid}",sourceId);
            }else if(initData.Type == "app"){
                sourceType = leEngineConfig.sourceTypes.SourceTypeApps;
                sourceId = gEngineStatus.app.appId;
                $scope.addMemberPermissions = initData['Add Member Into App'];
                $scope.deleteMemberPermissions = initData['Delete Member From App'];
                $scope.editMemberPermissions = initData['Set Member Permission For App'];
                $scope.viewMembersPermissions = initData['Browse App Member List'];
                var urlList = leEngineConfig.urls.app_member_list.replace('{appid}', sourceId);
                var urlEdit = leEngineConfig.urls.app_member_auth_edit.replace("{appid}",sourceId);
                var urlLeave = leEngineConfig.urls.app_member_leave.replace("{appid}",sourceId);
            }else if(initData.Type == "ci"){
                sourceType = leEngineConfig.sourceTypes.SourceTypeCis;
                sourceId = gEngineStatus.mirror.mirrorId;
                $scope.addMemberPermissions = initData['Add Member Into CI'];
                $scope.deleteMemberPermissions = initData['Delete Member From CI'];
                $scope.editMemberPermissions = initData['Set Member Permission For CI'];
                $scope.viewMembersPermissions = initData['Browse CI Member List'];
                var urlList = leEngineConfig.urls.ci_member_list.replace('{ciid}', sourceId);
                var urlEdit = leEngineConfig.urls.ci_member_auth_edit.replace("{ciid}",sourceId);
                var urlLeave = leEngineConfig.urls.ci_member_leave.replace("{ciid}",sourceId);
            }else{}

            //获取数据
            var refreshMemberList = function () {
                $scope.isListLoading = true;
                return leEngineHttpService.doGet(urlList).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading = false;
                        if (data.data.Details) {
                            $scope.memberList = data.data.Details;
                            $scope.totalItems = data.data.Details.length;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            //获取用户信息
            var getUserDetail = function(){
                return leEngineHttpService.doGet("/user", {}).then(function (data, status, headers, config) {
                    if (data.result == 1) {
                        $scope.userId = data.data.Details.Id;
                    }
                });
            }

            //获取选择的成员对象
            $scope.isAllMemberChecked = function () {
                var unCheckedRepertoryMembers = $scope.memberList.filter(function (Member) {
                    return Member.checked === false || Member.checked === undefined;
                });
                return unCheckedRepertoryMembers.length == 0;
            };

            $scope.checkAllMember = function () {
                if ($scope.isAllRepertoryMemberChecked()) {
                    $scope.memberList.forEach(function (member) {
                        member.checked = false;
                    });
                }
                else {
                    $scope.memberList.forEach(function (member) {
                        member.checked = true;
                    });
                }
            };

            $scope.checkMember= function (Member) {
                Member.checked = Member.checked === true ? false : true;
            };

            var getCheckedMember = function(){
                var checkedRepertoryMemberList=[];
                $scope.memberList.filter(function(item){
                    if(item.checked){
                        checkedRepertoryMemberList.push(item);
                    };
                });
                return checkedRepertoryMemberList;
            };

            //打开创建成员对话框
            function openMember(size,data){
                data.sourceId = sourceId;
                data.sourceType = sourceType;
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/create-member-modal.html',
                    controller: 'createMemberModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return data;
                        }
                    }
                });

                modalInstance.result.then(function (resultData) {
                    refreshMemberList();
                }, function () {
                });
            };

            //载入创建成员对话框数据
            $scope.openMemberCreateModal = function(size){
                var name = gEngineStatus.mirror.username;
                leEngineHttpService.doGet(leEngineConfig.urls.users_list).then(function(data, status, headers, config){
                    if (data.data.Code === 200) {
                        openMember(size, data.data.Details);
                    }else{
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            };

            //修改成员权限
            $scope.editMember = function(size,member){
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: '/apps/le-engine/template/edit-member-modal.html',
                        controller: 'editMemberModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            transData: function () {
                                return member;
                            }
                        }
                    });

                    modalInstance.result.then(function (resultData) {
                        var data = {
                            "AccessLevel":resultData,
                            "UserId":member.UserId
                        };

                        leEngineHttpService.doPut(urlEdit,data,contentType).success(function(data,status,headers,config){
                            if (data.data.Code != 200) {
                                WidgetService.notifyWarning(data.data.Message);
                            }else{
                                refreshMemberList();
                            }
                        });
                    }, function () {
                    });
            };

            //删除成员对象
            $scope.deleteMember = function(size,member){
                var confirmMessage = LanguageService.deleteMemberModalPage.deleteMessage;
                var confirmTitle = LanguageService.deleteMemberModalPage.memberDelete;
                if (member.UserName) {
                    confirmTitle = confirmTitle;
                    confirmMessage = confirmMessage + member.UserName + "?";
                }
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/confirm-modal.html',
                    controller: 'ConfirmModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                "title":confirmTitle,
                                "message":confirmMessage
                            };
                        }
                    }
                });

                modalInstance.result.then(function () {
                    var requestUrl = '';
                    if (sourceType == leEngineConfig.sourceTypes.SourceTypeImageGroups) {
                        requestUrl = leEngineConfig.urls.imagegroup_member_delete.replace("{imagegroupid}",sourceId).replace("{userid}",member.UserId);
                    } else if (sourceType == leEngineConfig.sourceTypes.SourceTypeImages) {
                        requestUrl = leEngineConfig.urls.image_member_delete.replace("{imageid}",sourceId).replace("{userid}",member.UserId);
                    } else if (sourceType == leEngineConfig.sourceTypes.SourceTypeApps) {
                        requestUrl = leEngineConfig.urls.app_member_delete.replace("{appid}",sourceId).replace("{userid}",member.UserId);
                    }else if(sourceType == leEngineConfig.sourceTypes.SourceTypeCis){
                        requestUrl = leEngineConfig.urls.ci_member_delete.replace("{ciid}",sourceId).replace("{userid}",member.UserId);
                    }else{}
                    leEngineHttpService.doDelete(requestUrl,{},contentType).then(function (data, status, headers, config) {
                        if (data.data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.data.Message);
                        }else{
                            refreshMemberList();
                        }
                    });
                }, function () {
                });
            };

            //成员退出
            $scope.logoutMember = function(size){
                var confirmMessage = LanguageService.logoutMemberModalPage.logoutMessage;
                var confirmTitle = LanguageService.logoutMemberModalPage.memberLogout;

                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/le-engine/template/confirm-modal.html',
                    controller: 'ConfirmModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        transData: function () {
                            return {
                                "title":confirmTitle,
                                "message":confirmMessage
                            };
                        }
                    }
                });

                modalInstance.result.then(function (){
                    var formdata={};
                    leEngineHttpService.doPost(urlLeave,formdata,contentType).success(function (data, status, headers, config) {
                        if (data.data.Code != 200) {
                            WidgetService.notifyWarning(data.data.Message);

                        } else {
                            $location.path('/main-repertory-list-all');
                        }
                    });
                }, function () {
                });

            };

            $q.when(getUserDetail()).then(refreshMemberList).then(function(){
                $scope.loading = false;
                var memberArray = $scope.memberList.filter(function(item){
                        return item.UserId===$scope.userId;
                });
                if(memberArray.length>0 && memberArray[0].AccessLevel===0){
                    $scope.exitMembersPermissions = false;
                }
            });
        }
    ]);
})
