/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {
  controllerModule.controller('VmSnapshotCrtl', ['$scope','$interval','$modal','$q', 'Config', 'HttpService','WidgetService','CurrentContext',
    function ($scope,$interval,$modal,$q, Config, HttpService,WidgetService,CurrentContext) {

      var refreshSnapshotList = function () {
          var isVmTabActive=isVmSnapshotTabActive();
          var queryParams = {
            region:CurrentContext.regionId,
            name: '',
            currentPage: isVmTabActive?$scope.vmCurrentPage:$scope.diskCurrentPage,
            recordsPerPage: $scope.pageSize
          };
          var url= isVmTabActive?Config.urls.snapshot_vm_list:Config.urls.snapshot_disk_list
          $scope.isListLoading=true;
          HttpService.doGet(url, queryParams).then(function (data, status, headers, config) {
            $scope.isListLoading=false;
            if(isVmTabActive){
              $scope.vmSnapshotList = data.data.data;
              $scope.vmTotalItems = data.data.totalRecords;
              $scope.vmSnapshotList.filter(function(vmSnapshot){return vmSnapshot.status=='QUEUED'}).forEach(function(vmSnapshot) {
                var vmSnapshotDetailUrl = Config.urls.snapshot_vm_detail,
                  queryData = {region: CurrentContext.regionId, vmSnapshotId: vmSnapshot.id};
                var pendingStatusInterval = $interval(function () {
                  HttpService.doGet(vmSnapshotDetailUrl, queryData).then(function (data, status, headers, config) {
                    if (data.result === 1 && data.data.status != 'QUEUED') {
                      vmSnapshot.status = data.data.status;
                      $interval.cancel(pendingStatusInterval);
                      refreshSnapshotList();
                    }
                  });
                }, 5000);
              });
            }
            else{
              $scope.diskSnapshotList = data.data.data;
              $scope.diskTotalItems = data.data.totalRecords;
              $scope.diskSnapshotList.filter(function(diskSnapshot){return diskSnapshot.status=='creating'}).forEach(function(diskSnapshot) {
                var diskSnapshotDetailUrl = Config.urls.snapshot_disk_detail.replace('{region}',CurrentContext.regionId).replace('{volumeSnapshotId}',diskSnapshot.id);
                var pendingStatusInterval = $interval(function () {
                  HttpService.doGet(diskSnapshotDetailUrl).then(function (data, status, headers, config) {
                    if (data.result === 1 && data.data.status != 'creating') {
                      diskSnapshot.status = data.data.status;
                      $interval.cancel(pendingStatusInterval);
                      refreshSnapshotList();
                    }
                  });
                }, 5000);
              });
            }

          });
        },
        getCheckedSnapshot=function(){
          var snapshotList=getCurrentSnapshotList();
          return snapshotList.filter(function(item){
            return item.checked===true;
          });
        },
        getCurrentSnapshotList=function(){
          return isVmSnapshotTabActive()?$scope.vmSnapshotList:$scope.diskSnapshotList;
        },
        isVmSnapshotTabActive=function(){
          return $scope.tabShow === 'VmSnapshot';
        };

      $scope.tabShow = 'VmSnapshot';
      $scope.vmSnapshotList = [];
      $scope.diskSnapshotList = [];

      $scope.vmCurrentPage = 1;
      $scope.vmTotalItems = 0;
      $scope.diskCurrentPage = 1;
      $scope.diskTotalItems = 0;
      $scope.pageSize = 10;
      $scope.refreshSnapshotList = refreshSnapshotList;
      $scope.onPageChange = function () {
        refreshSnapshotList();
      };

      $scope.openVmDiskCreateModal = function (size) {
        var checkedSnapshots=getCheckedSnapshot();
        if(checkedSnapshots.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘快照');
          return;
        }
        if(checkedSnapshots[0].status!=='available') {
          WidgetService.notifyWarning('快照当前状态不可创建云硬盘');
          return;
        }
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
              return checkedSnapshots[0];
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

      $scope.openVmCreateModal = function (size) {
        var checkedSnapshots=getCheckedSnapshot();
        if(checkedSnapshots.length !==1){
          WidgetService.notifyWarning('请选中一个云主机快照');
          return;
        }
        if(checkedSnapshots[0].status!=='ACTIVE') {
          WidgetService.notifyWarning('快照当前状态不可创建云主机');
          return;
        }
        var modalInstance = $modal.open({
          animation: $scope.animationsEnabled,
          templateUrl: '/apps/cloudvm/templates/vm-create-modal.html',
          controller: 'VmCreateModalCtrl',
          size: size,
          backdrop: 'static',
          keyboard: false,
          resolve: {
            region: function () {
              return CurrentContext.regionId;
            },
            vmSnapshot: function () {
              return checkedSnapshots[0];
            },
            loadAllRegionData:function(){
              if(CurrentContext.allRegionData){
                return true;
              }
              else{
                var deferred = $q.defer();
                HttpService.doGet(Config.urls.region_list).then(function (data, status, headers, config) {
                  CurrentContext.allRegionData=data.data;
                  deferred.resolve(true);
                });
                return deferred.promise;
              }
            }
          }
        });

        modalInstance.result.then(function (resultData) {
          if(resultData &&resultData.result===1){
            //refreshVmList();
          }
        }, function () {
        });
      };

      $scope.deleteDiskSnapshot=function(){
        var checkedSnapshots=getCheckedSnapshot(),
          originalStatus='';
        if(checkedSnapshots.length !==1){
          WidgetService.notifyWarning('请选中一个云硬盘快照');
          return;
        }else{
          originalStatus=checkedSnapshots[0].status
        }
        if(checkedSnapshots[0].status!=='available' && checkedSnapshots[0].status!=='error'){
          WidgetService.notifyWarning('云硬盘快照当前状态不可删除');
          return;
        }
        var data={
          region:checkedSnapshots[0].region,
          snapshotId: checkedSnapshots[0].id
        };
        var modalInstance = WidgetService.openConfirmModal('删除云硬盘快照','确定要删除云硬盘快照（'+checkedSnapshots[0].name+'）吗？');
        modalInstance.result.then(function (resultData) {
          if(!resultData) return resultData;
          WidgetService.notifyInfo('删除云硬盘快照执行中...');
          checkedSnapshots[0].status='deleting';
          HttpService.doPost(Config.urls.snapshot_disk_delete, data).success(function (data, status, headers, config) {
            if(data.result===1){
              checkedSnapshots[0].status='deleted';
              modalInstance.close(data);
              WidgetService.notifySuccess('删除云硬盘快照成功');
              refreshSnapshotList();
            }
            else{
              checkedSnapshots[0].status=originalStatus;
              WidgetService.notifyError(data.msgs[0]||'删除云硬盘快照失败');
            }
          });
        }, function () {
        });
      };

      $scope.deleteVmSnapshot=function(){
        var checkedSnapshots=getCheckedSnapshot(),
          originalStatus='';
        if(checkedSnapshots.length !==1){
          WidgetService.notifyWarning('请选中一个云主机快照');
          return;
        }else{
          originalStatus=checkedSnapshots[0].status;
        }
        if(originalStatus!=='ACTIVE' && originalStatus!=='KILLED') {
          WidgetService.notifyWarning('云主机快照当前状态不可删除');
          return;
        }
        var data={
          region:checkedSnapshots[0].region,
          vmSnapshotId: checkedSnapshots[0].id
        };
        var modalInstance = WidgetService.openConfirmModal('删除云主机快照','确定要删除云主机快照（'+checkedSnapshots[0].name+'）吗？');
        modalInstance.result.then(function (resultData) {
          if(!resultData) return resultData;
          WidgetService.notifyInfo('删除云主机快照执行中...');
          checkedSnapshots[0].status='PENDING_DELETE';
          HttpService.doPost(Config.urls.snapshot_vm_delete, data).success(function (data, status, headers, config) {
            if(data.result===1){
              checkedSnapshots[0].status='DELETED';
              modalInstance.close(data);
              WidgetService.notifySuccess('删除云主机快照成功');
              refreshSnapshotList();
            }
            else {
              checkedSnapshots[0].status = originalStatus;
              WidgetService.notifyError(data.msgs[0] || '删除云主机快照失败');
            }
          });
        }, function () {
        });
      };

      $scope.isAllSnapshotChecked=function(){
        var snapshotList=getCurrentSnapshotList();
        var unCheckedSnapshots=snapshotList.filter(function(snapshot){
          return snapshot.checked===false || snapshot.checked===undefined;
        });
        return unCheckedSnapshots.length==0;
      };
      $scope.checkAllSnapshot=function(){
        var snapshotList=getCurrentSnapshotList();
        if($scope.isAllSnapshotChecked()){
          snapshotList.forEach(function(snapshot){
            snapshot.checked=false;
          });
        }
        else{
          snapshotList.forEach(function(snapshot){
            snapshot.checked=true;
          });
        }

      };
      $scope.checkSnapshot = function (snapshot) {
        snapshot.checked = snapshot.checked === true ? false : true;
      };

      refreshSnapshotList();

    }
  ]);

});
