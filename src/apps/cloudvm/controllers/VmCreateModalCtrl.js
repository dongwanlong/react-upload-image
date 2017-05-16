/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('VmCreateModalCtrl', ['Config', 'HttpService', 'WidgetService', 'Utility', 'CurrentContext', 'ModelService', '$scope', '$modalInstance', '$timeout', '$window', '$sce', '$httpParamSerializerJQLike', '$modal', 'region', 'vmSnapshot',
        function (Config, HttpService, WidgetService, Utility, CurrentContext, ModelService, $scope, $modalInstance, $timeout, $window, $sce, $httpParamSerializerJQLike, $modal, region, vmSnapshot) {

            $scope.isCalculatingPrice = true;
            $scope.isDesignatedVmSnapshot = vmSnapshot ? true : false;
            $scope.activeFlow = 1;
            $scope.vmName = '';
            $scope.imageActiveTab = $scope.isDesignatedVmSnapshot ? 'snapshot' : 'image';
            $scope.vmImageList = [];
            $scope.selectedVmImage = null;
            $scope.vmSnapshotList = [];
            $scope.selectedVmSnapshot = null;
            $scope.vmCpuList = [];
            $scope.selectedVmCpu = null;
            $scope.vmRamList = [];
            $scope.selectedVmRam = null;
            $scope.vmDiskTypeList = [];
            $scope.selectedVmDiskType = null;
            $scope.dataDiskVolume = 10;
            $scope.vmNetworkType = 'primary';
            $scope.vmNetworkPublicIpModel = 'now';
            $scope.networkBandWidth = 2;
            $scope.vmNetworkSubnetList = [];
            $scope.vmNetworkSubnetSelectorData = [];
            $scope.selectedVmNetworkSubnet = null;
            $scope.vmSecurityType = 'keypair';
            $scope.vmSecurityKeypairList = [];
            $scope.vmSecurityKeypairSelectorData = [];
            $scope.selectedVmSecurityKeypair = null;
            $scope.vmSecurityPassword = {value: ''};
            $scope.allVmBuyPeriods = Config.allBuyPeriods;
            $scope.vmBuyPeriod = $scope.allVmBuyPeriods[0];
            $scope.vmCount = 1;
            $scope.vmTotalPrice = '';

            $scope.firstStepToNextTab = function (event) {
                event.preventDefault();
                if (!$scope.vm_create_form.vm_name.$valid) {
                    return;
                }
                if ($scope.imageActiveTab === 'snapshot' && !$scope.vmSnapshotList.length) {
                    WidgetService.notifyWarning('你还没有快照，请去创建或者选择系统镜像。');
                    return;
                }
                $scope.activeFlow = 2;
                $scope.hackRzSlider();
            };

            $scope.thirdStepToNextTab = function (event) {
                event.preventDefault();
                if ($scope.vmNetworkType == 'private' && !$scope.vmNetworkSubnetList.length) {
                    WidgetService.notifyWarning('你还没有子网，请去私有网络中创建。');
                    return;
                }
                $scope.activeFlow = 4;
                $scope.hackRzSlider();
            };

            $scope.closeModal = function () {
                $modalInstance.dismiss('cancel');
            };
            $scope.hackRzSlider = Utility.getRzSliderHack($scope);
            $scope.selectVmImage = function (vmImage) {
                $scope.selectedVmImage = vmImage;
            };
            $scope.isSelectedVmImage = function (vmImage) {
                return $scope.selectedVmImage === vmImage;
            };
            $scope.selectVmSnapshot = function (vmImage) {
                $scope.selectedVmSnapshot = vmImage;
            };
            $scope.isSelectedVmSnapshot = function (vmImage) {
                return $scope.selectedVmSnapshot === vmImage;
            };
            $scope.selectVmCpu = function (vmCpu) {
                $scope.selectedVmCpu = vmCpu;
            };
            $scope.isSelectedVmCpu = function (vmCpu) {
                return $scope.selectedVmCpu === vmCpu;
            };
            $scope.selectVmRam = function (vmRam) {
                $scope.selectedVmRam = vmRam;
            };
            $scope.isSelectedVmRam = function (vmRam) {
                return $scope.selectedVmRam === vmRam;
            };
            $scope.selectVmDiskType = function (vmDiskType) {
                if (vmDiskType.enable) {
                    $scope.selectedVmDiskType = vmDiskType;
                }
            };
            $scope.isSelectedVmDiskType = function (vmDiskType) {
                return $scope.selectedVmDiskType === vmDiskType;
            };
            $scope.selectVmBuyPeriod = function (vmBuyPeriod) {
                $scope.vmBuyPeriod = vmBuyPeriod;
            };
            $scope.isSelectedVmBuyPeriod = function (vmBuyPeriod) {
                return $scope.vmBuyPeriod === vmBuyPeriod;
            };
            $scope.createVm = function () {
                var data = {
                    region: region,
                    name: $scope.vmName,
                    imageId: $scope.imageActiveTab === 'image' ? $scope.selectedVmImage.id : '',
                    flavorId: selectedVmFlavor.id,
                    volumeTypeId: $scope.selectedVmDiskType.id,
                    volumeSize: $scope.dataDiskVolume,
                    bindFloatingIp: $scope.vmNetworkPublicIpModel === 'now',
                    sharedNetworkId: $scope.vmNetworkType == 'primary' ? selectedVmSharedNetwork.id : '',
                    bandWidth: $scope.networkBandWidth,
                    adminPass: $scope.vmSecurityType == 'password' ? $scope.vmSecurityPassword.value : '',
                    keyPairName: $scope.vmSecurityType == 'keypair' ? $scope.selectedVmSecurityKeypair.value : '',
                    count: $scope.vmCount,
                    privateSubnetId: $scope.vmNetworkType == 'private' ? $scope.selectedVmNetworkSubnet.value : '',//privateSubnetId和sharedNetworkId是否为空来标识选择的基础网络还是私有网络
                    snapshotId: $scope.imageActiveTab === 'snapshot' ? $scope.selectedVmSnapshot.id : '',
                    order_time: $scope.vmBuyPeriod.toString(),
                };
                $scope.isFormSubmiting = true;
                HttpService.doPost(Config.urls.vm_buy, {
                    paramsData: JSON.stringify(data),
                    displayData: buildDisplayData()
                }).success(function (data, status, headers, config) {
                    if (data.result === 1) {
                        $modalInstance.close(data);
                        $window.location.href = '/payment/' + data.data + '/2';
                    }
                    else {
                        WidgetService.notifyError(data.msgs[0] || '创建云主机失败');
                        $scope.isFormSubmiting = false;
                    }
                });
            };
            $scope.openVmKeypairCreateModal = function (size) {
                var modalInstance = $modal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: '/apps/cloudvm/templates/vm-keypair-create-modal.html',
                    controller: 'VmKeypairCreateModalCtrl',
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
                    if (resultData) {
                        $scope.keypairDownloadUrl = $sce.trustAsResourceUrl(Config.urls.keypair_create + '?' + $httpParamSerializerJQLike(resultData));
                        $timeout(function () {
                            WidgetService.notifySuccess('创建密钥成功');
                            initVmSecurityKeypairSelector();
                        }, 2000);
                    }
                }, function () {
                });
            };

            $scope.$watch('selectedVmCpu', function (value) {
                if (value != null) {
                    initVmRamSelector();
                }
            });
            $scope.$watch(function () {
                return [$scope.selectedVmCpu, $scope.selectedVmRam].join('_');
            }, function (value) {
                if ($scope.selectedVmCpu !==null &&  $scope.selectedVmRam !==null) {
                    setSelectedVmFlavor();
                }
            });

            $scope.$watch(function () {
                return [$scope.vmNetworkType, $scope.vmNetworkPublicIpModel].join('_');
            }, function () {
                if ($scope.vmNetworkType == 'primary' && $scope.vmNetworkPublicIpModel == 'now') {
                    $scope.networkBandWidth = 2;
                }
                else {
                    $scope.networkBandWidth = 0;
                }
            });

            $scope.$watch(function () {
                return [$scope.selectedVmCpu,
                    $scope.selectedVmRam,
                    ($scope.selectedVmDiskType && $scope.selectedVmDiskType.name) || '',
                    $scope.dataDiskVolume,
                    ($scope.vmNetworkType == 'primary' && $scope.vmNetworkPublicIpModel == 'now') ? $scope.networkBandWidth : 0,
                    $scope.vmCount,
                    $scope.vmBuyPeriod].join('_');
            }, function (value) {
                if ($scope.selectedVmCpu && $scope.selectedVmRam && $scope.selectedVmDiskType) {
                    setVmPrice();
                }
            });

            var flavorGroupData = null,
                selectedVmFlavor = null,
                selectedVmSharedNetwork = null,
                calculatePriceData = null;
            var initComponents = function () {
                    initVmImageSelector();
                    initVmSnapshotSelector();
                    initVmCpuSelector();
                    initVmDiskTypeSelector();
                    setSelectedVmSharedNetworkId();
                    initVmNetworkSubnetSelector();
                    initVmSecurityKeypairSelector();
                },
                initVmImageSelector = function () {
                    if ($scope.isDesignatedVmSnapshot) return;
                    HttpService.doGet(Config.urls.image_list, {
                        region: region,
                        name: '',
                        currentPage: '',
                        recordsPerPage: ''
                    }).then(function (data, status, headers, config) {
                        $scope.vmImageList = data.data.data;
                        $scope.selectedVmImage = $scope.vmImageList[0];
                    });
                },
                initVmSnapshotSelector = function () {
                    if ($scope.isDesignatedVmSnapshot) {
                        $scope.vmSnapshotList.push(vmSnapshot);
                        $scope.selectedVmSnapshot = $scope.vmSnapshotList[0];
                    }
                    else {
                        HttpService.doGet(Config.urls.snapshot_vm_list, {
                            region: region,
                            name: '',
                            currentPage: '',
                            recordsPerPage: ''
                        }).then(function (data, status, headers, config) {
                            $scope.vmSnapshotList = data.data.data;
                            $scope.selectedVmSnapshot = $scope.vmSnapshotList[0];
                        });
                    }
                },
                initVmNetworkSubnetSelector = function () {
                    HttpService.doGet(Config.urls.subnet_list, {
                        region: region,
                        name: '',
                        currentPage: '',
                        recordsPerPage: ''
                    }).then(function (data, status, headers, config) {
                        $scope.vmNetworkSubnetList = data.data.data;
                        $scope.vmNetworkSubnetSelectorData = $scope.vmNetworkSubnetList.map(function (subnet) {
                            return new ModelService.SelectModel(subnet.name + '(' + subnet.network.name + ')', subnet.id);
                        });
                        $scope.selectedVmNetworkSubnet = $scope.vmNetworkSubnetSelectorData[0];
                    });
                },
                initVmSecurityKeypairSelector = function () {
                    HttpService.doGet(Config.urls.keypair_list, {
                        region: region,
                        name: '',
                        currentPage: '',
                        recordsPerPage: ''
                    }).then(function (data, status, headers, config) {
                        if (data.data.data && data.data.data.length) {
                            $scope.vmSecurityKeypairList = data.data.data;
                            $scope.vmSecurityKeypairSelectorData.push(new ModelService.SelectModel('请选择密钥', ''));
                            $scope.vmSecurityKeypairList.forEach(function (subnet) {
                                $scope.vmSecurityKeypairSelectorData.push(new ModelService.SelectModel(subnet.name, subnet.name));
                            });
                            $scope.selectedVmSecurityKeypair = $scope.vmSecurityKeypairSelectorData[0];
                        }
                    });
                },
                initVmCpuSelector = function () {
                    HttpService.doGet(Config.urls.flavor_group_data.replace('{region}', region)).then(function (data, status, headers, config) {
                        flavorGroupData = data.data;
                        for (var cpu in flavorGroupData) {
                            $scope.vmCpuList.push(cpu);
                            $scope.vmCpuList.sort(function (a, b) {
                                return Number(a) - Number(b);
                            });
                        }
                        $scope.selectedVmCpu = $scope.vmCpuList[0];
                    });
                },
                initVmRamSelector = function () {
                    $scope.vmRamList.splice(0, $scope.vmRamList.length);
                    for (var ram in flavorGroupData[$scope.selectedVmCpu]) {
                        $scope.vmRamList.push(ram);
                        $scope.vmRamList.sort(function (a, b) {
                            return Number(a) - Number(b);
                        });
                    }
                    $scope.selectedVmRam = $scope.vmRamList[0];
                },
                setSelectedVmFlavor = function () {
                    for (var disk in flavorGroupData[$scope.selectedVmCpu][$scope.selectedVmRam]) {//跟运维规定系统盘都为40G，cpu,ram可唯一确定flavor,默认选择第一个硬盘，
                        selectedVmFlavor = flavorGroupData[$scope.selectedVmCpu][$scope.selectedVmRam][disk];
                        break;
                    }
                },
                initVmDiskTypeSelector = function () {
                    HttpService.doGet(Config.urls.vm_disk_type, {region: region}).then(function (data, status, headers, config) {
                        $scope.vmDiskTypeList = data.data;
                        $scope.selectedVmDiskType = $scope.vmDiskTypeList[0];
                    });
                },
                setSelectedVmSharedNetworkId = function () {
                    HttpService.doGet(Config.urls.vm_network_shared_list, {region: region}).then(function (data, status, headers, config) {
                        selectedVmSharedNetwork = data.data[0];
                    });
                },
                setVmPrice = function () {
                    var data = {
                        region: region,
                        order_time: $scope.vmBuyPeriod.toString(),
                        order_num: $scope.vmCount.toString(),
                        os_broadband: $scope.vmNetworkType == 'primary' && $scope.vmNetworkPublicIpModel == 'now' ? $scope.networkBandWidth.toString() : '0',
                        volumeType: $scope.selectedVmDiskType.name,
                        volumeSize: $scope.dataDiskVolume.toString(),
                        cpu_ram: $scope.selectedVmCpu + '_' + $scope.selectedVmRam,
                    };
                    calculatePriceData = data;
                    $scope.isCalculatingPrice = true;
                    HttpService.doPost(Config.urls.vm_calculate_price, data).success(function (data, status, headers, config) {
                        $scope.isCalculatingPrice = false;
                        if (data.result === 1) {
                            $scope.vmTotalPrice = data.data;
                        }
                        else {
                            WidgetService.notifyError(data.msgs[0] || '计算价格失败');
                        }
                    });
                },
                buildDisplayData = function () {
                    var part1 = [],
                        part2 = [],
                        part3 = [];
                    part1.push('配置/:' + selectedVmFlavor.vcpus + '核, ' + selectedVmFlavor.ram / 1024 + 'G内存');
                    if ($scope.imageActiveTab === 'snapshot') {
                        part1.push('快照/:' + $scope.selectedVmSnapshot.name);
                    }
                    else {
                        part1.push('镜像/:' + $scope.selectedVmImage.name);
                    }
                    part1.push('地域/:' + CurrentContext.allRegionData.filter(function (regionData) {
                            return regionData.id == region;
                        })[0].name);
                    part1.push('网络类型/:' + ($scope.vmNetworkType == 'primary' ? '基础网络' : '私有网络'));
                    part2.push('类型/:' + $scope.selectedVmDiskType.name);
                    part2.push('容量/:' + $scope.dataDiskVolume + 'G数据盘');
                    if ($scope.vmNetworkPublicIpModel === 'now' && $scope.vmNetworkType === 'primary') {
                        part3.push('带宽/:' + $scope.networkBandWidth + 'Mbps');
                    }
                    return [part1.join('/;'), part2.join('/;'), part3.join('/;')].join(';;');
                };

            initComponents();
        }]);

});
