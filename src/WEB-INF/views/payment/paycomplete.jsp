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
	<link rel="stylesheet" href="/stylesheets/home/common.css">
  <link rel="stylesheet" href="/stylesheets/home/style.css">
</head>
<body>
	<input type="text" class="hide" value="${orderNum}" id="orderNum">
	<div class="main-body">
		<div class="paycomplete">
			<div class="paytitle">
				<div class="title">乐视云计算支付状态</div>
				<p class="shortline"></p>
			</div>
			<div class="paydesc">
				<div class="desc">
					<div class="desc-tip clearfix"></div>
					<div class="desc-ordernum" id="payNum"></div>
				</div>
			</div>
		</div>
	</div>
</body>
<script src="/javascripts/vendor/jquery-1.11.3.js"></script>
<script src="${ctx}/javascripts/page/payment.js"></script>
<script>
timeStatus()//订单支付状态查询
</script>
</html>