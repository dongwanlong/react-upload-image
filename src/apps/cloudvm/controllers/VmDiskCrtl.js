/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {
  controllerModule.controller('VmDiskCrtl', ['$scope','$interval','$modal', 'Config','Utility', 'HttpService','WidgetService','CurrentContext',
    function ($scope,$interval,$modal, Config,Utility, HttpService,WidgetService,CurrentContext) {

      $scope.searchName='';
      $scope.diskList = [];

      $scope.currentPage = 1;
      $scope.totalItems = 0;
      $scope.pageSize = 10;
      $scope.operationBtn={};
      var operationArry=new Array(6);
      $scope.onPageChange = function () {
        refreshDiskList();
      };

      $scope.doSearch = function () {
        refreshDiskList();
      };

      $scope.openVmDiskCreateModal = function (size) {
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/apps/cloudvm/templates/vm-disk-create-modal.html',
          controller: 'VmDiskCreateModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            },
            diskSnapshot: function () {
              return undefined;
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            refreshDiskList();
          }
        }, function () {
        });
      };

      $scope.openVmDiskAttachModal = function (size) {
        var checkedDisks=getCheckedDisk();
        if(checkedDisks.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘');
          return;
        }
        if(checkedDisks[0].status !=='available'){
          WidgetService.notifyWarning('云硬盘当前状态不可挂载到云主机');
          return;
        }
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'VmDiskAttachModalTpl',
          controller: 'VmDiskAttachModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            },
            disk: function () {
              return checkedDisks[0];
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            refreshDiskList();
          }
        }, function () {
        });
      };

      $scope.detachDisk=function(){
        var checkedDisks=getCheckedDisk(),originalStatus='';
        if(checkedDisks.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘');
          return;
        }else{
          originalStatus=checkedDisks[0].status;
        }
        if(checkedDisks[0].status !=='in-use'){
          WidgetService.notifyWarning('云硬盘当前状态不可卸载');
          return;
        }
        var data={
          vmId: checkedDisks[0].attachments[0].vmId,
          volumeId: checkedDisks[0].id,
        };
        var modalInstance = WidgetService.openConfirmModal('卸载云硬盘','确定要从云主机（'+(checkedDisks[0].attachments[0] && checkedDisks[0].attachments[0].vmName)+'）卸载云硬盘（'+checkedDisks[0].name+'）吗？');
        modalInstance.result.then(function (resultData) {
          if(!resultData) return resultData;
          WidgetService.notifyInfo('卸载云硬盘执行中...');
          checkedDisks[0].status='detaching';
          HttpService.doPost(Config.urls.disk_detach.replace('{region}', checkedDisks[0].region), data).success(function (data, status, headers, config) {
            if(data.result===1){
              modalInstance.close(data);
              checkedDisks[0].status='available';
              WidgetService.notifySuccess('卸载云硬盘成功');
              refreshDiskList();
            }
            else{
              checkedDisks[0].status=originalStatus;
              WidgetService.notifyError(data.msgs[0]||'卸载云硬盘失败');
            }
          });
        }, function () {
        });
      };

      $scope.deleteDisk=function(){
        var checkedDisks=getCheckedDisk(),
          originalStatus='';
        if(checkedDisks.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘');
          return;
        }else{
          originalStatus=checkedDisks[0].status
        }
        if(checkedDisks[0].status!=='available' && checkedDisks[0].status!=='error'){
          WidgetService.notifyWarning('卸载云硬盘后执行删除操作');
          return;
        }
        var data={
          volumeId: checkedDisks[0].id
        };
        var modalInstance = WidgetService.openConfirmModal('删除云硬盘','确定要删除云硬盘（'+checkedDisks[0].name+'）吗？');
        modalInstance.result.then(function (resultData) {
          if(!resultData) return resultData;
          WidgetService.notifyInfo('删除云硬盘执行中...');
          checkedDisks[0].status='deleting';
          HttpService.doPost(Config.urls.disk_delete.replace('{region}', checkedDisks[0].region), data).success(function (data, status, headers, config) {
            if(data.result===1){
              checkedDisks[0].status='deleted';
              modalInstance.close(data);
              WidgetService.notifySuccess('删除云硬盘成功');
              refreshDiskList();
            }
            else{
              checkedDisks[0].status=originalStatus;
              WidgetService.notifyError(data.msgs[0]||'删除云硬盘失败');
            }
          });
        }, function () {
        });
      };

      $scope.openVmDiskEditModal=function(size){
        var checkedDisks=getCheckedDisk();
        if(checkedDisks.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘');
          return;
        }
        if(checkedDisks[0].status!=='available' && checkedDisks[0].status!=='in-use'){
          WidgetService.notifyWarning('云硬盘当前状态不可编辑');
          return;
        }
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'VmDiskEditModalTpl',
          controller: 'VmDiskEditModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            },
            disk: function () {
              return checkedDisks[0];
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            refreshDiskList();
          }
        }, function () {
        });
      };

      $scope.openVmDiskSnapshotCreateModal=function(size){
        var checkedDisks=getCheckedDisk();
        if(checkedDisks.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘');
          return;
        }
        if(checkedDisks[0].status!=='available' && checkedDisks[0].status!=='in-use'){
          WidgetService.notifyWarning('云硬盘当前状态不可创建快照');
          return;
        }
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'VmDiskSnapshotCreateModalTpl',
          controller: 'VmDiskSnapshotCreateModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            },
            disk: function () {
              return checkedDisks[0];
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            //refreshDiskList();
          }
        }, function () {
        });
      };

      $scope.isAllDiskChecked=function(){
        var unCheckedDisks=$scope.diskList.filter(function(disk){
          return disk.checked===false || disk.checked===undefined;
        });
        return unCheckedDisks.length==0;
      };
      $scope.checkAllDisk=function(){
        if($scope.isAllDiskChecked()){
          $scope.diskList.forEach(function(disk){
            disk.checked=false;
          });
        }
        else{
          $scope.diskList.forEach(function(disk){
            disk.checked=true;
          });
        }

      };
      $scope.checkDisk = function (disk) {
        disk.checked = disk.checked === true ? false : true;
      };

      var refreshDiskList = function () {
        operationArry=[]
          var queryParams = {
            name: $scope.searchName,
            currentPage: $scope.currentPage,
            recordsPerPage: $scope.pageSize
          };
          $scope.isListLoading=true;
          HttpService.doGet(Config.urls.disk_list.replace('{region}', CurrentContext.regionId), queryParams).then(function (data, status, headers, config) {
            if(!Utility.isServiceReady('serviceStatus3')){
              WidgetService.notifyWarning('服务未完全创建，请刷新试试看！');
            }
            $scope.isListLoading=false;
            $scope.diskList = data.data.data;
            $scope.totalItems = data.data.totalRecords;
            $scope.diskList.filter(function(disk){return disk.status=='creating'}).forEach(function(disk) {
              var diskDetailUrl = Config.urls.disk_detail.replace('{region}', CurrentContext.regionId).replace('{volumeId}', disk.id);
              var buildStatusInterval = $interval(function () {
                HttpService.doGet(diskDetailUrl).then(function (data, status, headers, config) {
                  if (data.result === 1 && data.data.status != 'creating') {
                    disk.status = data.data.status;
                    $interval.cancel(buildStatusInterval);
                    refreshDiskList();
                  }
                });
              }, 5000);
            });
          });
      },
        getCheckedDisk=function(){
          return $scope.diskList.filter(function(item){
            return item.checked===true;
          });
        };
      var watchStateChange=function(){
        var productInfo={
          'type':'disk',
          'state':'status',
          'other':['snapshots'],
          'operations':['create','createsnap','attachdisk','edit','detachdisk','delete']
        }
        $scope.$watch(function(){
          return $scope.diskList.map(function(obj) {
            return obj.checked;
          }).join(';');
        },function(){
          var operationArraycopy=Utility.setOperationBtns($scope,$scope.diskList,productInfo,operationArry,Config);
          var operaArraytemp=productInfo.operations;
          for(var k in operaArraytemp){
            $scope.operationBtn[operaArraytemp[k]]=operationArraycopy[k]
          }
        });
      }
      refreshDiskList();
      watchStateChange();
    }
  ]);

  controllerModule.controller('VmDiskAttachModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance', 'region','disk',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance, region,disk) {

    $scope.vmList=[];
    $scope.vmListSelectorData=[];
    $scope.selectedVm=null;

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.attachDisk = function () {
      var data = {
        vmId:$scope.selectedVm.value,
        volumeId:disk.id
      },
      originalStatus=disk.status;
      disk.status='attaching';
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.disk_attach.replace('{region}',region), data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          disk.status='in-use';
          WidgetService.notifySuccess('挂载云硬盘成功');
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'挂载云硬盘失败');
          disk.status=originalStatus;
          $scope.isFormSubmiting=false;
        }
      });
    };

    var initComponents = function () {
        initVmSelector();
      },
      initVmSelector = function () {
        $scope.isVmListLoading=true;
        HttpService.doGet(Config.urls.vm_list.replace('{region}',region),{name: '', currentPage:'', recordsPerPage: ''}).then(function (data, status, headers, config) {
          $scope.isVmListLoading=false;
          $scope.vmList = data.data.data;
          $scope.vmListSelectorData=$scope.vmList.map(function(vm){
            return new ModelService.SelectModel(vm.name,vm.id);
          });
          $scope.selectedVm=$scope.vmListSelectorData[0];
        });

      };

    initComponents();

  }]);

  controllerModule.controller('VmDiskEditModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance', 'region','disk',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance, region,disk) {

    $scope.diskName=disk.name;

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.editDisk = function () {
      var data = {
        region:region,
        volumeId:disk.id,
        name:$scope.diskName,
        description:''
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.disk_edit, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          WidgetService.notifySuccess('编辑云硬盘成功');
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'编辑云硬盘失败');
          $scope.isFormSubmiting=false;
        }
      });
    };


  }]);

  controllerModule.controller('VmDiskSnapshotCreateModalCtrl', ['Config', 'HttpService','WidgetService','Utility','ModelService', '$scope', '$modalInstance', 'region','disk',
    function (Config, HttpService,WidgetService,Utility,ModelService, $scope, $modalInstance, region,disk) {

    $scope.diskSnapshotName='';

    $scope.closeModal=function(){
      $modalInstance.dismiss('cancel');
    };

    $scope.createDiskSnapshot = function () {
      var data = {
        region:region,
        volumeId:disk.id,
        name:$scope.diskSnapshotName
      };
      $scope.isFormSubmiting=true;
      HttpService.doPost(Config.urls.snapshot_disk_create, data).success(function (data, status, headers, config) {
        if(data.result===1){
          $modalInstance.close(data);
          WidgetService.notifySuccess('创建云硬盘快照成功，请前往快照页面查看。');
        }
        else{
          WidgetService.notifyError(data.msgs[0]||'创建云硬盘快照失败');
          $scope.isFormSubmiting=false;
        }
      });
    };

  }]);

});
