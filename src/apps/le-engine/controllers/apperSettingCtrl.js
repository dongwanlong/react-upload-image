/**
 * Created by chenxiaoxiao3 on 2016/8/16.
 */
define(['./app.controller'], function (controllerModule) {

    controllerModule.controller('apperSettingCtrl', ['$filter','Config','$window','$q','$scope','$modalInstance','transData','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'leEngineConfig', 'leEngineHttpService','ModelService','WidgetService', 'Utility','CurrentContext','LanguageService','gEngineStatus',
        function ($filter,Config,$window,$q,$scope, $modalInstance,transData,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, leEngineConfig, leEngineHttpService,ModelService,WidgetService,Utility,CurrentContext,LanguageService,gEngineStatus) {
            var cellId = transData.cellId;
            var appId = gEngineStatus.app.appId;
            var imageId;
            var contentType = {headers:{'Content-Type':'application/json'}};
            var schemes = [
                new ModelService.SelectModel('http', 'HTTP'),
                new ModelService.SelectModel('https', 'HTTPS')
            ];
            $scope.REGEX = angular.extend({}, Config.REGEX, leEngineConfig.REGEX);
            $scope.apperVersion = $filter('date')(new Date(),'MM-dd-HH-mm-ss');
            $scope.apperPodcount = 1;
            $scope.apperMirrorTagList = [];
            $scope.apperDelay = 10;
            $scope.handleType = transData.handleType;

            $scope.dnsOptions = [
                new ModelService.SelectModel(LanguageService.apperSettingModalPage.apperDnsNoUse, false),
                new ModelService.SelectModel(LanguageService.apperSettingModalPage.apperDnsUse, true)
            ];
            $scope.currentDns = $scope.dnsOptions[0];

            $scope.envList = [
                {
                    name:"VENDER",
                    value:"leengine"
                }
            ];

            $scope.readinessProbeCheckTypes = [
                new ModelService.SelectModel(LanguageService.apperSettingModalPage.apperDnsNoUse, false),
                new ModelService.SelectModel(LanguageService.apperSettingModalPage.apperDnsUse, true)
            ];
            $scope.readinessProbeCheck = $scope.readinessProbeCheckTypes[0];
            $scope.readinessProbeDataModel = {
                path: '',
                port: '',
                schemes:schemes,
                selectedScheme: schemes[0],
                httpHeaders: [],
                initialDelaySeconds: 10,
                timeoutSeconds: 5,
                periodSeconds: 30
            };

            $scope.closeModal = function(){
                $modalInstance.dismiss('cancel');
            };
            //删除单个环境变量
            $scope.deleteEnv = function(index){
                if($scope.envList.length<=1)return;
                $scope.envList.splice(index,1);
            };
            //增加环境变量
            $scope.addEnv = function(){
                $scope.envList.push({
                    name:"",
                    value:""
                });
            };
            //删除单个httpheader
            $scope.deleteHttpHeader = function(index){
                if($scope.readinessProbeDataModel.httpHeaders.length<1)return;
                $scope.readinessProbeDataModel.httpHeaders.splice(index,1);
            };
            //增加httpheader
            $scope.addHttpHeader = function(){
                $scope.readinessProbeDataModel.httpHeaders.push({
                    name:"",
                    value:""
                });
            };
            //创建Apper
            $scope.createApper = function(){
                $timeout(createApperReq,1000);
            }

            function getMirrorId(obj){
                $scope.isListLoading = true;
                leEngineHttpService.doGet(leEngineConfig.urls.app_edit.replace('{appid}', appId).replace('{list}',"valid")).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        imageId = data.data.Details.ImageId;
                        getMirrorTagList();
                    }else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function getMirrorTagList(){
                leEngineHttpService.doGet(leEngineConfig.urls.mirror_tag_list.replace('{imageid}', imageId).replace('{list}',"valid")).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        $scope.isListLoading = false;
                        if (data.data.Details) {
                            for(var i=0,len=data.data.Details.length;i<len;i++){
                                $scope.apperMirrorTagList.push(new ModelService.SelectModel(data.data.Details[i].Name,data.data.Details[i].Id));
                            }
                            $scope.apperMirrorTagNow = $scope.apperMirrorTagList[0];
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function getAppDetail(){
                return leEngineHttpService.doGet(leEngineConfig.urls.app_edit.replace('{appid}', appId)).then(function (data, status, headers, config) {
                    if (data.data.Code === 200) {
                        if (data.data.Details) {
                            return data.data.Details;
                        }
                    } else {
                        WidgetService.notifyWarning(data.data.Message);
                    }
                });
            }

            function createApperReq(){
                var url = leEngineConfig.urls.apper_create.replace('{appid}',appId).replace('{versionname}',$scope.apperVersion).replace('{cellid}',cellId).replace('{podcount}',$scope.apperPodcount).replace('{force}',0);

                if (($scope.envList.length <= 0) || ($scope.envList.length == 1 && ((!$scope.envList[0].name) || (!$scope.envList[0].value)))) {
                    $scope.envList = [];
                }

                var formData = {
                    "ImageTagName":$scope.apperMirrorTagNow.text,
                    "Cpu": $scope.curentCpu.value,
                    "Memory":$scope.curentMemory.value,
                    "Env":angular.fromJson(angular.toJson($scope.envList)),
                    ReadinessProbeCheck: $scope.readinessProbeCheck.value,
                    SelfDefineDnsEnable:$scope.currentDns.value,
                    ReadinessProbe: {
                        HttpGet: {
                            Path: $scope.readinessProbeDataModel.path,
                            Port: parseInt($scope.readinessProbeDataModel.port),
                            Scheme:!$scope.readinessProbeDataModel.selectedScheme?"":$scope.readinessProbeDataModel.selectedScheme.value,
                            HttpHeaders: $scope.readinessProbeDataModel.httpHeaders
                        },
                        InitialDelaySeconds: parseInt($scope.readinessProbeDataModel.initialDelaySeconds),
                        TimeoutSeconds: parseInt($scope.readinessProbeDataModel.timeoutSeconds),
                        PeriodSeconds: parseInt($scope.readinessProbeDataModel.periodSeconds)
                    }
                };

                leEngineHttpService.doPost(url,formData,contentType).then(function (data, status, headers, config) {
                    $modalInstance.close(true);
                    if(data.data.data.Code!=200){
                        WidgetService.notifyWarning(data.data.data.Message);
                    }
                });
            }

            function setSelectForm(curent,list,allList,model,max,value){
                list = allList.filter(function (item) {
                    return item.value <= max;
                });
                if (list.length <= 0) {
                    curent = model;
                } else {
                    var memoryArray = list.filter(function(item){
                        return item.value===value;
                    });
                    if(memoryArray.length <=0 ){
                        curent = list[0];
                    }else{
                        curent = memoryArray[0];
                    }
                }
                return {
                    curent:curent,
                    list:list
                }
            }


            function fillOptions(apperDetail,appDetail){

                var arrayMemory = [
                        new ModelService.SelectModel('4G', 4 * 1024),
                        new ModelService.SelectModel('8G', 8 * 1024),
                        new ModelService.SelectModel('16G', 16 * 1024),
                        new ModelService.SelectModel('32G', 32 * 1024),
                        new ModelService.SelectModel('64G', 64 * 1024)
                    ],
                    allCpus = [
                        new ModelService.SelectModel('2', 2),
                        new ModelService.SelectModel('4', 4),
                        new ModelService.SelectModel('6', 6),
                        new ModelService.SelectModel('8', 8),
                        new ModelService.SelectModel('16', 16),
                        new ModelService.SelectModel('24', 24)
                    ];
                if(!apperDetail){
                    //内存
                    var memoryObj = setSelectForm($scope.curentMemory, $scope.memoryArray, arrayMemory, new ModelService.SelectModel('8G', 8 * 1024), appDetail.ContainerMemoryMax, null);
                    $scope.curentMemory = memoryObj.curent;
                    $scope.memoryArray = memoryObj.list;

                    //CPU个数
                    var allObj = setSelectForm($scope.curentCpu, $scope.cpuArray, allCpus, new ModelService.SelectModel('2G', 2 * 1024), appDetail.ContainerCpuMax, null);
                    $scope.curentCpu = allObj.curent;
                    $scope.cpuArray = allObj.list;

                }else {
                    //内存
                    var memoryObj = setSelectForm($scope.curentMemory, $scope.memoryArray, arrayMemory, new ModelService.SelectModel('8G', 8 * 1024), appDetail.ContainerMemoryMax, apperDetail.Memory);
                    $scope.curentMemory = memoryObj.curent;
                    $scope.memoryArray = memoryObj.list;

                    //CPU个数
                    var allObj = setSelectForm($scope.curentCpu, $scope.cpuArray, allCpus, new ModelService.SelectModel('2G', 2 * 1024), appDetail.ContainerCpuMax, apperDetail.Cpu);
                    $scope.curentCpu = allObj.curent;
                    $scope.cpuArray = allObj.list;

                    //环境变量
                    $scope.envList = apperDetail.Env;
                    $scope.envList = $scope.envList.filter(function (item) {
                        return leEngineConfig.REGEX.APPER_EVN.test(item.name);
                    });
                    //DNS
                    $scope.currentDns = $scope.dnsOptions.filter(function (item) {
                        return item.value === apperDetail.SelfDefineDnsEnable;
                    })[0];

                    //协议
                    if (apperDetail.ReadinessProbe.HttpGet.Scheme) {
                        $scope.readinessProbeDataModel.selectedScheme = $scope.readinessProbeDataModel.schemes.filter(function (item) {
                            return item.value === apperDetail.ReadinessProbe.HttpGet.Scheme;
                        })[0];
                    }

                    //路径
                    $scope.readinessProbeDataModel.path = apperDetail.ReadinessProbe.HttpGet.Path;

                    //端口
                    $scope.readinessProbeDataModel.port = apperDetail.ReadinessProbe.HttpGet.Port;

                    //http头
                    $scope.readinessProbeDataModel.httpHeaders = apperDetail.ReadinessProbe.HttpGet.HttpHeaders;

                    //健康检查
                    $scope.readinessProbeCheck = apperDetail.ReadinessProbeCheck?$scope.readinessProbeCheckTypes[1]:$scope.readinessProbeCheckTypes[0];

                    //延时时间
                    if(apperDetail.ReadinessProbe.InitialDelaySeconds)$scope.readinessProbeDataModel.initialDelaySeconds = apperDetail.ReadinessProbe.InitialDelaySeconds;

                    //超时时间
                    if(apperDetail.ReadinessProbe.TimeoutSeconds)$scope.readinessProbeDataModel.timeoutSeconds = apperDetail.ReadinessProbe.TimeoutSeconds;

                    //执行周期
                    if(apperDetail.ReadinessProbe.PeriodSeconds)$scope.readinessProbeDataModel.periodSeconds = apperDetail.ReadinessProbe.PeriodSeconds;

                }
            }


            function getApperDetail(appDetail){
                var deferred = $q.defer();
                if(transData.apperId){
                    leEngineHttpService.doGet(leEngineConfig.urls.apper_detail.replace('{versionid}', transData.apperId).replace('{detail}', false)).then(function (data, status, headers, config) {
                        if (data.data.Code === 200) {
                            deferred.resolve({apper:data.data.Details, app:appDetail});
                        }else{
                            deferred.resolve({apper:null, app:appDetail});
                            WidgetService.notifyWarning(data.data.Message);
                        }
                    });
                }else{
                    deferred.resolve({apper:null, app:appDetail});
                }
                return deferred.promise;
            }

            $q.when(getMirrorId()).then(getAppDetail).then(getApperDetail).then(function(resolveObj){
                fillOptions(resolveObj.apper, resolveObj.app);
            });


        }]);
});