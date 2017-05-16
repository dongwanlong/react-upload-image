<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="renderer" content="webkit">
	<title>支付-乐视云平台</title>
	<meta name="Keywords" content="乐视云计算，云计算，VaaS，视频存储，免费空间，企业视频，云主机，开放平台">
	<link rel="shortcut icon" href="http://i3.letvimg.com/lc05_lecloud/201601/12/10/21/favicon.ico">
	<link rel="stylesheet" href="/stylesheets/home/toastr.css">
	<link rel="stylesheet" href="/stylesheets/home/common.css">
  <link rel="stylesheet" href="/stylesheets/home/style.css">
</head>
<body>
	<input id="userId" type="text" class="hide" value="${cookie.userId.value}">
	<input id="orderNum" type="text" class="hide" value="${orderNum}">
	<input id="redirect" type="text" class="hide" value="${redirect}">
	<div class="main-body">
		<div class="order">
			<div class="order-title">订单支付</div>
			<div class="order-pay">
				<div class="pay-item"><span class="item-title">账号名称：</span><span class="item-desc account">letvcloud@letv.com</span></div>
				<div class="pay-item"><span class="item-title">本次需支付：</span><span class="text-red item-desc">¥<span id="orderpay">1000</span></span></div>
				<div class="pay-item" style="position:relative;z-index:200">
					<span class="item-title">可用余额：</span><span class="item-desc remain">¥100</span>
					<span class="item-desc">
						<span class="iconfont icon-checkiconfill self-checkbox alloption active" self-payoption='0'></span>
						<span style="padding-left:5px;">使用余额</span>
					</span>
				</div>
				<div class="pay-item remainInput" style="position:relative;z-index:100">
					<span class="item-title">余额支付：</span>
					<span class="item-desc">
						<span class="desc-input">
							<span class="input-china">¥</span><input type="text" class="remainPay" maxlength='12' onblur="moneyInput()" onfocus="moneyInputFocus()" /></span>
						<span class="error-desc text-red"></span>
					</span>
				</div>
				<div class="pay-item payoptions">
					<span class="item-title">支付方式：</span>
					<div class="payoption alloption" self-payoption='1'>
						<img src="/images/home/zhifubao.png">
						<i class="iconfont icon-checkroundfillicon"></i>
					</div>
					<div class="payoption alloption" self-payoption='2'>
						<img src="/images/home/wechat.png">
						<i class="iconfont icon-checkroundfillicon"></i>
					</div>
				</div>
				
				<div class="pay-item">
					<button class="btn btn-le-blue item-pay" id="pay">确认支付</button>
				</div>
			</div>
		</div>
		<div class="order">
			<div class="order-title">
				<span>订单详情</span>
				<span class="title-rollup">
					<span class="rollup-text">收起</span>
					<span class="iconfont icon-arrow01"></span>
					<span class="clearfix"></span>
				</span>
				<div class="clearfix"></div>
			</div>
			<div class="price-table ordertable opacity clearfix">
				<table class="col-md-12">
					<thead>
						<tr>
							<th width="12.5%">订单号</th>
							<th width="37.5%">配置</th>
							<th width="12.5%">数量</th>
							<th width="12.5%">使用时长</th>
							<th width="12.5%">支付费用</th>
						</tr>
					</thead>
					<tbody id="order-tbody"></tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="modal-container hide">
		<div class="modal">
			<div class="modal-top">
				<div class="modal-title"><span class="title">支付完成前请不要关闭此窗口</span>
				<span class="iconfont icon-add"></span>
				<span class="clearfix"></span>
				</div>
			</div>
			<div class="modal-content">
				<div class="content-desc">请在新开页面上完成付款后，再继续操作。</div>
				<div class="buttons clearfix text-center paybtns">
					<div class="col-md-offset-2 col-md-4"><button class="btn btn-le-blue paybtn">支付完成</button></div>
					<div class="col-md-4"><button class="btn btn-le-red paybtn">支付遇到问题</button></div>
				</div>
			</div>
		</div>
	</div>
</body>
<script src="${ctx}/javascripts/vendor/jquery-1.11.3.js"></script>
<script src="${ctx}/javascripts/page/toastr.js"></script>
<script src="${ctx}/javascripts/page/payment.js"></script>
<script>
remainChose();//余额支付
// moneyInputVali();//余额输入校验
payOptionChose();//支付方式选择
rollup();//展开&收起
userInfo();//用户名
goPay();//支付
$(window).resize(function(event) {
	var width=document.body.scrollWidth;
    var height=document.body.scrollHeight;
    $('.modal-container').css({
        width:width,
        height:height
    })
});
</script>
</html>