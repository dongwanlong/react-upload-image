<%@ page language="java" pageEncoding="UTF-8"%>
<%@page import="com.letv.common.util.ConfigUtil"%>
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="renderer" content="webkit">
	<title>500-乐视云平台</title>
	<meta name="Keywords" content="乐视云计算，云计算，VaaS，视频存储，免费空间，企业视频，云主机，开放平台">
	<link rel="shortcut icon" href="/images/home/favicon.ico">
	<link rel="stylesheet" href="/stylesheets/home/common.css">
	<link rel="stylesheet" href="/stylesheets/home/style.css">
	<title>404错误</title>
</head>
<body>
<div class="main-body text-center">
	<div class="body-errorimg"><img src="../../../images/error.png"></div>
	<div class="body-error"><span class="error_alert">500！服务器开小差！</span><span class="error_text">请您稍后再试！</span></div>
	<div class="error_return"><a href="<%=ConfigUtil.getString("webportal.local.http") %>"><span>返回首页</span></a></div>
</div>
<div class="main-body body-footer"> <!-- 页脚 -->
	<div class="footer clearfix">
		<div class="col-md-8">
			<div class="col-md-2">
				<div class="footer-linkTitle">关于我们</div>
				<ul>
					<li><a href="companyIntro.html">- 公司简介</a></li>
					<li><a href="companyIntro.html">- 联系我们</a></li>
				</ul>
			</div>
			<div class="col-md-2">
				<div class="footer-linkTitle">帮助中心</div>
				<ul>
					<li><a href="helpcenter.html">- 云主机</a></li>
				</ul>
			</div>
			<div class="col-md-2">
				<div class="footer-linkTitle">友情链接</div>
				<ul>
					<li><a href="http://www.letvcloud.com/vod.html">- 云点播</a></li>
					<li><a href="http://www.letvcloud.com/live.html">- 云直播</a></li>
				</ul>
			</div>
			<div class="col-md-2">
				<div class="footer-linkTitle">联系方式</div>
				<ul>
					<li>400-055-6060</li>
				</ul>
			</div>
			<div class="col-md-offset-2 col-md-2">
				<div class="footer-qrcode"><img src="/images/home/letv-code.png"></div>
				<div class="followus"><span>关注我们</span></div>
			</div>
			<div class="clearfix"></div>
		</div>
		<div class="col-md-4">
			<div class="footer-right clearfix">
				<div class="col-md-offset-4 col-md-5">
					<div class="col-md-5 right-logo">
						<img src="/images/home/credible-cloud.png">
						<div>可信云认证</div>
					</div>
					<div class="col-md-7 right-desc hide">
						<div>云主机 NO.01018</div>
						<div>云缓存 NO.01018</div>
						<div>云数据库 NO.01018</div>
					</div>
					<div class="clearfix"></div>
				</div>
				<div class="col-md-offset-1 col-md-5 hide">
					<div class="col-md-5 right-logo">
						<img src="/images/home/iso.png">
						<div>ISO27001认证 </div>
					</div>
					<div class="col-md-7 right-desc">
						<div>2013新标准</div>
						<div>NO.IS617259 </div>
					</div>
					<div class="clearfix"></div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
