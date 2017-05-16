<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html lang="zh">
<head>
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1"/>
	<meta name="viewport" content="width=device-width,initial-scale=1, maximum-scale=1, user-scalable=no"/>
    <link rel="shortcut icon" href="http://i3.letvimg.com/lc05_lecloud/201601/12/10/21/favicon.ico">
	<link rel="stylesheet" href="/stylesheets/vendor/bootstrap.css">
    <link rel="stylesheet" href="/stylesheets/vendor/toaster.css">
    <link rel="stylesheet" href="/stylesheets/common.css">
    <link rel="stylesheet" type="text/css" href="/stylesheets/style-profile.css">
    <title>控制台-乐视云平台</title>
</head>
<style>
.main .side-bar{height:100%;margin-top:0;padding-top:10px;z-index:200;background:#ebebeb;}
.main .content-wrapper{width:1349px;width:100%;min-width:1349px;}
</style>
<body>
	<%@ include file="../includes/header.jsp"%>
    <div class="main">
        <%@ include file="../includes/sidebar.jsp"%>
        <div class="content-wrapper">
            <div ng-view="ng-view" class="content"></div>
        </div>
        <div class="clearfix"></div>
    </div>
    <script type="text/javascript" src="/javascripts/dist/require.min.js" data-main="/apps/dashboard/main.js"></script>
</body>
</html>
