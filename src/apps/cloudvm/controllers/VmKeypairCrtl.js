/**
 * Created by jiangfei on 2015/8/12.
 */
define(['./app.controller'], function (controllerModule) {
  controllerModule.controller('VmKeypairCrtl', ['$scope','$interval','$modal','$timeout','$httpParamSerializerJQLike','$sce', 'Config', 'HttpService','WidgetService','CurrentContext',
    function ($scope,$interval,$modal,$timeout,$httpParamSerializerJQLike,$sce, Config, HttpService,WidgetService,CurrentContext) {

      $scope.searchName = '';
      $scope.keypairList = [];
      $scope.keypairDownloadUrl='';

      $scope.currentPage = 1;
      $scope.totalItems = 0;
      $scope.pageSize = 10;
      $scope.onPageChange = function () {
        refreshKeypairList();
      };

      $scope.doSearch = function () {
        refreshKeypairList();
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
            $scope.keypairDownloadUrl=$sce.trustAsResourceUrl(Config.urls.keypair_create+'?'+$httpParamSerializerJQLike(resultData));
            $timeout(function(){
              WidgetService.notifySuccess('创建密钥成功');
              refreshKeypairList();
            },2000);
          }
        }, function () {
        });
      };

      $scope.deleteKeypair = function () {
        var checkedKeypairs = getCheckedKeypair();
        if (checkedKeypairs.length !== 1) {
          WidgetService.notifyWarning('请选中一个密钥');
          return;
        }
        var data = {
          region:checkedKeypairs[0].region,
          name: checkedKeypairs[0].name
        };
        var modalInstance = WidgetService.openConfirmModal('删除密钥', '确定要删除密钥（' + checkedKeypairs[0].name + '）吗？');
        modalInstance.result.then(function (resultData) {
          if (!resultData) return resultData;
          WidgetService.notifyInfo('删除密钥执行中...');
          HttpService.doPost(Config.urls.keypair_delete, data).success(function (data, status, headers, config) {
            if (data.result === 1) {
              modalInstance.close(data);
              WidgetService.notifySuccess('删除密钥成功');
              refreshKeypairList();
            }
            else {
              WidgetService.notifyError(data.msgs[0] || '删除密钥失败');
            }
          });
        }, function () {
        });
      };

      $scope.isAllKeypairChecked = function () {
        var unCheckedKeypairs = $scope.keypairList.filter(function (keypair) {
          return keypair.checked === false || keypair.checked === undefined;
        });
        return unCheckedKeypairs.length == 0;
      };
      $scope.checkAllKeypair = function () {
        if ($scope.isAllKeypairChecked()) {
          $scope.keypairList.forEach(function (keypair) {
            keypair.checked = false;
          });
        }
        else {
          $scope.keypairList.forEach(function (keypair) {
            keypair.checked = true;
          });
        }

      };
      $scope.checkKeypair = function (keypair) {
        keypair.checked = keypair.checked === true ? false : true;
      };

      var refreshKeypairList = function () {
          var queryParams = {
            region: CurrentContext.regionId,
            name: $scope.searchName,
            currentPage: $scope.currentPage,
            recordsPerPage: $scope.pageSize
          };
          $scope.isListLoading = true;
          HttpService.doGet(Config.urls.keypair_list, queryParams).then(function (data, status, headers, config) {
            $scope.isListLoading = false;
            $scope.keypairList = data.data.data;
            $scope.totalItems = data.data.totalRecords;

          });
        },
        getCheckedKeypair = function () {
          return $scope.keypairList.filter(function (item) {
            return item.checked === true;
          });
        };

      refreshKeypairList();

    }
  ]);


});
