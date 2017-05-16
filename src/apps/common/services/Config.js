/**
 * Created by jiangfei on 2015/8/19.
 */
define(['./common.service'], function (serviceModule) {
  serviceModule.factory('Config', ['CommonLanguageService',function (CommonLanguageService) {

    var lang = CommonLanguageService.services;

    var config = {};
    config.urls = {
      vm_regions: '/ecs/regions/',
      region_list:'/ecs/region/list',
      vm_list: '/ecs/region/{region}',
      vm_detail:'/ecs/region/{region}/vm/{vmId}',
      not_in_any_network_vm_list:'/ecs/vm/notInAnyNetwork/list',
      could_attach_subnet_list:'/ecs/vm/couldAttachSubnet/list',
      vm_attach_subnet_list:"/ecs/vm/attached/subnet/list",
      image_list: '/osi/image/list',
      flavor_group_data: '/osf/region/{region}/group',
      vm_create_old: '/ecs/region/{region}/vm-create',
      vm_create: '/ecs/vm/create',
      vm_buy: '/billing/buy/2',
      disk_buy: '/billing/buy/3',
      floatip_buy: '/billing/buy/4',
      router_buy: '/billing/buy/5',
      vm_rename: '/ecs/vm/rename',
      vm_start: '/ecs/region/{region}/vm-start',
      vm_stop: '/ecs/region/{region}/vm-stop',
      vm_reboot: '/ecs/vm/reboot',
      vm_delete: '/ecs/region/{region}/vm-delete',
      vm_password_change: '/ecs/vm/changeAdminPass',
      vm_disk_type:'/osv/volume/type/list',
      vm_network_shared_list:'/osn/network/shared/list',
      vm_calculate_price:'/billing/calculate/price/2',
      disk_calculate_price:'/billing/calculate/price/3',
      floatip_calculate_price:'/billing/calculate/price/4',
      route_calculate_price:'/billing/calculate/price/5',
      disk_list:'/osv/region/{region}',
      disk_detail:'/osv/region/{region}/volume/{volumeId}',
      disk_create:'/osv/region/{region}/volume-create',
      disk_delete:'/osv/region/{region}/volume-delete',
      disk_attach:'/ecs/region/{region}/vm-attach-volume',
      disk_detach:'/ecs/region/{region}/vm-detach-volume',
      disk_edit:'/osv/volume/edit',
      subnet_list:'/osn/subnet/private/list',
      subnet_option_list:'/osn/subnet/option/list',
      subnet_create:'/osn/subnet/private/create',
      subnet_delete:'/osn/subnet/private/delete',
      subnet_edit:'/osn/subnet/private/edit',
      subnet_attach_vm:"/ecs/vm/attach/subnet",
      subnet_detach_vm:"/ecs/vm/detach/subnet",
      vpc_list:'/osn/network/private/list',
      vpc_delete:'/osn/network/private/delete',
      vpc_create:'/osn/network/private/create',
      vpc_subnet_create:'/osn/network/subnet/private/create',
      vpc_edit:'/osn/network/private/edit',
      router_list:'/osn/router/list',
      network_public_list:'/osn/network/public/list',
      available_for_router_subnet_list:'/osn/network/private/available_for_router_interface/list',
      subnet_associate:'/osn/router/subnet/associate',
      subnet_remove:'/osn/router/subnet/separate',
      router_create:'/osn/router/create',
      router_edit:'/osn/router/edit',
      router_delete:'/osn/router/delete',
      floatIP_list:'/osn/floatingip/list',
      floatIP_create:'/osn/floatingip/create',
      floatIp_delete:'/osn/floatingip/delete',
      floatIP_edit:'/osn/floatingip/edit',
      floatIp_bindVm:'/ecs/vm/floatingip/bind',
      floatIp_unbindVm:'/ecs/vm/floatingip/unbind',
      snapshot_disk_list:'/osv/volume/snapshot/list',
      snapshot_disk_detail:'/osv/region/{region}/volume/snapshot/{volumeSnapshotId}',
      snapshot_disk_create:'/osv/volume/snapshot/create',
      snapshot_disk_delete:'/osv/volume/snapshot/delete',
      snapshot_vm_list:'/ecs/vm/snapshot/list',
      snapshot_vm_detail:'/ecs/vm/snapshot/detail',
      snapshot_vm_create:'/ecs/vm/snapshot/create',
      snapshot_vm_delete:'/ecs/vm/snapshot/delete',
      vm_vnc:'/ecs/region/{region}/vm-open-console',
      keypair_list:'/ecs/keypair/list',
      keypair_create:'/ecs/keypair/create',
      keypair_delete:'/ecs/keypair/delete',
      keypair_check:'/ecs/keypair/create/check',

      area_list:'/area',
      hcluster_list:'/hcluster/{areaId}/{type}'
    };
    config.REGEX= {
      NAME: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5\(（_\-\)）]{1,127}$/,
      NAME_KEYPAIR: /^[a-zA-Z][a-zA-Z0-9_\-]{1,127}$/,
      PASSWORD: /^(?=.*[0-9].*)(?=.*[A-Z].*)(?=.*[a-z].*)[a-zA-Z0-9]{8,30}$/,
      IP:/^((\d{1,3}|\%)\.){3}(\d{1,3}|\%)$/,
      NAME_LE_ENGINE:/^[a-z0-9_]{4,30}$/,
      PHONE:/^\d{3,20}$/
    };
    config.REGEX_MESSAGE= {
      NAME: lang.NAME,
      NAME_KEYPAIR: lang.NAME_KEYPAIR,
      PASSWORD: lang.PASSWORD,
      IP:lang.IP,
      NAME_LE_ENGINE:lang.NAME_LE_ENGINE,
      PHONE:lang.PHONE
    };
    config.vmStatuses = {
      'active':'活跃',
      'building':'创建中',
      'paused':'已暂停',
      'suspended':'已挂起',
      'stopped':'已关机',
      'error':'异常',
      //前端添加
      'deleted':'已删除',
      'arrearaged':'欠费停机'
  };
    config.vmTaskStatuses = {
      'building':'创建中',
      'deleting':'删除中',
      'stopping':'关机中',
      'starting':'启动中',
      'rebooting':'重启中',
      'scheduling':'创建中',
      'block_device_mapping':'创建中',
      'spawning':'创建中',
      'image_snapshotting':'快照创建中',
      'image_uploading':'快照上传中',
      'updating_password':'密码修改中',
      'suspending':'挂起中',
      'resuming':'恢复中',
      'networking':'网络挂载中',
    };
    config.vmDiskStatuses = [
      {"text": "创建中", "value": "creating"},
      {"text": "可用", "value": "available"},
      {"text": "挂载中", "value": "attaching"},
      {"text": "使用中", "value": "in-use"},
      {"text": "删除中", "value": "deleting"},
      {"text": "异常", "value": "error"},
      //前端自定义
      {"text": "已删除", "value": "deleted"},
      {"text": "卸载中", "value": "detaching"},
    ];
    config.vmVpcStatuses = [
      {"text": "活跃", "value": "ACTIVE"},
      {"text": "可用", "value": "DOWN"},
      {"text": "创建中", "value": "BUILD"},
      {"text": "不可用", "value": "ERROR"},
      {"text": "不可用", "value": "UNRECOGNIZED"},
    ];
    config.vmFloatIpStatuses={
      'AVAILABLE':'可用',
      'BINDED':'已绑定'
    };
    config.vmImageStatuses=[
      {"text": "未识别", "value": "UNRECOGNIZED"},
      {"text": "活跃", "value": "ACTIVE"},
      {"text": "上传中", "value": "SAVING"},
      {"text": "等待上传", "value": "QUEUED"},
      {"text": "停止", "value": "KILLED"},
      {"text": "删除等待", "value": "PENDING_DELETE"},
      {"text": "删除", "value": "DELETED"},
      {"text": "无", "value": "NIL"},
    ];

    config.allBuyPeriods = [1,2,3,4,5,6,7,8,9,12,24,36];
    config.serverName={
      uc:"lcp-uc.letvcloud.com",
      matrix:"matrix.letvclond.com"
    };
    config.EMPTY_TEXT='--';
    config.statusOperations={
      "virtualMachine":{
        "active":{"create":1,"start":0,"stop":1,"restart":1,"createsnap":1,"changeconfig":0,"attachdisk":1,"detachdisk":1,"bindfloatIp":1,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1},
        "stopped":{"create":1,"start":1,"stop":0,"restart":0,"createsnap":1,"changeconfig":0,"attachdisk":1,"detachdisk":1,"bindfloatIp":1,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":1},
        "building":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "deleting":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "stopping":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "starting":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "rebooting":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "spawning":{"create":0,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0}, 
        "deleted":{"create":1,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":0},
        "error":{"create":1,"start":0,"stop":0,"restart":0,"createsnap":0,"changeconfig":0,"attachdisk":0,"detachdisk":0,"bindfloatIp":0,"unbindfloatIp":0,
                  "joinnet":0,"bindalarm":0,"vnc":0,"editssh":0,"editpass":0,"delete":1},
        "default":{"create":1,"start":1,"stop":1,"restart":1,"createsnap":1,"changeconfig":1,"attachdisk":1,"detachdisk":1,"bindfloatIp":1,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1},
        "volumes":{"create":1,"start":1,"stop":1,"restart":1,"createsnap":1,"changeconfig":1,"attachdisk":1,"detachdisk":1,"bindfloatIp":1,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1},
        "volumesnull":{"create":1,"start":1,"stop":1,"restart":1,"createsnap":1,"changeconfig":1,"attachdisk":1,"detachdisk":0,"bindfloatIp":1,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1},
        "public":{"create":1,"start":1,"stop":1,"restart":1,"createsnap":1,"changeconfig":1,"attachdisk":1,"detachdisk":1,"bindfloatIp":0,"unbindfloatIp":1,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1},
        "publicnull":{"create":1,"start":1,"stop":1,"restart":1,"createsnap":1,"changeconfig":1,"attachdisk":1,"detachdisk":1,"bindfloatIp":1,"unbindfloatIp":0,
                  "joinnet":1,"bindalarm":1,"vnc":1,"editssh":1,"editpass":1,"delete":1}            
      },
      "disk":{
        "creating":{"create":0,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        "available":{"create":1,"createsnap":1,"attachdisk":1,"detachdisk":0,"expandVolume":1,"delete":1,"edit":1},
        "attaching":{"create":0,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        "in-use":{"create":1,"createsnap":1,"attachdisk":0,"detachdisk":1,"expandVolume":0,"delete":0,"edit":1},
        "deleting":{"create":0,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        "error":{"create":1,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        //前端自定义
        "deleted":{"create":1,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        "detaching":{"create":0,"createsnap":0,"attachdisk":0,"detachdisk":0,"expandVolume":0,"delete":0,"edit":0},
        "default":{"create":1,"createsnap":1,"attachdisk":1,"detachdisk":1,"expandVolume":1,"delete":1,"edit":1},
        "snapshots":{"create":1,"createsnap":1,"attachdisk":1,"detachdisk":1,"expandVolume":1,"delete":0,"edit":1},
        "snapshotsnull":{"create":1,"createsnap":1,"attachdisk":1,"detachdisk":1,"expandVolume":1,"delete":1,"edit":1}
      },
      "floatIp":{
        "AVAILABLE":{"bindVm":1,"bindRouter":1,"bindBalance":1,"changeBandwidth":1,"detach":0,"bindalarm":1,"edit":1,"delete":1},
        "BINDED":{"bindVm":0,"bindRouter":0,"bindBalance":0,"changeBandwidth":0,"detach":1,"bindalarm":1,"edit":1,"delete":0},
        "default":{"bindVm":1,"bindRouter":1,"bindBalance":1,"changeBandwidth":1,"detach":1,"bindalarm":1,"edit":1,"delete":1}
      },
      "router":{
        "ACTIVE":{"create":1,"bindIp":1,"unbindIp":1,"bindsubnet":1,"removesubnet":1,"edit":1,"bindalarm":1,"delete":1},
        "DOWN":{"create":1,"bindIp":0,"unbindIp":1,"bindsubnet":0,"removesubnet":1,"edit":1,"bindalarm":1,"delete":1},
        "BUILD":{"create":0,"bindIp":0,"unbindIp":0,"bindsubnet":0,"removesubnet":0,"edit":0,"bindalarm":0,"delete":0},
        "ERROR":{"create":1,"bindIp":0,"unbindIp":0,"bindsubnet":0,"removesubnet":0,"edit":0,"bindalarm":0,"delete":0},
        "UNRECOGNIZED":{"create":1,"bindIp":0,"unbindIp":0,"bindsubnet":0,"removesubnet":0,"edit":0,"bindalarm":0,"delete":0},
        "subnets":{"create":1,"bindIp":1,"unbindIp":1,"bindsubnet":1,"removesubnet":1,"edit":1,"bindalarm":1,"delete":0},
        "subnetsnull":{"create":1,"bindIp":1,"unbindIp":1,"bindsubnet":1,"removesubnet":0,"edit":1,"bindalarm":1,"delete":1},
        "default":{"create":1,"bindIp":1,"unbindIp":1,"bindsubnet":1,"removesubnet":1,"edit":1,"bindalarm":1,"delete":1}
      },
      "subnet":{
        "vm":{"create":1,"bindvm":1,"unbindvm":1,"bindrouter":1,"unbindrouter":1,"edit":1,"delete":1},
        "vmnull":{"create":1,"bindvm":1,"unbindvm":0,"bindrouter":1,"unbindrouter":1,"edit":1,"delete":1},
        "router":{"create":1,"bindvm":1,"unbindvm":1,"bindrouter":0,"unbindrouter":1,"edit":1,"delete":1},
        "routernull":{"create":1,"bindvm":1,"unbindvm":1,"bindrouter":1,"unbindrouter":0,"edit":1,"delete":1},
        "default":{"create":1,"bindvm":1,"unbindvm":1,"bindrouter":1,"unbindrouter":1,"edit":1,"delete":1}
      }
    }
    return config;
  }]);
});
