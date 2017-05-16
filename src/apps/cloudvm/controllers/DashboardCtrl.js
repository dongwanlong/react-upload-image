define(['./app.controller'], function (controllerModule) {
	controllerModule.controller('DashboardCtrl', ['$scope', '$modal', 'Config', 'HttpService','$http','WidgetService','CurrentContext',
	     function ($scope, $modal, Config, HttpService,$http,WidgetService,CurrentContext) {
			$scope.username = "";
			$scope.usericon={};
			$scope.userimg='';
			$scope.message='';
			$scope.mobileStatus='';
			$scope.emailStatus='';
			$scope.userStatus='';
			$scope.remain='';
			$scope.billMes='';
			$scope.expander='';		
			$scope.expander.layout= "normal";
			$scope.consume={};
			$scope.service={}
			$scope.quotas={};
			var date=new Date();
			var month=date.getMonth()+1;
			var formatdate=date.getFullYear().toString()+month.toString();
			// $scope.billdate=formatdate;//当前月份的账单
			$scope.billdata=date;
			$scope.expanderToggle = function(element){
				var _target=element.target||element.srcElement;
				var _items=$(_target).parent().parent().find('.operation-items');
				if($(_target).parent().parent().hasClass('zhankai')){
					$(_target).parent().parent().removeClass('zhankai');
					$(_target).text('更多');
				}else{
					$(_target).parent().parent().addClass('zhankai');
					$(_target).text('收起');
					_items.scrollTop();
				}
				$scope.expander.layout === "top-expander"? $scope.expander.layout = "top-shrink":$scope.expander.layout="top-expander";
			}
			var inite=function(){
				var usinfourl="/user";
				var messageurl="/user/message/un";
				var remainurl="/userAccount/balance";
				var billMesurl="/userAccount/order/un";
				var operationurl="/operate";
				var serviceurl="/service?region="+CurrentContext.regionId;
				var consumeurl="/billing/product/daily/consume";
				var quotaurl="/quota?region="+CurrentContext.regionId;
				userinfo(usinfourl);
				unreadMes(messageurl);
				remain(remainurl);
				billing(billMesurl);
				operation(operationurl);
				consume(consumeurl);
				quotas(quotaurl,serviceurl)
			}
			 //获取浏览器缓存
			 function getCookie(name){
				 var arr=document.cookie.split('; ');

				 for(var i=0; i<arr.length; i++){
					 var arr2=arr[i].split('=');
					 if(arr2[0]==name){
						 return arr2[1];
					 }
				 }
				 return '';
			 }
			function userinfo(usinfourl){
				$scope.username=getCookie("userName");
				var userImg=getCookie("headPortrait");
				if(userImg){//has img
					$scope.usericon.hide=true;
					$scope.userimg=userImg;
				}else{//接口查询
					HttpService.doGet(usinfourl).then(function(data){
						if(data.result==0){//error
							WidgetService.notifyError('获取用户信息失败！')
						}else{
							var _data=data.data;
							$scope.usericon.hide=true;
							if(_data.userAvatar){
								$scope.userimg=_data.userAvatar;
							}else{
								$scope.usericon.hide=false;
								$scope.usericon.styles={color:'#f5c131'};
							}
							$scope.mobileStatus=_data.mobileStatus;
							$scope.emailStatus=_data.emailStatus;
							$scope.userStatus=_data.userStatus;
						}
					})
				}
				
			}
			function unreadMes(messageurl){
				HttpService.doGet(messageurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取消息失败！')
					}else{
						$scope.message=data.data;
					}
				});
			}
			function remain(remainurl){
				HttpService.doGet(remainurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取账户余额失败！')
					}else{
						$scope.remain=data.data;
					}
				});
			}
			function billing(billMesurl){
				HttpService.doGet(billMesurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取账单信息失败！')
					}else{
						$scope.billMes=data.data;
					}
				});
			}
			function operation(operationurl){
				$scope.isloading=false;
				HttpService.doGet(operationurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取操作信息失败！')
					}else{
						$scope.isloading=true;
						$scope.expander=data.data.operate;
						var time=new Date(data.data.date);
						$scope.date=time;
						$scope.year=time.getFullYear();
						$scope.month=time.getMonth()+1;
						$scope.day=time.getDate();
						$scope.hour=time.getHours();
						$scope.minute=time.getMinutes();
					}
				});
			}
			function service(serviceurl){
				return HttpService.doGet(serviceurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取服务信息失败！')
					}else{
						$scope.service=data.data;
					}
				});
			}
			function consume(consumeurl){
				HttpService.doGet(consumeurl).then(function(data){
					if(data.result==0){//error
						WidgetService.notifyError('获取服务信息失败！')
					}else{
						var ecs=0,disk=0,floatip=0,route=0;
						ecs=data.data["2"]?data.data['2']:0;
						disk=data.data["3"]?data.data['3']:0;
						floatip=data.data["4"]?data.data['4']:0;
						route=data.data["5"]?data.data['5']:0;
						var total=ecs+disk+floatip+route;
						$scope.consume.total=total.toFixed(2);
						$scope.consume.ecsconsume=ecs.toFixed(2);
						$scope.consume.diskconsume=disk.toFixed(2);
						$scope.consume.floatipconsume=floatip.toFixed(2);
						$scope.consume.routeconsume=route.toFixed(2);
					}
				});
			}
			function quotas(quotaurl,serviceurl){
				var serviceTemp=service(serviceurl);
				serviceTemp.then(function(data){
					HttpService.doGet(quotaurl).then(function(data){
						if(data.result==0){//error
							WidgetService.notifyError('获取配额信息失败！')
						}else{
							$scope.quotas.CLOUDVM_BAND_WIDTH=data.data.CLOUDVM_BAND_WIDTH;
							$scope.quotas.bandwidthStyle={width:$scope.service.bandWidth/$scope.quotas.CLOUDVM_BAND_WIDTH*100+"%"}
							$scope.quotas.CLOUDVM_CPU=data.data.CLOUDVM_CPU;
							$scope.quotas.cpuStyle={width:$scope.service.cpu/$scope.quotas.CLOUDVM_CPU*100+"%"}
							$scope.quotas.CLOUDVM_FLOATING_IP=data.data.CLOUDVM_FLOATING_IP;
							$scope.quotas.floatIpStyle={width:$scope.service.floatingIp/$scope.quotas.CLOUDVM_FLOATING_IP*100+"%"}
							$scope.quotas.CLOUDVM_KEY_PAIR=data.data.CLOUDVM_KEY_PAIR;
							$scope.quotas.keyPairStyle={width:$scope.service.keyPair/$scope.quotas.CLOUDVM_KEY_PAIR*100+"%"}
							$scope.quotas.CLOUDVM_MEMORY=data.data.CLOUDVM_MEMORY;
							$scope.quotas.memoryStyle={width:$scope.service.memory/1024/$scope.quotas.CLOUDVM_MEMORY*100+"%"}
							$scope.quotas.CLOUDVM_NETWORK=data.data.CLOUDVM_NETWORK;
							$scope.quotas.vpcStyle={width:$scope.service.privateNetwork/$scope.quotas.CLOUDVM_NETWORK*100+"%"}
							$scope.quotas.CLOUDVM_ROUTER=data.data.CLOUDVM_ROUTER;
							$scope.quotas.routerStyle={width:$scope.service.router/$scope.quotas.CLOUDVM_ROUTER*100+"%"}
							$scope.quotas.CLOUDVM_SUBNET=data.data.CLOUDVM_SUBNET;
							$scope.quotas.subNetStyle={width:$scope.service.privateSubnet/$scope.quotas.CLOUDVM_SUBNET*100+"%"}
							$scope.quotas.CLOUDVM_VM=data.data.CLOUDVM_VM;
							$scope.quotas.ecsStyle={width:$scope.service.ecs/$scope.quotas.CLOUDVM_VM*100+"%"}
							$scope.quotas.CLOUDVM_VM_SNAPSHOT=data.data.CLOUDVM_VM_SNAPSHOT;
							$scope.quotas.vmSnapshotStyle={width:$scope.service.vmSnapshot/$scope.quotas.CLOUDVM_VM_SNAPSHOT*100+"%"}
							$scope.quotas.CLOUDVM_VOLUME=data.data.CLOUDVM_VOLUME;
							$scope.quotas.diskStyle={width:$scope.service.disk/$scope.quotas.CLOUDVM_VOLUME*100+"%"}
							$scope.quotas.CLOUDVM_VOLUME_SIZE=data.data.CLOUDVM_VOLUME_SIZE;
							$scope.quotas.volumeSizeStyle={width:$scope.service.volumeSize/$scope.quotas.CLOUDVM_VOLUME_SIZE*100+"%"}
							$scope.quotas.CLOUDVM_VOLUME_SNAPSHOT=data.data.CLOUDVM_VOLUME_SNAPSHOT;
							$scope.quotas.volumeSnapshotStyle={width:$scope.service.volumeSnapshot/$scope.quotas.CLOUDVM_VOLUME_SNAPSHOT*100+"%"}
							$scope.quotas.CLOUDVM_KEY_PAIR=data.data.CLOUDVM_KEY_PAIR;
							$scope.quotas.keypairStyle={width:$scope.service.keyPair/$scope.quotas.CLOUDVM_KEY_PAIR*100+"%"}
						}
					});
				});
			}
			inite();
		}]);
});