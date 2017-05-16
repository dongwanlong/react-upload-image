/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {

  controllerModule.controller('VmDiskCreateModalCtrl', ['Config', 'HttpService','WidgetService','Utility','CurrentContext','ModelService', '$scope', '$modalInstance','$timeout','$window', 'region','diskSnapshot',
    function (Config, HttpService,WidgetService,Utility,CurrentContext,ModelService, $scope, $modalInstance,$timeout,$window, region,diskSnapshot) {

    var DEFAULT_MIN_VOLUME=10;
    var initComponents = function () {
        initDiskTypeSelector();
        initSnapshotListSelector();
      },
      initDiskTypeSelector = function () {
        HttpService.doGet(Config.urls.vm_disk_type,{region:region}).then(function (data, status, headers, config) {
          $scope.diskTypeList=data.data;
          $scope.selectedDiskType = $scope.diskTypeList[0];
        });
      },
        initSnapshotListSelector=function(){
        if(diskSnapshot){
          $scope.snapshotList.push(diskSnapshot);
          $scope.snapshotListSelectorData=[new ModelService.SelectModel(diskSnapshot.name,diskSnapshot.id)];
          $scope.selectedSnapshot=$scope.snapshotListSelectorData[0];
        }
        else{
          $scope.snapshotListSelectorData.push(new ModelService.SelectModel('请选择快照',''));
          $scope.selectedSnapshot=$scope.snapshotListSelectorData[0];
          HttpService.doGet(Config.urls.snapshot_disk_list,{region:region,name: '', currentPage: '', recordsPerPage: ''}).then(function (data, status, headers, config) {
            $scope.snapshotList = data.data.data;
            $scope.snapshotList.forEach(function(snapshot){
              $scope.snapshotListSelectorData.push(new ModelService.SelectModel(snapshot.name,snapshot.id));
            });
          });
        }
      },
      setDiskPrice=function(){
        var data={
          region: region,
          order_time: $scope.diskBuyPeriod.toString(),
          order_num: $scope.diskCount.toString(),
          volumeType: $scope.selectedDiskType.name,
          volumeSize: $scope.diskVolume.toString(),
        };
        $scope.isCalculatingPrice=true;
        HttpService.doPost(Config.urls.disk_calculate_price,data).success(function (data, status, headers, config) {
          $scope.isCalculatingPrice=false;
          if(data.result===1){
            $scope.totalPrice=data.data;
          }
          else{
            WidgetService.notifyError(data.msgs[0]||'计算价格失败');
          }
        });
      },
      buildDisplayData=function(){
        var data=[];
        data.push(['类型',$scope.selectedDiskType.name].join('/:'));
        data.push(['容量',$scope.diskVolume+'GB'].join('/:'));
        return data.join('/;');
      };

    Utility.getRzSliderHack($scope)();
    $scope.diskName = '';
    $scope.diskTypeList = [];
    $scope.selectedDiskType = null;
    $scope.snapshotList = [];
    $scope.snapshotListSelectorData = [];
    $scope.selectedSnapshot = null;
    $scope.diskVolume = $scope.diskMinVolume = DEFAULT_MIN_VOLUME;
    $scope.diskCount = 1;
    $scope.allDiskBuyPeriods = Config.allBuyPeriods;
    $scope.diskBuyPeriod = $scope.allDiskBuyPeriods[0];
    $scope.totalPrice='';

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };
    $scope.isSelectedDiskType = function (diskType) {
      return $scope.selectedDiskType === diskType;
    };
    $scope.selectDiskType = function (diskType) {
      if(diskType.enable) {
        $scope.selectedDiskType = diskType;
      }
    };
    $scope.createDisk = function () {
      var data = {
        region:region,
        name: $scope.diskName,
        description:'',
        volumeTypeId:$scope.selectedDiskType.id,
        size: $scope.diskVolume,
        volumeSnapshotId:$scope.selectedSnapshot.value,
        count:$scope.diskCount,
        order_time: $scope.diskBuyPeriod.toString()
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.disk_buy, {paramsData:JSON.stringify(data),displayData:buildDisplayData()}).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          $window.location.href = '/payment/'+data.data+'/3';
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'创建云硬盘失败');
          $scope.isFormSubmiting=false;
        }
      });
    };

    $scope.$watch('selectedSnapshot', function (value) {
      if (value) {
        if(value.value){
          var snapshotItem = $scope.snapshotList.filter(function (snapshot) {
            return snapshot.id === value.value;
          })[0];
          if(snapshotItem.size>DEFAULT_MIN_VOLUME) {
            $scope.diskMinVolume = snapshotItem.size;
          }
          else{
            $scope.diskMinVolume = DEFAULT_MIN_VOLUME;
          }
        }
        else {
          $scope.diskMinVolume = DEFAULT_MIN_VOLUME;
        }
      }
    });

    $scope.$watch(function(){
      return [
        ($scope.selectedDiskType &&  $scope.selectedDiskType.name) || '',
        $scope.diskCount,
        $scope.diskVolume,
        $scope.diskBuyPeriod].join('_');
    }, function (value) {
      if ($scope.selectedDiskType && $scope.diskVolume && $scope.diskCount && $scope.diskBuyPeriod) {
        setDiskPrice();
      }
    });

    initComponents();

  }]);

});
