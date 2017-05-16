/**
 * Created by jiangfei on 2015/8/12.
 */
define(['../app.controller'], function (controllerModule) {
    controllerModule.controller('VmVpcCtrl', ['$scope', '$interval', '$modal', 'Config','Utility', 'HttpService', 'WidgetService', 'CurrentContext',
        function ($scope, $interval, $modal, Config,Utility, HttpService, WidgetService, CurrentContext) {
            $scope.tabShow='vpc';
            $scope.vpcList = [];
            $scope.subnetList = [];
            $scope.vpc = $scope.subnet = {
                currentPage: 1,
                totalItems: 0,
                pageSize: 10
            };
            $scope.operationBtn={};
            var operationArry=[];
            $scope.vpc.onPageChange = function(){
                refreshVpcList();
            }
            $scope.subnet.onPageChange = function(){
                refreshSubnetList();
            }

            $scope.openVpcCreateModal = function (size) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'VpcCreateModalTpl',
                    controller: 'VpcCreateModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        region: function () {
                            return CurrentContext.regionId;
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    if (resultData && resultData.result === 1) {
                        refreshVpcList();
                    }
                }, function () {
                });
            };
            $scope.openSubnetCreateModal = function (size) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'SubnetCreateModalTpl',
                    controller: 'SubnetCreateModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        subnetInfo: function () {
                            return {
                                region:CurrentContext.regionId,

                            };
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    if (resultData && resultData.result === 1) {
                        refreshSubnetList();
                    }
                }, function () {
                });
            };
            $scope.subnetCreateWithVpc = function () {
                var checkedVpcs = getCheckedVpc();
                if (checkedVpcs.length !== 1) {
                    WidgetService.notifyWarning('请选中一个VPC');
                    return;
                }
                openSubnetCreateWithVpcModal('500', {
                    region: checkedVpcs[0].region,
                    vpcForSubnet:{
                        vpcId: checkedVpcs[0].id,
                        name: checkedVpcs[0].name

                    }
                });
            };
            $scope.editVpc = function () {
                var checkedVpcs = getCheckedVpc();
                if (checkedVpcs.length !== 1) {
                    WidgetService.notifyWarning('请选中一个VPC');
                    return;
                }
                openVmVpcEditModal('500', {
                    region: checkedVpcs[0].region,
                    vpcId: checkedVpcs[0].id,
                    name: checkedVpcs[0].name
                });
            };
            $scope.editSubnet = function () {
                var checkedSubnets = getCheckedSubnet();
                if (checkedSubnets.length !== 1) {
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                openVmSubnetEditModal('500', {
                    region: checkedSubnets[0].region,
                    subnetId: checkedSubnets[0].id,
                    name: checkedSubnets[0].name,
                    gatewayIp:checkedSubnets[0].gatewayIp
                });
            };
            $scope.associateRouter = function(){
                var checkedSubnets=getCheckedSubnet();
                if(checkedSubnets.length !==1){
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                if(checkedSubnets[0].router !== null){
                    WidgetService.notifyWarning('当前子网已绑定路由器');
                    return;
                }
                associateRouterModal('500',{
                    region:checkedSubnets[0].region,
                    subnetId: checkedSubnets[0].id,
                    subnetName: checkedSubnets[0].name
                });
            }

            $scope.deleteVpc = function () {
                var checkedVpcs = getCheckedVpc();
                if (checkedVpcs.length !== 1) {
                    WidgetService.notifyWarning('请选中一个VPC');
                    return;
                }
                var data = {
                    region: checkedVpcs[0].region,
                    networkId: checkedVpcs[0].id
                };
                var modalInstance = WidgetService.openConfirmModal('删除VPC', '确定要删除VPC（' + checkedVpcs[0].name + '）吗？');
                modalInstance.result.then(function (resultData) {
                    if (!resultData) return resultData;
                    WidgetService.notifyInfo('删除VPC执行中...');
                    HttpService.doPost(Config.urls.vpc_delete, data).success(function (data, status, headers, config) {
                        if (data.result === 1) {
                            modalInstance.close(data);
                            WidgetService.notifySuccess('删除VPC成功');
                            refreshVpcList();
                        }
                        else {
                            WidgetService.notifyError(data.msgs[0] || '删除VPC失败');
                        }
                    });
                }, function () {
                });
            };
            $scope.deleteSubnet = function () {
                var checkedSubnets = getCheckedSubnet();
                if (checkedSubnets.length !== 1) {
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                var data = {
                    region: checkedSubnets[0].region,
                    subnetId: checkedSubnets[0].id
                };
                var modalInstance = WidgetService.openConfirmModal('删除子网', '确定要删除子网（' + checkedSubnets[0].name + '）吗？');
                modalInstance.result.then(function (resultData) {
                    if (!resultData) return resultData;
                    WidgetService.notifyInfo('删除子网执行中...');
                    checkedSubnets[0].status = 'DELETEING';
                    HttpService.doPost(Config.urls.subnet_delete, data).success(function (data, status, headers, config) {
                        if (data.result === 1) {
                            checkedSubnets[0].status = 'DELETED';
                            modalInstance.close(data);
                            WidgetService.notifySuccess('删除子网成功');
                            refreshSubnetList();
                        }
                        else {
                            WidgetService.notifyError(data.msgs[0] || '删除子网失败');
                        }
                    });
                }, function () {
                });
            };
            $scope.unbundRouter = function () {
                var checkedSubnets = getCheckedSubnet();
                if (checkedSubnets.length !== 1) {
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                if(checkedSubnets[0].router === null){
                    WidgetService.notifyWarning('当前子网未绑定路由器');
                    return;
                }
                var data = {
                    region: checkedSubnets[0].region,
                    subnetId: checkedSubnets[0].id,
                    routerId:checkedSubnets[0].router.id
                };
                var modalInstance = WidgetService.openConfirmModal('解绑路由器', '确定要对子网（' + checkedSubnets[0].name + '）路由器解绑吗？');
                modalInstance.result.then(function (resultData) {
                    if (!resultData) return resultData;
                    WidgetService.notifyInfo('解绑路由器执行中....');
                    checkedSubnets[0].status = 'UNBUNDLING';
                    HttpService.doPost(Config.urls.subnet_remove, data).success(function (data, status, headers, config) {
                        if (data.result === 1) {
                            checkedSubnets[0].status = 'UNBUNDED';
                            modalInstance.close(data);
                            WidgetService.notifySuccess('解绑路由器成功');
                            refreshSubnetList();
                        }
                        else {
                            WidgetService.notifyError(data.msgs[0] || '子网路由解绑失败');
                        }
                    });
                }, function () {
                });
            };

            $scope.isAllVpcChecked = function () {
                var unCheckedVpcs = $scope.vpcList.filter(function (vpc) {
                    return vpc.checked === false || vpc.checked === undefined;
                });
                return unCheckedVpcs.length == 0;
            };
            $scope.checkAllVpc = function () {
                if ($scope.isAllVpcChecked()) {
                    $scope.vpcList.forEach(function (vpc) {
                        vpc.checked = false;
                    });
                }
                else {
                    $scope.vpcList.forEach(function (vpc) {
                        vpc.checked = true;
                    });
                }
            };
            $scope.checkVpc = function (vpc) {
                vpc.checked = vpc.checked === true ? false : true;
            };

            $scope.isAllSubnetChecked = function () {
                var unCheckedSubnets = $scope.subnetList.filter(function (subnet) {
                    return subnet.checked === false || subnet.checked === undefined;
                });
                return unCheckedSubnets.length == 0;
            };
            $scope.checkAllSubnet = function () {
                if ($scope.isAllSubnetChecked()) {
                    $scope.subnetList.forEach(function (subnet) {
                        subnet.checked = false;
                    });
                }
                else {
                    $scope.subnetList.forEach(function (subnet) {
                        subnet.checked = true;
                    });
                }

            };
            $scope.checkSubnet = function (subnet) {
                subnet.checked = subnet.checked === true ? false : true;
            };
            $scope.switchTabToSubnet=function(){
                $scope.tabShow='subnet';
                refreshSubnetList();
                watchStateChange();
            }
            $scope.switchTabToVpc=function(){
                $scope.tabShow='vpc';
                refreshVpcList();
            };

            $scope.openSubnetAssociateVmModal = function (size) {
                var checkedSubnets=getCheckedSubnet();
                if(checkedSubnets.length !==1){
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'SubnetAssociateVmModalTpl',
                    controller: 'SubnetAssociateVmModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        subnetInfo: function () {
                            return checkedSubnets[0];
                        },
                        region:function(){
                            return CurrentContext.regionId;
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    if (resultData && resultData.result === 1) {
                        refreshSubnetList();
                    }
                }, function () {
                });
            };
            $scope.openSubnetDetachVmModal = function (size) {
                var checkedSubnets=getCheckedSubnet();
                if(checkedSubnets.length !==1){
                    WidgetService.notifyWarning('请选中一个子网');
                    return;
                }
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'SubnetDetachVmModalTpl',
                    controller: 'SubnetDetachVmModalCtrl',
                    size: size,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        subnetInfo: function () {
                            return checkedSubnets[0];
                        },
                        region:function(){
                            return CurrentContext.regionId;
                        }
                    }
                });
                modalInstance.result.then(function (resultData) {
                    if (resultData && resultData.result === 1) {
                        refreshSubnetList();
                    }
                }, function () {
                });
            };

            var refreshVpcList = function () {
                    var queryParams = {
                        region: CurrentContext.regionId,
                        name: '',
                        currentPage: $scope.vpc.currentPage,
                        recordsPerPage: $scope.vpc.pageSize
                    };
                  $scope.isListLoading=true;
                    HttpService.doGet(Config.urls.vpc_list, queryParams).then(function (data, status, headers, config) {
                        $scope.isListLoading=false;
                        $scope.vpcList = data.data.data;
                        $scope.vpc.totalItems = data.data.totalRecords;

                    });
                },
                refreshSubnetList = function () {
                    operationArry=[];
                    var queryParams = {
                        region: CurrentContext.regionId,
                        name: '',
                        currentPage: $scope.subnet.currentPage,
                        recordsPerPage: $scope.subnet.pageSize
                    };
                    $scope.isListLoading=true;
                    HttpService.doGet(Config.urls.subnet_list, queryParams).then(function (data, status, headers, config) {
                        $scope.isListLoading=false;
                        $scope.subnetList = data.data.data;
                        $scope.subnet.totalItems = data.data.totalRecords;

                    });
                },
                getCheckedVpc = function () {
                    return $scope.vpcList.filter(function (item) {
                        return item.checked === true;
                    });
                },
                getCheckedSubnet = function () {
                    return $scope.subnetList.filter(function (item) {
                        return item.checked === true;
                    });
                },
                openVmVpcEditModal = function (size, data) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'VpcEditModalTpl',
                        controller: 'VpcEditModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            vpcInfo: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (resultData) {
                        if (resultData && resultData.result === 1) {
                            refreshVpcList();
                        }
                    }, function () {
                    });
                },
                openSubnetCreateWithVpcModal = function (size,data) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'SubnetCreateWithVpcModalTpl',
                        controller: 'SubnetCreateWithVpcModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            subnetInfo: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (resultData) {
                        if (resultData && resultData.result === 1) {
                            refreshVpcList();
                        }
                    }, function () {
                    });
                },
                associateRouterModal = function (size, data) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'AssociateRouterModalTpl',
                        controller: 'AssociateRouterModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            subnetInfo: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (resultData) {
                        if (resultData && resultData.result === 1) {
                            refreshSubnetList();
                        }
                    }, function () {
                    });
                },
                openVmSubnetEditModal = function (size, data) {
                    var modalInstance = $modal.open({
                        animation: $scope.animationsEnabled,
                        templateUrl: 'SubnetEditModalTpl',
                        controller: 'SubnetEditModalCtrl',
                        size: size,
                        backdrop: 'static',
                        keyboard: false,
                        resolve: {
                            subnetInfo: function () {
                                return data;
                            }
                        }
                    });
                    modalInstance.result.then(function (resultData) {
                        if (resultData && resultData.result === 1) {
                            refreshSubnetList();
                        }
                    }, function () {
                    });
                };
                var watchStateChange=function(){
                    var productInfo={
                      'type':'subnet',
                      'state':'default',
                      'other':['router'],
                      'operations':['create','bindvm','bindrouter','unbindvm','unbindrouter','edit','delete']
                    }
                    $scope.$watch(function(){
                      return $scope.subnetList.map(function(obj) {
                        return obj.checked;
                      }).join(';');
                    },function(){
                      var operationArraycopy=Utility.setOperationBtns($scope,$scope.subnetList,productInfo,operationArry,Config);
                      var operaArraytemp=productInfo.operations;
                      for(var k in operaArraytemp){
                        $scope.operationBtn[operaArraytemp[k]]=operationArraycopy[k]
                      }
                    });
                  }
            refreshVpcList();
        }
    ]);

    controllerModule.controller('SubnetAssociateVmModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window','region', 'subnetInfo',
        function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window,region, subnetInfo) {
        $scope.associatedVmList = [];
        $scope.selectedAssociatedVm = [];

        $scope.subnetAssociateVm = {
            subnetName:subnetInfo.name,
            subnetId:subnetInfo.id,
        }

        $scope.closeModal=function(){
            $modalInstance.dismiss('cancel');
        };
        $scope.selectAssociatedVmImage = function (vm) {
            if($scope.selectedAssociatedVm.indexOf(vm) === -1){
                $scope.selectedAssociatedVm.push(vm);
            }else{
                $scope.selectedAssociatedVm.splice($scope.selectedAssociatedVm.indexOf(vm));
            }
        };
        $scope.isSelectedAssociatedVmImage = function (vm) {
            return $scope.selectedAssociatedVm.indexOf(vm)!==-1;
        };
        $scope.associateVm = function () {
            if ($scope.selectedAssociatedVm.length === 0) {
                WidgetService.notifyError('至少选择一个要添加的云主机');
                return;
            }
            var data = {
                vmIds:'',
                region:region,
                subnetId:subnetInfo.id
            };
            var vmIds = [];
            for(var i= 0,len=$scope.selectedAssociatedVm.length;i<len;i++){
                vmIds.push($scope.selectedAssociatedVm[i].id)
            }
            data.vmIds = JSON.stringify(vmIds);
            $scope.isFormSubmiting=true;
            HttpService.doPost(Config.urls.subnet_attach_vm, data).success(function (data, status, headers, config) {
                if(data.result===1){
                    $modalInstance.close({result:1});
                    WidgetService.notifySuccess(data.msgs[0]||'添加云主机成功');
                }
                else{
                    $scope.isFormSubmiting=false;
                    WidgetService.notifyError(data.msgs[0]||'添加云主机失败');
                }
            });
        };

        var initComponents = function () {
              initAssociatedVmList();
          },
          initAssociatedVmList = function () {
              HttpService.doGet(Config.urls.could_attach_subnet_list, {region:region,subnetId:subnetInfo.id}).then(function (data, status, headers, config) {
                  $scope.associatedVmList = data.data;
              });
              /*HttpService.doGet(Config.urls.vm_list.replace('{region}', CurrentContext.regionId), {name: '', currentPage:'', recordsPerPage: ''}).success(function (data, status, headers, config) {
                  $scope.associatedVmList = data.data.data;
              });*/
          };
        initComponents();
    }]);
    controllerModule.controller('SubnetDetachVmModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext', '$scope', '$modalInstance','$timeout','$window','region', 'subnetInfo',
        function (Config, HttpService,WidgetService,Utility,CurrentContext, $scope, $modalInstance,$timeout,$window,region, subnetInfo) {
        $scope.detachVmList = [];
        $scope.selectedDetachVm = [];
        $scope.subnetDetachVm = {
            subnetName:subnetInfo.name,
            subnetId:subnetInfo.id,
        }

        $scope.closeModal=function(){
            $modalInstance.dismiss('cancel');
        };
        $scope.selectDetachVm = function (vm) {
            if($scope.selectedDetachVm.indexOf(vm) === -1){
                $scope.selectedDetachVm.push(vm);
            }else{
                $scope.selectedDetachVm.splice($scope.selectedDetachVm.indexOf(vm));
            }
        };
        $scope.isSelectedDetachVmImage = function (vm) {
            return $scope.selectedDetachVm.indexOf(vm)!==-1;
        };
        $scope.detachVm = function () {
            if ($scope.selectedDetachVm.length === 0) {
                WidgetService.notifyError('至少选择一个要移除的云主机');
                return;
            }
            var data = {
                vmIds:'',
                region:region,
                subnetId:subnetInfo.id
            };
            var vmIds = [];
            for(var i= 0,len=$scope.selectedDetachVm.length;i<len;i++){
                vmIds.push($scope.selectedDetachVm[i].id)
            }
            data.vmIds = JSON.stringify(vmIds);
            $scope.isFormSubmiting=true;
            HttpService.doPost(Config.urls.subnet_detach_vm, data).success(function (data, status, headers, config) {
                if(data.result===1){
                    $modalInstance.close({result:1});
                    WidgetService.notifySuccess(data.msgs[0]||'移除云主机成功');
                }
                else{
                    $scope.isFormSubmiting=false;
                    WidgetService.notifyError(data.msgs[0]||'移除云主机失败');
                }
            });
        };

        var initComponents = function () {
                initDetachVmList();
            },
            initDetachVmList = function () {
                HttpService.doGet(Config.urls.vm_attach_subnet_list, {region:region,subnetId:subnetInfo.id}).then(function (data, status, headers, config) {
                 $scope.detachVmList = data.data;
                 });
                /*HttpService.doGet(Config.urls.vm_list.replace('{region}', CurrentContext.regionId), {name: '', currentPage:'', recordsPerPage: ''}).success(function (data, status, headers, config) {
                    $scope.detachVmList = data.data.data;
                });*/
            };
        initComponents();
    }]);
});

